// Portfolio content comes from MySQL through the read-only content API.
// Named exports preserve the existing page interfaces. Install once before App mounts.
export let siteBrand = {}
export let siteNavigation = []
export let profileContent = {}
export let socialLinks = []
export let aboutPage = {}
export let experienceSection = { entries: [] }
export let projectCategories = []
export let projectPosts = []
export let portfolioProjects = []
export let projectEntries = {}
export let articleEntries = {}
export let projectStacks = {}
export let blogCategories = []
export let blogPosts = []
export let blogEntries = {}
export let resourceCategories = []
export let resources = []
export let projectsPage = {}
export let snippetCategories = []
export let snippets = []
export let newsletterPage = {}

export function installPortfolioContent(content) {
  siteBrand = content.siteBrand
  siteNavigation = content.siteNavigation ?? []
  profileContent = content.profileContent
  socialLinks = content.socialLinks
  aboutPage = content.aboutPage ?? {}
  experienceSection = content.experienceSection
  projectCategories = content.projectCategories ?? []
  projectPosts = content.projectPosts
  portfolioProjects = content.portfolioProjects
  projectEntries = content.projectEntries
  articleEntries = projectEntries
  projectStacks = content.projectStacks ?? {}
  blogCategories = content.blogCategories ?? []
  blogPosts = content.blogPosts ?? []
  blogEntries = content.blogEntries ?? {}
  resourceCategories = content.resourceCategories ?? []
  resources = content.resources ?? []
  projectsPage = content.projectsPage ?? {}
  snippetCategories = content.snippetCategories ?? []
  snippets = content.snippets ?? []
  newsletterPage = content.newsletterPage ?? {}
}

export function getProjectPath(slug) { return `/projects/${slug}` }
export function getProjectSlugFromPath(pathname = '') { return pathname.replace(/^\/(?:projects|series)\//, '') }
export function getBlogPath(slug) { return `/blog/${slug}` }
export function getBlogSlugFromPath(pathname = '') { return pathname.replace(/^\/blog\//, '') }
export function getArticlePath(slug) { return getProjectPath(slug) }
export function getArticleSlugFromPath(pathname = '') { return getProjectSlugFromPath(pathname) }
export function getProjectStack(slug) { return projectStacks[slug] ?? [] }
export function getProjectBySlug(slug) { return projectEntries[slug] ?? null }
export function getBlogPostBySlug(slug) { return blogEntries[slug] ?? null }
export function getArticleBySlug(slug) { return getProjectBySlug(slug) }
