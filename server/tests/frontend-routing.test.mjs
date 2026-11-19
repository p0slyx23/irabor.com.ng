import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('same-origin content requests reach Railway before the SPA fallback', async () => {
  const config = JSON.parse(await readFile(new URL('../../vercel.json', import.meta.url), 'utf8'))
  const matching = config.rewrites.find(rule => rule.source === '/api/content' || rule.source === '/(.*)')
  assert.equal(matching?.source, '/api/content', 'A missing public API variable must not turn content requests into index.html.')
  const destination = new URL(matching.destination)
  assert.equal(destination.protocol, 'https:')
  assert.equal(destination.hostname, 'iraborcomng-production.up.railway.app')
  assert.equal(destination.pathname, '/api/content')
  assert.equal(destination.username, '')
  assert.equal(destination.password, '')
  assert.ok(config.rewrites.some(rule => rule.source === '/(.*)' && rule.destination === '/index.html'))
})
