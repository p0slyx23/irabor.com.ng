import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('Railway runs the read-only API rather than the Vite frontend', async () => {
  const config = JSON.parse(await readFile(new URL('../../railway.json', import.meta.url), 'utf8'))
  assert.equal(config.build.buildCommand, 'npm run api:build')
  const pack = JSON.parse(await readFile(new URL('../../railpack.json', import.meta.url), 'utf8'))
  assert.deepEqual(pack.steps.install.commands, ['npm ci --omit=dev'])
  const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'))
  assert.equal(pkg.scripts['api:build'], 'node server/build.mjs')
  assert.equal(pkg.packageManager, 'npm@11.6.2')
  assert.equal(config.deploy.startCommand, 'npm run api:start')
  assert.deepEqual(config.deploy.preDeployCommand, ['npm run db:migrate'])
  assert.equal(config.deploy.healthcheckPath, '/readyz')
  assert.equal(config.deploy.sleepApplication, false)
})

test('the API image excludes secrets and frontend-only files, not runtime modules', async () => {
  const patterns = (await readFile(new URL('../../.dockerignore', import.meta.url), 'utf8'))
    .split(/\r?\n/).filter((line) => line && !line.startsWith('#'))
  for (const required of ['**/node_modules', '**/.env', '**/.env.*', '.git', 'src', 'public', 'dist', 'server/tests']) {
    assert.ok(patterns.includes(required), `Missing build exclusion: ${required}`)
  }
  assert.ok(!patterns.includes('server'))
  assert.ok(!patterns.includes('shared'))
})
