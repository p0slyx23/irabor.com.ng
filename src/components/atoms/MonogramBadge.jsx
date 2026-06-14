import { cx } from '../../core/cx.js'

function TypeScriptLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <rect fill="currentColor" height="56" rx="6" width="56" x="4" y="4" />
      <path
        d="M18 19H46V26H37.2V48H28.7V26H18V19Z"
        fill="#FFFFFF"
      />
      <path
        d="M48 39.7C48 45.3 44 48.6 37.4 48.6C32.3 48.6 28.4 46.5 26.2 42.4L32.8 38.4C33.8 40.5 35.4 41.6 37.7 41.6C39.7 41.6 40.9 40.8 40.9 39.4C40.9 38 39.9 37.2 36.7 36L35 35.4C30.1 33.7 26.8 31.1 26.8 25.5C26.8 20.4 30.7 16.5 36.8 16.5C41.2 16.5 44.4 18 46.7 21.9L40.3 26C38.9 23.5 37.3 22.5 35.1 22.5C32.9 22.5 31.9 23.4 31.9 24.7C31.9 26.3 32.9 26.9 35.4 28L37.1 28.7C42.9 31.2 46.2 33.7 46.2 39.6L48 39.7Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function FlutterLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <path d="M15 34L31 18H49L33 34H15Z" fill="currentColor" />
      <path d="M24 43L33 34H49L40 43H24Z" fill="currentColor" opacity="0.72" />
      <path d="M33 34L24 25L31 18L49 36L40 43L33 34Z" fill="currentColor" opacity="0.88" />
    </svg>
  )
}

function ReactLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <ellipse
        cx="32"
        cy="32"
        fill="none"
        rx="22"
        ry="8.5"
        stroke="currentColor"
        strokeWidth="3"
      />
      <ellipse
        cx="32"
        cy="32"
        fill="none"
        rx="22"
        ry="8.5"
        stroke="currentColor"
        strokeWidth="3"
        transform="rotate(60 32 32)"
      />
      <ellipse
        cx="32"
        cy="32"
        fill="none"
        rx="22"
        ry="8.5"
        stroke="currentColor"
        strokeWidth="3"
        transform="rotate(120 32 32)"
      />
      <circle cx="32" cy="32" fill="currentColor" r="4.5" />
    </svg>
  )
}

function FirebaseLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <path d="M18 47L30 14L46 24L40 52L18 47Z" fill="currentColor" opacity="0.92" />
      <path d="M18 47L26 24L32 34L18 47Z" fill="currentColor" opacity="0.72" />
      <path d="M32 34L46 24L40 52L32 34Z" fill="currentColor" />
    </svg>
  )
}

function NodeLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <path
        d="M32 6L51.92 17.5V46.5L32 58L12.08 46.5V17.5L32 6Z"
        fill="currentColor"
      />
      <path
        d="M24 42V22L40 32V42"
        fill="none"
        stroke="#FFFFFF"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M24 22L40 32"
        fill="none"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

function DartLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <path d="M20 12H36L48 24V40L34 52H20V12Z" fill="currentColor" opacity="0.86" />
      <path d="M20 12L36 28H48L36 12H20Z" fill="currentColor" />
      <path d="M20 32L34 52L48 40L36 28L20 32Z" fill="currentColor" opacity="0.68" />
    </svg>
  )
}

function CssLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <path
        d="M12 8H52L48 52L32 56L16 52L12 8Z"
        fill="currentColor"
      />
      <path
        d="M24 18H42L41 24H29L29.7 30H40.1L38.6 44L32 46L25.4 44L24.8 37H30.8L31 39L32 39.3L33 39L33.7 34H23.7L21.8 18H24Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function NpmLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo monogram-badge__logo--wide" viewBox="0 0 96 40">
      <path
        d="M4 8H92V32H70V20H60V32H4V8Z"
        fill="currentColor"
      />
      <path
        d="M12 14H18V26H24V14H30V26H36V14H42V26H48V14H54V26H60V14H78V26H84V14H88V28H72V20H66V28H48V20H42V28H24V20H18V28H12V14Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function TestingLibraryLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <path
        d="M24 12H40V16H36V24L47 43C48.3 45.3 46.7 48 44 48H20C17.3 48 15.7 45.3 17 43L28 24V16H24V12Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M24 40C27.5 34.8 31.7 32.2 36.6 32.2C40.1 32.2 43.2 33.8 46 37V43C46 44.7 44.7 46 43 46H21C19.3 46 18 44.7 18 43V40H24Z"
        fill="currentColor"
      />
      <circle cx="32" cy="22" fill="currentColor" r="2.5" />
    </svg>
  )
}

function FigmaGlyphLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <rect fill="currentColor" height="14" rx="7" width="24" x="20" y="8" />
      <rect fill="currentColor" height="14" rx="7" width="24" x="20" y="22" />
      <rect fill="currentColor" height="14" rx="7" width="24" x="20" y="36" />
      <circle cx="32" cy="15" fill="#FFFFFF" r="3" />
      <circle cx="32" cy="29" fill="#FFFFFF" r="3" />
      <circle cx="32" cy="43" fill="#FFFFFF" r="3" />
      <circle cx="44" cy="22" fill="currentColor" r="7" />
      <circle cx="44" cy="22" fill="#FFFFFF" r="3" />
    </svg>
  )
}

function IconLibraryLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <rect fill="none" height="40" rx="8" stroke="currentColor" strokeWidth="3" width="40" x="12" y="12" />
      <circle cx="24" cy="24" fill="currentColor" r="4" />
      <circle cx="40" cy="24" fill="currentColor" r="4" />
      <circle cx="24" cy="40" fill="currentColor" r="4" />
      <path d="M36 36L44 44" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      <path d="M44 36L36 44" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
  )
}

function DesignSystemLogo() {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo" viewBox="0 0 64 64">
      <rect fill="none" height="16" rx="3" stroke="currentColor" strokeWidth="3" width="16" x="10" y="10" />
      <rect fill="currentColor" height="16" rx="3" width="16" x="30" y="10" />
      <rect fill="currentColor" height="16" opacity="0.7" rx="3" width="16" x="10" y="30" />
      <rect fill="none" height="16" rx="3" stroke="currentColor" strokeWidth="3" width="16" x="30" y="30" />
    </svg>
  )
}

function GenericWordmarkLogo({ label }) {
  return (
    <svg aria-hidden="true" className="monogram-badge__logo monogram-badge__logo--wide" viewBox="0 0 96 40">
      <rect
        fill="none"
        height="30"
        rx="6"
        stroke="currentColor"
        strokeWidth="3"
        width="88"
        x="4"
        y="5"
      />
      <text
        dominantBaseline="middle"
        fill="currentColor"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="16"
        fontWeight="700"
        textAnchor="middle"
        x="48"
        y="22"
      >
        {label}
      </text>
    </svg>
  )
}

function renderLogoForLabel(label) {
  const normalizedLabel = label.trim().toLowerCase()

  switch (normalizedLabel) {
    case 'fl':
    case 'flutter':
      return <FlutterLogo />
    case 'fb':
    case 'firebase':
      return <FirebaseLogo />
    case 'ts':
      return <TypeScriptLogo />
    case 'dt':
    case 'dart':
      return <DartLogo />
    case 'r':
    case 'react':
      return <ReactLogo />
    case 'n':
    case 'node':
      return <NodeLogo />
    case 'css':
    case 'css3':
      return <CssLogo />
    case 'npm':
      return <NpmLogo />
    case 'tl':
      return <TestingLibraryLogo />
    case 'fg':
      return <FigmaGlyphLogo />
    case 'icons':
      return <IconLibraryLogo />
    case 'system':
    case 'ds':
      return <DesignSystemLogo />
    default:
      return <GenericWordmarkLogo label={label} />
  }
}

export function MonogramBadge({
  className,
  imageAlt = '',
  imageSrc = '',
  label,
  size = 'md',
  tone = 'neutral',
}) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'monogram-badge',
        `monogram-badge--${size}`,
        `monogram-badge--${tone}`,
        className,
      )}
    >
      {imageSrc ? (
        <img
          alt={imageAlt}
          className="monogram-badge__image"
          loading="lazy"
          src={imageSrc}
        />
      ) : (
        renderLogoForLabel(label)
      )}
    </div>
  )
}
