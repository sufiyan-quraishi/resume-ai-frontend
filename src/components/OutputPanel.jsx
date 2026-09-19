import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import { exportDocument, describeError } from '../api/client'

marked.setOptions({ breaks: true, gfm: true })

export default function OutputPanel({ generated }) {
  const [content, setContent] = useState('')
  const [view, setView] = useState('preview') // 'preview' | 'edit'
  const [busy, setBusy] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setContent(generated?.markdown || '')
    setView('preview')
    setError('')
  }, [generated])

  const html = useMemo(() => marked.parse(content || ''), [content])

  const fileName = useMemo(() => {
    const firstHeading = (content.match(/^#\s+(.+)$/m) || [])[1]
    const base = firstHeading || (generated?.type === 'COVER_LETTER' ? 'cover-letter' : 'resume')
    const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return generated?.type === 'COVER_LETTER' ? `${slug}-cover-letter` : `${slug}-resume`
  }, [content, generated])

  async function doExport(format) {
    setError('')
    setBusy(format)
    try {
      await exportDocument(format, content, fileName)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy('')
    }
  }

  function copy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  if (!generated) {
    return (
      <div className="output output--empty">
        <div className="empty-card">
          <div className="empty-mark">“ ”</div>
          <h3>Your document appears here</h3>
          <p>Fill the form and generate. You can edit the result and export it as PDF, DOCX, or Markdown.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="output">
      <div className="output-bar">
        <div className="output-title">
          {generated.type === 'COVER_LETTER' ? 'Cover letter' : 'Resume'}
          <span className={`pill ${generated.aiGenerated ? 'pill--ai' : 'pill--tpl'}`}>
            {generated.aiGenerated ? 'AI' : 'template'}
          </span>
        </div>
        <div className="seg seg--sm">
          <button className={`seg-btn${view === 'preview' ? ' seg-btn--on' : ''}`} onClick={() => setView('preview')}>
            Preview
          </button>
          <button className={`seg-btn${view === 'edit' ? ' seg-btn--on' : ''}`} onClick={() => setView('edit')}>
            Edit
          </button>
        </div>
      </div>

      {view === 'edit' ? (
        <textarea className="editor" value={content} onChange={(e) => setContent(e.target.value)} spellCheck={false} />
      ) : (
        <div className="preview markdown" dangerouslySetInnerHTML={{ __html: html }} />
      )}

      {error && <p className="error">{error}</p>}

      <div className="export-bar">
        <button className="btn btn--ghost btn--sm" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <span className="spacer" />
        <button className="btn btn--outline btn--sm" onClick={() => doExport('markdown')} disabled={!!busy}>
          {busy === 'markdown' ? '…' : 'Markdown'}
        </button>
        <button className="btn btn--outline btn--sm" onClick={() => doExport('docx')} disabled={!!busy}>
          {busy === 'docx' ? '…' : 'DOCX'}
        </button>
        <button className="btn btn--primary btn--sm" onClick={() => doExport('pdf')} disabled={!!busy}>
          {busy === 'pdf' ? '…' : 'PDF'}
        </button>
      </div>
    </div>
  )
}
