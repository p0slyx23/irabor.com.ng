import { useEffect, useState } from 'react'
import placeholderCoverImage from '../../assets/images/projects/placeholder-cover.png'

export function ContentImage({ alt, fallbackSrc = placeholderCoverImage, src, ...rest }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc)
  }, [fallbackSrc, src])

  return (
    <img
      alt={alt}
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
