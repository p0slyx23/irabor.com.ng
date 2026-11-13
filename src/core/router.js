import { useEffect, useState } from 'react'

const ROUTE_EVENT = 'portfolio:navigate'

export function normalizePath(pathname = '/') {
  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.replace(/\/+$/, '') || '/'
}

export function scrollToHash(hash, { behavior = 'auto' } = {}) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const targetHash = hash ?? window.location.hash
  let cancelled = false
  let frameId = window.requestAnimationFrame(async () => {
    // Font metrics can move the section after React's first paint on a reload.
    // Resolve the destination against the final reading layout.
    await document.fonts?.ready
    if (cancelled) return

    frameId = window.requestAnimationFrame(() => {
      if (!targetHash || targetHash === '#') {
        window.scrollTo({ top: 0, left: 0, behavior })
        return
      }

      let id
      try {
        id = decodeURIComponent(targetHash.replace(/^#/, ''))
      } catch {
        return
      }

      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior })
    })
  })

  return () => {
    cancelled = true
    window.cancelAnimationFrame(frameId)
  }
}

export function navigateTo(href, { replace = false } = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const nextUrl = new URL(href, window.location.href)
  if (nextUrl.origin !== window.location.origin) {
    window.location.assign(nextUrl.href)
    return
  }

  const nextPath = normalizePath(nextUrl.pathname)
  const currentPath = normalizePath(window.location.pathname)
  const destination = `${nextPath}${nextUrl.search}${nextUrl.hash}`
  const currentDestination = `${currentPath}${window.location.search}${window.location.hash}`

  if (destination !== currentDestination) {
    const method = replace ? 'replaceState' : 'pushState'
    window.history[method]({}, '', destination)
    window.dispatchEvent(new Event(ROUTE_EVENT))
  }

  // Same-page section clicks scroll after React has closed the mobile menu.
  // Cross-route scrolling belongs to AppShell, after the destination has rendered.
  if (nextPath === currentPath) {
    scrollToHash(nextUrl.hash)
  }
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
    const handleHistoryChange = () => {
      handleRouteChange()
      scrollToHash()
    }

    window.addEventListener('popstate', handleHistoryChange)
    window.addEventListener('hashchange', handleHistoryChange)
    window.addEventListener(ROUTE_EVENT, handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleHistoryChange)
      window.removeEventListener('hashchange', handleHistoryChange)
      window.removeEventListener(ROUTE_EVENT, handleRouteChange)
    }
  }, [])

  return pathname
}

export function useCurrentHash() {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )

  useEffect(() => {
    const handleChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handleChange)
    window.addEventListener('popstate', handleChange)
    window.addEventListener(ROUTE_EVENT, handleChange)

    return () => {
      window.removeEventListener('hashchange', handleChange)
      window.removeEventListener('popstate', handleChange)
      window.removeEventListener(ROUTE_EVENT, handleChange)
    }
  }, [])

  return hash
}
