import { motion } from 'framer-motion'
import useStore from '../../store/useStore.js'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useStore()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`label text-[var(--text-2)] hover:text-[var(--text)] transition-colors cursor-pointer ${className}`}
      whileTap={{ scale: 0.9 }}
    >
      {isDark ? '○' : '●'}
    </motion.button>
  )
}
