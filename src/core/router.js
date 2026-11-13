import { useEffect, useState } from 'react'

const ROUTE_EVENT = 'portfolio:navigate'
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')

export function withBasePath(path) {
  if (!BASE_PATH || !path?.startsWith('/') || path.startsWith('//') || path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path
  return `${BASE_PATH}${path}`
}

export function normalizePath(pathname = '/') {
  if (BASE_PATH && (pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`))) pathname = pathname.slice(BASE_PATH.length) || '/'
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
  window.history[method]({}, '', withBasePath(nextPath))
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
