import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  getToken,
  setToken,
  fetchProfile,
  loginAccount,
  verifyOtp as apiVerifyOtp,
} from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Local storage se initial cached user read karna taaki refresh par photo na ude
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('auth_user')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  // User state change hone par hamesha storage update karein
  const syncUser = (userData) => {
    if (!userData) {
      localStorage.removeItem('auth_user')
      setUser(null)
      return
    }
    // Photo property normalization (agar backend se avatar, avatarUrl ya photoUrl aaye)
    const normalized = {
      ...userData,
      photoUrl: userData.photoUrl || userData.avatarUrl || userData.avatar || userData.profilePicture || null
    }
    try {
      localStorage.setItem('auth_user', JSON.stringify(normalized))
    } catch (e) {
      console.warn('Could not cache user in localStorage', e)
    }
    setUser(normalized)
  }

  const loadProfile = useCallback(async () => {
    if (!getToken()) {
      syncUser(null)
      setLoading(false)
      return
    }
    try {
      const profile = await fetchProfile()
      syncUser(profile)
    } catch {
      setToken(null)
      syncUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  async function login(email, password) {
    const res = await loginAccount({ email, password })
    setToken(res.token)
    syncUser(res.user)
    return res.user
  }

  async function verifyOtp(email, otp) {
    const res = await apiVerifyOtp({ email, otp })
    setToken(res.token)
    syncUser(res.user)
    return res.user
  }

  function logout() {
    setToken(null)
    syncUser(null)
  }

  function updateLocalUser(patch) {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...patch } : patch
      const normalized = {
        ...updated,
        photoUrl: patch.photoUrl || updated.photoUrl || updated.avatarUrl || updated.avatar || null
      }
      try {
        localStorage.setItem('auth_user', JSON.stringify(normalized))
      } catch (e) {
        console.warn('Could not cache updated user', e)
      }
      return normalized
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, verifyOtp, logout, updateLocalUser, refresh: loadProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
