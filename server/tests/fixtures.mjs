import { settingKeys, createSeedRecords } from '../lib/content.mjs'

export function createFixture() {
  const content = Object.fromEntries(settingKeys.map((key) => [key, { title: key }]))
  Object.assign(content, {
    siteBrand: { name: 'Irabor', tagline: 'Frontend Engineer', location: 'Lagos, Nigeria', resumes: [{ url: '/src/assets/files/resume.pdf' }] },
    profileContent: { name: 'Irabor', introduction: 'Useful interfaces.', about: ['Make we build something useful. “Unicode”', 'Keep \\ paths and quotes \' intact.'] },
    socialLinks: [],
    experienceSection: { title: 'Experience', entries: [{ id: 'first-role', title: 'Engineer', period: '2025 — Present', company: 'Example', summary: 'Build interfaces.', technologies: ['React'] }] },
    projectPosts: [
      { slug: 'first-project', title: 'First', category: 'Case Studies', excerpt: 'First project.', tags: ['React'], date: '2025', image: { src: '/src/assets/images/projects/portfolio-v1-cover.png' } },
      { slug: 'second-project', title: 'Second', category: 'Case Studies', excerpt: 'Second project.', tags: ['React'], date: '2026' },
    ],
    projectEntries: {
      'first-project': { slug: 'first-project', title: 'First', sections: [{ id: 'overview', heading: 'Overview', paragraphs: ['Hello; DROP TABLE nope;'] }] },
      'second-project': { slug: 'second-project', title: 'Second', sections: [] },
    },
    getProjectStack: (slug) => [{ id: `${slug}-react`, title: 'React' }],
  })
  content.portfolioProjects = [...content.projectPosts].reverse()
  return content
}

export function createRows(content = createFixture()) {
  const records = createSeedRecords(content)
  return {
    settings: records.settings.map((row) => ({ content_key: row.key, payload: JSON.stringify(row.payload) })),
    projects: records.projects.map((row) => ({
      slug: row.slug, summary: JSON.stringify(row.summary), detail: JSON.stringify(row.detail),
      stack: JSON.stringify(row.stack), sort_order: row.position, portfolio_order: row.portfolioPosition,
    })),
    experience: records.experience.map((row) => ({ entry_id: row.id, payload: JSON.stringify(row.entry), sort_order: row.position })),
  }
}

export function createFakePool({ fail = false, rows = createRows() } = {}) {
  const calls = []
  const connection = {
    async beginTransaction() { calls.push('begin') },
    async execute(sql) {
      calls.push(sql)
      if (fail) throw new Error('mysql://secret:password@private-host/railway')
      if (sql.includes('portfolio_settings')) return [rows.settings]
      if (sql.includes('portfolio_projects')) return [rows.projects]
      return [rows.experience]
    },
    async commit() { calls.push('commit') },
    async rollback() { calls.push('rollback') },
    release() { calls.push('release') },
  }
  return { calls, async getConnection() { return connection }, async execute(sql) { calls.push(sql); return [[]] } }
}
