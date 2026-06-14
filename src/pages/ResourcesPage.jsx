import { startTransition, useDeferredValue, useId, useState } from 'react'
import { AppLink } from '../components/atoms/AppLink.jsx'
import { ArrowRightIcon } from '../components/atoms/Icons.jsx'
import { MonogramBadge } from '../components/atoms/MonogramBadge.jsx'
import { Chip } from '../components/atoms/Chip.jsx'
import { NewsletterForm } from '../components/molecules/NewsletterForm.jsx'
import { SearchField } from '../components/molecules/SearchField.jsx'
import { StarCluster } from '../components/molecules/StarCluster.jsx'
import { resourceCategories, resources } from '../content/siteContent.js'

export function ResourcesPage() {
  const searchId = useId()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLowerCase()

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === 'All' || resource.category === activeCategory

    if (!matchesCategory) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return [resource.title, resource.category, resource.description]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  })

  const featuredResources = filteredResources.slice(0, 2)
  const remainingResources = filteredResources.slice(2)

  return (
    <div className="page-shell resources-page">
      <header className="page-heading">
        <p className="eyebrow">Library</p>
        <h1 className="page-heading__title">Resources</h1>
        <p className="page-heading__lede">
          A working shelf of the frameworks, services, and systems behind the products
          in this portfolio.
        </p>
      </header>

      <section className="page-toolbar">
        <SearchField
          className="page-toolbar__search"
          id={searchId}
          label="Search"
          onValueChange={(nextValue) => {
            startTransition(() => {
              setQuery(nextValue)
            })
          }}
          placeholder="Search resources"
          value={query}
        />

        <div className="page-toolbar__filters">
          {resourceCategories.map((category) => (
            <Chip
              aria-pressed={activeCategory === category}
              key={category}
              onClick={() => {
                startTransition(() => {
                  setActiveCategory(category)
                })
              }}
              variant={activeCategory === category ? 'primary' : 'default'}
            >
              {category}
            </Chip>
          ))}
        </div>
      </section>

      <section className="resource-list" aria-label="Featured resources">
        {featuredResources.map((resource) => (
          <article className="resource-card" key={resource.id}>
            <div className="resource-card__copy">
              <h2 className="resource-card__title">{resource.title}</h2>
              <p className="resource-card__description">{resource.description}</p>
            </div>

            <AppLink className="resource-card__action" href="/newsletter">
              <ArrowRightIcon className="inline-link__icon" />
              <span className="sr-only">Open {resource.title}</span>
            </AppLink>

            <MonogramBadge
              className="resource-card__badge"
              imageAlt={resource.image?.alt ?? `${resource.title} logo`}
              imageSrc={resource.image?.src ?? ''}
              label={resource.logoText}
              size="lg"
              tone={resource.logoTone}
            />
          </article>
        ))}
      </section>

      {remainingResources.length ? (
        <section className="resource-mini-grid" aria-label="More resources">
          {remainingResources.map((resource) => (
            <article className="resource-mini-card" key={resource.id}>
              <MonogramBadge
                imageAlt={resource.image?.alt ?? `${resource.title} logo`}
                imageSrc={resource.image?.src ?? ''}
                label={resource.logoText}
                tone={resource.logoTone}
              />
              <div className="resource-mini-card__body">
                <p className="eyebrow eyebrow--compact">{resource.category}</p>
                <h2>{resource.title}</h2>
                <p>{resource.description}</p>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      <section className="newsletter-feature">
        {/* <StarCluster /> */}
        <NewsletterForm
          buttonLabel="Subscribe me"
          note="Occasional notes on product design, frontend systems, and the decisions behind the work in this portfolio."
          title="Newsletter"
        />
      </section>
    </div>
  )
}
