import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import LanguageToggle from '../ui/LanguageToggle.jsx'
import { buildWaLink } from '../ui/WhatsAppButton.jsx'
import useStore from '../../store/useStore.js'

const links = [
  { key: 'nav.services',  href: '#services'  },
  { key: 'nav.portfolio', href: '#portfolio' },
  { key: 'nav.pricing',   href: '#pricing'   },
  { key: 'nav.contact',   href: '#contact'   },
]

export default function Navbar() {
  const { t } = useTranslation()
  const { isMobileNavOpen, setMobileNavOpen } = useStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[var(--bg)]/90 backdrop-blur-md' : 'bg-transparent'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="wrap flex items-center justify-between h-14">
          {/* Logo — ultra minimal */}
          <a href="#" className="flex items-center gap-3">
            <span className="font-display font-light text-xl tracking-tight text-[var(--text)]">
              Drishya
            </span>
            <span className="label hidden sm:block text-[var(--text-3)]">/ Guntur AP</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {links.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="label text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
              >
                {t(key)}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-6">
            <LanguageToggle className="hidden sm:flex" />
            <ThemeToggle className="hidden sm:block" />
            <a
              href={buildWaLink(t('contact.whatsapp_pretext'))}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block label text-[var(--text)] hover:text-[var(--text-2)] transition-colors pb-px border-b border-[var(--line-2)] hover:border-[var(--text-2)]"
            >
              {t('nav.cta')} →
            </a>

            {/* Hamburger */}
            <button
              className="lg:hidden label text-[var(--text-2)] hover:text-[var(--text)]"
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
              aria-label="Menu"
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[var(--bg)]/95 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.nav
              className="fixed top-0 right-0 bottom-0 z-50 w-64 bg-[var(--bg-2)] flex flex-col px-8 pt-20 pb-10 gap-8 lg:hidden"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              {links.map(({ key, href }, i) => (
                <motion.a
                  key={key} href={href}
                  onClick={() => setMobileNavOpen(false)}
                  className="font-display font-light text-2xl text-[var(--text)] hover:text-[var(--text-2)] transition-colors"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  {t(key)}
                </motion.a>
              ))}
              <div className="rule mt-auto" />
              <div className="flex items-center gap-6">
                <LanguageToggle /> <ThemeToggle />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
