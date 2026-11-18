import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import { applyMigrations } from '../lib/migrations.mjs'

async function directory(t, sql = 'SELECT 1;') {
  const path = await mkdtemp(join(tmpdir(), 'portfolio-migrations-'))
  t.after(() => rm(path, { recursive: true, force: true }))
  await writeFile(join(path, '001_test.sql'), sql)
  return pathToFileURL(`${path}/`)
}

function connection({ applied = [], acquired = 1, failSql = false } = {}) {
  const calls = []
  return {
    calls,
    async query(sql) {
      calls.push(sql)
      if (sql.startsWith('SELECT DATABASE')) return [[{ name: 'test_portfolio' }]]
      if (failSql && sql === 'SELECT 1;') throw new Error('SQL failed')
      return [[]]
    },
    async execute(sql, values) {
      calls.push({ sql, values })
      if (sql.includes('GET_LOCK')) return [[{ acquired }]]
      if (sql === 'SELECT version, checksum FROM portfolio_schema_migrations') return [applied]
      return [[]]
    },
    async beginTransaction() { calls.push('begin') },
    async commit() { calls.push('commit') },
    async rollback() { calls.push('rollback') },
  }
}

test('new migrations commit with parameterized version tracking and release the lock', async (t) => {
  const db = connection()
  const messages = []
  await applyMigrations(db, await directory(t), (message) => messages.push(message))
  assert.ok(db.calls.includes('begin'))
  assert.ok(db.calls.includes('commit'))
  const insert = db.calls.find((call) => call.sql?.startsWith('INSERT'))
  assert.equal(insert.values[0], '001_test.sql')
  assert.match(db.calls.at(-1).sql, /RELEASE_LOCK/)
  assert.deepEqual(messages, ['Applied: 001_test.sql'])
})

test('unchanged migrations are skipped, treating CRLF and LF as equivalent', async (t) => {
  const sql = 'SELECT 1;\r\n'
  const checksum = createHash('sha256').update(sql.replace(/\r\n/g, '\n')).digest('hex')
  const db = connection({ applied: [{ version: '001_test.sql', checksum }] })
  await applyMigrations(db, await directory(t, sql), () => {})
  assert.ok(!db.calls.includes('begin'))
  assert.ok(!db.calls.includes(sql))
})

test('changed applied migrations are rejected and the lock is released', async (t) => {
  const db = connection({ applied: [{ version: '001_test.sql', checksum: 'wrong' }] })
  await assert.rejects(applyMigrations(db, await directory(t), () => {}), /Applied migration changed/)
  assert.ok(!db.calls.includes('begin'))
  assert.match(db.calls.at(-1).sql, /RELEASE_LOCK/)
})

test('failed SQL rolls back and is never recorded as applied', async (t) => {
  const db = connection({ failSql: true })
  await assert.rejects(applyMigrations(db, await directory(t), () => {}), /SQL failed/)
  assert.ok(db.calls.includes('rollback'))
  assert.ok(!db.calls.some((call) => call.sql?.startsWith('INSERT')))
  assert.match(db.calls.at(-1).sql, /RELEASE_LOCK/)
})

test('all applied checksums are checked before any pending migration can run', async (t) => {
  const folder = await directory(t)
  await writeFile(new URL('002_test.sql', folder), 'SELECT 2;')
  const db = connection({ applied: [{ version: '002_test.sql', checksum: 'changed' }] })
  await assert.rejects(applyMigrations(db, folder, () => {}), /Applied migration changed/)
  assert.ok(!db.calls.includes('begin'))
  assert.ok(!db.calls.includes('SELECT 1;'))
})

test('lock contention prevents concurrent schema changes', async (t) => {
  const db = connection({ acquired: 0 })
  await assert.rejects(applyMigrations(db, await directory(t), () => {}), /Another migration/)
  assert.ok(!db.calls.some((call) => typeof call === 'string' && call.startsWith('CREATE')))
})

test('checked-in schema is additive and uses JSON and utf8mb4', async () => {
  const schema = await readFile(new URL('../database/migrations/001_schema.sql', import.meta.url), 'utf8')
  const statements = schema.replace(/--[^\n]*/g, '')
  assert.ok(!/\b(DROP|TRUNCATE|DELETE)\b/i.test(statements))
  assert.equal((statements.match(/CREATE TABLE IF NOT EXISTS/g) || []).length, 3)
  assert.ok(statements.includes('JSON NOT NULL'))
  assert.ok(statements.includes('utf8mb4'))
})
