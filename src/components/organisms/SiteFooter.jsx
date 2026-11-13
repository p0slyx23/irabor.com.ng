import { siteBrand } from '../../content/siteContent.js'
import { AppLink } from '../atoms/AppLink.jsx'
import { BrandMarkIcon } from '../atoms/Icons.jsx'

export function SiteFooter() {
  return (
    <footer className="site-footer">

      <AppLink aria-label="Go to home page" className="site-footer__brand" href="/">
        <BrandMarkIcon className="site-footer__mark" />
      </AppLink>

      <p className="site-footer__meta">{siteBrand.footerLabel}</p>
    </footer>
  )
}
