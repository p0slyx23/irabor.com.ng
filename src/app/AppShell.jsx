import { useEffect } from 'react'
import { useThemeEngine } from '../core/useThemeEngine.js'
import { normalizePath, useCurrentPath } from '../core/router.js'
import {
  getBlogPostBySlug,
  getBlogSlugFromPath,
  getProjectBySlug,
  getProjectSlugFromPath,
  siteBrand,
  siteNavigation,
} from '../content/siteContent.js'
import { SiteHeader } from '../components/organisms/SiteHeader.jsx'
import { SiteFooter } from '../components/organisms/SiteFooter.jsx'
import { SocialRail } from '../components/organisms/SocialRail.jsx'
import StatusBar from '../components/atoms/StatusBar.jsx'
import { notFoundRoute, routes } from './routes.js'

function getCurrentRoute(pathname) {
  const normalizedPath = normalizePath(pathname)

  return (
    routes.find((route) => {
      if (route.matcher) {
        return route.matcher(normalizedPath)
      }

      return route.path === normalizedPath
    }) ?? notFoundRoute
  )
}

export default function AppShell() {
  const currentPath = useCurrentPath()
  const { announcement, theme, themePreference, toggleTheme } = useThemeEngine()
  const currentRoute = getCurrentRoute(currentPath)
  const PageComponent = currentRoute.component
  const pageTitle = (() => {
    if (currentRoute.id === 'project-article') {
      return getProjectBySlug(getProjectSlugFromPath(currentPath))?.title ?? currentRoute.title
    }

    if (currentRoute.id === 'blog-article') {
      return getBlogPostBySlug(getBlogSlugFromPath(currentPath))?.title ?? currentRoute.title
    }

    return currentRoute.title
  })()

  useEffect(() => {
    document.title = `${pageTitle} | ${siteBrand.name}`
  }, [pageTitle])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [currentPath])

  return (
    <div className="site-shell" data-route={currentRoute.id}>
      <StatusBar theme={theme} />

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <p aria-live="polite" className="sr-only" role="status">
        {announcement}
      </p>

      <div className="site-canvas">
        <div className="site-screen" data-route={currentRoute.id}>
          <SiteHeader
            currentPath={currentPath}
            navigation={siteNavigation}
            onToggleTheme={toggleTheme}
            theme={theme}
            themePreference={themePreference}
          />

          <div className="site-screen__body">
            <SocialRail />

            <main className="site-main" id="main-content">
              <div className="route-frame motion-page-enter" key={currentPath}>
                <PageComponent />
              </div>
            </main>
          </div>

          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
