import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function ArticleReadingProgress({ targetRef }) {
  const [readingState, setReadingState] = useState({ progress: 0, headerOffset: 0 })

  useEffect(() => {
    const target = targetRef.current

    if (!target) {
      return undefined
    }

    let frameId = null

    const measureProgress = () => {
      frameId = null

      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const articleBounds = target.getBoundingClientRect()
      const readableViewportHeight = Math.max(window.innerHeight - headerHeight, 1)
      const scrollableDistance = Math.max(articleBounds.height - readableViewportHeight, 1)
      const nextProgress = Math.min(
        Math.max((headerHeight - articleBounds.top) / scrollableDistance, 0),
        1,
      )

      setReadingState((currentState) => {
        if (
          Math.abs(currentState.progress - nextProgress) < 0.001 &&
          currentState.headerOffset === headerHeight
        ) {
          return currentState
        }

        return { progress: nextProgress, headerOffset: headerHeight }
      })
    }

    const scheduleMeasure = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(measureProgress)
      }
    }

    const resizeObserver =
      typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleMeasure) : null

    resizeObserver?.observe(target)
    window.addEventListener('scroll', scheduleMeasure, { passive: true })
    window.addEventListener('resize', scheduleMeasure)
    scheduleMeasure()

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('scroll', scheduleMeasure)
      window.removeEventListener('resize', scheduleMeasure)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [targetRef])

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      aria-hidden="true"
      className="article-reading-progress"
      style={{ '--article-reading-offset': `${readingState.headerOffset}px` }}
    >
      <span style={{ '--article-reading-progress': readingState.progress }} />
    </div>,
    document.body,
  )
}
