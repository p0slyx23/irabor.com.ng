import { MOTION_DURATION_MS } from './motion.js'

export const THEME_STORAGE_KEY = 'portfolio-theme'
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'
export const THEME_TRANSITION_DURATION_MS = MOTION_DURATION_MS.normal

function isThemePreference(value) {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function getStoredThemePreference() {
  if (typeof window === 'undefined') {
    return 'system'
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(storedTheme) ? storedTheme : 'system'
  } catch {
    return 'system'
  }
}

export function persistThemePreference(themePreference) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
  } catch {
    // Ignore storage failures so the UI still works in restricted environments.
  }
}

export function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

export function resolveTheme(themePreference, systemTheme = getSystemTheme()) {
  return themePreference === 'system' ? systemTheme : themePreference
}

export function getInitialThemeState() {
  const themePreference = getStoredThemePreference()
  const theme = resolveTheme(themePreference)

  return { theme, themePreference }
}

export function applyTheme(theme, themePreference) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement

  root.dataset.theme = theme
  root.dataset.themePreference = themePreference
  root.style.colorScheme = theme
}

export function subscribeToSystemTheme(onChange) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY)
  const handleChange = (event) => {
    onChange(event.matches ? 'dark' : 'light')
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }

  mediaQuery.addListener(handleChange)

  return () => {
    mediaQuery.removeListener(handleChange)
  }
}

export function runThemeTransition(updateTheme, { shouldReduceMotion = false } = {}) {
  if (typeof document === 'undefined') {
    updateTheme()
    return () => {}
  }

  if (shouldReduceMotion) {
    updateTheme()
    return () => {}
  }

  const root = document.documentElement
  root.dataset.themeTransition = 'active'

  let timeoutId

  const cleanup = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }

    delete root.dataset.themeTransition
  }

  if (typeof document.startViewTransition === 'function') {
    const transition = document.startViewTransition(() => {
      updateTheme()
    })

    transition.finished.finally(cleanup)
    return cleanup
  }

  updateTheme()
  timeoutId = window.setTimeout(cleanup, THEME_TRANSITION_DURATION_MS)

  return cleanup
}
