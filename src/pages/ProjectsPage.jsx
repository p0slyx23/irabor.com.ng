import { useEffect, useMemo, useRef, useState } from 'react'
import { AppLink } from '../components/atoms/AppLink.jsx'
import { ContentImage } from '../components/atoms/ContentImage.jsx'
import { ArrowRightIcon } from '../components/atoms/Icons.jsx'
import { formatContentDate } from '../core/dateFormatting.js'
import { getProjectPath, projectPosts, projectsPage } from '../content/siteContent.js'

const INITIAL_PROJECT_COUNT = 4
const PROJECT_BATCH_SIZE = 2

export function ProjectsPage() {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(INITIAL_PROJECT_COUNT, projectPosts.length),
  )
  const sentinelRef = useRef(null)

  const visibleProjects = useMemo(() => {
    return projectPosts.slice(0, visibleCount)
  }, [visibleCount])

  const hasMoreProjects = visibleCount < projectPosts.length

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || !hasMoreProjects) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        setVisibleCount((currentCount) => {
          if (currentCount >= projectPosts.length) {
            return currentCount
          }

          return Math.min(currentCount + PROJECT_BATCH_SIZE, projectPosts.length)
        })
      },
      {
        rootMargin: '0px 0px 240px 0px',
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMoreProjects])

  return (
    <div className="page-shell projects-page">
      <header className="page-heading">
        <p className="eyebrow">{projectsPage.eyebrow}</p>
        <h1 className="page-heading__title">{projectsPage.title}</h1>
        <p className="page-heading__lede">{projectsPage.lede}</p>
      </header>

      <section aria-label="Project case studies" className="post-list">
        {visibleProjects.map((project) => (
          <article className="post-list__item" key={project.slug}>
            <div className="post-list__body">
              {project.image ? (
                <figure className="post-list__media">
                  <ContentImage alt={project.image.alt} src={project.image.src} />
                </figure>
              ) : null}

              <p className="post-list__meta">
                {[project.category, formatContentDate(project.date)]
                  .filter(Boolean)
                  .map((item, index) => (
                    <span key={`${project.slug}-meta-${index}`}>{item}</span>
                  ))}
              </p>
              <h2 className="post-list__title">{project.title}</h2>
              <p className="post-list__excerpt">{project.excerpt}</p>
              <AppLink className="inline-link" href={getProjectPath(project.slug)}>
                <span>Open project</span>
                <ArrowRightIcon className="inline-link__icon" />
              </AppLink>
            </div>
          </article>
        ))}
      </section>

      {hasMoreProjects ? <div aria-hidden="true" className="scroll-sentinel" ref={sentinelRef} /> : null}
    </div>
  )
}
