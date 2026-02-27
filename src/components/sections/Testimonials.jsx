import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'

const testimonials = [
  { nameKey:'testimonials.t1_name', roleKey:'testimonials.t1_role', textKey:'testimonials.t1_text' },
  { nameKey:'testimonials.t2_name', roleKey:'testimonials.t2_role', textKey:'testimonials.t2_text' },
  { nameKey:'testimonials.t3_name', roleKey:'testimonials.t3_role', textKey:'testimonials.t3_text' },
]

export default function Testimonials() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)

  return (
    <section id="testimonials" className="section bg-[var(--bg)]">
      <div className="wrap">
        <SectionHeading titleKey="testimonials.title" subtitleKey="testimonials.subtitle" />

        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10"
            >
              <p className="font-display font-light text-d3 text-[var(--text)] leading-snug italic">
                &ldquo;{t(testimonials[active].textKey)}&rdquo;
              </p>
            </motion.blockquote>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-[var(--text)]">{t(testimonials[active].nameKey)}</p>
              <p className="label text-[var(--text-3)]">{t(testimonials[active].roleKey)}</p>
            </div>
            {/* Dot nav */}
            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`transition-all duration-300 rounded-full bg-[var(--text)] ${
                    active === i ? 'w-6 h-1.5' : 'w-1.5 h-1.5 opacity-20 hover:opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
