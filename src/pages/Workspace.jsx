import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getHealth } from '../api/client'
import ResumeForm from '../components/ResumeForm.jsx'
import CoverLetterForm from '../components/CoverLetterForm.jsx'
import ResumeAnalyzer from '../components/ResumeAnalyzer.jsx'
import OutputPanel from '../components/OutputPanel.jsx'

const TABS = [
  { id: 'resume', n: '01', label: 'Build resume' },
  { id: 'cover', n: '02', label: 'Cover letter' },
  { id: 'analyze', n: '03', label: 'Analyze resume' },
]

export default function Workspace() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = TABS.some((t) => t.id === searchParams.get('tab')) ? searchParams.get('tab') : 'resume'
  const [tab, setTab] = useState(initialTab)
  const [generated, setGenerated] = useState(null)
  const [aiConfigured, setAiConfigured] = useState(null)

  useEffect(() => {
    getHealth()
      .then((h) => setAiConfigured(h.aiConfigured))
      .catch(() => setAiConfigured(null))
  }, [])

  function switchTab(next) {
    setTab(next)
    setGenerated(null)
    setSearchParams(next === 'resume' ? {} : { tab: next })
  }

  return (
    <div className="workspace">
      <div className="workspace__head">
        <div>
          <h1 className="workspace__title">Workspace</h1>
          <p className="workspace__sub">Draft, tailor, and score your resume</p>
        </div>
        <AiBadge configured={aiConfigured} />
      </div>

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab${tab === t.id ? ' tab--active' : ''}`}
            onClick={() => switchTab(t.id)}
          >
            <span className="tab__n">{t.n}</span> {t.label}
          </button>
        ))}
      </nav>

      <main className="layout">
        <section className="column column--form">
          {tab === 'resume' && <ResumeForm onGenerated={setGenerated} />}
          {tab === 'cover' && <CoverLetterForm onGenerated={setGenerated} />}
          {tab === 'analyze' && <ResumeAnalyzer />}
        </section>

        {tab !== 'analyze' && (
          <section className="column column--output">
            <OutputPanel generated={generated} />
          </section>
        )}
      </main>
    </div>
  )
}

function AiBadge({ configured }) {
  if (configured === null) {
    return <span className="badge badge--muted">checking…</span>
  }
  return configured ? (
    <span className="badge badge--live" title="An AI model is connected">
      <span className="badge-dot" /> AI connected
    </span>
  ) : (
    <span className="badge badge--offline" title="No API key set — using built-in templates">
      <span className="badge-dot" /> Template mode
    </span>
  )
}
