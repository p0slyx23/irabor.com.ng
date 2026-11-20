import { useEffect, useState } from 'react'

const messages = [
  'Connecting to my portfolio',
  'Waiting for the latest work',
  'Thanks for your patience',
]

export function ThinkingStatus({ paused }) {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (paused) return undefined
    // First hold is 2000ms; later holds follow the 150ms swap + 50ms gap.
    let timer
    const advance = () => {
      setCycle(value => value + 1)
      timer = window.setTimeout(advance, 2200)
    }
    timer = window.setTimeout(advance, 2000)
    return () => window.clearTimeout(timer)
  }, [paused])

  const current = messages[cycle % messages.length]
  return (
    <span aria-hidden="true" className="thinking-status">
      {messages.map(message => <span className="thinking-status__sizer" key={message}>{message}</span>)}
      {cycle > 0 ? <span className="thinking-status__text thinking-status__text--exit" key={`out-${cycle}`}>{messages[(cycle - 1) % messages.length]}</span> : null}
      <span className={`thinking-status__text${cycle > 0 ? ' thinking-status__text--enter' : ''}`} data-text={current} key={cycle}>{current}</span>
    </span>
  )
}
