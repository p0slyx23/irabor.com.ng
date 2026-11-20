import assert from 'node:assert/strict'
import test from 'node:test'
import { ContentLoadError, getContentEndpoint, loadPortfolioContent } from '../../src/core/loadPortfolioContent.mjs'
import { validatePortfolioContent } from '../../shared/content-data.mjs'
import { portableAssets } from '../../scripts/export-content-seed.mjs'
import { createFixture } from './fixtures.mjs'
import * as store from '../../src/content/siteContent.js'

function fixture() {
  const content = JSON.parse(JSON.stringify(portableAssets(createFixture())))
  return { content, assets: {
    'asset:src/assets/files/resume.pdf': '/assets/resume-hash.pdf',
    'asset:src/assets/images/projects/portfolio-v1-cover.png': '/assets/cover-hash.png',
  } }
}
const json = (content) => new Response(JSON.stringify({ schemaVersion: 1, content }), { headers: { 'content-type': 'application/json' } })

test('content endpoint supports a service origin, full endpoint, and local proxy', () => {
  assert.equal(getContentEndpoint('https://api.example.com/'), 'https://api.example.com/api/content')
  assert.equal(getContentEndpoint('https://api.example.com/api/content'), 'https://api.example.com/api/content')
  assert.equal(getContentEndpoint(), '/api/content')
  for (const value of ['javascript:alert(1)', 'https://user:secret@api.example.com', 'https://api.example.com/other', 'https://api.example.com?key=secret']) {
    assert.throws(() => getContentEndpoint(value), ContentLoadError)
  }
})

test('loader validates real payload shape, resolves local files, and hydrates existing page interfaces', async () => {
  const { content, assets } = fixture()
  let options
  const loaded = await loadPortfolioContent({ assets, fetchImpl: async (_url, input) => { options = input; return json(content) } })
  assert.equal(loaded.siteBrand.resumes[0].url, '/assets/resume-hash.pdf')
  assert.equal(loaded.projectPosts[0].image.src, '/assets/cover-hash.png')
  assert.equal(options.credentials, 'omit')
  store.installPortfolioContent(loaded)
  assert.equal(store.siteBrand.name, 'Irabor')
  assert.equal(store.getProjectBySlug('first-project'), loaded.projectEntries['first-project'])
  assert.equal(store.articleEntries, store.projectEntries)
  assert.equal(store.getProjectSlugFromPath('/projects/first-project'), 'first-project')
  assert.equal(store.getProjectSlugFromPath('/series/first-project'), 'first-project')
})

test('R2 public URLs do not require local asset resolution or upload credentials', async () => {
  const { content } = fixture()
  content.siteBrand.resumes[0].url = 'https://assets.example.com/resume.pdf'
  content.projectPosts[0].image.src = 'https://assets.example.com/image.png'
  content.portfolioProjects.find((project) => project.slug === 'first-project').image.src = 'https://assets.example.com/image.png'
  const loaded = await loadPortfolioContent({ fetchImpl: async () => json(content) })
  assert.equal(loaded.siteBrand.resumes[0].url, 'https://assets.example.com/resume.pdf')
})

test('temporary failures retry once, permanent errors do not, and HTML is never treated as content', async () => {
  const { content, assets } = fixture()
  let calls = 0
  await loadPortfolioContent({ assets, pause: async () => {}, fetchImpl: async () => ++calls === 1 ? new Response('', { status: 503 }) : json(content) })
  assert.equal(calls, 2)
  calls = 0
  await assert.rejects(loadPortfolioContent({ fetchImpl: async () => { calls++; return new Response('frontend HTML', { headers: { 'content-type': 'text/html' } }) } }), (error) => error.code === 'configuration')
  assert.equal(calls, 1)
  await assert.rejects(loadPortfolioContent({ fetchImpl: async () => new Response('', { status: 404 }) }), (error) => error.code === 'service-error')
})

test('only service-unavailable HTTP responses suggest a possible wake-up', async () => {
  for (const status of [401, 403, 404, 429, 500, 502, 503, 504]) {
    const expected = status === 503 ? 'unavailable' : status === 429 ? 'rate-limited' : 'service-error'
    await assert.rejects(loadPortfolioContent({ attempts: 1, fetchImpl: async () => new Response('', { status }) }), error => error.code === expected)
  }
})

test('malformed, unsafe, and unknown-asset content is rejected before the portfolio renders', async () => {
  const { content, assets } = fixture()
  await assert.rejects(loadPortfolioContent({ assets, fetchImpl: async () => json({}) }), (error) => error.code === 'invalid-content')
  content.siteBrand.resumes[0].url = 'javascript:alert(1)'
  assert.throws(() => validatePortfolioContent(content), /Invalid portfolio/)
  const missing = fixture()
  await assert.rejects(loadPortfolioContent({ fetchImpl: async () => json(missing.content) }), (error) => error.code === 'invalid-content')
  const duplicate = fixture().content
  duplicate.projectPosts.push(duplicate.projectPosts[0])
  assert.throws(() => validatePortfolioContent(duplicate), /Invalid portfolio/)
})

test('aborted requests never hydrate content and timeouts stop waiting', async () => {
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(loadPortfolioContent({ signal: controller.signal, fetchImpl: async () => { throw new Error('Should not run') } }), (error) => error.code === 'aborted')
  await assert.rejects(loadPortfolioContent({ timeoutMs: 5, attempts: 1, fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')))) }), (error) => error.code === 'timeout')
  await assert.rejects(loadPortfolioContent({ timeoutMs: 5, attempts: 1, fetchImpl: async (_url, { signal }) => new Response(new ReadableStream({ start(stream) { signal.addEventListener('abort', () => stream.error(new Error('body timed out'))) } }), { headers: { 'content-type': 'application/json' } }) }), (error) => error.code === 'timeout')
})
