import { motion } from 'framer-motion'

/**
 * Fully animated brand panel for the auth pages. No photos, no fake data —
 * just floating cards/orbs built from the design system, echoing the same
 * "AI workspace" language used on the landing page hero.
 */
export default function AuthVisual({ mode = 'login' }) {
  return (
    <div className="auth-visual" aria-hidden="true">
      <motion.span
        className="auth-visual__orb auth-visual__orb--a"
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="auth-visual__orb auth-visual__orb--b"
        animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <motion.div
        className="auth-visual__card auth-visual__card--doc"
        initial={{ opacity: 0, y: 16, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="wv-bar"><span /><span /><span /></div>
        <div className="wv-name" />
        <div className="wv-line w80" />
        <div className="wv-line w60" />
        <div className="wv-line w40" />
      </motion.div>

      <motion.div
        className="auth-visual__card auth-visual__card--badge"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="auth-visual__badge-icon">✓</span>
        <div>
          <div className="auth-visual__badge-title">
            {mode === 'login' ? 'Pick up where you left off' : 'Free to get started'}
          </div>
          <div className="auth-visual__badge-sub">Your data stays in your account</div>
        </div>
      </motion.div>

      <motion.div
        className="auth-visual__ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      />

      <div className="auth-visual__caption">
        <span className="auth-visual__caption-kicker">Resume AI</span>
        <p>
          {mode === 'login'
            ? 'Your resumes, cover letters and analysis history — right where you left them.'
            : 'Build your first resume, cover letter, or check an existing one — free.'}
        </p>
      </div>
    </div>
  )
}
