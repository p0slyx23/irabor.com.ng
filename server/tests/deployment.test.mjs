import assert from 'node:assert/strict'
import { copyFile, mkdtemp, readFile, rm } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'

test('direct npm install does not opt into unprovisioned Corepack runtime layers', async () => {
  const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'))
  // Railpack 0.43 adds /opt/corepack to runtime layers when packageManager is
  // present for npm. Our explicit install commands do not provision Corepack.
  assert.equal(pkg.packageManager, undefined,
    'Direct npm install must not request /opt/corepack through packageManager metadata.')
})

test('the custom install stages both manifests before real npm ci reads them', async (t) => {
  const config = JSON.parse(await readFile(new URL('../../railpack.json', import.meta.url), 'utf8'))
  const directory = await mkdtemp(join(tmpdir(), 'irabor-install-regression-'))
  // Only this test's freshly-created temporary directory is removed.
  t.after(() => rm(directory, { recursive: true, force: true }))
  assert.ok(process.env.npm_execpath, 'Run this test through npm run test:server.')
  let installed = false
  // Replay the documented copy/exec subset of this install override. Unlike
  // testing in the repository root, the install layer starts with no files.
  for (const command of config.steps.install.commands) {
    if (typeof command === 'object') {
      assert.ok(['package.json', 'package-lock.json'].includes(command.src))
      assert.equal(command.dest, command.src)
      await copyFile(new URL(`../../${command.src}`, import.meta.url), join(directory, command.dest))
    } else {
      assert.equal(command, 'npm ci --omit=dev')
      try {
        await promisify(execFile)(process.execPath, [process.env.npm_execpath,
          'ci', '--omit=dev', '--dry-run', '--offline', '--ignore-scripts',
          '--no-audit', '--no-fund', '--cache', join(directory, 'npm-cache'),
        ], { cwd: directory, timeout: 20000 })
      } catch (error) {
        const code = error.stderr?.match(/npm error code ([A-Z_]+)/)?.[1] || 'INSTALL_FAILED'
        assert.fail(`Isolated install layer: npm ${code}. Check that package.json and package-lock.json were copied before npm ci.`)
      }
      installed = true
    }
  }
  assert.ok(installed, 'The install step must run npm ci.')
})

test('Railway runs the read-only API rather than the Vite frontend', async () => {
  const config = JSON.parse(await readFile(new URL('../../railway.json', import.meta.url), 'utf8'))
  assert.equal(config.build.buildCommand, 'npm run api:build')
  const pack = JSON.parse(await readFile(new URL('../../railpack.json', import.meta.url), 'utf8'))
  assert.deepEqual(pack.steps.install.commands, [
    { src: 'package.json', dest: 'package.json' },
    { src: 'package-lock.json', dest: 'package-lock.json' },
    'npm ci --omit=dev',
  ])
  assert.equal(pack.provider, 'node')
  assert.deepEqual(pack.steps.build.commands, [config.build.buildCommand])
  assert.equal(pack.deploy.startCommand, config.deploy.startCommand)
  const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'))
  assert.equal(pkg.scripts['api:build'], 'node server/build.mjs')
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
