import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'

const steps = [
  { num: '01', titleKey: 'process.step1_title', descKey: 'process.step1_desc' },
  { num: '02', titleKey: 'process.step2_title', descKey: 'process.step2_desc' },
  { num: '03', titleKey: 'process.step3_title', descKey: 'process.step3_desc' },
  { num: '04', titleKey: 'process.step4_title', descKey: 'process.step4_desc' },
]

export default function Process() {
  const { t } = useTranslation()

  return (
    <section id="process" className="section bg-[var(--bg)]">
      <div className="wrap">
        <SectionHeading titleKey="process.title" subtitleKey="process.subtitle" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--line)]">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="bg-[var(--bg)] px-6 pt-6 pb-8"
            >
              {/* Giant number — design element */}
              <p className="font-display font-light text-[7rem] md:text-[9rem] leading-none text-[var(--text-3)] select-none mb-2">
                {step.num}
              </p>
              <h3 className="font-display font-light text-xl text-[var(--text)] mb-3">
                {t(step.titleKey)}
              </h3>
              <p className="text-sm text-[var(--text-2)] font-light leading-relaxed">
                {t(step.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
