import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { socialLinks } from '../../content/siteContent.js'
import { AppLink } from '../atoms/AppLink.jsx'
import { CloseIcon, ContactIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../atoms/Icons.jsx'

const iconMap = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
}

export function SocialRail({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const linksId = useId()
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return undefined

    const closeOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus({ preventScroll: true })
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const closeAfterSelection = () => {
    setIsOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }
  const iconTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', duration: 0.3, bounce: 0 }

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className={`social-rail ${className}${isOpen ? ' is-open' : ''}`.trim()} ref={containerRef}>
      <button
        aria-controls={linksId}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close contact links' : 'Open contact links'}
        className="social-rail__toggle"
        onClick={() => setIsOpen((open) => !open)}
        ref={triggerRef}
        title="Contact links"
        type="button"
      >
        <Motion.span
          aria-hidden="true"
          className="social-rail__toggle-icon"
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.25 : 1, filter: isOpen ? 'blur(4px)' : 'blur(0px)' }}
          transition={iconTransition}
        >
          <ContactIcon />
        </Motion.span>
        <Motion.span
          aria-hidden="true"
          className="social-rail__toggle-icon"
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.25, filter: isOpen ? 'blur(0px)' : 'blur(4px)' }}
          transition={iconTransition}
        >
          <CloseIcon />
        </Motion.span>
      </button>
      <nav aria-label="Contact links" aria-hidden={!isOpen} className="social-rail__links" id={linksId} inert={!isOpen ? true : undefined}>
        {socialLinks.map((item, index) => {
          const Icon = iconMap[item.icon]
          const angle = (index * Math.PI) / (2 * Math.max(socialLinks.length - 1, 1))
          const horizontalOffset = -Math.round(Math.sin(angle) * 88)
          const verticalOffset = -Math.round(Math.cos(angle) * 88)

          return (
            <AppLink
              aria-label={item.label}
              className="social-link"
              href={item.href}
              key={item.label}
              onClick={closeAfterSelection}
              style={{
                '--contact-index': index,
                '--contact-x': `${horizontalOffset}px`,
                '--contact-y': `${verticalOffset}px`,
              }}
              tabIndex={isOpen ? 0 : -1}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              title={item.label}
            >
              <Icon className="social-link__icon" />
            </AppLink>
          )
        })}
      </nav>
    </div>,
    document.body,
  )
}
