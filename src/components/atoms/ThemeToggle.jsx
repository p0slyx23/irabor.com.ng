import { cx } from '../../core/cx.js'
import { MoonIcon, SunIcon } from './Icons.jsx'

export function ThemeToggle({
  className,
  onToggle,
  theme,
  themePreference,
}) {
  const currentThemeLabel = theme === 'dark' ? 'Dark' : 'Light'
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const preferenceLabel =
    themePreference === 'system' ? `System / ${currentThemeLabel}` : currentThemeLabel
  const Icon = theme === 'dark' ? SunIcon : MoonIcon

  return (
    <button
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'dark'}
      className={cx('icon-button theme-toggle', className)}
      onClick={onToggle}
      title={`Current theme: ${preferenceLabel}`}
      type="button"
    >
      <Icon className="icon-button__icon" />
      <span className="sr-only">
        Current theme is {currentThemeLabel}. Activate to switch to {nextTheme}.
      </span>
    </button>
  )
}
