import { useState } from 'react'
import { generateCoverLetter, describeError } from '../api/client'

const TONES = ['professional', 'enthusiastic', 'formal']
const LANGUAGES = ['English', 'Marathi', 'Hindi', 'Japanese', 'German', 'Spanish']

export default function CoverLetterForm({ onGenerated }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    hiringManager: '',
    jobTitle: '',
    yearsOfExperience: '',
    skills: '',
    highlights: '',
    jobDescription: '',
    tone: 'professional',
    language: 'English',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const toList = (t) => t.split('\n').map((s) => s.trim()).filter(Boolean)

  async function handleSubmit() {
    setError('')
    if (!form.fullName.trim()) return setError('Full name is required.')
    if (!form.companyName.trim()) return setError('Company name is required.')
    if (!form.jobDescription.trim()) return setError('Job description is required.')

    const payload = {
      ...form,
      skills: toList(form.skills),
      highlights: toList(form.highlights),
    }
    setLoading(true)
    try {
      const data = await generateCoverLetter(payload)
      onGenerated(data)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Cover letter</h2>
        <p>Tailored to a specific role and company.</p>
      </div>

      <div className="grid grid-2">
        <Field label="Full name *">
          <input value={form.fullName} onChange={setField('fullName')} placeholder="Vaibhav Barde" />
        </Field>
        <Field label="Applying for (role)">
          <input value={form.jobTitle} onChange={setField('jobTitle')} placeholder="Technical Lead" />
        </Field>
        <Field label="Company *">
          <input value={form.companyName} onChange={setField('companyName')} placeholder="Acme Corp" />
        </Field>
        <Field label="Hiring manager">
          <input value={form.hiringManager} onChange={setField('hiringManager')} placeholder="Ms. Sharma (optional)" />
        </Field>
        <Field label="Email">
          <input value={form.email} onChange={setField('email')} placeholder="you@example.com" />
        </Field>
        <Field label="Phone">
          <input value={form.phone} onChange={setField('phone')} placeholder="+91 …" />
        </Field>
        <Field label="Years of experience">
          <input value={form.yearsOfExperience} onChange={setField('yearsOfExperience')} placeholder="6" />
        </Field>
        <Field label="Tone">
          <select value={form.tone} onChange={setField('tone')}>
            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Key skills (one per line)">
        <textarea rows={3} value={form.skills} onChange={setField('skills')} placeholder={'Java\nSpring Boot\nMicroservices'} />
      </Field>

      <Field label="Highlights to weave in (one per line)">
        <textarea rows={3} value={form.highlights} onChange={setField('highlights')} placeholder={'led a team of 5 engineers\nreduced cloud costs by 25%'} />
      </Field>

      <Field label="Job description *">
        <textarea rows={5} value={form.jobDescription} onChange={setField('jobDescription')} placeholder="Paste the JD here…" />
      </Field>

      <Field label="Language" inline>
        <select value={form.language} onChange={setField('language')}>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </Field>

      {error && <p className="error">{error}</p>}

      <button className="btn btn--primary btn--block" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating…' : 'Generate cover letter'}
      </button>
    </div>
  )
}

function Field({ label, inline, children }) {
  return (
    <label className={`field${inline ? ' field--inline' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}
