import { Button } from '../components/atoms/Button.jsx'
import { WindowIllustration } from '../components/molecules/WindowIllustration.jsx'

export function NotFoundPage() {
  return (
    <div className="page-shell not-found-page">
      <section className="not-found">
        <WindowIllustration />

        <div className="not-found__content">
          <h1>Don&apos;t worry!</h1>
          <p>Sometimes I feel lost too... even though it&apos;s just 404 page :)</p>

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
