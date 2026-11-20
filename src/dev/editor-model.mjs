export const cloneContent = content => JSON.parse(JSON.stringify(content))
export const paragraphs = text => text.split(/\n\s*\n/).map(value => value.trim()).filter(Boolean)
export const commaList = text => [...new Set(text.split(',').map(value => value.trim()).filter(Boolean))]
export const slugify = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 160)

export function newProject() {
  return {
    slug: '', title: '', category: 'Case Studies', date: String(new Date().getFullYear()), excerpt: '', tags: [], featured: true,
    image: { src: '', alt: '' }, lede: '', meta: ['Frontend Engineering', 'Completed'], links: [], stack: [],
    sections: [{ id: 'overview', heading: 'Overview', paragraphs: [] }],
  }
}

export function projectForEditing(content, slug) {
  return cloneContent({ ...content.projectPosts.find(item => item.slug === slug), ...content.projectEntries[slug], image: content.projectPosts.find(item => item.slug === slug)?.image ?? content.projectEntries[slug].coverImage ?? { src: '', alt: '' }, featured: content.portfolioProjects.some(item => item.slug === slug) })
}

export function putProject(content, value, originalSlug) {
  const next = cloneContent(content)
  const slug = originalSlug || slugify(value.slug || value.title)
  if (!slug || (!originalSlug && next.projectEntries[slug])) throw new Error('Choose a unique project slug.')
  const existing = next.projectPosts.find(item => item.slug === slug)
  const summary = { ...existing, slug, title: value.title, category: value.category, date: value.date, sortDate: value.date, excerpt: value.excerpt, tags: value.tags, image: value.image, featured: value.featured }
  const detail = { ...value, slug, coverImage: value.image, toc: value.sections.map(section => ({ id: section.id, label: section.heading })) }
  for (const key of ['image', 'excerpt', 'category', 'date', 'sortDate', 'featured']) delete detail[key]
  if (existing) next.projectPosts = next.projectPosts.map(item => item.slug === slug ? summary : item)
  else next.projectPosts.unshift(summary)
  next.projectEntries[slug] = detail
  next.projectStacks[slug] = detail.stack
  const selected = new Set(next.portfolioProjects.map(item => item.slug))
  if (value.featured) selected.add(slug)
  else selected.delete(slug)
  next.portfolioProjects = next.projectPosts.filter(item => selected.has(item.slug))
  return next
}

export function removeEntry(content, kind, id) {
  const next = cloneContent(content)
  if (kind === 'experience') next.experienceSection.entries = next.experienceSection.entries.filter(item => item.id !== id)
  else {
    if (next.projectPosts.length <= 1) throw new Error('Keep at least one project in the portfolio.')
    next.projectPosts = next.projectPosts.filter(item => item.slug !== id)
    next.portfolioProjects = next.portfolioProjects.filter(item => item.slug !== id)
    delete next.projectEntries[id]
    delete next.projectStacks[id]
    for (const entry of Object.values(next.projectEntries)) if (entry.related) entry.related = entry.related.filter(slug => slug !== id)
  }
  return next
}

export function moveEntry(content, kind, id, offset) {
  const next = cloneContent(content)
  const items = kind === 'experience' ? next.experienceSection.entries : next.projectPosts
  const index = items.findIndex(item => (item.id || item.slug) === id)
  const target = index + offset
  if (index < 0 || target < 0 || target >= items.length) return null
  ;[items[index], items[target]] = [items[target], items[index]]
  if (kind === 'project') {
    const slugs = new Set(next.portfolioProjects.map(item => item.slug))
    next.portfolioProjects = next.projectPosts.filter(item => slugs.has(item.slug))
  }
  return next
}
