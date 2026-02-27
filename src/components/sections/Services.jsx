import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'
import { buildWaLink } from '../ui/WhatsAppButton.jsx'

const services = [
  {
    num: '01',
    titleKey: 'services.3d_title',
    descKey:  'services.3d_desc',
    features: ['services.3d_feature1', 'services.3d_feature2', 'services.3d_feature3'],
  },
  {
    num: '02',
    titleKey: 'services.vr_title',
    descKey:  'services.vr_desc',
    features: ['services.vr_feature1', 'services.vr_feature2', 'services.vr_feature3'],
  },
  {
    num: '03',
    titleKey: 'services.video_title',
    descKey:  'services.video_desc',
    features: ['services.video_feature1', 'services.video_feature2', 'services.video_feature3'],
  },
]

export default function Services() {
  const { t } = useTranslation()

  return (
    <section id="services" className="section bg-[var(--bg)]">
      <div className="wrap">
        <SectionHeading titleKey="services.title" subtitleKey="services.subtitle" />

        <div className="flex flex-col">
          {services.map((svc, i) => (
            <motion.div
              key={svc.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-1 md:grid-cols-[5rem_1fr_1.2fr] gap-6 md:gap-12 py-10 border-b border-[var(--line)] hover:border-[var(--line-2)] transition-colors"
            >
              {/* Step number */}
              <span className="font-display font-light text-4xl text-[var(--text-3)] group-hover:text-[var(--text-2)] transition-colors leading-none pt-1">
                {svc.num}
              </span>

              {/* Title */}
              <div>
                <h3 className="text-d3 font-display font-light text-[var(--text)] leading-none mb-3">
                  {t(svc.titleKey)}
                </h3>
                <a
                  href={buildWaLink(`${t('contact.whatsapp_pretext')} Interested in ${t(svc.titleKey)}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                >
                  {t('nav.cta')} →
                </a>
              </div>

              {/* Description + features */}
              <div>
                <p className="text-sm text-[var(--text-2)] leading-relaxed font-light mb-5">
                  {t(svc.descKey)}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {svc.features.map((fk) => (
                    <li key={fk} className="flex items-start gap-3 label text-[var(--text-3)]">
                      <span className="mt-px">—</span>
                      {t(fk)}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
