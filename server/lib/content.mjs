export const settingKeys = [
  'siteBrand', 'siteNavigation', 'profileContent', 'socialLinks', 'aboutPage',
  'experienceSection', 'projectCategories', 'blogCategories', 'blogPosts',
  'blogEntries', 'resourceCategories', 'resources', 'projectsPage',
  'snippetCategories', 'snippets', 'newsletterPage',
]

function parseJson(value) {
  return typeof value === 'string' ? JSON.parse(value) : value
}

export function createSeedRecords(content) {
  const settings = settingKeys.map((key) => ({
    key,
    payload: key === 'experienceSection'
      ? Object.fromEntries(Object.entries(content[key]).filter(([name]) => name !== 'entries'))
      : content[key],
  }))
  const projects = content.projectPosts.map((summary, position) => {
    const portfolioPosition = content.portfolioProjects.findIndex((entry) => entry.slug === summary.slug)
    return {
      slug: summary.slug,
      summary,
      detail: content.projectEntries[summary.slug],
      stack: content.getProjectStack(summary.slug),
      position,
      portfolioPosition: portfolioPosition < 0 ? null : portfolioPosition,
    }
  })
  return {
    settings,
    projects,
    experience: content.experienceSection.entries.map((entry, position) => ({ id: entry.id, entry, position })),
  }
}

export function assembleContent(settings, projects, experience) {
  const content = Object.fromEntries(settings
    .filter((row) => settingKeys.includes(row.content_key))
    .map((row) => [row.content_key, parseJson(row.payload)]))
  if (settingKeys.some((key) => content[key] == null) || !projects.length) {
    throw new Error('Portfolio content has not been seeded.')
  }
  const orderedProjects = [...projects].sort((a, b) => a.sort_order - b.sort_order)
  content.projectPosts = orderedProjects.map((row) => parseJson(row.summary))
  content.projectEntries = Object.fromEntries(orderedProjects.map((row) => [row.slug, parseJson(row.detail)]))
  content.projectStacks = Object.fromEntries(orderedProjects.map((row) => [row.slug, parseJson(row.stack)]))
  content.portfolioProjects = orderedProjects.filter((row) => row.portfolio_order !== null)
    .sort((a, b) => a.portfolio_order - b.portfolio_order).map((row) => parseJson(row.summary))
  content.experienceSection = {
    ...content.experienceSection,
    entries: [...experience].sort((a, b) => a.sort_order - b.sort_order).map((row) => parseJson(row.payload)),
  }
  return content
}

export async function readPortfolioContent(pool) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [settings] = await connection.execute('SELECT content_key, payload FROM portfolio_settings')
    const [projects] = await connection.execute('SELECT slug, summary, detail, stack, sort_order, portfolio_order FROM portfolio_projects ORDER BY sort_order, slug')
    const [experience] = await connection.execute('SELECT entry_id, payload, sort_order FROM portfolio_experience ORDER BY sort_order, entry_id')
    const content = assembleContent(settings, projects, experience)
    await connection.commit()
    return content
  } catch (error) {
    await connection.rollback().catch(() => {})
    throw error
  } finally {
    connection.release()
  }
}
