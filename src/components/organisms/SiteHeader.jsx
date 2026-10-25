import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { cx } from '../../core/cx.js'
import { AppLink } from '../atoms/AppLink.jsx'
import { siteBrand } from '../../content/siteContent.js'
import { BrandMarkIcon, CloseIcon, MenuIcon } from '../atoms/Icons.jsx'
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
  const menuId = useId()
  const menuLabelId = useId()
  const menuPanelRef = useRef(null)
  const menuButtonRef = useRef(null)

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
      menuButton?.focus()
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
    if (path === '/') {
      return currentPath === '/'
    }

    return currentPath === path || currentPath.startsWith(`${path}/`)
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <AppLink aria-label="Go to home page" className="site-header__brand" href="/">
            <BrandMarkIcon className="site-header__mark" />
          </AppLink>

          <nav aria-label="Primary navigation" className="site-header__nav">
            {navigation.map((item) => (
              <AppLink
                className={cx(
                  'site-nav__link',
                  isActivePath(item.path) && 'is-active',
                )}
                href={item.path}
                key={item.path}
              >
                {item.label}
              </AppLink>
            ))}
          </nav>

          <div className="site-header__actions">
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
              <span className="site-header__menu-copy">menu</span>
              {isMenuOpen ? (
                <CloseIcon className="site-header__menu-icon" />
              ) : (
                <MenuIcon className="site-header__menu-icon" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMenuMounted ? (
        <div className={cx('site-mobile-nav', isMenuOpen && 'is-open')} role="presentation">
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
            className="site-mobile-nav__panel"
            id={menuId}
            ref={menuPanelRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="site-mobile-nav__header">
              <AppLink aria-label="Go to home page" className="site-header__brand" href="/" onClick={closeMenu}>
                <BrandMarkIcon className="site-header__mark" />
              </AppLink>
              <p className="sr-only" id={menuLabelId}>
                Navigation
              </p>
              <div className="site-mobile-nav__header-actions">
                <ThemeToggle
                  onToggle={onToggleTheme}
                  theme={theme}
                  themePreference={themePreference}
                />
                <button className="icon-button" onClick={closeMenu} type="button">
                  <CloseIcon className="icon-button__icon" />
                  <span className="sr-only">Close navigation menu</span>
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
                  href={item.path}
                  key={item.path}
                  onClick={closeMenu}
                  style={{ '--menu-item-index': index }}
                >
                  {item.label}
                </AppLink>
              ))}
            </nav>

            {siteBrand.resumes?.[0] ? (
              <AppLink
                className="page-action-link site-mobile-nav__resume"
                href={siteBrand.resumes[0].url}
                onClick={closeMenu}
                target="_blank"
              >
                {siteBrand.resumes[0].label}
              </AppLink>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  )
}
