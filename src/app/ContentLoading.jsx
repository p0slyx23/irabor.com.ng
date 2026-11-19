import { useEffect, useRef, useState } from 'react'
import { BrandMarkIcon } from '../components/atoms/Icons.jsx'
import { useReducedMotionPreference } from '../core/useReducedMotionPreference.js'

export function ContentLoading({ onInteract }) {
  const reducedMotion = useReducedMotionPreference()
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(() => document.hidden)
  const [slow, setSlow] = useState(false)
  const [replay, setReplay] = useState(0)
  const mark = useRef(null)
  const stopped = paused || reducedMotion || hidden

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 6000)
    const handleVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  function resetMark() {
    mark.current?.style.setProperty('--loading-x', '0px')
    mark.current?.style.setProperty('--loading-y', '0px')
  }

  function moveMark(event) {
    if (stopped || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-6, Math.min(6, (event.clientX - bounds.left - bounds.width / 2) / 8))
    const y = Math.max(-6, Math.min(6, (event.clientY - bounds.top - bounds.height / 2) / 8))
    mark.current?.style.setProperty('--loading-x', `${x}px`)
    mark.current?.style.setProperty('--loading-y', `${y}px`)
  }

  return (
    <>
      <p aria-atomic="true" aria-live="polite" className="sr-only" role="status">
        {slow ? 'Still connecting. This is taking a little longer.' : 'Loading portfolio. Getting the latest experience and projects.'}
      </p>
      <main aria-busy="true" className="content-gate" data-state="loading" id="main-content" onFocusCapture={onInteract} tabIndex={-1}>
        <div className="content-gate__inner content-loader" data-motion={stopped ? 'paused' : 'playing'}>
          <button
            aria-describedby="loading-hint"
            aria-label="Play the logo animation"
            className="content-loader__play"
            disabled={stopped}
            onBlur={resetMark}
            onClick={() => setReplay((value) => value + 1)}
            onPointerLeave={resetMark}
            onPointerMove={moveMark}
            type="button"
          >
            <span className="content-loader__follow" ref={mark}>
              <BrandMarkIcon className="content-loader__mark" key={replay} />
            </span>
          </button>
          <div className="content-gate__copy">
            <h1>Loading portfolio</h1>
            <p>{slow ? 'Still connecting. This is taking a little longer.' : 'Getting the latest experience and projects.'}</p>
          </div>
          <div aria-hidden="true" className="content-loader__activity"><span /><span /><span /></div>
          <div className="content-loader__controls">
            <p id="loading-hint">{reducedMotion ? 'Reduced motion is on.' : paused ? 'Animation paused. Loading continues.' : 'Tap the mark while you wait.'}</p>
            {!reducedMotion ? (
              <button aria-pressed={paused} className="content-loader__pause" onClick={() => { resetMark(); setPaused((value) => !value) }} type="button">
                {paused ? 'Resume animation' : 'Pause animation'}
              </button>
            ) : null}
          </div>
        </div>
      </main>
    </>
  )
}
