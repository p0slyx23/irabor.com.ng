import { cx } from '../../core/cx.js'

export function StarCluster({ className }) {
  return (
    <div aria-hidden="true" className={cx('star-cluster', className)}>
      <span className="star-cluster__star star-cluster__star--gold" />
      <span className="star-cluster__star star-cluster__star--violet" />
      <span className="star-cluster__star star-cluster__star--amber" />
      <span className="star-cluster__star star-cluster__star--orchid" />
    </div>
  )
}
