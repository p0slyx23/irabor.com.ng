import { useRef } from 'react'
import {
  blogPosts,
  blogEntries,
  getBlogPath,
  getBlogPostBySlug,
  getBlogSlugFromPath,
  getProjectBySlug,
  getProjectPath,
  getProjectSlugFromPath,
  projectEntries,
  projectPosts,
} from '../content/siteContent.js'
import { useCurrentPath } from '../core/router.js'
import { AppLink } from '../components/atoms/AppLink.jsx'
import { ContentImage } from '../components/atoms/ContentImage.jsx'
import { ArrowRightIcon } from '../components/atoms/Icons.jsx'
import { Chip } from '../components/atoms/Chip.jsx'
import { PageHero } from '../components/molecules/PageHero.jsx'
import { ArticleReadingProgress } from '../components/molecules/ArticleReadingProgress.jsx'
import { ProjectOutcome } from '../components/molecules/ProjectOutcome.jsx'
import { ProjectProof } from '../components/molecules/ProjectProof.jsx'
import { ProjectSummary } from '../components/molecules/ProjectSummary.jsx'
import { ProjectStackCarousel } from '../components/organisms/ProjectStackCarousel.jsx'
import { TableOfContents } from '../components/organisms/TableOfContents.jsx'
import { NotFoundPage } from './NotFoundPage.jsx'

export function ArticlePage() {
  const articleRef = useRef(null)
  const currentPath = useCurrentPath()
  const isProjectRoute =
    currentPath.startsWith('/projects/') || currentPath.startsWith('/series/')
  const article = isProjectRoute
    ? getProjectBySlug(getProjectSlugFromPath(currentPath))
    : getBlogPostBySlug(getBlogSlugFromPath(currentPath))

  if (!article) {
    return <NotFoundPage />
  }

  const relatedEntries = (article.related ?? [])
    .map((slug) =>
      isProjectRoute
        ? projectEntries[slug] ?? projectPosts.find((post) => post.slug === slug)
        : blogEntries[slug] ?? blogPosts.find((post) => post.slug === slug),
    )
    .filter(Boolean)
  const articleLinks = (article.links ?? []).filter((link) => link?.label && link?.href)
  const projectLinks = isProjectRoute ? articleLinks : []
  const footerLinks = isProjectRoute ? [] : articleLinks
  const hasArticleFooter = Boolean(article.tags?.length || footerLinks.length || relatedEntries.length)
  const outcomeSection = isProjectRoute
    ? article.sections.find((section) => section.id === 'outcome')
    : null
  const articleSections = outcomeSection
    ? article.sections.filter((section) => section.id !== outcomeSection.id)
    : article.sections

  return (
    <div className="page-shell page-shell--article">
      <ArticleReadingProgress targetRef={articleRef} />

      <PageHero
        aside={<TableOfContents items={article.toc} />}
        className="page-hero--article"
        eyebrow={article.eyebrow}
        lede={article.lede}
        meta={article.meta}
        title={article.title}
      />

      <article className="article-layout" ref={articleRef}>
        <div className="article-layout__body">
          {isProjectRoute ? <ProjectSummary meta={article.meta} stack={article.stack} /> : null}

          {projectLinks.length ? (
            <div aria-label="Project links" className="project-actions">
              {projectLinks.map((link) => (
                <AppLink
                  className="page-action-link"
                  href={link.href}
                  key={`${link.label}-${link.href}`}
                  target={link.href.startsWith('/') ? undefined : '_blank'}
                >
                  {link.label}
                </AppLink>
              ))}
            </div>
          ) : null}

          {article.coverImage ? (
            <figure className="article-cover">
              <ContentImage
                alt={article.coverImage.alt}
                fetchPriority="high"
                loading="eager"
                src={article.coverImage.src}
              />
            </figure>
          ) : null}

          {article.stack?.length ? (
            <ProjectStackCarousel
              ariaLabel={`${article.title} project stack`}
              items={article.stack}
            />
          ) : null}

          <div className="article-prose">
            {articleSections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.list ? (
                  <ol className="article-list">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                ) : null}

                {section.callout ? (
                  <aside className={`article-callout article-callout--${section.callout.tone}`}>
                    <h3>{section.callout.title}</h3>
                    <p>{section.callout.copy}</p>
                  </aside>
                ) : null}
              </section>
            ))}
          </div>

          {isProjectRoute ? <ProjectOutcome meta={article.meta} section={outcomeSection} /> : null}
          {isProjectRoute ? (
            <ProjectProof evidence={article.evidence} screenshots={article.screenshots} />
          ) : null}
        </div>
      </article>

      {hasArticleFooter ? (
        <footer className="article-footer">
          {article.tags?.length || footerLinks.length ? (
            <div className="article-footer__tags">
              {footerLinks.length ? (
                <div className="article-footer__actions">
                  {footerLinks.map((link) => (
                    <AppLink
                      className="page-action-link"
                      href={link.href}
                      key={`${link.label}-${link.href}`}
                      target={link.href.startsWith('/') ? undefined : '_blank'}
                    >
                      {link.label}
                    </AppLink>
                  ))}
                </div>
              ) : null}

              {article.tags?.length ? (
                <>
                  <p className="eyebrow eyebrow--compact">Tags</p>
                  <div className="chip-set">
                    {article.tags.map((tag) => (
                      <Chip key={tag} variant="outlined">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {relatedEntries.length ? (
            <div className="article-related">
              <h2 className="article-related__title">You may want to check out</h2>
              <div className="article-related__list">
                {relatedEntries.map((item) => (
                  <article className="article-related__item" key={item.slug ?? item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt ?? item.lede}</p>
                    <AppLink
                      className="inline-link"
                      href={
                        isProjectRoute
                          ? getProjectPath(item.slug ?? getProjectSlugFromPath(currentPath))
                          : getBlogPath(item.slug ?? getBlogSlugFromPath(currentPath))
                      }
                    >
                      <span>Read more</span>
                      <ArrowRightIcon className="inline-link__icon" />
                    </AppLink>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </footer>
      ) : null}
    </div>
  )
}
