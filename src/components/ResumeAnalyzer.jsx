import { useState } from 'react'
import { analyzeResumeFile, analyzeResumeText, describeError } from '../api/client'

export default function ResumeAnalyzer() {
  const [mode, setMode] = useState('upload') // 'upload' | 'paste'
  const [file, setFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAnalyze() {
    setError('')
    setResult(null)
    try {
      setLoading(true)
      let data
      if (mode === 'upload') {
        if (!file) return setError('Choose a PDF or TXT file first.')
        data = await analyzeResumeFile(file, jobDescription)
      } else {
        if (!resumeText.trim()) return setError('Paste your resume text first.')
        data = await analyzeResumeText(resumeText, jobDescription)
      }
      setResult(data)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="analyzer">
      <div className="panel">
        <div className="panel-head">
          <h2>Analyze resume</h2>
          <p>Score an existing resume and tailor it to a job description.</p>
        </div>

        <div className="seg">
          <button className={`seg-btn${mode === 'upload' ? ' seg-btn--on' : ''}`} onClick={() => setMode('upload')}>
            Upload file
          </button>
          <button className={`seg-btn${mode === 'paste' ? ' seg-btn--on' : ''}`} onClick={() => setMode('paste')}>
            Paste text
          </button>
        </div>

        {mode === 'upload' ? (
          <label className="dropzone">
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <span className="dropzone-icon">↑</span>
            <span>{file ? file.name : 'Click to choose a PDF or TXT resume'}</span>
          </label>
        ) : (
          <label className="field">
            <span>Resume text</span>
            <textarea rows={8} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your full resume text…" />
          </label>
        )}

        <label className="field">
          <span>Job description <em>(optional — enables keyword matching)</em></span>
          <textarea rows={5} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the target JD…" />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn btn--primary btn--block" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>

      {result && <AnalysisReport result={result} />}
    </div>
  )
}

function AnalysisReport({ result }) {
  return (
    <div className="panel report">
      <div className="report-scores">
        <ScoreRing label="ATS score" value={result.overallScore} />
        {result.jobDescriptionProvided && (
          <ScoreRing label="JD match" value={result.keywordMatchScore} small />
        )}
        <div className="report-meta">
          <div className="meta-num">{result.wordCount}</div>
          <div className="meta-label">words</div>
        </div>
      </div>

      <div className="checks">
        {result.checks.map((c, i) => (
          <div key={i} className={`check ${c.passed ? 'check--pass' : 'check--fail'}`}>
            <span className="check-icon">{c.passed ? '✓' : '!'}</span>
            <div>
              <div className="check-name">
                {c.name}
                {!c.passed && <span className={`sev sev--${c.severity}`}>{c.severity}</span>}
              </div>
              <div className="check-msg">{c.message}</div>
            </div>
          </div>
        ))}
      </div>

      {result.jobDescriptionProvided && (
        <div className="keyword-grid">
          <div>
            <h3 className="kw-title kw-title--matched">Matched ({result.matchedKeywords.length})</h3>
            <div className="chips">
              {result.matchedKeywords.length === 0 && <span className="muted">None yet</span>}
              {result.matchedKeywords.slice(0, 30).map((k) => (
                <span key={k} className="chip chip--matched">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="kw-title kw-title--missing">Missing ({result.missingKeywords.length})</h3>
            <div className="chips">
              {result.missingKeywords.length === 0 && <span className="muted">Nothing major</span>}
              {result.missingKeywords.map((k) => (
                <span key={k} className="chip chip--missing">{k}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div className="suggestions">
          <h3>Suggestions</h3>
          <ul>
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ScoreRing({ label, value, small }) {
  const size = small ? 96 : 132
  const stroke = small ? 9 : 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  const color = value >= 75 ? 'var(--green)' : value >= 50 ? 'var(--amber)' : 'var(--red)'

  return (
    <div className="ring-wrap">
      <svg width={size} height={size} className="ring">
        <circle cx={size / 2} cy={size / 2} r={r} style={{ stroke: 'var(--line-strong)' }} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          style={{ stroke: color }}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="50%" dy="0.1em" textAnchor="middle" className="ring-value" style={{ fill: color }}>
          {value}
        </text>
      </svg>
      <div className="ring-label">{label}</div>
    </div>
  )
}
