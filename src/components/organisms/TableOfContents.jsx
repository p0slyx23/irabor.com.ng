export function TableOfContents({ items }) {
  return (
    <nav aria-label="Table of contents" className="toc card">
      <div className="card__header">
        <div className="card__heading">
          <h3 className="card__title">On this page</h3>
        </div>
      </div>

      <div className="card__body">
        <ol className="toc__list">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
