import { AppLink } from '../components/atoms/AppLink.jsx'
import { ArrowRightIcon, BrandMarkIcon } from '../components/atoms/Icons.jsx'
import { ExperienceList } from '../components/organisms/ExperienceList.jsx'
import { ProjectCard } from '../components/organisms/ProjectCard.jsx'
import {
  experienceSection,
  portfolioProjects,
  profileContent,
  siteBrand,
} from '../content/siteContent.js'

export function HomePage() {
  const resume = siteBrand.resumes?.[0]

  return (
    <div className="profile-layout">
      <header className="profile-identity">
        <div>
          <h1 id="profile-name"><BrandMarkIcon className="profile-identity__mark" />{profileContent.name}</h1>
          <p className="profile-identity__role">{siteBrand.tagline}</p>
          <p className="profile-identity__intro">{profileContent.introduction}</p>
          <p className="profile-identity__location">{siteBrand.location}</p>
        </div>

      </header>

      <div className="profile-content">
        <section aria-labelledby="about-title" className="profile-section profile-about" id="about">
          <h2 className="profile-section__heading" id="about-title">About</h2>
          {profileContent.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section aria-labelledby="experience-title" className="profile-section profile-experience" id="experience">
          <h2 className="profile-section__heading" id="experience-title">Experience</h2>
          <ExperienceList entries={experienceSection.entries} />
          {resume ? (
            <AppLink className="profile-text-link profile-text-link--external" href={resume.url} target="_blank">
              View full résumé <ArrowRightIcon aria-hidden="true" />
            </AppLink>
          ) : null}
        </section>

        <section aria-labelledby="projects-title" className="profile-section profile-projects" id="projects">
          <h2 className="profile-section__heading" id="projects-title">Projects</h2>
          <div className="profile-project-list">
            {portfolioProjects.slice(0, 4).map((project) => (
              <ProjectCard compact key={project.slug} project={project} />
            ))}
          </div>
          <AppLink className="profile-text-link profile-text-link--external" href="/archive">
            View full project archive <ArrowRightIcon aria-hidden="true" />
          </AppLink>
        </section>

        <footer className="profile-colophon">
          <p>© {new Date().getFullYear()} {profileContent.name}</p>
        </footer>
      </div>
    </div>
  )
}
