import { socialLinks } from '../../content/siteContent.js'
import { AppLink } from '../atoms/AppLink.jsx'
import { GitHubIcon, LinkedInIcon, MailIcon } from '../atoms/Icons.jsx'

const iconMap = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
}

export function SocialRail({ className = '' }) {
  return (
    <nav aria-label="Social links" className={`social-rail ${className}`.trim()}>
      {socialLinks.map((item) => {
        const Icon = iconMap[item.icon]

        return (
          <AppLink
            aria-label={item.label}
            className="social-link"
            href={item.href}
            key={item.label}
            target={item.href.startsWith('http') ? '_blank' : undefined}
          >
            <Icon className="social-link__icon" />
          </AppLink>
        )
      })}
    </nav>
  )
}
