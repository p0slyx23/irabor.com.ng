import { navigateTo } from '../../core/router.js'
import { cx } from '../../core/cx.js'

function shouldIntercept(event, href, target) {
  return (
    href?.startsWith('/') &&
    target !== '_blank' &&
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  )
}

export function AppLink({
  children,
  className,
  href,
  onClick,
  rel,
  target,
  ...rest
}) {
  const handleClick = (event) => {
    onClick?.(event)

    if (shouldIntercept(event, href, target)) {
      event.preventDefault()
      navigateTo(href)
    }
  }

  return (
    <a
      className={cx(className)}
      href={href}
      onClick={handleClick}
      rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)}
      target={target}
      {...rest}
    >
      {children}
    </a>
  )
}
