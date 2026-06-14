import { cx } from '../../core/cx.js'
import { AppLink } from './AppLink.jsx'

export function Button({
  children,
  className,
  href,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...rest
}) {
  const classes = cx('button', `button--${variant}`, `button--${size}`, className)

  if (href) {
    return (
      <AppLink className={classes} href={href} {...rest}>
        {children}
      </AppLink>
    )
  }

  return (
    <button className={classes} type={type} {...rest}>
      {children}
    </button>
  )
}
