import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'

const CAPABILITIES = [
  {
    title: 'Resume builder',
    body: 'Fill in your experience, projects, education and skills once. Resume AI drafts a clean, recruiter-ready resume from it — optionally tailored to a job description you paste in.',
  },
  {
    title: 'Cover letter generator',
    body: 'Give it the role, the company, and the job description, and it writes a cover letter that actually references the posting instead of generic filler.',
  },
  {
    title: 'Resume analyzer',
    body: 'Upload an existing resume (PDF/TXT) or paste the text. Get an ATS-style score, a job-description match score, passed/failed checks, matched and missing keywords, and concrete suggestions.',
  },
  {
    title: 'Export & edit',
    body: 'Every generated document opens in an editable preview. Export to PDF, DOCX, or Markdown — whichever format the application portal expects.',
  },
]

const STACK = [
  { label: 'Frontend', value: 'React + Vite, React Router, Framer Motion' },
  { label: 'Backend', value: 'Spring Boot' },
  { label: 'Auth', value: 'Email + password, with email OTP verification' },
  { label: 'AI status', value: 'The workspace shows whether a live AI model is connected, or whether it is running on built-in templates' },
]

export default function About() {
  const { user } = useAuth()

  return (
    <div className="about-page">
      <motion.section
        className="about-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <p className="hero__kicker">About Resume AI</p>
        <h1 className="about-hero__title">A career workspace built around three things you actually need.</h1>
        <p className="about-hero__sub">
          Draft a resume, tailor a cover letter, and check your existing resume against a job
          description — all from your own experience, with nothing invented on your behalf.
        </p>
        <div className="hero__cta-row">
          <Link to={user ? '/workspace' : '/register'} className="btn btn--primary btn--lg">
            {user ? 'Open workspace' : 'Get started'}
          </Link>
          <Link to="/" className="btn btn--ghost btn--lg">Back to home</Link>
        </div>
      </motion.section>

      <section className="about-section">
        <h2 className="section-title">What it does</h2>
        <div className="feature-list__grid">
          {CAPABILITIES.map((c, i) => (
            <motion.div
              key={c.title}
              className="feature-item"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <span className="feature-item__index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="about-section about-section--split">
        <div>
          <h2 className="section-title about-section__title-left">How it's built</h2>
          <dl className="about-stack">
            {STACK.map((s) => (
              <div className="about-stack__row" key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="surface-card">
          <h3 className="surface-card__title">Your data</h3>
          <p className="surface-card__body">
            Your account, resumes, and generated documents stay attached to your account. You can
            edit any generated document before exporting it, and you can delete your account and
            profile photo permanently from the Profile page at any time.
          </p>
        </div>
      </section>
    </div>
  )
}
