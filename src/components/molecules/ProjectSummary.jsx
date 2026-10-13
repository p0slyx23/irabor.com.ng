function getProjectFacts({ meta = [], stack = [] }) {
  const status = meta.find((item) => item === 'Completed' || item === 'In Development')
  const delivery = meta.find((item) => /^(Completed|In Development)\s+.+\d{4}$/.test(item))
  const scope = meta.filter((item) => item !== status && item !== delivery)
  const stackNames = stack.map((item) => item.title).filter(Boolean)

  return [
    scope.length ? { label: 'Scope', value: scope.join(' · ') } : null,
    status ? { label: 'Status', value: status } : null,
    delivery ? { label: 'Delivery', value: delivery } : null,
    stackNames.length ? { label: 'Stack', value: stackNames.slice(0, 3).join(' · ') } : null,
  ].filter(Boolean)
}

export function ProjectSummary({ meta, stack }) {
  const facts = getProjectFacts({ meta, stack })

  if (!facts.length) {
    return null
  }

  return (
    <section aria-labelledby="project-summary-title" className="project-summary">
      <h2 id="project-summary-title" className="project-summary__title">
        Project at a glance
      </h2>
      <dl className="project-summary__facts">
        {facts.map((fact) => (
          <div className="project-summary__fact" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
