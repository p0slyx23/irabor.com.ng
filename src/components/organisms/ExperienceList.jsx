import { AppLink } from '../atoms/AppLink.jsx'
import { Chip } from '../atoms/Chip.jsx'
import { ArrowRightIcon } from '../atoms/Icons.jsx'

export function ExperienceList({ entries }) {
  return (
    <div className="experience-list">
      {entries.map((entry) => {
        const roles = entry.title.split(' → ')
        const currentRole = roles.at(-1)
        const previousRoles = roles.slice(0, -1).reverse()

        return (
          <article className="experience-entry" key={entry.id}>
            <p className="experience-entry__period">{entry.period}</p>
            <div className="experience-entry__body">
              <div className="experience-entry__title-row">
                <h3>
                  {currentRole} <span aria-hidden="true">·</span>{' '}
                  {entry.companyUrl ? (
                    <AppLink className="experience-entry__company-link" href={entry.companyUrl} target="_blank">
                      {entry.company}<ArrowRightIcon aria-hidden="true" />
                    </AppLink>
                  ) : entry.company}
                </h3>
              </div>
              {previousRoles.length ? (
                <ul aria-label="Previous roles" className="experience-entry__previous-roles">
                  {previousRoles.map((role) => <li key={role}>{role}</li>)}
                </ul>
              ) : null}
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
        )
      })}
    </div>
  )
}
