const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const strings = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string')

function validUrl(value, image = false) {
  if (typeof value !== 'string') return false
  if (!value) return true
  if (image && /^asset:src\/assets\/(images\/projects\/[^/]+\.(png|webp|jpe?g|avif)|files\/resume\.pdf)$/.test(value)) return true
  if ((value.startsWith('/') && !value.startsWith('//')) || (!image && value.startsWith('#'))) return !/[\s\\]/.test(value)
  try {
    const parsed = new URL(value)
    return !parsed.username && !parsed.password && (image ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:', 'tel:']).includes(parsed.protocol)
  } catch { return false }
}

export function validatePortfolioContent(content) {
  const fail = () => { throw new Error('Invalid portfolio content.') }
  if (!record(content) || !record(content.siteBrand) || !record(content.profileContent) || !record(content.experienceSection)) fail()
  for (const key of ['name', 'tagline', 'location']) if (typeof content.siteBrand[key] !== 'string') fail()
  for (const key of ['name', 'introduction']) if (typeof content.profileContent[key] !== 'string') fail()
  if (!strings(content.profileContent.about) || !Array.isArray(content.experienceSection.entries) || !Array.isArray(content.socialLinks)) fail()
  for (const entry of content.experienceSection.entries) {
    if (!record(entry) || ['id', 'period', 'title', 'company', 'summary'].some((key) => typeof entry[key] !== 'string') || !strings(entry.technologies)) fail()
  }
  for (const link of content.socialLinks) {
    if (!record(link) || typeof link.label !== 'string' || !validUrl(link.href) || !['linkedin', 'github', 'mail'].includes(link.icon)) fail()
  }
  if (!Array.isArray(content.projectPosts) || !record(content.projectEntries) || !Array.isArray(content.portfolioProjects)) fail()
  const slugs = new Set()
  for (const project of content.projectPosts) {
    if (!record(project) || !/^[a-z0-9-]+$/.test(project.slug) || slugs.has(project.slug)) fail()
    slugs.add(project.slug)
    if (['title', 'excerpt', 'category', 'date'].some((key) => typeof project[key] !== 'string') || !strings(project.tags)) fail()
    const detail = content.projectEntries[project.slug]
    if (!record(detail) || detail.slug !== project.slug || typeof detail.title !== 'string' || !Array.isArray(detail.sections)) fail()
    for (const section of detail.sections) {
      if (!record(section) || typeof section.id !== 'string' || typeof section.heading !== 'string' || !strings(section.paragraphs)) fail()
      if (section.list != null && !strings(section.list)) fail()
    }
  }
  if (content.portfolioProjects.some((project) => !record(project) || !slugs.has(project.slug))) fail()
  const walk = (value) => {
    if (Array.isArray(value)) return value.forEach(walk)
    if (!record(value)) return
    for (const [key, item] of Object.entries(value)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) fail()
      if (['href', 'url', 'companyUrl', 'repositoryUrl'].includes(key) && !validUrl(item, typeof item === 'string' && item.startsWith('asset:'))) fail()
      if (key === 'src' && !validUrl(item, true)) fail()
      walk(item)
    }
  }
  walk(content)
  return content
}

export function mapAssetReferences(value, resolve) {
  if (typeof value === 'string' && value.startsWith('asset:')) return resolve(value)
  if (Array.isArray(value)) return value.map((item) => mapAssetReferences(item, resolve))
  if (record(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapAssetReferences(item, resolve)]))
  return value
}

export function collectAssetReferences(value) {
  const references = new Set()
  mapAssetReferences(value, (reference) => { references.add(reference); return reference })
  return [...references].sort()
}
