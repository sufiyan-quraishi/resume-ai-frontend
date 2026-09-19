import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export const THEMES = [
  { id: 'nebula', label: 'Dark', mode: 'dark' },
  { id: 'daylight', label: 'Light', mode: 'light' },
]

const STORAGE_KEY = 'resumeai.theme'
const ThemeContext = createContext(null)

function preferredDefault() {
  if (typeof window === 'undefined') return 'nebula'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && THEMES.some((t) => t.id === stored)) return stored
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
  return prefersLight ? 'daylight' : 'nebula'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(preferredDefault)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'nebula' ? 'daylight' : 'nebula'))
  }

  const value = useMemo(() => ({ theme, setTheme, toggleTheme, themes: THEMES }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
