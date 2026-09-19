import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { describeError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import AuthVisual from '../components/AuthVisual.jsx'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      const from = location.state?.from || '/workspace'
      navigate(from)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <AuthVisual mode="login" />
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={submit}>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Log in to pick up where you left off.</p>

          <label className="field">
            <span className="field__label">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn btn--primary btn--block" disabled={busy}>
            {busy ? 'Logging in…' : 'Log in'}
          </button>

          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
