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
import { Button } from '../components/atoms/Button.jsx'
import { AppLink } from '../components/atoms/AppLink.jsx'
import { ArrowRightIcon } from '../components/atoms/Icons.jsx'
import { Chip } from '../components/atoms/Chip.jsx'
import { PageHero } from '../components/molecules/PageHero.jsx'
import { ProjectStackCarousel } from '../components/organisms/ProjectStackCarousel.jsx'
import { TableOfContents } from '../components/organisms/TableOfContents.jsx'
import { NotFoundPage } from './NotFoundPage.jsx'

export function ArticlePage() {
  const currentPath = useCurrentPath()
  const isProjectRoute =
    currentPath.startsWith('/projects/') || currentPath.startsWith('/series/')
  const article = isProjectRoute
    ? getProjectBySlug(getProjectSlugFromPath(currentPath))
    : getBlogPostBySlug(getBlogSlugFromPath(currentPath))

  if (!article) {
    return <NotFoundPage />
  }

  const relatedEntries = article.related
    .map((slug) =>
      isProjectRoute
        ? projectEntries[slug] ?? projectPosts.find((post) => post.slug === slug)
        : blogEntries[slug] ?? blogPosts.find((post) => post.slug === slug),
    )
    .filter(Boolean)

  return (
    <div className="page-shell page-shell--article">
      <PageHero
        aside={<TableOfContents items={article.toc} />}
        className="page-hero--article"
        eyebrow={article.eyebrow}
        lede={article.lede}
        meta={article.meta}
        title={article.title}
      />

      <article className="article-layout">
        <div className="article-layout__body">
          {article.coverImage ? (
            <figure className="article-cover">
              <img alt={article.coverImage.alt} src={article.coverImage.src} />
            </figure>
          ) : null}

          {article.stack?.length ? (
            <ProjectStackCarousel
              ariaLabel={`${article.title} project stack`}
              items={article.stack}
            />
          ) : null}

          <div className="article-prose">
            {article.sections.map((section) => (
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

          <div className="article-actions">
            <Button size="sm" variant="secondary">
              13733
            </Button>
            <Button size="sm" variant="ghost">
              edit on github
            </Button>
          </div>
        </div>
      </article>

      <footer className="article-footer">
        <div className="article-footer__tags">
          <p className="eyebrow eyebrow--compact">Tags</p>
          <div className="chip-set">
            {article.tags.map((tag) => (
              <Chip key={tag} variant="outlined">
                {tag}
              </Chip>
            ))}
          </div>
        </div>

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
      </footer>
    </div>
  )
}
