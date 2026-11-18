import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('Railway runs the read-only API rather than the Vite frontend', async () => {
  const config = JSON.parse(await readFile(new URL('../../railway.json', import.meta.url), 'utf8'))
  assert.equal(config.build.buildCommand, 'npm ci --omit=dev')
  assert.equal(config.deploy.startCommand, 'npm run api:start')
  assert.deepEqual(config.deploy.preDeployCommand, ['npm run db:migrate'])
  assert.equal(config.deploy.healthcheckPath, '/readyz')
  assert.equal(config.deploy.sleepApplication, false)
})
