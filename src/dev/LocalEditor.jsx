import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { EditorContext } from '../core/editorContext.js'
import { installPortfolioContent } from '../content/siteContent.js'
import { bundledAssets } from '../content/assets.js'
import { mapAssetReferences } from '../../shared/content-data.mjs'
import { EditorForm } from './EditorForm.jsx'
import { moveEntry } from './editor-model.mjs'
import './editor.css'

// Local extension of the existing page: quiet inline controls and an editing
// sheet, never a second dashboard. Explicit saves change shared MySQL content.
export default function LocalEditor({ children }) {
  const [session, setSession] = useState(null)
  const [active, setActive] = useState(false)
  const [busy, setBusy] = useState(false)
  const [selection, setSelection] = useState(null)
  const [message, setMessage] = useState('')
  const [version, setVersion] = useState(0)
  const inFlight = useRef(false)

  async function request(path, options = {}) {
    const response = await fetch(`/api/editor/${path}`, { cache: 'no-store', signal: AbortSignal.timeout(25000), ...options })
    if (!(response.headers.get('content-type') || '').includes('application/json')) throw new Error('Start the local editor with npm run editor:start, then try again.')
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'The editor could not save. Please try again.')
    return data
  }

  function install(data) {
    const content = mapAssetReferences(data.content, reference => data.assets[reference] || bundledAssets[reference] || '')
    installPortfolioContent(content)
    setSession(data)
    setVersion(value => value + 1)
  }

  async function connect() {
    if (inFlight.current) return
    inFlight.current = true
    setBusy(true)
    try {
      install(await request('session'))
      setActive(true)
      setMessage('Editing LIVE content. Changes reach the public site after saving; cached pages may take a minute.')
    } catch (error) { setMessage(error.name === 'TimeoutError' ? 'The editor timed out. Check the local editor terminal and MySQL connection.' : error.message) }
    finally { inFlight.current = false; setBusy(false) }
  }

  async function save(content, restoreId) {
    if (inFlight.current) return false
    inFlight.current = true
    setBusy(true)
    setMessage('Saving to MySQL…')
    try {
      const data = await request(restoreId ? 'restore' : 'content', {
        method: restoreId ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Editor-Token': session.token },
        body: JSON.stringify({ revision: session.revision, ...(restoreId ? { id: restoreId } : { content }) }),
      })
      install(data)
      setSelection(null)
      setMessage('Saved to live content. Public caches may take up to a minute to refresh.')
      return true
    } catch (error) {
      setMessage(error.name === 'TimeoutError' ? 'Save timed out. Reload latest content to check whether it committed before retrying.' : error.message)
      return false
    } finally { inFlight.current = false; setBusy(false) }
  }

  return (
    <EditorContext.Provider value={{ active, busy, open: setSelection, move: async (kind, id, offset) => { const next = moveEntry(session.content, kind, id, offset); if (next) await save(next) } }}>
      <div className={active ? 'local-editor-page--active' : undefined} key={version}>{children}</div>
      <aside aria-label="Local page editor" className={`local-editor-bar${active ? ' local-editor-bar--active' : ''}`}>
        <div className="local-editor-bar__actions">
          <button disabled={busy || !!selection} onClick={() => active ? setActive(false) : connect()} type="button">{busy ? 'Working…' : active ? 'Done editing' : 'Edit page'}</button>
          {active ? <>
            <span className="local-editor-bar__live">Local editor · live database</span>
            <button disabled={busy || !!selection} onClick={connect} type="button">Reload latest</button>
            <button disabled={busy || !!selection} onClick={() => setSelection({ kind: 'socials' })} type="button">Social links</button>
            <button disabled={busy || !!selection || !session.undo} onClick={() => { if (window.confirm('Undo the last saved change? This updates live content and keeps a recovery snapshot.')) save(null, session.undo) }} type="button">Undo last save</button>
          </> : null}
        </div>
        {message ? <p role="status">{message}</p> : null}
      </aside>
      {selection && session ? createPortal(<EditorDialog key={`${selection.kind}-${selection.id || 'new'}`} selection={selection} content={session.content} busy={busy} message={message} save={save} close={() => setSelection(null)} />, document.body) : null}
    </EditorContext.Provider>
  )
}

function EditorDialog({ selection, content, busy, message, save, close }) {
  const dialog = useRef(null)
  const dirty = useRef(false)
  const trigger = useRef(document.activeElement)
  const requestClose = () => { if (!busy && (!dirty.current || window.confirm('Discard these unsaved changes?'))) close() }

  useEffect(() => {
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    const beforeUnload = event => { if (dirty.current) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', beforeUnload)
    const previousTrigger = trigger.current
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      window.removeEventListener('beforeunload', beforeUnload)
      const target = previousTrigger?.isConnected ? previousTrigger : document.getElementById('main-content')
      target?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog className="editor-sheet" ref={dialog} aria-labelledby="editor-title" onCancel={event => { event.preventDefault(); requestClose() }}>
      <header className="editor-sheet__header"><h2 id="editor-title">{selection.add ? 'Add' : 'Edit'} {selection.kind}</h2><button type="button" disabled={busy} onClick={requestClose}>Close</button></header>
      <p className="editor-sheet__notice">Localhost only. Saving updates the live portfolio.</p>
      <EditorForm selection={selection} content={content} busy={busy} save={save} onChange={() => { dirty.current = true }} />
      <p className="editor-sheet__status" role="status">{message}</p>
    </dialog>
  )
}
