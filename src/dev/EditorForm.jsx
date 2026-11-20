import { useState } from 'react'
import { cloneContent, commaList, newProject, paragraphs, projectForEditing, putProject, removeEntry } from './editor-model.mjs'

function Field({ label, value, onChange, multiline = false, ...props }) {
  const Control = multiline ? 'textarea' : 'input'
  return <label className="editor-field"><span>{label}</span><Control value={value ?? ''} onChange={event => onChange(event.target.value)} {...props} /></label>
}

export function EditorForm({ selection, content, busy, save, onChange }) {
  const { kind, id, add } = selection
  const [value, setValue] = useState(() => {
    if (kind === 'project') return add ? newProject() : projectForEditing(content, id)
    if (kind === 'experience') return add ? { id: `role-${crypto.randomUUID()}`, period: '', title: '', company: '', companyUrl: '', summary: '', technologies: [] } : cloneContent(content.experienceSection.entries.find(entry => entry.id === id))
    if (kind === 'socials') return { links: cloneContent(content.socialLinks) }
    return { name: content.profileContent.name, tagline: content.siteBrand.tagline, introduction: content.profileContent.introduction, location: content.siteBrand.location, about: content.profileContent.about, resumeUrl: content.siteBrand.resumes?.[0]?.url ?? '' }
  })
  const [advanced, setAdvanced] = useState(() => kind === 'project' ? JSON.stringify({ stack: value.stack ?? [], evidence: value.evidence ?? [], screenshots: value.screenshots ?? [], related: value.related ?? [] }, null, 2) : '')
  const [error, setError] = useState('')
  const change = (key, next) => { setValue(previous => ({ ...previous, [key]: next })); onChange() }
  const textList = (label, key) => <Field label={label} value={value[key].join(',')} onChange={text => change(key, text.split(','))} />
  const updateList = (key, index, item) => change(key, value[key].map((entry, position) => position === index ? item : entry))
  const moveLink = (index, offset) => {
    const links = [...value.links]
    ;[links[index], links[index + offset]] = [links[index + offset], links[index]]
    change('links', links)
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      let next = cloneContent(content)
      if (kind === 'project') {
        const extra = JSON.parse(advanced)
        if (!extra || ['stack', 'evidence', 'screenshots', 'related'].some(key => !Array.isArray(extra[key]))) throw new Error('Advanced project details must contain arrays for stack, evidence, screenshots, and related.')
        next = putProject(next, { ...value, ...extra, tags: commaList(value.tags.join(',')), meta: commaList((value.meta || []).join(',')) }, id)
      } else if (kind === 'experience') {
        const entry = { ...value, technologies: commaList(value.technologies.join(',')) }
        if (add) next.experienceSection.entries.unshift(entry)
        else next.experienceSection.entries = next.experienceSection.entries.map(item => item.id === id ? entry : item)
      } else if (kind === 'socials') next.socialLinks = value.links
      else if (kind === 'about') next.profileContent.about = paragraphs(value.about.join('\n\n'))
      else {
        Object.assign(next.profileContent, { name: value.name, introduction: value.introduction })
        Object.assign(next.siteBrand, { name: value.name, tagline: value.tagline, location: value.location })
        if (next.siteBrand.resumes?.[0]) next.siteBrand.resumes[0].url = value.resumeUrl
        else if (value.resumeUrl) next.siteBrand.resumes = [{ label: 'View résumé', url: value.resumeUrl }]
      }
      await save(next)
    } catch (failure) { setError(failure instanceof SyntaxError ? 'Check the JSON in Advanced project details.' : failure.message) }
  }

  const deleteEntry = async () => {
    if (!window.confirm(`Delete this ${kind}? This changes the LIVE portfolio. You can undo the last save from the editor bar.`)) return
    try { await save(removeEntry(content, kind, id)) } catch (failure) { setError(failure.message) }
  }

  return (
    <form className="editor-form" onSubmit={submit} onChange={onChange}>
      <fieldset disabled={busy}>
        {kind === 'profile' ? <>
          <Field label="Name" value={value.name} onChange={text => change('name', text)} required />
          <Field label="Role" value={value.tagline} onChange={text => change('tagline', text)} required />
          <Field label="Introduction" value={value.introduction} onChange={text => change('introduction', text)} multiline rows={3} />
          <Field label="Location" value={value.location} onChange={text => change('location', text)} />
          <Field label="Résumé URL or stable asset reference" value={value.resumeUrl} onChange={text => change('resumeUrl', text)} />
        </> : null}
        {kind === 'about' ? <Field label="About — separate paragraphs with a blank line" value={value.about.join('\n\n')} onChange={text => change('about', text.split(/\n\s*\n/))} multiline rows={14} /> : null}
        {kind === 'experience' ? <>
          <Field label="Role title (use → between previous roles)" value={value.title} onChange={text => change('title', text)} required />
          <Field label="Company" value={value.company} onChange={text => change('company', text)} required />
          <Field label="Company URL" value={value.companyUrl} onChange={text => change('companyUrl', text)} />
          <Field label="Period" value={value.period} onChange={text => change('period', text)} placeholder="Mar 2025 — Present" required />
          <Field label="Summary" value={value.summary} onChange={text => change('summary', text)} multiline rows={6} />
          {textList('Technologies — comma separated', 'technologies')}
        </> : null}
        {kind === 'socials' ? <>
          {value.links.map((link, index) => <div className="editor-repeat" key={index}>
            <Field label="Label" value={link.label} onChange={text => updateList('links', index, { ...link, label: text })} required />
            <Field label="Link" value={link.href} onChange={text => updateList('links', index, { ...link, href: text })} required />
            <label className="editor-field"><span>Icon</span><select value={link.icon} onChange={event => updateList('links', index, { ...link, icon: event.target.value })}>{['github', 'linkedin', 'mail'].map(icon => <option key={icon}>{icon}</option>)}</select></label>
            <div className="editor-repeat__actions">
              <button type="button" disabled={index === 0} onClick={() => moveLink(index, -1)}>Move link up</button>
              <button type="button" disabled={index === value.links.length - 1} onClick={() => moveLink(index, 1)}>Move link down</button>
              <button type="button" onClick={() => change('links', value.links.filter((_, position) => position !== index))}>Remove link</button>
            </div>
          </div>)}
          <button type="button" onClick={() => change('links', [...value.links, { label: '', href: '', icon: 'github' }])}>Add link</button>
        </> : null}
        {kind === 'project' ? <>
          <Field label="Project title" value={value.title} onChange={text => change('title', text)} required />
          {add ? <Field label="Slug (optional — generated from title)" value={value.slug} onChange={text => change('slug', text)} /> : <p className="editor-form__hint">Project address: /projects/{id}</p>}
          <Field label="Year or date" value={value.date} onChange={text => change('date', text)} placeholder="2026" required />
          <Field label="Category" value={value.category} onChange={text => change('category', text)} required />
          <Field label="Project-list description" value={value.excerpt} onChange={text => change('excerpt', text)} multiline rows={3} />
          <Field label="Case-study introduction" value={value.lede} onChange={text => change('lede', text)} multiline rows={3} />
          {textList('Tags — comma separated', 'tags')}
          <Field label="Project metadata — comma separated" value={(value.meta || []).join(',')} onChange={text => change('meta', text.split(','))} />
          <Field label="Cover URL or stable asset reference" value={value.image.src} onChange={text => change('image', { ...value.image, src: text })} />
          <Field label="Cover description" value={value.image.alt} onChange={text => change('image', { ...value.image, alt: text })} />
          <label className="editor-checkbox"><input type="checkbox" checked={value.featured} onChange={event => change('featured', event.target.checked)} />Include in homepage selection (current-year projects only)</label>
          <h3>Project links</h3>
          {(value.links || []).map((link, index) => <div className="editor-repeat" key={index}>
            <Field label="Link label" value={link.label} onChange={text => updateList('links', index, { ...link, label: text })} required />
            <Field label="URL" value={link.href} onChange={text => updateList('links', index, { ...link, href: text })} required />
            <button type="button" onClick={() => change('links', value.links.filter((_, position) => position !== index))}>Remove link</button>
          </div>)}
          <button type="button" onClick={() => change('links', [...(value.links || []), { label: '', href: '' }])}>Add project link</button>
          <h3>Case-study blocks</h3>
          {value.sections.map((section, index) => <div className="editor-repeat" key={section.id}>
            <Field label="Block heading" value={section.heading} onChange={text => updateList('sections', index, { ...section, heading: text })} required />
            <Field label="Paragraphs — blank line between paragraphs" value={section.paragraphs.join('\n\n')} onChange={text => updateList('sections', index, { ...section, paragraphs: text.split(/\n\s*\n/) })} multiline rows={6} />
            <Field label="List items — one per line" value={(section.list || []).join('\n')} onChange={text => updateList('sections', index, { ...section, list: text.split('\n') })} multiline rows={3} />
            <div className="editor-repeat__actions">
              <button type="button" disabled={index === 0} onClick={() => { const items = [...value.sections]; [items[index - 1], items[index]] = [items[index], items[index - 1]]; change('sections', items) }}>Move block up</button>
              <button type="button" disabled={index === value.sections.length - 1} onClick={() => { const items = [...value.sections]; [items[index + 1], items[index]] = [items[index], items[index + 1]]; change('sections', items) }}>Move block down</button>
              <button type="button" onClick={() => change('sections', value.sections.filter((_, position) => position !== index))}>Remove block</button>
            </div>
          </div>)}
          <button type="button" onClick={() => change('sections', [...value.sections, { id: `section-${crypto.randomUUID()}`, heading: '', paragraphs: [] }])}>Add text block</button>
          <details className="editor-advanced"><summary>Advanced project details</summary><p>Stack, evidence, screenshots, and related project slugs. Existing values are preserved.</p><Field label="Structured details (JSON)" value={advanced} onChange={setAdvanced} multiline rows={16} spellCheck={false} /></details>
        </> : null}
        {error ? <p role="alert" className="editor-form__error">{error}</p> : null}
        <footer className="editor-form__footer">
          <button className="editor-save" type="submit">{busy ? 'Saving…' : 'Save changes'}</button>
          {!add && ['experience', 'project'].includes(kind) ? <button type="button" onClick={deleteEntry}>Delete {kind}</button> : null}
        </footer>
      </fieldset>
    </form>
  )
}
