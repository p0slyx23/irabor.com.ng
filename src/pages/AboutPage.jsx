import { AppLink } from '../components/atoms/AppLink.jsx'
import { ExperienceList } from '../components/organisms/ExperienceList.jsx'
import { aboutPage, experienceSection, projectEntries, siteBrand } from '../content/siteContent.js'

function getProjectStatusCounts() {
  const projects = Object.values(projectEntries)

  return projects.reduce(
    (summary, project) => {
      if (project.meta.includes('In Development')) {
        summary.inDevelopment += 1
      }

      if (project.meta.includes('Completed')) {
        summary.completed += 1
      }

      return summary
    },
    {
      completed: 0,
      inDevelopment: 0,
      total: projects.length,
    },
  )
}

export function AboutPage() {
  const projectSummary = getProjectStatusCounts()
  const hasProfileImage = Boolean(siteBrand.profileImage?.src)

  return (
    <div className="page-shell about-page">
      <header className="page-heading">
        <p className="eyebrow">{aboutPage.eyebrow}</p>
        <h1 className="page-heading__title">{aboutPage.title}</h1>
        <p className="page-heading__lede">{aboutPage.lede}</p>
      </header>

      <section className="about-layout">
        <div className="about-main">
          <article className="about-panel about-panel--intro">
            {hasProfileImage ? (
              <figure className="about-profile">
                <img alt={siteBrand.profileImage.alt} src={siteBrand.profileImage.src} />
              </figure>
            ) : null}

            <div className="about-copy">
              <p className="about-kicker">{siteBrand.tagline}</p>
              {aboutPage.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <section className="about-grid">
            <article className="about-panel">
              <h2 className="section-heading">How I work</h2>
              <ul className="about-list">
                {aboutPage.principles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="about-availability">{aboutPage.availability}</p>
            </article>

          </section>
        </div>

        <aside className="about-sidebar">
          <section className="about-panel">
            <h2 className="section-heading">Overview</h2>
            <dl className="about-facts">
              <div className="about-fact">
                <dt>Focus</dt>
                <dd>{siteBrand.tagline}</dd>
              </div>

              <div className="about-fact">
                <dt>Location</dt>
                <dd>{siteBrand.location}</dd>
              </div>

              <div className="about-fact">
                <dt>Contact</dt>
                <dd>
                  <AppLink href={`mailto:${siteBrand.email}`}>{siteBrand.email}</AppLink>
                </dd>
              </div>

              <div className="about-fact">
                <dt>Phone</dt>
                <dd>
                  <AppLink href={`tel:${siteBrand.phone}`}>
                    +234 916 386 6675
                  </AppLink>
                </dd>
              </div>
            </dl>

            <div className="about-actions">
              <AppLink className="page-action-link" href={`mailto:${siteBrand.email}`}>
                Get in touch
              </AppLink>
              {siteBrand.resumes?.map((resume) => (
                <AppLink
                  className="page-action-link"
                  href={resume.url}
                  key={resume.url}
                  target="_blank"
                >
                  {resume.label}
                </AppLink>
              ))}
            </div>
          </section>

          <section className="about-panel">
            <h2 className="section-heading">Snapshot</h2>
            <div className="about-stats">
              <article className="about-stat">
                <span className="about-stat__value">{projectSummary.total}</span>
                <span className="about-stat__label">Case studies</span>
              </article>

              <article className="about-stat">
                <span className="about-stat__value">{projectSummary.completed}</span>
                <span className="about-stat__label">Completed</span>
              </article>

              <article className="about-stat">
                <span className="about-stat__value">{projectSummary.inDevelopment}</span>
                <span className="about-stat__label">In development</span>
              </article>
            </div>
          </section>
        </aside>
      </section>

      <section aria-labelledby="experience-title" className="experience-section">
        <header className="experience-section__heading">
          <h2 id="experience-title" className="section-heading">
            {experienceSection.title}
          </h2>
        </header>

        <ExperienceList entries={experienceSection.entries} />
      </section>

      <section className="about-grid">
        <article className="about-panel">
          <h2 className="section-heading">What I do</h2>
          <ul className="about-list">
            {aboutPage.capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
