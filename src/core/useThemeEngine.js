import { useEffect, useRef, useState } from 'react'
import { useReducedMotionPreference } from './useReducedMotionPreference.js'
import {
  applyTheme,
  getInitialThemeState,
  getSystemTheme,
  persistThemePreference,
  resolveTheme,
  runThemeTransition,
  subscribeToSystemTheme,
} from './theme.js'

export function useThemeEngine() {
  const shouldReduceMotion = useReducedMotionPreference()
  const [themePreference, setThemePreference] = useState(
    () => getInitialThemeState().themePreference,
  )
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)
  const [announcement, setAnnouncement] = useState('')
  const mountedRef = useRef(false)
  const announcementTimeoutRef = useRef(null)
  const theme = resolveTheme(themePreference, systemTheme)

  useEffect(() => {
    return subscribeToSystemTheme((nextSystemTheme) => {
      setSystemTheme(nextSystemTheme)
    })
  }, [])

  useEffect(() => {
    persistThemePreference(themePreference)

    if (!mountedRef.current) {
      applyTheme(theme, themePreference)
      mountedRef.current = true
      return undefined
    }

    return runThemeTransition(
      () => {
        applyTheme(theme, themePreference)
      },
      { shouldReduceMotion },
    )
  }, [shouldReduceMotion, theme, themePreference])

  useEffect(() => {
    return () => {
      if (announcementTimeoutRef.current) {
        window.clearTimeout(announcementTimeoutRef.current)
      }
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'

    if (announcementTimeoutRef.current) {
      window.clearTimeout(announcementTimeoutRef.current)
    }

    setThemePreference(nextTheme)
    setAnnouncement(`${nextTheme === 'dark' ? 'Dark' : 'Light'} theme enabled.`)

    announcementTimeoutRef.current = window.setTimeout(() => {
      setAnnouncement('')
    }, 1200)
  }

  return {
    announcement,
    theme,
    themePreference,
    toggleTheme,
  }
}
