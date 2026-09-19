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
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const profile = await fetchProfile()
      setUser(profile)
    } catch {
      setToken(null)
      setUser(null)
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
    setUser(res.user)
    return res.user
  }

  async function verifyOtp(email, otp) {
    const res = await apiVerifyOtp({ email, otp })
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  function updateLocalUser(patch) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
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
