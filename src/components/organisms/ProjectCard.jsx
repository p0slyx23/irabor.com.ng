import { AppLink } from '../atoms/AppLink.jsx'
import { ContentImage } from '../atoms/ContentImage.jsx'
import { ArrowRightIcon } from '../atoms/Icons.jsx'
import { getProjectPath } from '../../content/siteContent.js'
import { formatContentDate } from '../../core/dateFormatting.js'

export function ProjectCard({ project, compact = false, featured = false, eager = false }) {
  const date = formatContentDate(project.date)
  const Heading = compact ? 'h3' : 'h2'

  return (
    <article className={`project-card${compact ? ' project-card--compact' : ''}${featured ? ' project-card--featured' : ''}`}>
      <AppLink className="project-card__link" href={getProjectPath(project.slug)}>
        <figure className="project-card__media">
          <ContentImage
            alt={project.image?.alt ?? project.title}
            fetchPriority={eager ? 'high' : undefined}
            loading={eager ? 'eager' : 'lazy'}
            src={project.image?.src}
            width="1536"
            height="1024"
          />
        </figure>
        <div className="project-card__body">
          {!compact ? <p className="project-card__meta">
            <span>{project.category}</span>
            {date ? <span>{date}</span> : null}
          </p> : null}
          <Heading className="project-card__title">
            {project.title}
            {compact ? <ArrowRightIcon aria-hidden="true" className="project-card__title-arrow" /> : null}
          </Heading>
          <p className="project-card__excerpt">{project.excerpt}</p>
          {project.tags?.length ? (
            <ul aria-label="Project technologies and topics" className="project-card__tags">
              {project.tags.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          ) : null}
          {!compact ? <span className="project-card__action">
            Read case study <ArrowRightIcon aria-hidden="true" />
          </span> : null}
        </div>
      </AppLink>
    </article>
  )
}
