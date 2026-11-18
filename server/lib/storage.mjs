import { createHash } from 'node:crypto'
import { readFile, realpath } from 'node:fs/promises'
import { basename, extname, resolve, sep } from 'node:path'
import { S3Client, ListObjectsV2Command, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { collectAssetReferences } from '../../shared/content-data.mjs'

const types = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.pdf': 'application/pdf' }

const failure = (message) => Object.assign(new Error(message), { safeMessage: message })

export function getStorageConfig(env = process.env) {
  for (const key of ['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_BASE_URL']) {
    if (!env[key] || /^(your-|your_|<)/i.test(env[key])) throw failure(`Set ${key} in the ignored server/.env.`)
  }
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(env.R2_BUCKET)) throw failure('Invalid R2 bucket name.')
  let endpoint, publicBase
  try {
    endpoint = new URL(env.R2_ENDPOINT)
    publicBase = new URL(env.R2_PUBLIC_BASE_URL)
  } catch { throw failure('Invalid R2 endpoint or public base URL.') }
  const clean = (url) => url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash
  const endpointPath = decodeURIComponent(endpoint.pathname).replace(/^\/+|\/+$/g, '')
  if (!clean(endpoint) || !endpoint.hostname.endsWith('.r2.cloudflarestorage.com') || (endpointPath && endpointPath !== env.R2_BUCKET)) throw failure('Use the R2 S3 endpoint from Cloudflare.')
  if (!clean(publicBase) || publicBase.hostname.endsWith('.r2.cloudflarestorage.com')) throw failure('Use a public R2 custom domain or development URL, not the S3 endpoint.')
  return {
    bucket: env.R2_BUCKET,
    endpoint: endpoint.origin,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    publicBaseUrl: publicBase.href.replace(/\/+$/, ''),
  }
}

export function createStorageClient(config) {
  return new S3Client({
    region: 'auto', endpoint: config.endpoint,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    requestHandler: { connectionTimeout: 10000, requestTimeout: 15000 },
    requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED', maxAttempts: 2,
  })
}

export async function checkStorage(client, bucket) {
  await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }))
}

export async function planAssets(content, root, config) {
  const actualRoot = await realpath(root)
  const assets = []
  for (const reference of collectAssetReferences(content)) {
    const relative = reference.slice('asset:'.length)
    // Only these existing public files are approved for upload. Never traverse
    // arbitrary database paths, symlinks outside the project, or secret files.
    if (!/^src\/assets\/images\/projects\/[a-zA-Z0-9_-]+\.(png|webp|jpe?g|avif)$/.test(relative) && relative !== 'src/assets/files/resume.pdf') {
      throw failure('Content references a file outside the public asset allowlist.')
    }
    const path = await realpath(resolve(actualRoot, relative))
    if (!path.startsWith(actualRoot + sep)) throw failure('Asset resolves outside the repository.')
    const bytes = await readFile(path)
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    const objectKey = `portfolio/${sha256}/${basename(relative)}`
    assets.push({ reference, path, sha256, byteSize: bytes.length, contentType: types[extname(relative)], objectKey, publicUrl: `${config.publicBaseUrl}/${objectKey}` })
  }
  return assets
}

export async function uploadAndVerifyAsset(asset, { client, config, fetchImpl = fetch }) {
  let exists = false
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: config.bucket, Key: asset.objectKey }))
    if (Number(head.ContentLength) !== asset.byteSize || head.Metadata?.sha256 !== asset.sha256) throw failure('Existing content-addressed object does not match the local file.')
    exists = true
  } catch (error) {
    if (error.$metadata?.httpStatusCode !== 404 && !['NotFound', 'NoSuchKey'].includes(error.name)) throw error
  }
  if (!exists) {
    const body = await readFile(asset.path)
    if (body.length !== asset.byteSize || createHash('sha256').update(body).digest('hex') !== asset.sha256) throw failure('Asset changed after planning. Rerun the command.')
    await client.send(new PutObjectCommand({
      Bucket: config.bucket, Key: asset.objectKey, Body: body,
      ContentType: asset.contentType, ContentLength: asset.byteSize,
      CacheControl: 'public, max-age=31536000, immutable', Metadata: { sha256: asset.sha256 },
      ...(asset.contentType === 'application/pdf' ? { ContentDisposition: 'inline; filename="resume.pdf"' } : {}),
    }))
  }
  const response = await fetchImpl(asset.publicUrl, { signal: AbortSignal.timeout(15000), redirect: 'error' })
  if (!response.ok) throw failure('Uploaded asset is not publicly readable. Check the bucket domain.')
  const type = (response.headers.get('content-type') || '').split(';')[0].trim()
  const bytes = Buffer.from(await response.arrayBuffer())
  if (type !== asset.contentType || bytes.length !== asset.byteSize || createHash('sha256').update(bytes).digest('hex') !== asset.sha256) {
    throw failure('Public asset verification failed. No database reference was changed.')
  }
  return { ...asset, uploaded: !exists }
}

export async function recordAssets(pool, assets) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    for (const asset of assets) {
      await connection.execute(`INSERT INTO portfolio_assets (asset_ref, object_key, public_url, sha256, byte_size, content_type)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE object_key = ?, public_url = ?, sha256 = ?, byte_size = ?, content_type = ?`,
      [asset.reference, asset.objectKey, asset.publicUrl, asset.sha256, asset.byteSize, asset.contentType,
        asset.objectKey, asset.publicUrl, asset.sha256, asset.byteSize, asset.contentType])
    }
    await connection.commit()
  } catch (error) {
    await connection.rollback().catch(() => {})
    throw error
  } finally { connection.release() }
}

