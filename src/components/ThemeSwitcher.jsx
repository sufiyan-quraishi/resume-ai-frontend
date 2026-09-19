import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'nebula'

  return (
    <button
      type="button"
      className="theme-switcher"
      onClick={toggleTheme}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className={`theme-switcher__track${isDark ? '' : ' theme-switcher__track--light'}`}>
        <span className="theme-switcher__icon theme-switcher__icon--sun" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="13" height="13">
            <circle cx="12" cy="12" r="4.4" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
            </g>
          </svg>
        </span>
        <span className="theme-switcher__icon theme-switcher__icon--moon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="13" height="13">
            <path
              fill="currentColor"
              d="M20.4 14.7A8.6 8.6 0 0 1 9.3 3.6a.6.6 0 0 0-.75-.8A9.8 9.8 0 1 0 21.2 15.4a.6.6 0 0 0-.8-.7Z"
            />
          </svg>
        </span>
        <span className="theme-switcher__knob" />
      </span>
    </button>
  )
}
