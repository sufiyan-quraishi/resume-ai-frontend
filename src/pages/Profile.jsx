import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { updateProfile, uploadProfilePhoto, deleteAccount, describeError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import { Avatar } from '../components/Navbar.jsx'

export default function Profile() {
  const { user, updateLocalUser, logout } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    headline: user?.headline || '',
  })
  const [savedMsg, setSavedMsg] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [photoError, setPhotoError] = useState('')

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function saveProfile(e) {
    e.preventDefault()
    setError('')
    setSavedMsg('')
    setBusy(true)
    try {
      const updated = await updateProfile(form)
      updateLocalUser(updated)
      setSavedMsg('Saved')
      setTimeout(() => setSavedMsg(''), 2000)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(false)
    }
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoError('')
    setPhotoBusy(true)
    try {
      const updated = await uploadProfilePhoto(file)
      updateLocalUser(updated)
    } catch (err) {
      setPhotoError(describeError(err))
    } finally {
      setPhotoBusy(false)
      e.target.value = ''
    }
  }

  async function confirmDelete(e) {
    e.preventDefault()
    setDeleteError('')
    setDeleteBusy(true)
    try {
      await deleteAccount(deletePassword)
      logout()
      navigate('/')
    } catch (err) {
      setDeleteError(describeError(err))
    } finally {
      setDeleteBusy(false)
    }
  }

  if (!user) return null

  return (
    <div className="profile-page">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="profile-header">
          <div className="profile-photo">
            <Avatar user={user} size={96} />
            <button
              type="button"
              className="profile-photo__edit"
              onClick={() => fileRef.current?.click()}
              disabled={photoBusy}
              title="Change photo"
            >
              {photoBusy ? '…' : '✎'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={handlePhotoChange}
            />
          </div>
          <div>
            <h1 className="profile-header__name">{user.fullName}</h1>
            <p className="profile-header__email">{user.email}</p>
            <p className="profile-header__meta">
              Member since {new Date(user.createdAt).toLocaleDateString()}
              {user.emailVerified && <span className="badge badge--live badge--sm"><span className="badge-dot" /> Verified</span>}
            </p>
          </div>
        </div>
        {photoError && <p className="auth-error">{photoError}</p>}

        <div className="profile-grid">
          <form className="surface-card" onSubmit={saveProfile}>
            <h2 className="surface-card__title">Personal information</h2>

            <label className="field">
              <span className="field__label">Full name</span>
              <input value={form.fullName} onChange={update('fullName')} />
            </label>
            <label className="field">
              <span className="field__label">Phone</span>
              <input value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" />
            </label>
            <label className="field">
              <span className="field__label">Headline</span>
              <input value={form.headline} onChange={update('headline')} placeholder="Junior Full-Stack Developer" />
            </label>
            <label className="field">
              <span className="field__label">Email</span>
              <input value={user.email} disabled />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <div className="profile-form-actions">
              <button className="btn btn--primary" disabled={busy}>
                {busy ? 'Saving…' : 'Save changes'}
              </button>
              <AnimatePresence>
                {savedMsg && (
                  <motion.span
                    className="save-confirm"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    ✓ {savedMsg}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>

          <div className="surface-card surface-card--danger">
            <h2 className="surface-card__title">Delete account</h2>
            <p className="surface-card__body">
              This permanently deletes your account and profile photo. This cannot be undone.
            </p>
            {!deleteOpen ? (
              <button className="btn btn--danger-outline" onClick={() => setDeleteOpen(true)}>
                Delete my account
              </button>
            ) : (
              <form onSubmit={confirmDelete} className="delete-confirm">
                <label className="field">
                  <span className="field__label">Enter your password to confirm</span>
                  <input
                    type="password"
                    required
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </label>
                {deleteError && <p className="auth-error">{deleteError}</p>}
                <div className="delete-confirm__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setDeleteOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--danger" disabled={deleteBusy}>
                    {deleteBusy ? 'Deleting…' : 'Permanently delete'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
