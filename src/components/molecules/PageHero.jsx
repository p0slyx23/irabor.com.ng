import { Chip } from '../atoms/Chip.jsx'
import { cx } from '../../core/cx.js'
import {
  formatContentDate,
  formatTimelineSummary,
  splitTimelineMeta,
} from '../../core/dateFormatting.js'

export function PageHero({
  actions = null,
  className,
  eyebrow,
  lede,
  meta = [],
  title,
  aside = null,
}) {
  const { timelineItems, metaItems, statusItem } = splitTimelineMeta(meta)
  const timelineSummary =
    statusItem &&
    timelineItems.length === 1 &&
    timelineItems[0].kind === statusItem.kind.replace('in-development', 'started')
      ? formatContentDate(timelineItems[0].value)
      : formatTimelineSummary(timelineItems)

  return (
    <header className={cx('page-hero', className)}>
      <div className="page-hero__content">
        <div className="page-hero__eyebrow-row">
          <p className="eyebrow">{eyebrow}</p>
          <div className="page-hero__eyebrow-meta">
            {statusItem ? (
              <p
                className={cx(
                  'page-hero__status',
                  `page-hero__status--${statusItem.kind}`,
                )}
              >
                {statusItem.label}
              </p>
            ) : null}
            {timelineSummary ? <p className="page-hero__date">{timelineSummary}</p> : null}
          </div>
        </div>
        <h1 className="page-hero__title">{title}</h1>
        <p className="page-hero__lede">{lede}</p>

        {metaItems.length ? (
          <div className="page-hero__meta">
            {metaItems.map((item) => (
              <Chip key={item} variant="outlined">
                {item}
              </Chip>
            ))}
          </div>
        ) : null}

        {actions ? <div className="page-hero__actions">{actions}</div> : null}
      </div>

      {aside ? <aside className="page-hero__aside">{aside}</aside> : null}
    </header>
  )
}
