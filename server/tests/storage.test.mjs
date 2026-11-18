import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { getStorageConfig, planAssets, recordAssets, uploadAndVerifyAsset } from '../lib/storage.mjs'
import { applyAssetManifest } from '../lib/content.mjs'
import { collectAssetReferences } from '../../shared/content-data.mjs'

const env = {
  R2_BUCKET: 'portfolio-assets', R2_ENDPOINT: 'https://account.r2.cloudflarestorage.com',
  R2_ACCESS_KEY_ID: 'test-key', R2_SECRET_ACCESS_KEY: 'test-secret', R2_PUBLIC_BASE_URL: 'https://assets.example.com',
}

test('R2 configuration accepts a bucket suffix but never uses it twice', () => {
  const config = getStorageConfig({ ...env, R2_ENDPOINT: `${env.R2_ENDPOINT}/${env.R2_BUCKET}` })
  assert.equal(config.endpoint, env.R2_ENDPOINT)
  assert.equal(config.bucket, env.R2_BUCKET)
  assert.equal(config.publicBaseUrl, env.R2_PUBLIC_BASE_URL)
  assert.throws(() => getStorageConfig({ ...env, R2_ENDPOINT: `${env.R2_ENDPOINT}/wrong-bucket` }), /S3 endpoint/)
})

test('R2 configuration rejects credential-bearing URLs, placeholders, and private delivery URLs', () => {
  for (const change of [
    { R2_ENDPOINT: 'https://user:secret@account.r2.cloudflarestorage.com' },
    { R2_PUBLIC_BASE_URL: env.R2_ENDPOINT },
    { R2_SECRET_ACCESS_KEY: '' }, { R2_ACCESS_KEY_ID: 'your-access-key' },
    { R2_PUBLIC_BASE_URL: 'http://assets.example.com' },
  ]) {
    assert.throws(() => getStorageConfig({ ...env, ...change }), (error) => {
      assert.ok(error.safeMessage)
      assert.ok(!error.message.includes('test-secret'))
      return true
    })
  }
})

async function assetFixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-storage-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(join(root, 'src/assets/files'), { recursive: true })
  const bytes = Buffer.from('public resume fixture')
  await writeFile(join(root, 'src/assets/files/resume.pdf'), bytes)
  const config = getStorageConfig(env)
  const content = { resume: 'asset:src/assets/files/resume.pdf', duplicate: 'asset:src/assets/files/resume.pdf' }
  const [asset] = await planAssets(content, root, config)
  return { root, bytes, asset, config }
}

test('asset plans deduplicate public files and use content-addressed keys', async (t) => {
  const { bytes, asset } = await assetFixture(t)
  assert.equal(asset.sha256, createHash('sha256').update(bytes).digest('hex'))
  assert.equal(asset.objectKey, `portfolio/${asset.sha256}/resume.pdf`)
  assert.equal(asset.contentType, 'application/pdf')
  assert.equal(collectAssetReferences({ a: asset.reference, b: [asset.reference] }).length, 1)
})

test('database content cannot upload secrets or traverse directories', async (t) => {
  const { root, config } = await assetFixture(t)
  for (const reference of ['asset:server/.env', 'asset:src/assets/files/../../server/.env', 'asset:src/assets/files/private.pdf']) {
    await assert.rejects(planAssets({ file: reference }, root, config), /allowlist/)
  }
})

test('new uploads are publicly verified byte-for-byte before a reference can be recorded', async (t) => {
  const { bytes, asset, config } = await assetFixture(t)
  const calls = []
  const client = { async send(command) {
    calls.push(command)
    if (command.constructor.name === 'HeadObjectCommand') throw Object.assign(new Error('not found'), { name: 'NotFound', $metadata: { httpStatusCode: 404 } })
    return {}
  } }
  const result = await uploadAndVerifyAsset(asset, { client, config, fetchImpl: async () => new Response(bytes, { headers: { 'content-type': 'application/pdf' } }) })
  assert.equal(result.uploaded, true)
  const put = calls.find((call) => call.constructor.name === 'PutObjectCommand').input
  assert.deepEqual(put.Body, bytes)
  assert.equal(put.Metadata.sha256, asset.sha256)
  assert.equal(put.ContentDisposition, 'inline; filename="resume.pdf"')
  assert.equal(put.CacheControl, 'public, max-age=31536000, immutable')
})

test('matching existing objects are verified but never overwritten', async (t) => {
  const { bytes, asset, config } = await assetFixture(t)
  const calls = []
  const client = { async send(command) { calls.push(command.constructor.name); return { ContentLength: bytes.length, Metadata: { sha256: asset.sha256 } } } }
  const result = await uploadAndVerifyAsset(asset, { client, config, fetchImpl: async () => new Response(bytes, { headers: { 'content-type': 'application/pdf' } }) })
  assert.equal(result.uploaded, false)
  assert.deepEqual(calls, ['HeadObjectCommand'])
})

test('a private, incorrect, or changed upload never passes verification', async (t) => {
  const { bytes, asset, config } = await assetFixture(t)
  const client = { async send() { return { ContentLength: bytes.length, Metadata: { sha256: asset.sha256 } } } }
  await assert.rejects(uploadAndVerifyAsset(asset, { client, config, fetchImpl: async () => new Response('', { status: 403 }) }), /not publicly readable/)
  await assert.rejects(uploadAndVerifyAsset(asset, { client, config, fetchImpl: async () => new Response('wrong', { headers: { 'content-type': 'application/pdf' } }) }), /verification failed/)
  const mismatched = { async send() { return { ContentLength: 1, Metadata: {} } } }
  await assert.rejects(uploadAndVerifyAsset(asset, { client: mismatched, config }), /does not match/)
})

test('asset manifest updates use a single transaction with bound parameters', async (t) => {
  const { asset } = await assetFixture(t)
  const calls = []
  const connection = {
    async beginTransaction() { calls.push('begin') },
    async execute(sql, values) { calls.push({ sql, values }) },
    async commit() { calls.push('commit') },
    async rollback() { calls.push('rollback') }, release() { calls.push('release') },
  }
  await recordAssets({ async getConnection() { return connection } }, [asset])
  assert.deepEqual([calls[0], ...calls.slice(-2)], ['begin', 'commit', 'release'])
  assert.equal(calls[1].values[0], asset.reference)
  connection.execute = async () => { throw new Error('DB failure') }
  await assert.rejects(recordAssets({ async getConnection() { return connection } }, [asset]))
  assert.deepEqual(calls.slice(-2), ['rollback', 'release'])
})

test('public manifest resolution preserves unknown references for bundled fallbacks', () => {
  const content = { image: 'asset:src/assets/images/projects/example.png', resume: 'asset:src/assets/files/resume.pdf' }
  const resolved = applyAssetManifest(content, [{ asset_ref: content.image, public_url: 'https://assets.example.com/image.png' }])
  assert.equal(resolved.image, 'https://assets.example.com/image.png')
  assert.equal(resolved.resume, content.resume)
  assert.ok(content.image.startsWith('asset:'))
})
