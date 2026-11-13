import { Button } from '../components/atoms/Button.jsx'
import { WindowIllustration } from '../components/molecules/WindowIllustration.jsx'

export function NotFoundPage() {
  return (
    <div className="page-shell not-found-page">
      <section className="not-found">
        <WindowIllustration />

        <div className="not-found__content">
          <h1>This page don waka.</h1>
          <p>The link may have changed. Head back home to find my work.</p>

          <div className="button-group">
            <Button href="/" variant="primary">
              Back to home
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
