import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createServer } from 'node:net'
import { promisify } from 'node:util'
import test from 'node:test'
import { describeListenError } from '../lib/startup.mjs'

const runNode = promisify(execFile)

test('listen failures give specific guidance without including raw error details', () => {
  const config = { host: '127.0.0.1', port: 3001 }
  for (const code of ['EACCES', 'EADDRNOTAVAIL']) {
    const message = describeListenError({ code, message: 'private-test-password' }, config)
    assert.ok(message.includes(code))
    assert.doesNotMatch(message, /private-test-password/)
  }
  assert.doesNotMatch(describeListenError({ code: 'private-test-password', message: 'private-test-password' }, config), /private-test-password/)
})

test('the real API entrypoint explains an occupied port and exits without leaking credentials', async (t) => {
  const occupied = createServer()
  await new Promise((resolve) => occupied.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise((resolve) => occupied.close(resolve)))
  const port = String(occupied.address().port)
  await assert.rejects(runNode(process.execPath, ['server/index.mjs'], {
    cwd: new URL('../../', import.meta.url),
    timeout: 10000,
    env: {
      ...process.env,
      HOST: '127.0.0.1', PORT: port,
      MYSQL_URL: 'mysql://reader:private-test-password@127.0.0.1/portfolio',
      MYSQL_SSL: 'false', MYSQL_SSL_CA_FILE: '',
      CORS_ORIGINS: 'http://localhost:5173',
    },
  }), (error) => {
    assert.equal(error.code, 1)
    assert.match(error.stderr, /EADDRINUSE/)
    assert.match(error.stderr, new RegExp(`port ${port}`))
    assert.match(error.stderr, /already running/i)
    assert.match(error.stderr, /Ctrl\+C/)
    assert.doesNotMatch(error.stderr, /private-test-password|mysql:\/\//)
    return true
  })
})
