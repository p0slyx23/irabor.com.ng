import { AppLink } from '../components/atoms/AppLink.jsx'
import { ContentImage } from '../components/atoms/ContentImage.jsx'
import { ArrowRightIcon } from '../components/atoms/Icons.jsx'
import { ProjectStackCarousel } from '../components/organisms/ProjectStackCarousel.jsx'
import { formatContentDate } from '../core/dateFormatting.js'
import {
  getProjectPath,
  getProjectStack,
  homeRecentProjects,
} from '../content/siteContent.js'

export function HomePage() {
  return (
    <div className="page-shell home-page">
      <header className="page-heading">
        <p className="eyebrow">Case studies</p>
        <h1 className="page-heading__title">Recent case studies</h1>
        <p className="page-heading__lede">
          Selected product work across mobile apps, full-stack platforms, and backend
          systems.
        </p>
      </header>

      <section className="post-list" aria-label="Recent case studies">
        {homeRecentProjects.map((post, index) => (
          <article className="post-list__item" key={post.slug}>
            <div className="post-list__body">
              <AppLink className="post-list__primary-link" href={getProjectPath(post.slug)}>
                {post.image ? (
                  <figure className="post-list__media">
                    <ContentImage
                      alt={post.image.alt}
                      fetchPriority={index === 0 ? 'high' : undefined}
                      loading={index === 0 ? 'eager' : undefined}
                      src={post.image.src}
                    />
                  </figure>
                ) : null}

                <p className="post-list__meta">
                  {[post.category, formatContentDate(post.date)]
                    .filter(Boolean)
                    .map((item, index) => (
                      <span key={`${post.slug}-meta-${index}`}>{item}</span>
                    ))}
                </p>
                <h2 className="post-list__title">{post.title}</h2>
                <p className="post-list__excerpt">{post.excerpt}</p>
                <span className="inline-link">
                  <span>Read more</span>
                  <ArrowRightIcon className="inline-link__icon" />
                </span>
              </AppLink>
              <ProjectStackCarousel
                ariaLabel={`${post.title} project stack`}
                items={getProjectStack(post.slug)}
              />
            </div>
          </article>
        ))}
      </section>

      <div className="page-actions">
        <AppLink className="page-action-link" href="/projects">
          View all projects
        </AppLink>
      </div>

      {/* Reserved for future testimonial content. */}
    </div>
  )
}
