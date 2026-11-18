import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'
import { assembleContent } from '../lib/content.mjs'

test('initial SQL snapshot restores all projects, experience, and portable file references', async () => {
    // The initial migration is immutable. Test its own snapshot rather than
    // requiring future content edits to rewrite an already-applied migration.
    const sql = await readFile(new URL('../database/migrations/002_initial_content.sql', import.meta.url), 'utf8')
    const jsonLiteral = "CONVERT\\(X'([0-9a-f]+)' USING utf8mb4\\)"
    const decode = (hex) => JSON.parse(Buffer.from(hex, 'hex').toString('utf8'))
    const settings = [...sql.matchAll(new RegExp(`INSERT INTO portfolio_settings .*?VALUES \\('([^']+)', ${jsonLiteral}\\)`, 'g'))]
      .map((match) => ({ content_key: match[1], payload: decode(match[2]) }))
    const projects = [...sql.matchAll(new RegExp(`INSERT INTO portfolio_projects .*?VALUES \\('([^']+)', ${jsonLiteral}, ${jsonLiteral}, ${jsonLiteral}, (\\d+), (NULL|\\d+)\\)`, 'g'))]
      .map((match) => ({ slug: match[1], summary: decode(match[2]), detail: decode(match[3]), stack: decode(match[4]), sort_order: Number(match[5]), portfolio_order: match[6] === 'NULL' ? null : Number(match[6]) }))
    const experience = [...sql.matchAll(new RegExp(`INSERT INTO portfolio_experience .*?VALUES \\('([^']+)', ${jsonLiteral}, (\\d+)\\)`, 'g'))]
      .map((match) => ({ entry_id: match[1], payload: decode(match[2]), sort_order: Number(match[3]) }))
    const restored = assembleContent(settings, projects, experience)
    assert.equal(projects.length, 11)
    assert.equal(experience.length, 3)
    assert.equal(projects.length, new Set(projects.map((project) => project.slug)).size)
    assert.equal(restored.projectEntries['icypop-store'].title, 'Icypop Store')
    assert.equal(restored.projectStacks['icypop-store'].length, 6)
    for (const project of restored.projectPosts) assert.equal(restored.projectEntries[project.slug].slug, project.slug)
    for (const snippet of restored.snippets) {
      assert.ok(snippet.id, 'Snippet must have its own ID')
      assert.ok(restored.projectEntries[snippet.projectSlug], 'Snippet must link to a real project')
    }
    const assetPaths = [...JSON.stringify(restored).matchAll(/asset:(src\/assets\/[^"\\]+)/g)].map((match) => match[1])
    assert.ok(assetPaths.includes('src/assets/files/resume.pdf'))
    for (const path of new Set(assetPaths)) await access(new URL(`../../${path}`, import.meta.url))
})

test('Icypop revision migration contains the supplied content and keeps its cover', async () => {
  const sql = await readFile(new URL('../database/migrations/003_update_icypop_store.sql', import.meta.url), 'utf8')
  assert.match(sql, /WHERE slug = 'icypop-store';/)
  assert.ok(!sql.includes('sort_order ='))
  const [summary, detail, stack] = [...sql.matchAll(/CONVERT\(X'([0-9a-f]+)' USING utf8mb4\)/g)]
    .map((match) => JSON.parse(Buffer.from(match[1], 'hex').toString('utf8')))
  assert.equal(summary.excerpt, 'A beauty ecommerce platform for product discovery, secure checkout, loyalty rewards, customer accounts, and support.')
  assert.deepEqual(summary.tags, ['React', 'PHP', 'MySQL', 'Paystack', 'Cloudflare R2'])
  assert.deepEqual(detail.tags, summary.tags)
  assert.deepEqual(summary.links, [{ label: 'Visit Icypop Store', href: 'https://icypopstore.com/' }])
  assert.deepEqual(detail.links, summary.links)
  assert.equal(summary.date, '2026')
  assert.equal(summary.sortDate, '2026')
  assert.equal(summary.featured, true)
  assert.equal(summary.image.src, 'asset:src/assets/images/projects/icypop-store-cover.png')
  assert.equal(detail.coverImage.src, summary.image.src)
  assert.equal(detail.lede, 'Icypop Store brings beauty shopping, payments, member rewards, order management, and customer support into one connected storefront.')
  assert.deepEqual(detail.sections.map((section) => section.id), ['overview', 'challenge', 'role', 'outcome'])
  assert.deepEqual(detail.toc.map((section) => section.id), detail.sections.map((section) => section.id))
  assert.equal(detail.sections[1].heading, 'The Challenge')
  assert.equal(detail.sections[2].list.length, 5)
  assert.equal(stack.length, 6)
})
