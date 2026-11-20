import assert from 'node:assert/strict'
import { createServer, request as httpRequest } from 'node:http'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createEditorHandler, assertLocalEditorEnvironment } from '../lib/editor-api.mjs'
import { contentRevision, createEditorStore, validateEditorContent } from '../lib/editor-content.mjs'
import { assembleContent } from '../lib/content.mjs'
import { createRows } from './fixtures.mjs'
import { portableAssets } from '../../scripts/export-content-seed.mjs'
import { moveEntry, putProject, projectForEditing, removeEntry } from '../../src/dev/editor-model.mjs'

function fixture() {
  const rows = createRows()
  const content = portableAssets(assembleContent(rows.settings, rows.projects, rows.experience))
  for (const detail of Object.values(content.projectEntries)) Object.assign(detail, { toc: [], meta: [], stack: [] })
  return content
}

function fakeDatabase() {
  let content = fixture()
  let history = new Map()
  let checkpoint
  const calls = []
  let failWrites = false
  const connection = {
    async beginTransaction() { checkpoint = { content: structuredClone(content), history: new Map(history) } },
    async commit() {},
    async rollback() { if (checkpoint) { content = checkpoint.content; history = checkpoint.history } },
    release() {},
    async execute(sql, values = []) {
      calls.push({ sql, values })
      if (sql.includes('GET_LOCK')) return [[{ acquired: 1 }]]
      if (sql.includes('RELEASE_LOCK')) return [[]]
      if (sql.startsWith('SELECT content_key')) {
        const keys = (await import('../lib/content.mjs')).settingKeys
        return [keys.map(key => ({ content_key: key, payload: key === 'experienceSection' ? { title: content.experienceSection.title } : content[key] }))]
      }
      if (sql.startsWith('SELECT slug')) return [content.projectPosts.map((summary, sort_order) => ({ slug: summary.slug, summary, detail: content.projectEntries[summary.slug], stack: content.projectStacks[summary.slug] || [], sort_order, portfolio_order: content.portfolioProjects.findIndex(item => item.slug === summary.slug) < 0 ? null : content.portfolioProjects.findIndex(item => item.slug === summary.slug) }))]
      if (sql.startsWith('SELECT entry_id')) return [content.experienceSection.entries.map((payload, sort_order) => ({ entry_id: payload.id, payload, sort_order }))]
      if (sql.startsWith('INSERT INTO portfolio_content_history')) { history.set(values[0], values[1]); return [{}] }
      if (failWrites) throw new Error('mysql://private:secret@internal/railway')
      if (sql.startsWith('UPDATE portfolio_settings')) { if (values[1] === 'experienceSection') content.experienceSection = { ...JSON.parse(values[0]), entries: content.experienceSection.entries }; else content[values[1]] = JSON.parse(values[0]) }
      if (sql.startsWith('INSERT INTO portfolio_projects')) {
        const [slug, summary, detail, stack, position, portfolioPosition] = values
        content.projectPosts = content.projectPosts.filter(item => item.slug !== slug)
        content.projectPosts.splice(position, 0, JSON.parse(summary))
        content.projectEntries[slug] = JSON.parse(detail)
        content.projectStacks[slug] = JSON.parse(stack)
        content.portfolioProjects = content.portfolioProjects.filter(item => item.slug !== slug)
        if (portfolioPosition !== null) content.portfolioProjects.splice(portfolioPosition, 0, JSON.parse(summary))
      }
      if (sql.startsWith('DELETE FROM portfolio_projects')) content = removeEntry(content, 'project', values[0])
      if (sql.startsWith('INSERT INTO portfolio_experience')) {
        content.experienceSection.entries = content.experienceSection.entries.filter(item => item.id !== values[0])
        content.experienceSection.entries.splice(values[2], 0, JSON.parse(values[1]))
      }
      if (sql.startsWith('DELETE FROM portfolio_experience')) content.experienceSection.entries = content.experienceSection.entries.filter(item => item.id !== values[0])
      return [{}]
    },
  }
  const pool = { async getConnection() { return connection }, async execute(sql, values) {
    if (sql.includes('portfolio_assets')) return [[]]
    if (sql.startsWith('SELECT revision_id')) return [[...history.keys()].reverse().slice(0, 1).map(revision_id => ({ revision_id }))]
    if (sql.startsWith('SELECT payload')) return [history.has(values[0]) ? [{ payload: history.get(values[0]) }] : []]
    throw new Error('Unexpected test query')
  } }
  return { pool, calls, fail: () => { failWrites = true } }
}

test('editor saves use conflict checks, parameterized writes, snapshots, and recoverable deletion', async () => {
  const db = fakeDatabase()
  const store = createEditorStore(db.pool)
  const first = await store.read()
  const next = structuredClone(first.content)
  next.profileContent.introduction = "Unicode: make we build. SQL '; DROP TABLE never;"
  const saved = await store.save(next, first.revision)
  assert.equal(saved.content.profileContent.introduction, next.profileContent.introduction)
  assert.notEqual(saved.revision, first.revision)
  assert.ok(saved.undo)
  await assert.rejects(store.save(next, first.revision), error => error.status === 409)
  const deleted = await store.save(removeEntry(saved.content, 'project', 'first-project'), saved.revision)
  assert.equal(deleted.content.projectPosts.length, 1)
  const restored = await store.restore(deleted.undo, deleted.revision)
  assert.equal(restored.content.projectPosts.length, 2)
  assert.ok(db.calls.every(call => !call.sql.includes('DROP TABLE never')))
  assert.ok(db.calls.some(call => call.sql.includes('FOR UPDATE')))
  assert.ok(!db.calls.some(call => /(?:INSERT|DELETE|UPDATE).*portfolio_assets/.test(call.sql)))
})

