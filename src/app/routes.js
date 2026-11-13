import { HomePage } from '../pages/HomePage.jsx'
import { ArticlePage } from '../pages/ArticlePage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'
import { ProjectArchivePage } from '../pages/ProjectArchivePage.jsx'

function matchProjectRoute(pathname) {
  return (
    (pathname.startsWith('/projects/') && pathname !== '/projects') ||
    (pathname.startsWith('/series/') && pathname !== '/series')
  )
}

export const routes = [
  { id: 'home', path: '/', title: 'Frontend Engineer', component: HomePage },
  { id: 'project-archive', path: '/archive', title: 'Project Archive', component: ProjectArchivePage },
  { id: 'home', path: '/about', title: 'About', component: HomePage, redirect: '/#about' },
  { id: 'home', path: '/experience', title: 'Experience', component: HomePage, redirect: '/#experience' },
  { id: 'home', path: '/projects', title: 'Projects', component: HomePage, redirect: '/#projects' },
  { id: 'home', path: '/series', title: 'Projects', component: HomePage, redirect: '/#projects' },
  {
    id: 'project-article',
    path: '/projects/:slug',
    title: 'Project',
    component: ArticlePage,
    matcher: matchProjectRoute,
  },
]

export const notFoundRoute = {
  id: 'not-found',
  path: '/404',
  title: '404',
  component: NotFoundPage,
}
