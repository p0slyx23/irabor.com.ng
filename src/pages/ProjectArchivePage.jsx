import { AppLink } from '../components/atoms/AppLink.jsx'
import { ArrowRightIcon } from '../components/atoms/Icons.jsx'
import { getProjectBySlug, getProjectPath, projectPosts } from '../content/siteContent.js'
import { getContentDateSortValue, getContentYear } from '../core/dateFormatting.js'

const technologyLabels = {
  react: 'React', php: 'PHP', sql: 'MySQL', flutter: 'Flutter',
  firebase: 'Firebase', figma: 'Figma', dart: 'Dart', mapbox: 'Mapbox',
  pay: 'Paystack', cdn: 'Cloudinary', mail: 'ZeptoMail',
}

export function ProjectArchivePage() {
  const currentYear = new Date().getFullYear()
  const projects = projectPosts.filter((project) => {
    const year = getContentYear(project.sortDate || project.date)
    return year !== null && year < currentYear
  }).sort((left, right) =>
    getContentDateSortValue(right.sortDate || right.date) - getContentDateSortValue(left.sortDate || left.date),
  )

  return (
    <div className="project-archive">
      <AppLink className="profile-text-link project-archive__back" href="/#projects">
        <ArrowRightIcon aria-hidden="true" /> Irabor
      </AppLink>
      <h1>Project Archive</h1>
      <table className="project-archive__table">
        <thead><tr><th scope="col">Year</th><th scope="col">Project</th><th scope="col" className="project-archive__stack">Built with</th><th scope="col" className="project-archive__live">Links</th></tr></thead>
        <tbody>
          {projects.map((project) => {
            const detail = getProjectBySlug(project.slug)
            const links = (detail?.links ?? []).filter((link) => link.label && link.href)
            const year = (project.date || project.sortDate || '').match(/\b\d{4}\b/)?.[0]
            const technologies = [...new Set((detail?.stack ?? []).map((item) => technologyLabels[item.badge]).filter(Boolean))]
            return (
              <tr key={project.slug}>
                <td>{year || '—'}</td>
                <th scope="row"><AppLink href={getProjectPath(project.slug)}>{project.title}<ArrowRightIcon aria-hidden="true" /></AppLink></th>
                <td className="project-archive__stack"><ul>{technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></td>
                <td className="project-archive__live">
                  <ul className="project-archive__links">
                    {links.map((link) => (
                      <li key={link.href}>
                        <AppLink href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined}>
                          {link.label}<ArrowRightIcon aria-hidden="true" />
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
