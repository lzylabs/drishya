import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// ── Replace with actual WhatsApp business number (country code + digits) ──
export const WHATSAPP_NUMBER = '919999999999'

export function buildWaLink(message = '') {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}${encoded ? `?text=${encoded}` : ''}`
}

export default function WhatsAppButton() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={buildWaLink(t('contact.whatsapp_pretext'))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[var(--bg-3)] border border-[var(--line-2)] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5" fill="var(--text-2)" aria-hidden="true">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.734 5.469 2.018 7.775L0 32l8.476-2.006A15.935 15.935 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.28 20.347c-.4-.2-2.363-1.163-2.729-1.296-.367-.133-.634-.2-.9.2-.267.4-1.03 1.296-1.264 1.563-.233.267-.467.3-.867.1-.4-.2-1.69-.623-3.217-1.983-1.19-1.06-1.993-2.37-2.227-2.77-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.233.267-.4.4-.666.133-.267.067-.5-.033-.7-.1-.2-.9-2.163-1.233-2.963-.327-.78-.66-.673-.9-.686l-.767-.013c-.267 0-.7.1-1.067.5s-1.4 1.367-1.4 3.33 1.433 3.863 1.633 4.13c.2.267 2.82 4.3 6.833 6.03.954.41 1.7.654 2.28.837.957.304 1.83.261 2.52.158.768-.114 2.363-.966 2.696-1.9.333-.933.333-1.733.233-1.9-.1-.167-.367-.267-.767-.467z"/>
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
