import { useContext } from 'react'
import { EditorContext } from '../../core/editorContext.js'

export function EditorSlot({ kind, id, add = false }) {
  const editor = useContext(EditorContext)
  if (!editor?.active) return null
  return (
    <div className="editor-slot" aria-label={`${kind} editing controls`}>
      <button type="button" disabled={editor.busy} onClick={() => editor.open({ kind, id, add })}>{add ? `Add ${kind}` : `Edit ${kind}`}</button>
      {id ? <>
        <button aria-label={`Move ${kind} up`} type="button" disabled={editor.busy} onClick={() => editor.move(kind, id, -1)}>Move up</button>
        <button aria-label={`Move ${kind} down`} type="button" disabled={editor.busy} onClick={() => editor.move(kind, id, 1)}>Move down</button>
      </> : null}
    </div>
  )
}
