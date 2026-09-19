import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { registerAccount, resendOtp, describeError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import AuthVisual from '../components/AuthVisual.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { verifyOtp } = useAuth()
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function submitForm(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      await registerAccount({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      setInfo(`We emailed a 6-digit code to ${form.email}`)
      setStep('otp')
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(false)
    }
  }

  async function submitOtp(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await verifyOtp(form.email, otp)
      navigate('/profile')
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(false)
    }
  }

  async function handleResend() {
    setError('')
    setInfo('')
    try {
      await resendOtp(form.email)
      setInfo('New code sent — check your inbox')
    } catch (err) {
      setError(describeError(err))
    }
  }

  return (
    <div className="auth-page">
      <AuthVisual mode="register" />
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.form
              key="form"
              onSubmit={submitForm}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-sub">Free to use — build your first resume in minutes.</p>

              <Field label="Full name">
                <input required value={form.fullName} onChange={update('fullName')} placeholder="Aditi Sharma" />
              </Field>
              <Field label="Email">
                <input required type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
              </Field>
              <Field label="Phone (optional)">
                <input value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Password">
                <input required type="password" minLength={6} value={form.password} onChange={update('password')} placeholder="At least 6 characters" />
              </Field>
              <Field label="Confirm password">
                <input required type="password" value={form.confirm} onChange={update('confirm')} placeholder="Re-enter password" />
              </Field>

              {error && <p className="auth-error">{error}</p>}

              <button className="btn btn--primary btn--block" disabled={busy}>
                {busy ? 'Creating account…' : 'Create account'}
              </button>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              onSubmit={submitOtp}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="auth-title">Verify your email</h1>
              <p className="auth-sub">{info || `Enter the 6-digit code sent to ${form.email}`}</p>

              <Field label="Verification code">
                <input
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="otp-input"
                />
              </Field>

              {error && <p className="auth-error">{error}</p>}

              <button className="btn btn--primary btn--block" disabled={busy || otp.length !== 6}>
                {busy ? 'Verifying…' : 'Verify & continue'}
              </button>

              <p className="auth-switch">
                Didn't get a code?{' '}
                <button type="button" className="link-btn" onClick={handleResend}>Resend code</button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
    </label>
  )
}
