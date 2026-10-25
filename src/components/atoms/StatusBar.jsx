import { getThemeChrome } from '../../core/theme.js'

export default function StatusBar({ theme }) {
  const { color } = getThemeChrome(theme)

  return (
    <div
      aria-hidden="true"
      className="status-bar"
      data-theme={theme}
      style={{ backgroundColor: color }}
    />
  )
}
