import { ContentImage } from '../atoms/ContentImage.jsx'

export function ProjectProof({ evidence = [], screenshots = [] }) {
  const proof = evidence.filter((item) => item?.label && item?.value)
  const gallery = screenshots.filter((item) => item?.src && item?.alt)

  if (!proof.length && !gallery.length) {
    return null
  }

  return (
    <section aria-labelledby="project-proof-title" className="project-proof">
      <h2 id="project-proof-title">Project evidence</h2>

      {proof.length ? (
        <dl className="project-proof__facts">
          {proof.map((item) => (
            <div className="project-proof__fact" key={`${item.label}-${item.value}`}>
              <dt>{item.label}</dt>
              <dd>
                <strong>{item.value}</strong>
                {item.detail ? <span>{item.detail}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {gallery.length ? (
        <div className="project-proof__gallery">
          {gallery.map((image) => (
            <figure key={image.src}>
              <ContentImage alt={image.alt} src={image.src} />
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  )
}
