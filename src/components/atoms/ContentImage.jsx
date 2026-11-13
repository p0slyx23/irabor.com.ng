import { useState } from 'react'
import placeholderCoverImage from '../../assets/images/projects/placeholder-cover.webp'

function ImageWithFallback({ alt, fallbackSrc, src, ...rest }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)

  return (
    <img
      alt={alt}
      decoding="async"
      loading="lazy"
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc)
        }
      }}
      src={currentSrc}
      {...rest}
    />
  )
}

export function ContentImage({ alt, fallbackSrc = placeholderCoverImage, src, ...rest }) {
  return (
    <ImageWithFallback
      alt={alt}
      fallbackSrc={fallbackSrc}
      key={JSON.stringify([src, fallbackSrc])}
      src={src}
      {...rest}
    />
  )
}
