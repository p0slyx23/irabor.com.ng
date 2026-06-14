import { useEffect, useState } from 'react'

const ROUTE_EVENT = 'portfolio:navigate'

export function normalizePath(pathname = '/') {
  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.replace(/\/+$/, '') || '/'
}

export function navigateTo(pathname, { replace = false } = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const nextPath = normalizePath(pathname)
  const currentPath = normalizePath(window.location.pathname)

  if (nextPath === currentPath) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return
  }

  const method = replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', nextPath)
  window.dispatchEvent(new Event(ROUTE_EVENT))
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

export function useCurrentPath() {
  const [pathname, setPathname] = useState(() => {
    if (typeof window === 'undefined') {
      return '/'
    }

    return normalizePath(window.location.pathname)
  })

  useEffect(() => {
    const handleRouteChange = () => {
      setPathname(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener(ROUTE_EVENT, handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener(ROUTE_EVENT, handleRouteChange)
    }
  }, [])

  return pathname
}
