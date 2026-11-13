import { useEffect } from 'react'
import { useThemeEngine } from '../core/useThemeEngine.js'
import { navigateTo, normalizePath, scrollToHash, useCurrentPath } from '../core/router.js'
import {
  getProjectBySlug,
  getProjectSlugFromPath,
  siteBrand,
  // siteNavigation,
} from '../content/siteContent.js'
// import { SiteHeader } from '../components/organisms/SiteHeader.jsx'
import { SiteFooter } from '../components/organisms/SiteFooter.jsx'
import { SocialRail } from '../components/organisms/SocialRail.jsx'
// import StatusBar from '../components/atoms/StatusBar.jsx'
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
  const { announcement } = useThemeEngine()
  // Restore theme, themePreference, and toggleTheme here when re-enabling SiteHeader.
  const currentRoute = getCurrentRoute(currentPath)
  const PageComponent = currentRoute.component
  const pageTitle = (() => {
    if (currentRoute.id === 'project-article') {
      return getProjectBySlug(getProjectSlugFromPath(currentPath))?.title ?? currentRoute.title
    }

    return currentRoute.title
  })()

  useEffect(() => {
    document.title = `${pageTitle} | ${siteBrand.name}`
  }, [pageTitle])

  useEffect(() => {
    if (currentRoute.redirect) {
      navigateTo(currentRoute.redirect, { replace: true })
      return undefined
    }

    return scrollToHash(window.location.hash)
  }, [currentPath, currentRoute.redirect])

  return (
    <div className="site-shell" data-route={currentRoute.id}>
      {/* <StatusBar theme={theme} /> */}

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <p aria-live="polite" className="sr-only" role="status">
        {announcement}
      </p>
      <SocialRail className="social-rail--floating" />

      <div className="site-canvas">
        <div className="site-screen" data-route={currentRoute.id}>
          {/* <SiteHeader
            currentPath={currentPath}
            navigation={siteNavigation}
            onToggleTheme={toggleTheme}
            theme={theme}
            themePreference={themePreference}
          /> */}

          <div className="site-screen__body">

            <main className="site-main" id="main-content" tabIndex={-1}>
              <div className="route-frame motion-page-enter" key={currentPath}>
                <PageComponent />
              </div>
            </main>
          </div>

          {currentRoute.id !== 'home' && currentRoute.id !== 'project-archive' ? <SiteFooter /> : null}
        </div>
      </div>
    </div>
  )
}
