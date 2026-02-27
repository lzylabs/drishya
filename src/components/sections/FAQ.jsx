import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'

const faqs = [1,2,3,4,5,6,7].map((n) => ({ q:`faq.q${n}`, a:`faq.a${n}` }))

export default function FAQ() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="section bg-[var(--bg-2)]">
      <div className="wrap">
        <SectionHeading titleKey="faq.title" subtitleKey="faq.subtitle" />

        <div className="max-w-2xl">
          {faqs.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-[var(--line)]"
            >
              <button
                className="w-full flex items-start justify-between py-5 text-left gap-6 group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="text-sm font-light text-[var(--text)] group-hover:text-[var(--text-2)] transition-colors leading-relaxed">
                  {t(item.q)}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[var(--text-3)] text-lg leading-none shrink-0 mt-0.5"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden text-sm text-[var(--text-2)] font-light leading-relaxed pb-5"
                  >
                    {t(item.a)}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
