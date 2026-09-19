import { Link } from 'react-router-dom'
import ThemeSwitcher from './ThemeSwitcher.jsx'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="nav__brand" style={{ marginRight: 0 }}>
            <span className="nav__mark" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M9 12.5h6M9 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M15 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="nav__brand-text">Resume AI</span>
          </div>
          <p className="site-footer__tagline">
            Draft resumes and cover letters from your own experience, then check them
            against a job description before you apply.
          </p>
          <ThemeSwitcher />
        </div>

        <div className="site-footer__col">
          <h4>Resources</h4>
          <a href="/#faq">FAQ</a>
          <a href="/#how-it-works">How it works</a>
        </div>

        <div className="site-footer__col">
          <h4>Data &amp; privacy</h4>
          <p className="site-footer__note">
            Your resumes and generated documents stay attached to your account. You can
            delete your account and everything in it from the Profile page at any time.
          </p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© {year} Resume AI</span>
        <span className="dot"></span>
        <span className="dot">·</span>
        <span>Resume &amp; Cover Letter Generator</span>
      </div>
    </footer>
  )
}
