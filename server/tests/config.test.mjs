import assert from 'node:assert/strict'
import test from 'node:test'
import { getApiConfig, getDatabaseConfig } from '../lib/config.mjs'

test('database configuration decodes credentials and retains safe connection defaults', () => {
  const config = getDatabaseConfig({ MYSQL_URL: 'mysql://reader:p%40ss%3Aword@db.internal:3307/railway' })
  assert.equal(config.host, 'db.internal')
  assert.equal(config.port, 3307)
  assert.equal(config.password, 'p@ss:word')
  assert.equal(config.database, 'railway')
  assert.equal(config.charset, 'utf8mb4')
  assert.equal(config.multipleStatements, false)
  assert.equal(config.connectTimeout, 10000)
})

test('DATABASE_URL is supported but MYSQL_URL takes precedence', () => {
  assert.equal(getDatabaseConfig({ DATABASE_URL: 'mysql://reader:secret@db/portfolio' }).database, 'portfolio')
  assert.equal(getDatabaseConfig({ DATABASE_URL: 'invalid', MYSQL_URL: 'mysql://reader:secret@db/railway' }).database, 'railway')
})

test('missing configuration fails without exposing a secret', () => {
  assert.throws(() => getDatabaseConfig({}), /Set MYSQL_URL/)
})

for (const value of [
  'invalid-secret', 'https://reader:secret@db/railway',
  'mysql://reader:secret@db/', 'mysql://db/railway',
  'mysql://reader:secret@db/railway?multipleStatements=true',
  'mysql://reader:secret@db/railway#secret', 'mysql://reader:secret@db/one/two',
  'mysql://reader:secret@db:0/railway', 'mysql://reader:%GG@db/railway',
]) {
  test(`invalid database configuration is rejected without printing it (${value.split(':')[0]})`, () => {
    assert.throws(() => getDatabaseConfig({ MYSQL_URL: value }), (error) => {
      assert.match(error.message, /Invalid MySQL configuration/)
      assert.ok(!error.message.includes('secret'))
      return true
    })
  })
}

test('TLS verifies certificates and rejects invalid flags or unreadable CA files', () => {
  const MYSQL_URL = 'mysql://reader:secret@db/railway'
  assert.deepEqual(getDatabaseConfig({ MYSQL_URL, MYSQL_SSL: 'true' }).ssl, { rejectUnauthorized: true })
  assert.throws(() => getDatabaseConfig({ MYSQL_URL, MYSQL_SSL: 'disabled' }), /Invalid/)
  assert.throws(() => getDatabaseConfig({ MYSQL_URL, MYSQL_SSL_CA_FILE: 'missing.pem' }), /Invalid/)
  assert.throws(() => getDatabaseConfig({ MYSQL_URL, MYSQL_SSL: 'true', MYSQL_SSL_CA_FILE: 'missing.pem' }), /Invalid/)
})

test('API configuration accepts only exact HTTP origins and valid ports', () => {
  const config = getApiConfig({ PORT: '8080', CORS_ORIGINS: 'https://irabor.com.ng, http://localhost:5173' })
  assert.equal(config.port, 8080)
  assert.deepEqual(config.origins, ['https://irabor.com.ng', 'http://localhost:5173'])
  for (const CORS_ORIGINS of ['*', 'https://example.com/', 'https://example.com/path', 'file:///tmp', 'https://user:secret@example.com']) {
    assert.throws(() => getApiConfig({ CORS_ORIGINS }), /CORS_ORIGINS/)
  }
  for (const PORT of ['-1', '0', '65536', 'abc', '1.5']) assert.throws(() => getApiConfig({ PORT }), /PORT/)
  assert.equal(getApiConfig({ HOST: '127.0.0.1' }).host, '127.0.0.1')
  assert.throws(() => getApiConfig({ HOST: 'database.railway.internal' }), /local listen address/)
})
