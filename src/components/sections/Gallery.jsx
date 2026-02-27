/**
 * Gallery — full-bleed project showcase.
 * Each project is a large panel with a cinematic image/placeholder,
 * a clip-path reveal on hover, and a label system.
 * No cards. Dark background always.
 */
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { buildWaLink } from '../ui/WhatsAppButton.jsx'

/* ── Project data — swap `placeholder` for real image URLs ───────────── */
export const GALLERY_PROJECTS = [
  {
    id:          'villa-guntur-01',
    title:       'Villa at Nallapadu',
    titleTe:     'నల్లపాడు విల్లా',
    location:    'Guntur',
    type:        '3D Walkthrough',
    typeTe:      '3D వాక్‌త్రూ',
    year:        '2024',
    placeholder: null,   // set to image URL when ready
    shade:       '#0e0e0e',
    aspect:      'landscape',  // 'landscape' | 'portrait'
  },
  {
    id:          'apartment-vijayawada-01',
    title:       'Riverside Apartments',
    titleTe:     'రివర్‌సైడ్ అపార్ట్‌మెంట్లు',
    location:    'Vijayawada',
    type:        'VR Experience',
    typeTe:      'VR అనుభవం',
    year:        '2024',
    placeholder: null,
    shade:       '#0c0c0c',
    aspect:      'portrait',
  },
  {
    id:          'commercial-mangalagiri-01',
    title:       'Commercial Complex',
    titleTe:     'వాణిజ్య సముదాయం',
    location:    'Mangalagiri',
    type:        'Marketing Video',
    typeTe:      'మార్కెటింగ్ వీడియో',
    year:        '2024',
    placeholder: null,
    shade:       '#111111',
    aspect:      'landscape',
  },
  {
    id:          'penthouse-amaravati-01',
    title:       'Penthouse at Capital',
    titleTe:     'క్యాపిటల్ పెంట్‌హౌస్',
    location:    'Amaravati',
    type:        'VR + Video',
    typeTe:      'VR + వీడియో',
    year:        '2025',
    placeholder: null,
    shade:       '#0d0d0d',
    aspect:      'portrait',
  },
  {
    id:          'gated-narasaraopet-01',
    title:       'Gated Community',
    titleTe:     'గేటెడ్ కమ్యూనిటీ',
    location:    'Narasaraopet',
    type:        'Full Package',
    typeTe:      'పూర్తి ప్యాకేజీ',
    year:        '2025',
    placeholder: null,
    shade:       '#0f0f0f',
    aspect:      'landscape',
  },
  {
    id:          'house-tenali-01',
    title:       'Heritage House',
    titleTe:     'హెరిటేజ్ నివాసం',
    location:    'Tenali',
    type:        '3D Walkthrough',
    typeTe:      '3D వాక్‌త్రూ',
    year:        '2025',
    placeholder: null,
    shade:       '#101010',
    aspect:      'landscape',
  },
]

/* ── Magnetic hover tile ─────────────────────────────────────────────── */
function GalleryTile({ project, index, language }) {
  const ref       = useRef(null)
  const [hovered, setHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 200, damping: 30 })
  const sy = useSpring(my, { stiffness: 200, damping: 30 })

  const title    = language === 'te' ? project.titleTe    : project.title
  const typeLabel= language === 'te' ? project.typeTe     : project.type

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 12
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 12
    mx.set(nx)
    my.set(ny)
  }

  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
    setHovered(false)
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group cursor-pointer ${
        project.aspect === 'portrait' ? 'row-span-2' : ''
      }`}
      style={{ background: project.shade }}
    >
      {/* The actual image (or placeholder) */}
      <div className="absolute inset-0">
        {project.placeholder ? (
          <motion.img
            src={project.placeholder}
            alt={title}
            className="w-full h-full object-cover"
            style={{ x: sx, y: sy }}
          />
        ) : (
          /* Placeholder — architectural grid */
          <div className="w-full h-full relative">
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),' +
                  'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            {/* Large faint project number */}
            <span
              className="absolute bottom-4 right-5 font-display font-light text-[8rem] leading-none text-white/[0.03] select-none"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Always-visible bottom label */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <p
              className="text-white/35 mb-1"
              style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"DM Sans"' }}
            >
              {project.location} · {project.year}
            </p>
            <h3 className="font-display font-light text-white text-xl leading-tight">
              {title}
            </h3>
          </div>
          <span
            className="text-white/25 shrink-0 ml-4"
            style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: '"DM Sans"' }}
          >
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Full hover overlay — clips in from bottom */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-6"
        style={{
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(2px)',
        }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-white/40 mb-3"
          style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"DM Sans"' }}
        >
          {project.location} · {typeLabel} · {project.year}
        </p>
        <h3 className="font-display font-light text-white text-2xl leading-tight mb-5">
          {title}
        </h3>

        {/* Thin rule */}
        <div className="h-px bg-white/10 mb-5" />

        <div className="flex items-center gap-5">
          <a
            href={buildWaLink(`I'd like to see the ${project.title} project demo.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
            style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"DM Sans"' }}
            onClick={(e) => e.stopPropagation()}
          >
            Request Demo →
          </a>
          {project.placeholder && (
            <span
              className="text-white/30"
              style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: '"DM Sans"' }}
            >
              View 3D
            </span>
          )}
        </div>
      </motion.div>
    </motion.article>
  )
}

/* ── Gallery section ─────────────────────────────────────────────────── */
export default function Gallery() {
  const { t, i18n } = useTranslation()
  const language = i18n.language

  return (
    <section id="gallery" className="bg-[#080808]" style={{ paddingTop: 'clamp(5rem,10vw,8rem)' }}>
      {/* Header */}
      <div className="wrap mb-12">
        <p
          className="text-white/30 mb-4"
          style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: '"DM Sans"' }}
        >
          {t('portfolio.subtitle')}
        </p>
        <motion.h2
          className="font-display font-light text-white"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {t('portfolio.title')}
        </motion.h2>
      </div>

      {/* Masonry-ish grid — no gap borders, panels touch */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{ gridAutoRows: '320px', gap: '1px', background: '#1a1a1a' }}
      >
        {GALLERY_PROJECTS.map((project, i) => (
          <GalleryTile
            key={project.id}
            project={project}
            index={i}
            language={language}
          />
        ))}
      </div>

      {/* Footer strip */}
      <div className="wrap flex items-center justify-between py-8">
        <p
          className="text-white/20"
          style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"DM Sans"' }}
        >
          {t('portfolio.coming_soon')}
        </p>
        <a
          href={buildWaLink('Hello Drishya! I\'d like to discuss a project.')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white/70 transition-colors"
          style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"DM Sans"' }}
        >
          {t('portfolio.cta')} →
        </a>
      </div>
    </section>
  )
}
