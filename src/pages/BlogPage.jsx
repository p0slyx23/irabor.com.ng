import { useEffect, useMemo, useRef, useState } from 'react'
import { AppLink } from '../components/atoms/AppLink.jsx'
import { ArrowRightIcon } from '../components/atoms/Icons.jsx'
import { blogPosts, getBlogPath } from '../content/siteContent.js'
import { formatContentDate } from '../core/dateFormatting.js'

const INITIAL_BLOG_COUNT = 4
const BLOG_BATCH_SIZE = 2

export function BlogPage() {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(INITIAL_BLOG_COUNT, blogPosts.length),
  )
  const sentinelRef = useRef(null)

  const visiblePosts = useMemo(() => {
    return blogPosts.slice(0, visibleCount)
  }, [visibleCount])

  const hasMorePosts = visibleCount < blogPosts.length

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || !hasMorePosts) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        setVisibleCount((currentCount) => {
          if (currentCount >= blogPosts.length) {
            return currentCount
          }

          return Math.min(currentCount + BLOG_BATCH_SIZE, blogPosts.length)
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
  }, [hasMorePosts])

  return (
    <div className="page-shell blog-page">
      <header className="page-heading">
        <p className="eyebrow">Posts</p>
        <h1 className="page-heading__title">Blog</h1>
        <p className="page-heading__lede">
          Longer-form writing, implementation notes, and post-launch reflections will
          live here.
        </p>
      </header>

      {visiblePosts.length ? (
        <>
          <section className="post-list">
            {visiblePosts.map((post) => (
              <article className="post-list__item" key={post.slug}>
                <div className="post-list__body">
                  {post.image ? (
                    <figure className="post-list__media">
                      <img alt={post.image.alt} src={post.image.src} />
                    </figure>
                  ) : null}

                  <p className="post-list__meta">
                    <span>{post.category}</span>
                    <span>{formatContentDate(post.date)}</span>
                    <span>{post.readTime}</span>
                  </p>
                  <h2 className="post-list__title">{post.title}</h2>
                  <p className="post-list__excerpt">{post.excerpt}</p>
                  <AppLink className="inline-link" href={getBlogPath(post.slug)}>
                    <span>Read more</span>
                    <ArrowRightIcon className="inline-link__icon" />
                  </AppLink>
                </div>
              </article>
            ))}
          </section>

          {hasMorePosts ? (
            <div aria-hidden="true" className="scroll-sentinel" ref={sentinelRef} />
          ) : null}
        </>
      ) : (
        <section className="empty-state empty-state--centered">
          <h2 className="empty-state__title">No blog posts at the moment.</h2>
          <p className="empty-state__copy">
            Case studies are already published under Projects. Deeper notes and
            supporting write-ups will appear here as the archive grows.
          </p>
        </section>
      )}
    </div>
  )
}
