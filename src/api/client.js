import axios from 'axios'

// In dev, baseURL is empty and Vite proxies /api to the backend.
// For a production build, set VITE_API_BASE to your backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  headers: { 'Content-Type': 'application/json' },
})

const TOKEN_KEY = 'resumeai.token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// Attach the JWT (when present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ---------------------------------------------------------------------------
// NEW: auth + profile endpoints
// ---------------------------------------------------------------------------

export async function registerAccount(payload) {
  const { data } = await api.post('/api/auth/register', payload)
  return data
}

export async function verifyOtp(payload) {
  const { data } = await api.post('/api/auth/verify-otp', payload)
  return data
}

export async function resendOtp(email) {
  const { data } = await api.post('/api/auth/resend-otp', { email })
  return data
}

export async function loginAccount(payload) {
  const { data } = await api.post('/api/auth/login', payload)
  return data
}

export async function fetchProfile() {
  const { data } = await api.get('/api/user/me')
  return data
}

export async function updateProfile(payload) {
  const { data } = await api.put('/api/user/me', payload)
  return data
}

export async function uploadProfilePhoto(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/api/user/me/photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteAccount(password) {
  const { data } = await api.delete('/api/user/me', { data: { password } })
  return data
}

export async function getHealth() {
  const { data } = await api.get('/api/health')
  return data
}

export async function generateResume(payload) {
  const { data } = await api.post('/api/resume/generate', payload)
  return data
}

export async function generateCoverLetter(payload) {
  const { data } = await api.post('/api/cover-letter/generate', payload)
  return data
}

export async function analyzeResumeFile(file, jobDescription) {
  const form = new FormData()
  form.append('file', file)
  if (jobDescription) form.append('jobDescription', jobDescription)
  const { data } = await api.post('/api/resume/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function analyzeResumeText(resumeText, jobDescription) {
  const { data } = await api.post('/api/resume/analyze-text', { resumeText, jobDescription })
  return data
}

/** Calls an export endpoint and triggers a browser download. */
export async function exportDocument(format, content, fileName) {
  const response = await api.post(
    `/api/export/${format}`,
    { content, fileName },
    { responseType: 'blob' }
  )
  const blob = new Blob([response.data])
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const ext = format === 'markdown' ? 'md' : format
  link.download = `${fileName}.${ext}`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

/** Turns an axios error into a readable message. */
export function describeError(err) {
  const data = err?.response?.data
  if (data?.message) {
    const details = data.details
      ? ' (' + Object.values(data.details).join('; ') + ')'
      : ''
    return data.message + details
  }
  return err?.message || 'Something went wrong'
}
