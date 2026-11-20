import { useEffect, useState } from 'react'
import { BrandMarkIcon } from '../components/atoms/Icons.jsx'
import { ThinkingStatus } from '../components/molecules/ThinkingStatus.jsx'
import { useReducedMotionPreference } from '../core/useReducedMotionPreference.js'

export function ContentLoading({ onInteract }) {
  const reducedMotion = useReducedMotionPreference()
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(() => document.hidden)
  const stopped = paused || reducedMotion || hidden

  useEffect(() => {
    const handleVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <>
      <p aria-atomic="true" aria-live="polite" className="sr-only" role="status">
        Loading portfolio. Getting the latest experience and projects.
      </p>
      <main aria-busy="true" className="content-gate content-thinking" data-state="loading" id="main-content" onFocusCapture={onInteract} onPointerDown={onInteract} tabIndex={-1}>
        <h1 className="sr-only">Loading portfolio</h1>
        <div className="content-loader" data-motion={stopped ? 'paused' : 'playing'}>
          <button
            aria-label={paused ? 'Resume animation' : 'Pause animation'}
            aria-pressed={paused}
            className="content-loader__play"
            disabled={reducedMotion}
            onClick={() => setPaused(value => !value)}
            type="button"
          >
            <BrandMarkIcon className="content-loader__mark" />
          </button>
          <div className="content-loader__controls">
            <ThinkingStatus paused={stopped} />
          </div>
        </div>
      </main>
    </>
  )
}
