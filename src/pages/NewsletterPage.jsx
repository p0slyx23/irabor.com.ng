import { NewsletterForm } from '../components/molecules/NewsletterForm.jsx'
import { StarCluster } from '../components/molecules/StarCluster.jsx'
import { newsletterPage } from '../content/siteContent.js'

export function NewsletterPage() {
  return (
    <div className="page-shell newsletter-page">
      <section className="newsletter-hero">
        <StarCluster className="newsletter-hero__stars" />
        <NewsletterForm
          buttonLabel="Subscribe me"
          eyebrow={newsletterPage.eyebrow}
          note={newsletterPage.lede}
          title={newsletterPage.title}
        />
      </section>

      <section className="newsletter-layout">
        <div className="newsletter-column">
          <h2 className="section-heading">What arrives</h2>
          <div className="newsletter-benefits">
            {newsletterPage.benefits.map((benefit) => (
              <article className="newsletter-benefit" key={benefit}>
                <p>{benefit}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="newsletter-column newsletter-column--aside">
          <h2 className="section-heading">Newest posts</h2>
          <div className="newsletter-issues">
            {newsletterPage.issues.map((issue) => (
              <article className="newsletter-issue" key={issue.title}>
                <h3>{issue.title}</h3>
                <p>{issue.excerpt}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </div>
  )
}
