import { useState } from 'react'
import { AppLink } from '../components/atoms/AppLink.jsx'
import { ArrowRightIcon, BrandMarkIcon } from '../components/atoms/Icons.jsx'
import { ExperienceList } from '../components/organisms/ExperienceList.jsx'
import { ProjectCard } from '../components/organisms/ProjectCard.jsx'
import { getContentYear } from '../core/dateFormatting.js'
import {
  experienceSection,
  portfolioProjects,
  profileContent,
  siteBrand,
} from '../content/siteContent.js'

export function HomePage() {
  const resume = siteBrand.resumes?.[0]
  const [playEntrance] = useState(() => typeof window !== 'undefined' && !window.location.hash)
  const currentYear = new Date().getFullYear()
  const featuredProjects = portfolioProjects.filter((project) => getContentYear(project.sortDate || project.date) === currentYear)
  const resumeEntranceIndex = profileContent.about.length + experienceSection.entries.length
  const projectsEntranceStart = resumeEntranceIndex + 1

  return (
    <div className={`profile-layout${playEntrance ? ' profile-layout--enter' : ''}`}>
      <header className="profile-identity">
        <div>
          <h1 className="profile-enter" id="profile-name" style={{ '--entrance-index': 0 }}><BrandMarkIcon className="profile-identity__mark" />{profileContent.name}</h1>
          <p className="profile-identity__role profile-enter" style={{ '--entrance-index': 1 }}>{siteBrand.tagline}</p>
          <p className="profile-identity__intro profile-enter" style={{ '--entrance-index': 2 }}>{profileContent.introduction}</p>
          <p className="profile-identity__location profile-enter" style={{ '--entrance-index': 3 }}>{siteBrand.location}</p>
        </div>

      </header>

      <div className="profile-content">
        <section aria-labelledby="about-title" className="profile-section profile-about" id="about">
          <h2 className="profile-section__heading" id="about-title">About</h2>
          {profileContent.about.map((paragraph, index) => (
            <p className="profile-enter" key={paragraph} style={{ '--entrance-index': index }}>{paragraph}</p>
          ))}
        </section>

        <section aria-labelledby="experience-title" className="profile-section profile-experience" id="experience">
          <h2 className="profile-section__heading" id="experience-title">Experience</h2>
          <ExperienceList entries={experienceSection.entries} entranceStart={profileContent.about.length} />
          {resume ? (
            <AppLink className="profile-text-link profile-text-link--external profile-enter" href={resume.url} style={{ '--entrance-index': resumeEntranceIndex }} target="_blank">
              View full résumé <ArrowRightIcon aria-hidden="true" />
            </AppLink>
          ) : null}
        </section>

        <section aria-labelledby="projects-title" className="profile-section profile-projects" id="projects">
          <h2 className="profile-section__heading" id="projects-title">Projects</h2>
          <div className="profile-project-list">
            {featuredProjects.map((project, index) => (
              <ProjectCard compact entranceIndex={projectsEntranceStart + index} key={project.slug} project={project} />
            ))}
          </div>
          <AppLink className="profile-text-link profile-text-link--external profile-enter" href="/archive" style={{ '--entrance-index': projectsEntranceStart + featuredProjects.length }}>
            View full project archive <ArrowRightIcon aria-hidden="true" />
          </AppLink>
        </section>

        <footer className="profile-colophon">
          <p className="profile-enter" style={{ '--entrance-index': projectsEntranceStart + featuredProjects.length + 1 }}>© {new Date().getFullYear()} {profileContent.name}</p>
        </footer>
      </div>
    </div>
  )
}
