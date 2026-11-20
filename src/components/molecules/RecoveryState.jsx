import { useLayoutEffect, useRef } from 'react'
import { AppLink } from '../atoms/AppLink.jsx'
import { ArrowRightIcon, BrandMarkIcon } from '../atoms/Icons.jsx'

export function RecoveryState({ title, message, children, note, wake = false, onWake }) {
  const heading = useRef(null)

  useLayoutEffect(() => {
    heading.current?.focus({ preventScroll: true })
  }, [])

  return (
    <section aria-labelledby="recovery-title" className="recovery" data-recovery={wake ? 'wake' : 'error'}>
      <div aria-label="Irabor" className="recovery__identity">
        {onWake ? <button className="recovery__wake-mark" type="button" aria-label="Wake portfolio" onClick={onWake}><BrandMarkIcon className="recovery__mark" /></button> : <BrandMarkIcon className="recovery__mark" />}
      </div>
      <div className="recovery__copy">
        <h1 id="recovery-title" ref={heading} tabIndex={-1}>{title}</h1>
        <p>{message}</p>
      </div>
      <div className="recovery__footer">
        <div className="recovery__actions">{children}</div>
        {note ? <p className="recovery__note">{note}</p> : null}
      </div>
    </section>
  )
}

export function RecoveryLink({ children, href, external = false }) {
  return (
    <AppLink className="recovery__link" href={href} target={external ? '_blank' : undefined}>
      {children}<ArrowRightIcon aria-hidden="true" />
    </AppLink>
  )
}
