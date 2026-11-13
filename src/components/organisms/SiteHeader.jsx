import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { cx } from '../../core/cx.js'
import { useCurrentHash } from '../../core/router.js'
import { AppLink } from '../atoms/AppLink.jsx'
import { siteBrand } from '../../content/siteContent.js'
import { ArrowRightIcon, CloseIcon, MenuIcon } from '../atoms/Icons.jsx'
import { ThemeToggle } from '../atoms/ThemeToggle.jsx'

const DESKTOP_MEDIA_QUERY = '(min-width: 901px)'
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SiteHeader({
  currentPath,
  navigation,
  onToggleTheme,
  theme,
  themePreference,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuMounted, setIsMenuMounted] = useState(false)
  const [footerClearance, setFooterClearance] = useState(0)
  const currentHash = useCurrentHash()
  const [activeSection, setActiveSection] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )
  const menuId = useId()
  const menuLabelId = useId()
  const menuPanelRef = useRef(null)
  const menuButtonRef = useRef(null)
  const brandRef = useRef(null)
  const resume = siteBrand.resumes?.[0]

  useEffect(() => {
    let frameId
    const measureFooter = () => {
      const footer = currentPath === '/' ? document.querySelector('.profile-colophon') : null
      setFooterClearance(footer ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top + 16) : 0)
    }
    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(measureFooter)
    }
    scheduleMeasure()
    window.addEventListener('scroll', scheduleMeasure, { passive: true })
    window.addEventListener('resize', scheduleMeasure)
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleMeasure)
      window.removeEventListener('resize', scheduleMeasure)
    }
  }, [currentPath])

  useEffect(() => {
    if (currentPath !== '/') return undefined

    const sections = navigation
      .map((item) => {
        const hash = new URL(item.path, window.location.href).hash
        if (!hash) return null
        const element = document.getElementById(hash.slice(1))
        return element ? { hash, element } : null
      })
      .filter(Boolean)

    if (!sections.length) return undefined

    let observer
    let frameId
    const syncActiveSection = () => {
      const header = document.querySelector('.site-header')
      const offset = (header?.getBoundingClientRect().height ?? 80) + 48
      const passed = sections.filter(({ element }) => element.getBoundingClientRect().top <= offset + 1)
      setActiveSection((passed.at(-1) ?? sections[0]).hash)
    }

    const observeSections = () => {
      observer?.disconnect()
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 80
      const offset = Math.min(headerHeight + 48, window.innerHeight - 2)
      // A one-pixel reading boundary follows the content below the fixed header.
      // Each section becomes active when it crosses that boundary, even if long.
      observer = new IntersectionObserver(syncActiveSection, {
        rootMargin: `-${offset}px 0px -${Math.max(window.innerHeight - offset - 1, 0)}px 0px`,
      })
      sections.forEach(({ element }) => observer.observe(element))
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(syncActiveSection)
    }

    observeSections()
    window.addEventListener('resize', observeSections)

    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', observeSections)
    }
  }, [currentPath, currentHash, navigation])

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const openMenu = () => {
    setIsMenuMounted(true)
    setIsMenuOpen(true)
  }

  const handleMenuKeydown = useEffectEvent((event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const panel = menuPanelRef.current

    if (!panel) {
      return
    }

    const focusableElements = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR))

    if (!focusableElements.length) {
      event.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
      return
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  })

  const handleDesktopLayoutChange = useEffectEvent((event) => {
    if (event.matches) {
      closeMenu()
    }
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const handleChange = (event) => {
      handleDesktopLayoutChange(event)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const panel = menuPanelRef.current
    const menuButton = menuButtonRef.current
    const brand = brandRef.current
    const previousOverflow = document.body.style.overflow
    const focusableElements = panel
      ? Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR))
      : []

    document.body.style.overflow = 'hidden'
    ;(focusableElements[0] ?? panel)?.focus()

    const handleKeydown = (event) => {
      handleMenuKeydown(event)
    }

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeydown)
      if (menuButton?.getClientRects().length) {
        menuButton.focus()
      } else {
        if (brand?.getClientRects().length) brand.focus()
        else document.getElementById('main-content')?.focus({ preventScroll: true })
      }
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isMenuOpen || !isMenuMounted) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setIsMenuMounted(false)
    }, 180)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isMenuOpen, isMenuMounted])

  const isActivePath = (path) => {
    if (path.includes('#')) {
      const hash = path.slice(path.indexOf('#'))
      if (currentPath === '/') return hash === (activeSection || currentHash || '#about')
      if (hash === '#projects') return /^\/(?:projects|series)(?:\/|$)/.test(currentPath)
      return currentPath === `/${hash.slice(1)}`
    }
    if (path === '/') {
      return currentPath === '/'
    }

    return currentPath === path || currentPath.startsWith(`${path}/`)
  }

  const headerLabel = currentPath === '/archive' ? 'All projects' : 'Projects'

  return (
    <>
      <header className="site-header" style={{ '--footer-clearance': `${footerClearance}px` }}>
        <div className="site-header__inner">
          {currentPath === '/' ? <span aria-hidden="true" /> : (
            <AppLink className="site-header__section-label" href="/#projects" ref={brandRef}>
              {headerLabel}
            </AppLink>
          )}

          <nav aria-label="Primary navigation" className="site-header__nav">
            {navigation.map((item) => (
              <AppLink
                className={cx(
                  'site-nav__link',
                  isActivePath(item.path) && 'is-active',
                )}
                aria-current={isActivePath(item.path) ? (item.path.includes('#') ? 'location' : 'page') : undefined}
                href={item.path}
                key={item.path}
              >
                {item.label}
              </AppLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <div className="site-header__controls">
              <ThemeToggle
                onToggle={onToggleTheme}
                theme={theme}
                themePreference={themePreference}
              />
              <button
                aria-controls={menuId}
                aria-expanded={isMenuOpen}
                className="site-header__menu-button"
                onClick={isMenuOpen ? closeMenu : openMenu}
                ref={menuButtonRef}
                type="button"
              >
                <span className="site-header__menu-label">{isMenuOpen ? 'Close' : 'Menu'}</span>
                {isMenuOpen ? (
                  <CloseIcon className="site-header__menu-icon" />
                ) : (
                  <MenuIcon className="site-header__menu-icon" />
                )}
              </button>
            </div>
            {resume ? (
              <AppLink className="site-header__resume" href={resume.url} target="_blank">
                Résumé <ArrowRightIcon aria-hidden="true" />
              </AppLink>
            ) : null}
          </div>
        </div>
      </header>

      {isMenuMounted ? (
        <div className={cx('site-mobile-nav', isMenuOpen && 'is-open')} role="presentation" style={{ '--footer-clearance': `${footerClearance}px` }}>
          <button
            aria-label="Close navigation menu"
            className="site-mobile-nav__backdrop"
            onClick={closeMenu}
            type="button"
          />

          <aside
            aria-labelledby={menuLabelId}
            aria-modal="true"
            aria-hidden={!isMenuOpen}
            inert={!isMenuOpen ? true : undefined}
            className="site-mobile-nav__panel"
            id={menuId}
            ref={menuPanelRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="site-mobile-nav__header">
              <AppLink aria-label="Go to home page" className="site-header__section-label" href="/" onClick={closeMenu}>
                Home
              </AppLink>
              <p className="sr-only" id={menuLabelId}>
                Navigation
              </p>
              <div className="site-mobile-nav__header-actions site-header__controls">
                <ThemeToggle
                  onToggle={onToggleTheme}
                  theme={theme}
                  themePreference={themePreference}
                />
                <button aria-label="Close navigation menu" className="site-header__menu-button" onClick={closeMenu} type="button">
                  <span className="site-header__menu-label">Close</span>
                  <CloseIcon className="site-header__menu-icon" />
                </button>
              </div>
            </div>

            <nav aria-label="Mobile navigation" className="site-mobile-nav__links">
              {navigation.map((item, index) => (
                <AppLink
                  className={cx(
                    'site-mobile-nav__link',
                    isActivePath(item.path) && 'is-active',
                  )}
                  aria-current={isActivePath(item.path) ? (item.path.includes('#') ? 'location' : 'page') : undefined}
                  href={item.path}
                  key={item.path}
                  onClick={closeMenu}
                  style={{ '--menu-item-index': index }}
                >
                  {item.label}
                  <ArrowRightIcon aria-hidden="true" className="site-mobile-nav__link-icon" />
                </AppLink>
              ))}
            </nav>

            <div className="site-mobile-nav__footer">
              {resume ? (
                <AppLink
                  className="page-action-link site-mobile-nav__resume"
                  href={resume.url}
                  onClick={closeMenu}
                  target="_blank"
                >
                  {resume.label}
                </AppLink>
              ) : null}
              <AppLink className="site-mobile-nav__contact" href={`mailto:${siteBrand.email}`}>
                {siteBrand.email}
              </AppLink>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
