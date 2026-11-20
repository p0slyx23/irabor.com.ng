import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('editor history schema is additive and case-study migration targets only Irabor V2', async () => {
  const history = await readFile(new URL('../database/migrations/005_editor_history.sql', import.meta.url), 'utf8')
  assert.match(history, /CREATE TABLE IF NOT EXISTS portfolio_content_history/)
  assert.doesNotMatch(history, /\bDROP\b|\bDELETE\b/i)
  const migration = await readFile(new URL('../database/migrations/006_irabor_v2_architecture.sql', import.meta.url), 'utf8')
  assert.equal((migration.match(/WHERE slug = 'portfolio-v2'/g) || []).length, 2)
  for (const word of ['MySQL', 'Railway', 'Cloudflare R2', 'localhost']) assert.ok(migration.includes(word))
  assert.doesNotMatch(migration, /\$\.image|\$\.coverImage|\bDELETE\b|\bDROP\b|password|secret/i)
})
