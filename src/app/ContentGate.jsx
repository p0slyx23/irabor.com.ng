import { useEffect, useRef, useState } from 'react'
import App from '../App.jsx'
import { Button } from '../components/atoms/Button.jsx'
import { bundledAssets } from '../content/assets.js'
import { installPortfolioContent } from '../content/siteContent.js'
import { loadPortfolioContent } from '../core/loadPortfolioContent.mjs'

export function ContentGate() {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ status: 'loading' })
  const retried = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    loadPortfolioContent({ endpoint: import.meta.env.VITE_CONTENT_API_URL, assets: bundledAssets, signal: controller.signal })
      .then((content) => {
        if (controller.signal.aborted) return
        installPortfolioContent(content)
        setState({ status: 'ready' })
        if (retried.current && !window.location.hash) {
          requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }))
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ status: 'error', code: error.code })
      })
    return () => controller.abort()
  }, [attempt])

  if (state.status === 'ready') return <App />
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false
  const message = offline
    ? 'You appear to be offline. Reconnect, then try again.'
    : state.code === 'configuration' || state.code === 'invalid-content'
      ? 'The portfolio content service is not responding correctly. Please try again shortly.'
      : 'The portfolio could not load over this connection. Please try again.'

  return (
    <main aria-busy={state.status === 'loading'} className="content-gate" id="main-content" tabIndex={-1}>
      <div aria-atomic="true" aria-live="polite" className="content-gate__copy">
        <h1>{state.status === 'loading' ? 'Loading portfolio' : 'Content couldn’t load'}</h1>
        <p>{state.status === 'loading' ? 'Getting the latest experience and projects.' : message}</p>
      </div>
      {state.status === 'error' ? (
        <Button onClick={() => { retried.current = true; setState({ status: 'loading' }); setAttempt((value) => value + 1) }} variant="secondary">
          Try again
        </Button>
      ) : null}
    </main>
  )
}
