import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import ThemeSwitcher from './ThemeSwitcher.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__brand" onClick={() => setMenuOpen(false)}>
          <span className="nav__mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9 12.5h6M9 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M15 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="nav__brand-text">Resume AI</span>
        </Link>

        <nav className={`nav__links${menuOpen ? ' nav__links--open' : ''}`}>
          <NavLink to="/workspace" className="nav__link" onClick={() => setMenuOpen(false)}>
            Build
          </NavLink>
          <NavLink to="/workspace?tab=cover" className="nav__link" onClick={() => setMenuOpen(false)}>
            Cover letters
          </NavLink>
          <NavLink to="/workspace?tab=analyze" className="nav__link" onClick={() => setMenuOpen(false)}>
            Analyze
          </NavLink>
          <NavLink to="/about" className="nav__link" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
        </nav>

        <div className="nav__actions">
          <ThemeSwitcher />
          {user ? (
            <div className="nav__user">
              <button className="nav__avatar-btn" onClick={() => setUserMenuOpen((o) => !o)}>
                <Avatar user={user} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="nav__user-menu"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <p className="nav__user-name">{user.fullName}</p>
                    <p className="nav__user-email">{user.email}</p>
                    <Link to="/profile" className="nav__user-item" onClick={() => setUserMenuOpen(false)}>
                      View profile
                    </Link>
                    <button className="nav__user-item nav__user-item--danger" onClick={handleLogout}>
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="nav__auth-buttons">
              <Link to="/login" className="btn btn--ghost btn--sm">Log in</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Get started</Link>
            </div>
          )}
          <button className="nav__burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}

export function Avatar({ user, size = 36 }) {
  const initials = (user?.fullName || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (user?.photoUrl) {
    return (
      <img
        className="avatar-img"
        src={user.photoUrl}
        alt={user.fullName}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span className="avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </span>
  )
}
