import { useId } from 'react'
import { cx } from '../../core/cx.js'
import { Button } from '../atoms/Button.jsx'

export function NewsletterForm({
  buttonLabel = 'Join newsletter',
  className,
  eyebrow = 'Newsletter',
  note = 'One useful issue when something worth reading is actually ready.',
  title = 'Stay in the loop without subscribing to noise.',
}) {
  const inputId = useId()

  return (
    <section className={cx('newsletter-block', className)}>
      <div className="newsletter-block__copy">
        <p className="eyebrow eyebrow--compact">{eyebrow}</p>
        <h2 className="newsletter-block__title">{title}</h2>
        <p className="newsletter-block__note">{note}</p>
      </div>

      <form className="newsletter-block__form" onSubmit={(event) => event.preventDefault()}>
        <label className="form-label" htmlFor={inputId}>
          Your e-mail
        </label>
        <div className="newsletter-block__input-row">
          <input
            className="form-control"
            id={inputId}
            name="newsletter-email"
            placeholder="Your e-mail"
            type="email"
          />
          <Button size="md" type="submit" variant="primary">
            {buttonLabel}
          </Button>
        </div>
      </form>
    </section>
  )
}
