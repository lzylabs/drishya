import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function SectionHeading({ titleKey, subtitleKey, align = 'left', className = '' }) {
  const { t } = useTranslation()

  return (
    <div className={`mb-16 ${className}`}>
      {subtitleKey && (
        <motion.p
          className="label mb-4 text-[var(--text-2)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t(subtitleKey)}
        </motion.p>
      )}
      {titleKey && (
        <motion.h2
          className={`text-d2 font-display font-light leading-none text-[var(--text)] ${align === 'center' ? 'text-center' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {t(titleKey)}
        </motion.h2>
      )}
      <motion.div
        className="rule-2 mt-8"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />
    </div>
  )
}
