import { AppLink } from '../atoms/AppLink.jsx'
import { Chip } from '../atoms/Chip.jsx'

export function ExperienceList({ entries }) {
  return (
    <div className="experience-list">
      {entries.map((entry) => (
        <article className="experience-entry" key={entry.id}>
          <p className="experience-entry__period">{entry.period}</p>
          <div className="experience-entry__body">
            <div className="experience-entry__title-row">
              <h3>{entry.title}</h3>
              <span aria-hidden="true">·</span>
              {entry.companyUrl ? (
                <AppLink href={entry.companyUrl} target="_blank">
                  {entry.company}
                </AppLink>
              ) : (
                <span>{entry.company}</span>
              )}
            </div>
            {entry.isDemo ? <p className="experience-entry__demo">Demo entry</p> : null}
            <p>{entry.summary}</p>
            {entry.technologies?.length ? (
              <div className="chip-set" aria-label={`${entry.title} technologies`}>
                {entry.technologies.map((technology) => (
                  <Chip key={technology} variant="outlined">
                    {technology}
                  </Chip>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