test('failed editor writes rollback content and the recovery snapshot', async () => {
  const db = fakeDatabase()
  const store = createEditorStore(db.pool)
  const before = await store.read()
  const next = structuredClone(before.content)
  next.profileContent.name = 'Must not persist'
  db.fail()
  await assert.rejects(store.save(next, before.revision))
  assert.deepEqual(await store.read(), before)
})

test('editor validates unsafe URLs, malformed project structures and duplicate identifiers', () => {
  assert.doesNotThrow(() => validateEditorContent(fixture()))
  for (const mutate of [
    c => { c.socialLinks = [{ label: 'unsafe', icon: 'github', href: 'javascript:alert(1)' }] },
    c => { c.projectEntries['first-project'].evidence = {} },
    c => { c.projectEntries['first-project'].toc = null },
    c => { c.experienceSection.entries.push(c.experienceSection.entries[0]) },
    c => { c.siteBrand.resumes[0].url = '/assets/resume-hash.pdf' },
    c => { c.projectPosts = [] },
  ]) { const content = fixture(); mutate(content); assert.throws(() => validateEditorContent(content), error => error.status === 400) }
  assert.equal(contentRevision({ b: 2, a: 1 }), contentRevision({ a: 1, b: 2 }))
})

test('project edits keep summary, detail, homepage, table of contents and stacks aligned', () => {
  const content = fixture()
  const project = projectForEditing(content, 'first-project')
  project.title = 'Updated project'
  project.sections[0].heading = 'New heading'
  const next = putProject(content, project, 'first-project')
  assert.equal(next.projectEntries['first-project'].title, next.projectPosts[0].title)
  assert.equal(next.portfolioProjects.find(item => item.slug === 'first-project').title, project.title)
  assert.equal(next.projectEntries['first-project'].toc[0].label, 'New heading')
  assert.equal(content.projectPosts[0].title, 'First')
  const ordered = moveEntry(next, 'project', 'first-project', 1)
  assert.equal(ordered.projectPosts[1].slug, 'first-project')
  assert.equal(moveEntry(next, 'project', 'first-project', -1), null)
})

test('local editor refuses deployed environments and is absent from public entrypoints', async () => {
  assert.doesNotThrow(() => assertLocalEditorEnvironment({}))
  for (const env of [{ NODE_ENV: 'production' }, { RAILWAY_PROJECT_ID: 'project' }, { RAILWAY_ENVIRONMENT_ID: 'env' }, { VERCEL: '1' }]) assert.throws(() => assertLocalEditorEnvironment(env), /localhost-only/)
  const entry = await readFile(new URL('../index.mjs', import.meta.url), 'utf8')
  assert.doesNotMatch(entry, /editor/)
  const local = await readFile(new URL('../editor.mjs', import.meta.url), 'utf8')
  assert.match(local, /listen\(port, '127\.0\.0\.1'/)
})

test('editor HTTP rejects hostile hosts, origins, missing tokens and oversized/malformed writes', async t => {
  let reads = 0, saves = 0
  const token = 'a'.repeat(64)
  const content = fixture()
  const store = { async read() { reads++; return { content, revision: contentRevision(content), assets: {} } }, async save() { saves++; return { revision: 'saved' } } }
  let handler
  const server = createServer((request, response) => handler(request, response))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  handler = createEditorHandler({ store, port: server.address().port, token })
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve) }))
  const url = `http://127.0.0.1:${server.address().port}`
  const headers = { Origin: 'http://localhost:5173', 'Content-Type': 'application/json', 'X-Editor-Token': token }
  assert.equal((await fetch(url + '/api/editor/session', { headers })).status, 200)
  const body = JSON.stringify({ content, revision: contentRevision(content) })
  const hostileHost = await new Promise((resolve, reject) => { const request = httpRequest(url + '/api/editor/session', { headers: { Host: 'attacker.test:3002' } }, response => { response.resume(); resolve(response.statusCode) }); request.on('error', reject); request.end() })
  assert.equal(hostileHost, 403)
  for (const extra of [{ Origin: 'https://irabor.com.ng' }, { Origin: 'http://evil.localhost:5173' }, { 'X-Editor-Token': 'b'.repeat(64) }, { 'Sec-Fetch-Site': 'cross-site' }]) {
    assert.equal((await fetch(url + '/api/editor/content', { method: 'PUT', headers: { ...headers, ...extra }, body })).status, 403)
  }
  const noOrigin = { ...headers }
  delete noOrigin.Origin
  assert.equal((await fetch(url + '/api/editor/content', { method: 'PUT', headers: noOrigin, body })).status, 403)
  assert.equal((await fetch(url + '/api/editor/content', { method: 'PUT', headers, body: '{invalid' })).status, 400)
  assert.equal((await fetch(url + '/api/editor/content', { method: 'PUT', headers, body: ' '.repeat(1024 * 1024 + 1) })).status, 413)
  assert.equal((await fetch(url + '/api/editor/content', { method: 'PUT', headers, body })).status, 200)
  assert.equal(reads, 1)
  assert.equal(saves, 1)
})
