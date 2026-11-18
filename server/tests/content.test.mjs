import assert from 'node:assert/strict'
import test from 'node:test'
import { assembleContent, createSeedRecords, readPortfolioContent } from '../lib/content.mjs'
import { createFixture, createRows, createFakePool } from './fixtures.mjs'
import { createSeedSql, createProjectUpdateSql, portableAssets } from '../../scripts/export-content-seed.mjs'

test('SQL seed records roundtrip every public content field and preserve both project orders', () => {
  const original = createFixture()
  const rows = createRows(original)
  const assembled = assembleContent(rows.settings.reverse(), rows.projects.reverse(), rows.experience)
  for (const [key, value] of Object.entries(original)) {
    if (typeof value !== 'function') assert.deepEqual(assembled[key], value, key)
  }
  assert.deepEqual(assembled.projectStacks['first-project'], original.getProjectStack('first-project'))
})

test('native JSON values and JSON strings from MySQL are both supported', () => {
  const rows = createRows()
  rows.settings.forEach((row) => { row.payload = JSON.parse(row.payload) })
  rows.projects.forEach((row) => { row.summary = JSON.parse(row.summary) })
  assert.equal(assembleContent(rows.settings, rows.projects, rows.experience).siteBrand.name, 'Irabor')
})

test('missing seed content fails readiness and arbitrary settings are not exposed', () => {
  const rows = createRows()
  rows.settings.push({ content_key: 'private-token', payload: '"never return"' })
  assert.equal(assembleContent(rows.settings, rows.projects, rows.experience)['private-token'], undefined)
  assert.throws(() => assembleContent([], rows.projects, rows.experience), /not been seeded/)
  assert.throws(() => assembleContent(rows.settings, [], rows.experience), /not been seeded/)
})

test('reads commit and release the connection, and failures rollback and release', async () => {
  const good = createFakePool()
  assert.equal((await readPortfolioContent(good)).projectPosts.length, 2)
  assert.deepEqual(good.calls.slice(-2), ['commit', 'release'])
  const bad = createFakePool({ fail: true })
  await assert.rejects(readPortfolioContent(bad))
  assert.deepEqual(bad.calls.slice(-2), ['rollback', 'release'])
})

test('portable asset references preserve external URLs and do not mutate source data', () => {
  const original = createFixture()
  const records = createSeedRecords(original)
  const converted = portableAssets(records)
  assert.equal(converted.settings.find((row) => row.key === 'siteBrand').payload.resumes[0].url, 'asset:src/assets/files/resume.pdf')
  assert.equal(original.siteBrand.resumes[0].url, '/src/assets/files/resume.pdf')
  assert.equal(portableAssets('https://example.com/image.png'), 'https://example.com/image.png')
  assert.equal(portableAssets('/images/photo.png'), '/images/photo.png')
})

test('generated seed is non-destructive and preserves Unicode, punctuation, and backslashes', () => {
  const fixture = createFixture()
  const sql = createSeedSql(fixture)
  assert.ok(sql.includes('ON DUPLICATE KEY UPDATE slug = slug'))
  assert.ok(sql.includes('ON DUPLICATE KEY UPDATE content_key = content_key'))
  assert.ok(!sql.includes('DROP TABLE nope'))
  const values = [...sql.matchAll(/CONVERT\(X'([0-9a-f]+)' USING utf8mb4\)/g)]
    .map((match) => JSON.parse(Buffer.from(match[1], 'hex').toString('utf8')))
  assert.ok(values.some((value) => JSON.stringify(value) === JSON.stringify(fixture.profileContent)))
  assert.ok(values.some((value) => value.sections?.[0]?.paragraphs?.[0] === 'Hello; DROP TABLE nope;'))
})

test('invalid project identifiers and missing case studies cannot generate partial seeds', () => {
  const fixture = createFixture()
  fixture.projectPosts[0].slug = "bad'); DROP TABLE users; --"
  assert.throws(() => createSeedSql(fixture), /slugs/)
  const missing = createFixture()
  delete missing.projectEntries['first-project']
  assert.throws(() => createSeedSql(missing), /Missing project case study/)
})

test('project update SQL targets one row, preserves ordering, and encodes portable assets', () => {
  const fixture = createFixture()
  const sql = createProjectUpdateSql(fixture, 'first-project')
  assert.match(sql, /WHERE slug = 'first-project';/)
  assert.ok(!sql.includes('sort_order ='))
  assert.ok(!sql.includes('portfolio_order ='))
  assert.ok(!sql.includes('INSERT INTO'))
  const values = [...sql.matchAll(/CONVERT\(X'([0-9a-f]+)' USING utf8mb4\)/g)]
    .map((match) => JSON.parse(Buffer.from(match[1], 'hex').toString('utf8')))
  assert.deepEqual(values[0], portableAssets(fixture.projectPosts[0]))
  assert.deepEqual(values[1], fixture.projectEntries['first-project'])
  assert.deepEqual(values[2], fixture.getProjectStack('first-project'))
  assert.throws(() => createProjectUpdateSql(fixture, "bad'; DELETE --"), /Invalid project slug/)
  assert.throws(() => createProjectUpdateSql(fixture, 'unknown'), /must exist/)
})
