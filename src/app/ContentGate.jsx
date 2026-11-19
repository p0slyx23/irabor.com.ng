import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import App from '../App.jsx'
import { Button } from '../components/atoms/Button.jsx'
import { RecoveryLink, RecoveryState } from '../components/molecules/RecoveryState.jsx'
import { ContentLoading } from './ContentLoading.jsx'
import { bundledAssets } from '../content/assets.js'
import { installPortfolioContent } from '../content/siteContent.js'
import { loadPortfolioContent } from '../core/loadPortfolioContent.mjs'
import { getContentRecovery } from '../core/recovery.mjs'
import { useOnlineStatus } from '../core/useOnlineStatus.js'
import resumeUrl from '../assets/files/resume.pdf'

export function ContentGate() {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ status: 'loading' })
  const retried = useRef(false)
  const usedLoader = useRef(false)
  const online = useOnlineStatus()

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
  return (
    <main aria-busy="false" className="content-gate recovery-screen" data-state="error" id="main-content" tabIndex={-1}>
      <RecoveryState {...getContentRecovery(state.code, online)} note="The résumé opens as a PDF in a new tab.">
        <Button onClick={() => { retried.current = true; setState({ status: 'loading' }); setAttempt((value) => value + 1) }}>
          Try again
        </Button>
        <RecoveryLink href={resumeUrl} external>View résumé</RecoveryLink>
      </RecoveryState>
      <p aria-live="polite" className="sr-only" role="status">
        {online ? 'You are online. You can try again.' : 'You are offline. Reconnect before trying again.'}
      </p>
    </main>
  )
}
