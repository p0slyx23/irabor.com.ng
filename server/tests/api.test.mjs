import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test from 'node:test'
import { createApiHandler } from '../lib/api.mjs'
import { createFakePool, createRows } from './fixtures.mjs'

async function startApi(t, options = {}) {
  const pool = options.pool || createFakePool()
  const messages = []
  const server = createServer(createApiHandler({ pool, origins: ['https://irabor.com.ng'], logError: (message) => messages.push(message) }))
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve) }))
  return { url: `http://127.0.0.1:${server.address().port}`, pool, messages }
}

test('public GET returns content, ETag, bounded caching, and exact-origin CORS', async (t) => {
  const { url } = await startApi(t)
  const response = await fetch(`${url}/api/content`, { headers: { Origin: 'https://irabor.com.ng' } })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://irabor.com.ng')
  assert.equal(response.headers.get('cache-control'), 'public, max-age=60')
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  const payload = await response.json()
  assert.equal(payload.schemaVersion, 1)
  assert.equal(payload.content.projectPosts.length, 2)
  const cached = await fetch(`${url}/api/content`, { headers: { 'If-None-Match': response.headers.get('etag') } })
  assert.equal(cached.status, 304)
  assert.equal(await cached.text(), '')
})

test('unknown origins, mutations, and unknown paths are rejected without reading MySQL', async (t) => {
  const { url, pool } = await startApi(t)
  assert.equal((await fetch(`${url}/api/content`, { headers: { Origin: 'https://untrusted.example' } })).status, 403)
  const mutation = await fetch(`${url}/api/content`, { method: 'POST' })
  assert.equal(mutation.status, 405)
  assert.match(mutation.headers.get('allow'), /GET/)
  assert.equal((await fetch(`${url}/missing`)).status, 404)
  assert.equal(pool.calls.length, 0)
})

test('OPTIONS is supported and HEAD has no response body', async (t) => {
  const { url } = await startApi(t)
  const options = await fetch(`${url}/api/content`, { method: 'OPTIONS', headers: { Origin: 'https://irabor.com.ng' } })
  assert.equal(options.status, 204)
  assert.match(options.headers.get('access-control-allow-methods'), /GET/)
  const head = await fetch(`${url}/api/content`, { method: 'HEAD' })
  assert.equal(head.status, 200)
  assert.equal(await head.text(), '')
})

test('liveness remains available during database failure, readiness and content fail safely', async (t) => {
  const { url, pool, messages } = await startApi(t, { pool: createFakePool({ fail: true }) })
  assert.equal((await fetch(`${url}/healthz`)).status, 200)
  assert.equal(pool.calls.length, 0)
  for (const endpoint of ['/readyz', '/api/content']) {
    const response = await fetch(`${url}${endpoint}`)
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.deepEqual(await response.json(), { error: 'Content is temporarily unavailable.' })
  }
  assert.ok(!messages.join('').includes('password'))
  assert.equal(messages.length, 2)
})

test('readiness validates content, not just a live database socket', async (t) => {
  const { url } = await startApi(t)
  const response = await fetch(`${url}/readyz`)
  assert.deepEqual(await response.json(), { status: 'ready' })
})

test('API resolves verified asset locations without returning upload credentials', async (t) => {
  const rows = createRows()
  const brandRow = rows.settings.find((row) => row.content_key === 'siteBrand')
  const brand = JSON.parse(brandRow.payload)
  brand.resumes[0].url = 'asset:src/assets/files/resume.pdf'
  brandRow.payload = JSON.stringify(brand)
  const pool = createFakePool({ rows })
  pool.execute = async () => [[{ asset_ref: 'asset:src/assets/files/resume.pdf', public_url: 'https://assets.example.com/portfolio/hash/resume.pdf' }]]
  const { url } = await startApi(t, { pool })
  const payload = await (await fetch(`${url}/api/content`)).json()
  assert.equal(payload.schemaVersion, 1)
  assert.equal(payload.content.siteBrand.resumes[0].url, 'https://assets.example.com/portfolio/hash/resume.pdf')
  assert.ok(!JSON.stringify(payload).includes('R2_SECRET_ACCESS_KEY'))
})
