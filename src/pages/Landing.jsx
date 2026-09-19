import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'

const FEATURES = [
  {
    title: 'AI-drafted resumes',
    body: 'Describe your experience once. Get a clean, recruiter-ready draft in seconds, in your own words — not a generic template.',
  },
  {
    title: 'Tailored cover letters',
    body: 'Paste a job description and get a cover letter that actually references the role, not filler paragraphs.',
  },
  {
    title: 'ATS score check',
    body: 'Upload an existing resume and see exactly which keywords and sections are missing before you hit apply.',
  },
  {
    title: 'Export anywhere',
    body: 'Download as PDF, DOCX, or Markdown — pick whichever format the application portal actually accepts.',
  },
]

const STEPS = [
  { n: '01', title: 'Add your experience', body: 'Roles, projects, and skills — filled in once, reused everywhere.' },
  { n: '02', title: 'Generate a draft', body: 'The AI writes a first pass; you keep full control to edit every line.' },
  { n: '03', title: 'Export and apply', body: 'Download the format you need and send it off with confidence.' },
]

// Free-to-use Unsplash photos (Unsplash License — no attribution required,
// credited in comments below as good practice). Captions describe this
// product's real features only.
const FAQS = [
  {
    q: 'Is Resume AI free to use?',
    a: 'Yes — creating an account, building a resume, generating a cover letter, and analyzing an existing resume are all free.',
  },
  {
    q: 'What file formats can I export?',
    a: 'Generated documents can be exported as PDF, DOCX, or Markdown.',
  },
  {
    q: 'Do I need to upload a resume to use the builder?',
    a: 'No. The builder works from a form — you fill in your experience, and the AI drafts a resume from it. Uploading an existing resume is only needed if you want it analyzed.',
  },
  {
    q: 'What happens if the AI model isn\u2019t connected?',
    a: 'The workspace shows an "AI connected" or "Template mode" badge. In template mode, generation still works using built-in templates instead of a live model.',
  },
  {
    q: 'Where does my data go?',
    a: 'Your account, resumes, and generated documents stay attached to your account. You can delete your account at any time from the Profile page.',
  },
]

const SHOWCASE = [
  {
    src: '/images/resume.png',
    alt: 'Person typing on a laptop at a desk',
    caption: 'Draft your resume from what you already know about your own work.',
    credit: 'Glenn Carstens-Peters',
  },
  {
    src: '/images/coverletter.png',
    alt: 'Person typing on a laptop keyboard, close up',
    caption: 'Paste a job description and tailor your cover letter to it.',
    credit: 'Benjamin Dada',
  },
  {
    src: '/images/matchrole.png',
    alt: 'Two people reviewing a resume on a laptop together',
    caption: 'Check your resume against the role before you hit send.',
    credit: 'KOBU Agency',
  },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="landing">
      <section className="hero">
        <motion.div
          className="hero__copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero__kicker">Free resume &amp; cover letter tool</p>
          <h1 className="hero__title">
            Write a resume that gets past the filter <em>and</em> the recruiter.
          </h1>
          <p className="hero__sub">
            Resume AI drafts your resume and cover letter from what you already know about your own
            work, then checks it against the job description before you apply.
          </p>
          <div className="hero__cta-row">
            <Link to={user ? '/workspace' : '/register'} className="btn btn--primary btn--lg">
              {user ? 'Go to workspace' : 'Create your resume'}
            </Link>
            <Link to="/workspace?tab=analyze" className="btn btn--ghost btn--lg">
              Check an existing resume
            </Link>
          </div>
          <div className="hero__trust">
            <span>No design skills needed</span>
            <span className="hero__trust-dot" />
            <span>PDF, DOCX &amp; Markdown export</span>
            <span className="hero__trust-dot" />
            <span>Your data stays in your account</span>
          </div>
        </motion.div>

        <motion.div
          className="hero__mock"
          initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <WorkspaceVisual />
        </motion.div>
      </section>

      <section className="feature-list">
        <h2 className="section-title">Everything you need, nothing you don't</h2>
        <div className="feature-list__grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-item"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <span className="feature-item__index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="steps" id="how-it-works">
        <h2 className="section-title">How it works</h2>
        <div className="steps__row">
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <span className="step__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="showcase">
        <h2 className="section-title">Built for how people actually apply</h2>
        <div className="showcase__grid">
          {SHOWCASE.map((s) => (
            <motion.div
              className="showcase-card"
              key={s.caption}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
            >
              {/* Photo by {s.credit} on Unsplash — free to use under the Unsplash License */}
              <img src={s.src} alt={s.alt} loading="lazy" />
              <div className="showcase-card__overlay">
                <span className="showcase-card__caption">{s.caption}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-banner__inner">
          <h2>Your next application deserves a real draft, not a blank page.</h2>
          <Link to={user ? '/workspace' : '/register'} className="btn btn--primary btn--lg">
            {user ? 'Open workspace' : 'Get started — it’s free'}
          </Link>
        </div>
      </section>

      <section className="faq" id="faq">
        <h2 className="section-title">Frequently asked</h2>
        {FAQS.map((f) => (
          <details className="faq-item" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </div>
  )
}

/**
 * Decorative product visualization — illustrates the shape of the real
 * Workspace UI (resume draft, ATS score, JD match, a suggestion) without
 * presenting any of it as live data.
 */
function WorkspaceVisual() {
  return (
    <div className="workspace-visual" aria-hidden="true">
      <motion.div
        className="wv-card wv-main"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <div className="wv-bar"><span /><span /><span /></div>
        <div className="wv-name" />
        <div className="wv-line w40" />
        <div className="wv-section" />
        <div className="wv-line wfull" />
        <div className="wv-line w80" />
        <div className="wv-line w60" />
        <div className="wv-section" />
        <div className="wv-line wfull" />
        <div className="wv-line w40" />
      </motion.div>

      <motion.div
        className="wv-card wv-score"
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <span className="wv-score-num">92</span>
        <span className="wv-score-label">ATS score</span>
      </motion.div>

      <motion.div
        className="wv-card wv-match"
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <div className="wv-match-row"><span>JD match</span><span>74%</span></div>
        <div className="wv-match-bar"><span style={{ width: '74%' }} /></div>
        <div className="wv-match-row"><span>Keywords</span><span>11/15</span></div>
        <div className="wv-match-bar"><span style={{ width: '68%' }} /></div>
      </motion.div>

      <motion.div
        className="wv-card wv-suggest"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <span className="dot" />
        <span>Add a metric to your most recent role — quantified impact scores higher.</span>
      </motion.div>
    </div>
  )
}
