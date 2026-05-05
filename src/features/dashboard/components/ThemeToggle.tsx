import { useColorMode } from '@chakra-ui/react'

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <button
      type="button"
      className="dash-head__icon-btn"
      onClick={toggleColorMode}
      aria-label={isDark ? 'ライトモードへ切替' : 'ダークモードへ切替'}
      title={isDark ? 'ライトモードへ切替' : 'ダークモードへ切替'}
      aria-pressed={isDark}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
