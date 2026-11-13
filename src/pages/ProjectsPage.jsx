import { useEffect, useMemo, useRef, useState } from 'react'
import { ProjectCard } from '../components/organisms/ProjectCard.jsx'
import { projectPosts, projectsPage } from '../content/siteContent.js'

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
        <h1 className="page-heading__title">{projectsPage.title}</h1>
        <p className="page-heading__lede">{projectsPage.lede}</p>
      </header>

      <section aria-label="Project case studies" className="project-grid">
        {visibleProjects.map((project, index) => (
          <ProjectCard eager={index < 2} key={project.slug} project={project} />
        ))}
      </section>

      <p className="collection-result-count" role="status">Showing {visibleProjects.length} of {projectPosts.length} projects</p>
      {hasMoreProjects ? (
        <div className="page-actions">
          <div aria-hidden="true" className="scroll-sentinel" ref={sentinelRef} />
          <button className="page-action-link" onClick={() => setVisibleCount((count) => Math.min(count + PROJECT_BATCH_SIZE, projectPosts.length))} type="button">
            Show more projects
          </button>
        </div>
      ) : null}
    </div>
  )
}
