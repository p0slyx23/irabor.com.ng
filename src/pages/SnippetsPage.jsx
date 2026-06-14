import { startTransition, useDeferredValue, useId, useState } from 'react'
import { AppLink } from '../components/atoms/AppLink.jsx'
import { Chip } from '../components/atoms/Chip.jsx'
import { SearchField } from '../components/molecules/SearchField.jsx'
import { getProjectPath, snippetCategories, snippets } from '../content/siteContent.js'
import { formatContentDate } from '../core/dateFormatting.js'

export function SnippetsPage() {
  const searchId = useId()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLowerCase()

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesCategory =
      activeCategory === 'All' || snippet.category === activeCategory

    if (!matchesCategory) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return [
      snippet.title,
      snippet.description,
      snippet.category,
      snippet.projectTitle,
      ...(snippet.stack ?? []),
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  })

  return (
    <div className="page-shell snippets-page">
      <header className="page-heading">
        <p className="eyebrow">Patterns</p>
        <h1 className="page-heading__title">Snippets</h1>
        <p className="page-heading__lede">
          Small reusable patterns pulled from the same interface, accessibility, and
          data work used across these projects.
        </p>
      </header>

      <section className="page-toolbar page-toolbar--stack">
        <SearchField
          className="page-toolbar__search"
          id={searchId}
          label="Search"
          onValueChange={(nextValue) => {
            startTransition(() => {
              setQuery(nextValue)
            })
          }}
          placeholder="Search snippets"
          value={query}
        />

        <div className="page-toolbar__filters">
          {snippetCategories.map((category) => (
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

      <div className="table-shell">
        <table className="data-table">
          <caption className="sr-only">
            Developer snippets with title, description, category, and last updated date
          </caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredSnippets.map((snippet) => (
              <tr className={snippet.highlighted ? 'is-highlighted' : undefined} key={snippet.id}>
                <th data-label="Name" scope="row">
                  <AppLink className="data-table__title" href={`/snippets#${snippet.id}`}>
                    {snippet.title}
                  </AppLink>
                </th>
                <td data-label="Description">
                  <div className="data-table__description">
                    <p>{snippet.description}</p>
                    {snippet.projectSlug && snippet.projectTitle ? (
                      <AppLink
                        className="data-table__project-link"
                        href={getProjectPath(snippet.projectSlug)}
                      >
                        From {snippet.projectTitle}
                      </AppLink>
                    ) : null}
                    {snippet.stack?.length ? (
                      <p className="data-table__subcopy">{snippet.stack.join(' / ')}</p>
                    ) : null}
                  </div>
                </td>
                <td data-label="Category">{snippet.category}</td>
                <td data-label="Last updated">
                  <time dateTime={snippet.updatedAt}>{formatContentDate(snippet.updatedAt)}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
