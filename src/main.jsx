import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { applyTheme, getInitialThemeState } from './core/theme.js'

const { theme, themePreference } = getInitialThemeState()

applyTheme(theme, themePreference)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignore registration failures so the app still works as a normal site.
    })
  })
}
