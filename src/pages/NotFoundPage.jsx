import { Button } from '../components/atoms/Button.jsx'
import { RecoveryLink, RecoveryState } from '../components/molecules/RecoveryState.jsx'
import { missingPageRecovery, missingProjectRecovery } from '../core/recovery.mjs'

export function NotFoundPage({ kind = 'page' }) {
  return (
    <div className="recovery-screen recovery-screen--page">
      <RecoveryState {...(kind === 'project' ? missingProjectRecovery : missingPageRecovery)}>
        <Button href="/#projects">Explore my work</Button>
        <RecoveryLink href="/archive">Project archive</RecoveryLink>
      </RecoveryState>
    </div>
  )
}
