import { Component } from 'react'
import { Button } from '../components/atoms/Button.jsx'
import { RecoveryLink, RecoveryState } from '../components/molecules/RecoveryState.jsx'
import resumeUrl from '../assets/files/resume.pdf'
import { unexpectedRecovery } from '../core/recovery.mjs'

export class PortfolioErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main className="recovery-screen" id="main-content" tabIndex={-1}>
        <RecoveryState {...unexpectedRecovery} note="The résumé opens as a PDF in a new tab.">
          <Button onClick={() => window.location.reload()}>Reload page</Button>
          <RecoveryLink href={resumeUrl} external>View résumé</RecoveryLink>
        </RecoveryState>
      </main>
    )
  }
}
