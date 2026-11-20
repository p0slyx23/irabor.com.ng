import assert from 'node:assert/strict'
import test from 'node:test'
import { getContentRecovery, missingPageRecovery, missingProjectRecovery, unexpectedRecovery } from '../../src/core/recovery.mjs'

test('offline guidance takes precedence over stale service errors', () => {
  for (const code of ['timeout', 'network', 'unavailable', 'configuration', undefined]) {
    assert.match(getContentRecovery(code, false).title, /offline/)
    assert.match(getContentRecovery(code, false).message, /PDF may need a connection/)
  }
})

test('recovery distinguishes timeout, connection, service and missing-page states', () => {
  assert.match(getContentRecovery('timeout').message, /taking a little longer/)
  assert.match(getContentRecovery('network').title, /connect/)
  assert.notEqual(getContentRecovery('unavailable').title, missingPageRecovery.title)
  assert.notEqual(missingPageRecovery.title, missingProjectRecovery.title)
  assert.match(unexpectedRecovery.message, /Reload/)
})

test('unknown errors cannot leak implementation details into recovery copy', () => {
  const untrusted = 'mysql://user:secret@private-host/db <script>alert(1)</script>'
  const fallback = getContentRecovery(untrusted)
  assert.deepEqual(fallback, getContentRecovery('configuration'))
  assert.doesNotMatch(JSON.stringify(fallback), /mysql|secret|private-host|script|500|API|SQL/)
  assert.match(fallback.message, /résumé/)
})

test('wake recovery is conditional, never a claim that every failure is sleep', () => {
  for (const code of ['timeout', 'unavailable']) {
    assert.equal(getContentRecovery(code).wake, true)
    assert.match(getContentRecovery(code).message, /may/)
    assert.doesNotMatch(getContentRecovery(code).message, /server|request|timed out|API|HTTP/i)
    assert.notEqual(getContentRecovery(code, false).wake, true)
  }
  for (const code of ['network', 'configuration', 'invalid-content', 'rate-limited']) assert.notEqual(getContentRecovery(code).wake, true)
})
