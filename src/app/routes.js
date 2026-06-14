import { HomePage } from '../pages/HomePage.jsx'
import { AboutPage } from '../pages/AboutPage.jsx'
import { BlogPage } from '../pages/BlogPage.jsx'
import { ArticlePage } from '../pages/ArticlePage.jsx'
import { ResourcesPage } from '../pages/ResourcesPage.jsx'
import { ProjectsPage } from '../pages/ProjectsPage.jsx'
import { SnippetsPage } from '../pages/SnippetsPage.jsx'
import { NewsletterPage } from '../pages/NewsletterPage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'

function matchBlogArticleRoute(pathname) {
  return pathname.startsWith('/blog/') && pathname !== '/blog'
}

function matchProjectRoute(pathname) {
  return (
    (pathname.startsWith('/projects/') && pathname !== '/projects') ||
    (pathname.startsWith('/series/') && pathname !== '/series')
  )
}

export const routes = [
  { id: 'home', path: '/', title: 'Home', component: HomePage },
  { id: 'about', path: '/about', title: 'About', component: AboutPage },
  { id: 'blog', path: '/blog', title: 'Blog', component: BlogPage },
  {
    id: 'blog-article',
    path: '/blog/:slug',
    title: 'Article',
    component: ArticlePage,
    matcher: matchBlogArticleRoute,
  },
  { id: 'resources', path: '/resources', title: 'Resources', component: ResourcesPage },
  { id: 'projects', path: '/projects', title: 'Projects', component: ProjectsPage },
  { id: 'projects-legacy', path: '/series', title: 'Projects', component: ProjectsPage },
  {
    id: 'project-article',
    path: '/projects/:slug',
    title: 'Project',
    component: ArticlePage,
    matcher: matchProjectRoute,
  },
  { id: 'snippets', path: '/snippets', title: 'Snippets', component: SnippetsPage },
  { id: 'newsletter', path: '/newsletter', title: 'Newsletter', component: NewsletterPage },
]

export const notFoundRoute = {
  id: 'not-found',
  path: '/404',
  title: '404',
  component: NotFoundPage,
}
