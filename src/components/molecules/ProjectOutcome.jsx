function getDeliveryStatus(meta = []) {
  return meta.find((item) => /^(Completed|In Development)(?:\s|$)/.test(item))
}

export function ProjectOutcome({ meta, section }) {
  if (!section) {
    return null
  }

  const status = getDeliveryStatus(meta)

  return (
    <section aria-labelledby="project-outcome-title" className="project-outcome" id={section.id}>
      <div className="project-outcome__heading">
        <h2 id="project-outcome-title">{section.heading}</h2>
        {status ? <p className="project-outcome__status">{status}</p> : null}
      </div>

      <div className="project-outcome__copy">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

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
  )
}
