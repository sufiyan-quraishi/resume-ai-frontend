import { useState } from 'react'
import { generateResume, describeError } from '../api/client'

const emptyExperience = () => ({ jobTitle: '', company: '', duration: '', location: '', responsibilities: '' })
const emptyEducation = () => ({ degree: '', institution: '', year: '', score: '' })
const emptyProject = () => ({ name: '', techStack: '', description: '' })

const LANGUAGES = ['English', 'Marathi', 'Hindi', 'Japanese', 'German', 'Spanish']

export default function ResumeForm({ onGenerated }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    targetRole: '',
    summary: '',
    skills: '',
    certifications: '',
    achievements: '',
    jobDescription: '',
    language: 'English',
  })
  const [experience, setExperience] = useState([emptyExperience()])
  const [education, setEducation] = useState([emptyEducation()])
  const [projects, setProjects] = useState([emptyProject()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  function updateRow(list, setList, index, key, value) {
    const next = list.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    setList(next)
  }

  function toList(text) {
    return text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  async function handleSubmit() {
    setError('')
    if (!form.fullName.trim()) {
      setError('Full name is required.')
      return
    }
    const payload = {
      ...form,
      skills: toList(form.skills),
      certifications: toList(form.certifications),
      achievements: toList(form.achievements),
      experience: experience
        .filter((e) => e.jobTitle || e.company)
        .map((e) => ({ ...e, responsibilities: toList(e.responsibilities) })),
      education: education.filter((e) => e.degree || e.institution),
      projects: projects.filter((p) => p.name),
    }
    setLoading(true)
    try {
      const data = await generateResume(payload)
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
        <h2>Your details</h2>
        <p>Fill what you have. Empty fields are skipped or sensibly filled.</p>
      </div>

      <Fieldset legend="Basics">
        <div className="grid grid-2">
          <Input label="Full name *" value={form.fullName} onChange={setField('fullName')} placeholder="Vaibhav Barde" />
          <Input label="Target role" value={form.targetRole} onChange={setField('targetRole')} placeholder="Senior Java Full Stack Developer" />
          <Input label="Email" value={form.email} onChange={setField('email')} placeholder="you@example.com" />
          <Input label="Phone" value={form.phone} onChange={setField('phone')} placeholder="+91 …" />
          <Input label="Location" value={form.location} onChange={setField('location')} placeholder="Pune, India" />
          <Input label="LinkedIn" value={form.linkedIn} onChange={setField('linkedIn')} placeholder="linkedin.com/in/…" />
          <Input label="GitHub" value={form.github} onChange={setField('github')} placeholder="github.com/…" />
          <Input label="Portfolio" value={form.portfolio} onChange={setField('portfolio')} placeholder="yoursite.dev" />
        </div>
        <label className="field">
          <span>Professional summary <em>(optional — generated if blank)</em></span>
          <textarea rows={3} value={form.summary} onChange={setField('summary')} placeholder="A few lines about you…" />
        </label>
      </Fieldset>

      <Fieldset
        legend="Experience"
        onAdd={() => setExperience([...experience, emptyExperience()])}
        addLabel="Add role"
      >
        {experience.map((row, i) => (
          <RepeatCard key={i} onRemove={experience.length > 1 ? () => setExperience(experience.filter((_, x) => x !== i)) : null}>
            <div className="grid grid-2">
              <Input label="Job title" value={row.jobTitle} onChange={(e) => updateRow(experience, setExperience, i, 'jobTitle', e.target.value)} />
              <Input label="Company" value={row.company} onChange={(e) => updateRow(experience, setExperience, i, 'company', e.target.value)} />
              <Input label="Duration" value={row.duration} onChange={(e) => updateRow(experience, setExperience, i, 'duration', e.target.value)} placeholder="Jun 2022 – Present" />
              <Input label="Location" value={row.location} onChange={(e) => updateRow(experience, setExperience, i, 'location', e.target.value)} />
            </div>
            <label className="field">
              <span>What you did <em>(one bullet per line)</em></span>
              <textarea rows={3} value={row.responsibilities} onChange={(e) => updateRow(experience, setExperience, i, 'responsibilities', e.target.value)} placeholder={'Built REST APIs serving 2,000+ users\nReduced build time by 40%'} />
            </label>
          </RepeatCard>
        ))}
      </Fieldset>

      <Fieldset
        legend="Projects"
        onAdd={() => setProjects([...projects, emptyProject()])}
        addLabel="Add project"
      >
        {projects.map((row, i) => (
          <RepeatCard key={i} onRemove={projects.length > 1 ? () => setProjects(projects.filter((_, x) => x !== i)) : null}>
            <div className="grid grid-2">
              <Input label="Name" value={row.name} onChange={(e) => updateRow(projects, setProjects, i, 'name', e.target.value)} />
              <Input label="Tech stack" value={row.techStack} onChange={(e) => updateRow(projects, setProjects, i, 'techStack', e.target.value)} placeholder="Spring Boot, React, MySQL" />
            </div>
            <label className="field">
              <span>Description</span>
              <textarea rows={2} value={row.description} onChange={(e) => updateRow(projects, setProjects, i, 'description', e.target.value)} />
            </label>
          </RepeatCard>
        ))}
      </Fieldset>

      <Fieldset
        legend="Education"
        onAdd={() => setEducation([...education, emptyEducation()])}
        addLabel="Add education"
      >
        {education.map((row, i) => (
          <RepeatCard key={i} onRemove={education.length > 1 ? () => setEducation(education.filter((_, x) => x !== i)) : null}>
            <div className="grid grid-2">
              <Input label="Degree" value={row.degree} onChange={(e) => updateRow(education, setEducation, i, 'degree', e.target.value)} placeholder="MCA" />
              <Input label="Institution" value={row.institution} onChange={(e) => updateRow(education, setEducation, i, 'institution', e.target.value)} />
              <Input label="Year" value={row.year} onChange={(e) => updateRow(education, setEducation, i, 'year', e.target.value)} placeholder="2020 – 2022" />
              <Input label="Score" value={row.score} onChange={(e) => updateRow(education, setEducation, i, 'score', e.target.value)} placeholder="8.4 CGPA" />
            </div>
          </RepeatCard>
        ))}
      </Fieldset>

      <Fieldset legend="Skills & extras">
        <div className="grid grid-2">
          <label className="field">
            <span>Skills <em>(one per line)</em></span>
            <textarea rows={4} value={form.skills} onChange={setField('skills')} placeholder={'Java\nSpring Boot\nReact\nMySQL'} />
          </label>
          <label className="field">
            <span>Certifications <em>(one per line)</em></span>
            <textarea rows={4} value={form.certifications} onChange={setField('certifications')} placeholder={'CEH v13\nOracle Java SE'} />
          </label>
        </div>
        <label className="field">
          <span>Achievements <em>(one per line)</em></span>
          <textarea rows={2} value={form.achievements} onChange={setField('achievements')} placeholder={'Outstanding Contribution Award'} />
        </label>
      </Fieldset>

      <Fieldset legend="Tailoring">
        <label className="field">
          <span>Job description <em>(optional — tailors the resume)</em></span>
          <textarea rows={4} value={form.jobDescription} onChange={setField('jobDescription')} placeholder="Paste the JD you're targeting…" />
        </label>
        <label className="field field--inline">
          <span>Language</span>
          <select value={form.language} onChange={setField('language')}>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
      </Fieldset>

      {error && <p className="error">{error}</p>}

      <button className="btn btn--primary btn--block" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating…' : 'Generate resume'}
      </button>
    </div>
  )
}

/* ---------- small presentational helpers ---------- */

function Fieldset({ legend, children, onAdd, addLabel }) {
  return (
    <fieldset className="fieldset">
      <div className="fieldset-head">
        <legend>{legend}</legend>
        {onAdd && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onAdd}>
            + {addLabel}
          </button>
        )}
      </div>
      {children}
    </fieldset>
  )
}

function RepeatCard({ children, onRemove }) {
  return (
    <div className="repeat-card">
      {onRemove && (
        <button type="button" className="repeat-remove" onClick={onRemove} aria-label="Remove">
          ×
        </button>
      )}
      {children}
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="text" {...props} />
    </label>
  )
}
