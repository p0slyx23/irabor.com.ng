import { CloseIcon } from '../atoms/Icons.jsx'
import { cx } from '../../core/cx.js'

export function SearchField({
  className,
  id,
  label = 'Search',
  onValueChange,
  placeholder = 'Search',
  value = '',
}) {
  const hasValue = value.trim().length > 0

  return (
    <div className={cx('search-field', className)}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="search-field__control">
        <input
          className="form-control search-field__input"
          id={id}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
        {hasValue ? (
          <button
            aria-label={`Clear ${label.toLowerCase()}`}
            className="search-field__clear"
            onClick={() => onValueChange('')}
            type="button"
          >
            <CloseIcon className="search-field__clear-icon" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
