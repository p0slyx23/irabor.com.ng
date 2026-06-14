import { cx } from '../../core/cx.js'
import { AppLink } from './AppLink.jsx'

export function Chip({
  children,
  className,
  href,
  size = 'sm',
  type = 'button',
  variant = 'default',
  ...rest
}) {
  const classes = cx('chip', `chip--${variant}`, `chip--${size}`, className)

  if (href) {
    return (
      <AppLink className={classes} href={href} {...rest}>
        {children}
      </AppLink>
    )
  }

  if (rest.onClick) {
    return (
      <button className={classes} type={type} {...rest}>
        {children}
      </button>
    )
  }

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  )
}
