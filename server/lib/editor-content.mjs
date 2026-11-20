import { createHash, randomUUID } from 'node:crypto'
import { assembleContent, createSeedRecords, readPortfolioContent, settingKeys } from './content.mjs'
import { validatePortfolioContent } from '../../shared/content-data.mjs'

export class EditorError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value
export const contentRevision = content => createHash('sha256').update(JSON.stringify(canonical(content))).digest('hex')

export function validateEditorContent(content) {
  try {
    validatePortfolioContent(content)
    if (settingKeys.some(key => content[key] == null) || !content.projectPosts.length) throw new Error()
    const ids = new Set()
    for (const entry of content.experienceSection.entries) {
      if (!/^[a-z0-9-]{1,160}$/.test(entry.id) || ids.has(entry.id)) throw new Error()
      ids.add(entry.id)
    }
    for (const project of content.projectPosts) {
      if (project.slug.length > 160 || !project.title.trim()) throw new Error()
      const detail = content.projectEntries[project.slug]
      if (!Array.isArray(detail.toc) || !Array.isArray(detail.stack) || !Array.isArray(detail.meta)) throw new Error()
      for (const key of ['related', 'tags', 'evidence', 'screenshots', 'links']) {
        if (detail[key] != null && !Array.isArray(detail[key])) throw new Error()
      }
      const sectionIds = new Set()
      for (const section of detail.sections) {
        if (!/^[a-z0-9-]+$/.test(section.id) || sectionIds.has(section.id)) throw new Error()
        sectionIds.add(section.id)
      }
    }
    const slugs = new Set(content.projectPosts.map(project => project.slug))
    if (Object.keys(content.projectEntries).some(slug => !slugs.has(slug))) throw new Error()
    if (new Set(content.portfolioProjects.map(project => project.slug)).size !== content.portfolioProjects.length) throw new Error()
    // Never persist development URLs or Vite's generated filenames as asset locations.
    const inspect = value => {
      if (typeof value === 'string' && /^\/(?:src\/assets\/|assets\/)/.test(value)) throw new Error()
      if (Array.isArray(value)) value.forEach(inspect)
      else if (value && typeof value === 'object') Object.values(value).forEach(inspect)
    }
    inspect(content)
    return content
  } catch { throw new EditorError(400, 'Check the fields, links, and project sections. Keep at least one project and use public asset URLs or stable asset references.') }
}

export function createEditorStore(pool) {
  const read = async () => {
    const content = validatePortfolioContent(await readPortfolioContent(pool))
    const [assets] = await pool.execute('SELECT asset_ref, public_url FROM portfolio_assets')
    const [history] = await pool.execute('SELECT revision_id, created_at FROM portfolio_content_history ORDER BY created_at DESC, revision_id DESC LIMIT 1')
    return { content, revision: contentRevision(content), assets: Object.fromEntries(assets.map(row => [row.asset_ref, row.public_url])), undo: history[0]?.revision_id ?? null }
  }

  const save = async (next, expectedRevision) => {
    validateEditorContent(next)
    const connection = await pool.getConnection()
    let locked = false
    try {
      const [[lock]] = await connection.execute('SELECT GET_LOCK(?, 0) AS acquired', ['portfolio-local-editor'])
      if (Number(lock.acquired) !== 1) throw new EditorError(409, 'Another save is running. Please try again.')
      locked = true
      await connection.beginTransaction()
      const [settings] = await connection.execute('SELECT content_key, payload FROM portfolio_settings FOR UPDATE')
      const [projects] = await connection.execute('SELECT slug, summary, detail, stack, sort_order, portfolio_order FROM portfolio_projects ORDER BY sort_order, slug FOR UPDATE')
      const [experience] = await connection.execute('SELECT entry_id, payload, sort_order FROM portfolio_experience ORDER BY sort_order, entry_id FOR UPDATE')
      const previous = assembleContent(settings, projects, experience)
      if (contentRevision(previous) !== expectedRevision) throw new EditorError(409, 'Content changed in another tab. Reload the latest content before saving again.')
      const backup = randomUUID()
      await connection.execute('INSERT INTO portfolio_content_history (revision_id, payload) VALUES (?, ?)', [backup, JSON.stringify(previous)])
      const records = createSeedRecords({ ...next, getProjectStack: slug => next.projectEntries[slug].stack })
      for (const row of records.settings) await connection.execute('UPDATE portfolio_settings SET payload = ? WHERE content_key = ?', [JSON.stringify(row.payload), row.key])
      for (const row of records.projects) await connection.execute(
        'INSERT INTO portfolio_projects (slug, summary, detail, stack, sort_order, portfolio_order) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE summary = VALUES(summary), detail = VALUES(detail), stack = VALUES(stack), sort_order = VALUES(sort_order), portfolio_order = VALUES(portfolio_order)',
        [row.slug, JSON.stringify(row.summary), JSON.stringify(row.detail), JSON.stringify(row.stack), row.position, row.portfolioPosition])
      for (const row of projects) if (!next.projectEntries[row.slug]) await connection.execute('DELETE FROM portfolio_projects WHERE slug = ?', [row.slug])
      const entryIds = new Set(records.experience.map(row => row.id))
      for (const row of records.experience) await connection.execute('INSERT INTO portfolio_experience (entry_id, payload, sort_order) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE payload = VALUES(payload), sort_order = VALUES(sort_order)', [row.id, JSON.stringify(row.entry), row.position])
      for (const row of experience) if (!entryIds.has(row.entry_id)) await connection.execute('DELETE FROM portfolio_experience WHERE entry_id = ?', [row.entry_id])
      await connection.commit()
    } catch (error) {
      await connection.rollback().catch(() => {})
      throw error
    } finally {
      if (locked) await connection.execute('SELECT RELEASE_LOCK(?)', ['portfolio-local-editor']).catch(() => {})
      connection.release()
    }
    return read()
  }

  const restore = async (id, revision) => {
    if (!/^[a-f0-9-]{36}$/.test(id)) throw new EditorError(400, 'Invalid recovery snapshot.')
    const [[row]] = await pool.execute('SELECT payload FROM portfolio_content_history WHERE revision_id = ?', [id])
    if (!row) throw new EditorError(404, 'Recovery snapshot not found.')
    return save(typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload, revision)
  }
  return { read, save, restore }
}
