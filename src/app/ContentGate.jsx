import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import App from '../App.jsx'
import { Button } from '../components/atoms/Button.jsx'
import { BrandMarkIcon } from '../components/atoms/Icons.jsx'
import { ContentLoading } from './ContentLoading.jsx'
import { bundledAssets } from '../content/assets.js'
import { installPortfolioContent } from '../content/siteContent.js'
import { loadPortfolioContent } from '../core/loadPortfolioContent.mjs'

export function ContentGate() {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ status: 'loading' })
  const retried = useRef(false)
  const usedLoader = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    loadPortfolioContent({ endpoint: import.meta.env.VITE_CONTENT_API_URL, assets: bundledAssets, signal: controller.signal })
      .then((content) => {
        if (controller.signal.aborted) return
        installPortfolioContent(content)
        setState({ status: 'ready' })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ status: 'error', code: error.code })
      })
    return () => controller.abort()
  }, [attempt])

  useLayoutEffect(() => {
    // Focus only after React has replaced the loading main with the real page.
    // Scheduling a frame in the fetch callback can target the soon-removed node
    // when a fast response resolves before React commits the ready state.
    if (state.status === 'ready' && (retried.current || usedLoader.current) && !window.location.hash) {
      document.getElementById('main-content')?.focus({ preventScroll: true })
    }
  }, [state.status])

  if (state.status === 'ready') return <App />
  if (state.status === 'loading') return <ContentLoading onInteract={() => { usedLoader.current = true }} />
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false
  const message = offline
    ? 'You appear to be offline. Reconnect, then try again.'
    : state.code === 'configuration' || state.code === 'invalid-content'
      ? 'The portfolio content service is not responding correctly. Please try again shortly.'
      : 'The portfolio could not load over this connection. Please try again.'

  return (
    <main aria-busy="false" className="content-gate" data-state="error" id="main-content" tabIndex={-1}>
      <div className="content-gate__inner">
        <BrandMarkIcon className="content-loader__mark content-loader__mark--static" />
        <div aria-atomic="true" aria-live="polite" className="content-gate__copy">
          <h1>Content couldn’t load</h1>
          <p>{message}</p>
        </div>
        <Button onClick={() => { retried.current = true; setState({ status: 'loading' }); setAttempt((value) => value + 1) }} variant="secondary">
          Try again
        </Button>
      </div>
    </main>
  )
}
