import { useEffect, useId, useRef, useState } from 'react'
import { ArrowRightIcon } from '../atoms/Icons.jsx'
import { MonogramBadge } from '../atoms/MonogramBadge.jsx'

export function ProjectStackCarousel({ ariaLabel, items, title }) {
  const carouselId = useId()
  const carouselRef = useRef(null)
  const [carouselState, setCarouselState] = useState({
    canScrollNext: false,
    canScrollPrev: false,
    progressValue: 0,
  })

  useEffect(() => {
    const viewport = carouselRef.current

    if (!viewport) {
      return undefined
    }

    const syncCarousel = () => {
      const { clientWidth, scrollLeft, scrollWidth } = viewport
      const maxScrollLeft = Math.max(scrollWidth - clientWidth, 0)
      const progressValue = maxScrollLeft === 0 ? 100 : (scrollLeft / maxScrollLeft) * 100

      setCarouselState({
        canScrollNext: scrollLeft < maxScrollLeft - 1,
        canScrollPrev: scrollLeft > 1,
        progressValue,
      })
    }

    syncCarousel()
    viewport.addEventListener('scroll', syncCarousel, { passive: true })
    window.addEventListener('resize', syncCarousel)

    return () => {
      viewport.removeEventListener('scroll', syncCarousel)
      window.removeEventListener('resize', syncCarousel)
    }
  }, [])

  if (!items?.length) {
    return null
  }

  const scrollCarousel = (direction) => {
    const viewport = carouselRef.current

    if (!viewport) {
      return
    }

    viewport.scrollBy({
      behavior: 'smooth',
      left: viewport.clientWidth * 0.82 * direction,
    })
  }

  return (
    <section aria-label={ariaLabel} className="project-stack-section">
      {title ? <p className="eyebrow">{title}</p> : null}

      <div className="project-stack">
        <div
          aria-label={ariaLabel}
          className="tool-card-grid"
          id={carouselId}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              scrollCarousel(-1)
            }

            if (event.key === 'ArrowRight') {
              event.preventDefault()
              scrollCarousel(1)
            }
          }}
          ref={carouselRef}
          tabIndex={0}
        >
          {items.map((item) => (
            <article className="tool-card" key={item.id}>
              <MonogramBadge
                imageAlt={item.image?.alt ?? `${item.title} logo`}
                imageSrc={item.image?.src ?? ''}
                label={item.badge}
                tone={item.badgeTone}
              />
              <h2 className="tool-card__title">{item.title}</h2>
              <p className="tool-card__description">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="project-stack__controls">
          {carouselState.canScrollPrev ? (
            <button
              aria-controls={carouselId}
              aria-label={`Scroll ${ariaLabel} backward`}
              className="icon-button project-stack__arrow"
              onClick={() => scrollCarousel(-1)}
              type="button"
            >
              <ArrowRightIcon className="project-stack__arrow-icon project-stack__arrow-icon--prev" />
            </button>
          ) : null}

          <div
            aria-hidden="true"
            className="progress-strip"
            style={{
              '--progress-value': `${carouselState.progressValue}%`,
            }}
          >
            <span className="progress-strip__value" />
          </div>

          {carouselState.canScrollNext ? (
            <button
              aria-controls={carouselId}
              aria-label={`Scroll ${ariaLabel} forward`}
              className="icon-button project-stack__arrow"
              onClick={() => scrollCarousel(1)}
              type="button"
            >
              <ArrowRightIcon className="project-stack__arrow-icon" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
