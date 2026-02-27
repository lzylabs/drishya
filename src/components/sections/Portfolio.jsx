import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'
import { buildWaLink } from '../ui/WhatsAppButton.jsx'

const projects = [
  { id: 1, city: 'Guntur',         type: '3D Walkthrough' },
  { id: 2, city: 'Vijayawada',     type: 'VR Experience'  },
  { id: 3, city: 'Mangalagiri',    type: 'Marketing Video'},
  { id: 4, city: 'Tenali',         type: '3D Walkthrough' },
  { id: 5, city: 'Amaravati',      type: 'VR + Video'     },
  { id: 6, city: 'Narasaraopet',   type: 'Full Package'   },
]

// Shades of grey for placeholder thumbnails — no colour
const SHADES = ['#111','#161616','#0d0d0d','#141414','#121212','#0f0f0f']

export default function Portfolio() {
  const { t } = useTranslation()

  return (
    <section id="portfolio" className="section bg-[var(--bg-2)]">
      <div className="wrap">
        <SectionHeading titleKey="portfolio.title" subtitleKey="portfolio.subtitle" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--line)]">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="group relative overflow-hidden aspect-[4/3] cursor-pointer bg-[var(--bg)]"
              style={{ background: SHADES[i] }}
            >
              {/* Placeholder: tight grid lines, Gaussian-splat-style noise */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(var(--line-2) 1px,transparent 1px),linear-gradient(90deg,var(--line-2) 1px,transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Project number — large, faint */}
              <span className="absolute top-5 left-6 font-display font-light text-6xl text-white/5 select-none leading-none">
                {String(p.id).padStart(2,'0')}
              </span>

              {/* Hover reveal overlay */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6">
                <p className="label text-white/50 mb-2">{p.type}</p>
                <h3 className="font-display font-light text-2xl text-white leading-tight">
                  {t(`portfolio.p${p.id}_title`)}
                </h3>
                <div className="rule mt-4 mb-4" style={{ background:'rgba(255,255,255,0.15)' }} />
                <a
                  href={buildWaLink(`${t('contact.whatsapp_pretext')} I'd like to see a demo for ${p.type}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-white/60 hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('portfolio.cta')} →
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="label text-[var(--text-3)] text-center mt-10"
        >
          {t('portfolio.coming_soon')}
        </motion.p>
      </div>
    </section>
  )
}
