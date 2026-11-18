import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createServer } from 'vite'
import { createSeedRecords } from '../server/lib/content.mjs'

// Asset tokens survive Vite's hashed production filenames. A future frontend
// adapter resolves these references using its own bundled asset registry.
export function portableAssets(value) {
  if (typeof value === 'string') {
    return value.startsWith('/src/assets/') ? `asset:${value.slice(1)}` : value
  }
  if (Array.isArray(value)) return value.map(portableAssets)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, portableAssets(item)]))
  }
  return value
}

function sqlText(value) {
  // JSON strings use hexadecimal UTF-8 literals to preserve quotes, backslashes,
  // Pidgin, and Unicode independently of the client's SQL mode and encoding.
  return `CONVERT(X'${Buffer.from(value, 'utf8').toString('hex')}' USING utf8mb4)`
}

export function createSeedSql(content) {
  const records = portableAssets(createSeedRecords(content))
  const statements = [
    '-- Initial portfolio content, exported from src/content/siteContent.js.',
    '-- Generated UTF-8 JSON literals. Do not edit an already-applied migration.',
    '-- Duplicate keys are left unchanged, preserving content edited in MySQL.',
    '-- Files stay in the repository. asset:src/assets/... references identify those files.',
    'SET NAMES utf8mb4;',
  ]
  for (const { key, payload } of records.settings) {
    statements.push(`-- Setting: ${key}\nINSERT INTO portfolio_settings (content_key, payload) VALUES ('${key}', ${sqlText(JSON.stringify(payload))}) ON DUPLICATE KEY UPDATE content_key = content_key;`)
  }
  for (const { slug, summary, detail, stack, position, portfolioPosition } of records.projects) {
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Project slugs must use lowercase ASCII letters, digits, and hyphens.')
    if (!detail) throw new Error(`Missing project case study: ${slug}`)
    statements.push(`-- Project: ${slug}\nINSERT INTO portfolio_projects (slug, summary, detail, stack, sort_order, portfolio_order) VALUES ('${slug}', ${sqlText(JSON.stringify(summary))}, ${sqlText(JSON.stringify(detail))}, ${sqlText(JSON.stringify(stack))}, ${position}, ${portfolioPosition ?? 'NULL'}) ON DUPLICATE KEY UPDATE slug = slug;`)
  }
  for (const { id, entry, position } of records.experience) {
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Experience IDs must use lowercase ASCII letters, digits, and hyphens.')
    statements.push(`-- Experience: ${id}\nINSERT INTO portfolio_experience (entry_id, payload, sort_order) VALUES ('${id}', ${sqlText(JSON.stringify(entry))}, ${position}) ON DUPLICATE KEY UPDATE entry_id = entry_id;`)
  }
  return `${statements.join('\n\n')}\n`
}

export function createProjectUpdateSql(content, slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid project slug.')
  const project = portableAssets(createSeedRecords(content)).projects.find((entry) => entry.slug === slug)
  if (!project?.detail || project.detail.slug !== slug) throw new Error('Project summary and case study must exist and have matching slugs.')
  return [
    `-- Update project content: ${slug}. Existing cover references and ordering are retained.`,
    '-- Apply after the initial seed. Do not edit an already-applied migration.',
    'SET NAMES utf8mb4;',
    'UPDATE portfolio_projects',
    `SET summary = ${sqlText(JSON.stringify(project.summary))},`,
    `    detail = ${sqlText(JSON.stringify(project.detail))},`,
    `    stack = ${sqlText(JSON.stringify(project.stack))}`,
    `WHERE slug = '${slug}';`,
    '',
  ].join('\n')
}

async function main() {
  const outputFlag = process.argv.indexOf('--output')
  const output = outputFlag < 0 ? 'server/database/content-export.local.sql' : process.argv[outputFlag + 1]
  if (!output || output.startsWith('--')) throw new Error('Provide a file path after --output.')
  const vite = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom',
  })
  try {
    const content = await vite.ssrLoadModule('/src/content/siteContent.js')
    const projectFlag = process.argv.indexOf('--project')
    const slug = projectFlag < 0 ? null : process.argv[projectFlag + 1]
    if (projectFlag >= 0 && (!slug || slug.startsWith('--'))) throw new Error('Provide a slug after --project.')
    const sql = projectFlag < 0 ? createSeedSql(content) : createProjectUpdateSql(content, slug)
    const target = resolve(output)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, sql, { flag: outputFlag < 0 ? 'w' : 'wx' })
    console.log(slug
      ? `Exported the ${slug} project update to ${output}.`
      : `Exported ${content.projectPosts.length} projects and ${content.experienceSection.entries.length} experience entries to ${output}.`)
  } finally {
    await vite.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(() => {
    console.error('Content export failed. Check the content and use a new --output path if the file already exists.')
    process.exitCode = 1
  })
}
