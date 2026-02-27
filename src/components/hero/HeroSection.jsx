import { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildWaLink } from '../ui/WhatsAppButton.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

const HeroScene = lazy(() => import('./HeroScene.jsx'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch { return false }
}

export default function HeroSection() {
  const { t }         = useTranslation()
  const reducedMotion = useReducedMotion()

  const trackRef  = useRef()

  // Mouse + click refs fed directly into CameraController (zero re-renders)
  const mouseRef  = useRef({ x: 0, y: 0 })
  const clickRef  = useRef({ theta: 0 })

  // Scroll only drives the particle morph (completely separate from camera)
  const [morphProgress, setMorphProgress] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [webGL] = useState(() => hasWebGL())

  /* ── Scroll drives ONLY particle morph ──────────────────────── */
  useEffect(() => {
    if (!webGL || reducedMotion) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackRef.current,
        start: 'top top',
        end:   'bottom bottom',
        scrub: 1.2,
        onUpdate(self) {
          // Morph from config A → B in the 30–70% scroll window
          setMorphProgress(Math.min(1, Math.max(0, (self.progress - 0.3) / 0.4)))
        },
      })
    })
    return () => ctx.revert()
  }, [webGL, reducedMotion])

  /* ── Mouse → camera (pure, no scroll interference) ──────────── */
  useEffect(() => {
    if (reducedMotion) return
    const fn = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [reducedMotion])

  /* ── Hint ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const id = setTimeout(() => setShowHint(true), 3000)
    return () => clearTimeout(id)
  }, [])

  /* ── Click: 3-direction snap (independent of scroll) ─────────── */
  const handleClick = useCallback((e) => {
    const x = (e.clientX - e.currentTarget.getBoundingClientRect().left)
             / e.currentTarget.offsetWidth
    const target = x < 0.33 ? -Math.PI / 4 : x > 0.67 ? Math.PI / 4 : 0
    gsap.to(clickRef.current, {
      theta: target,
      duration: 1.1,
      ease: 'power3.inOut',
      onComplete: () =>
        gsap.to(clickRef.current, { theta: 0, duration: 3, delay: 4, ease: 'power2.inOut' }),
    })
  }, [])

  const fade = (i) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4 + i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    /* 300vh scroll track — scroll morphs the splat; camera stays mouse-only */
    <section ref={trackRef} className="hero-track" aria-label="Drishya hero">
      <div className="hero-sticky">

        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'var(--hero-bg)' }} />

        {/* 3D Gaussian Splat Canvas */}
        {webGL && !reducedMotion ? (
          <div className="absolute inset-0 cursor-none" onClick={handleClick}>
            <Suspense fallback={null}>
              <HeroScene
                mouseRef={mouseRef}
                clickRef={clickRef}
                morphProgress={morphProgress}
              />
            </Suspense>
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: 'var(--hero-bg)' }} />
        )}

        {/* Vignette — darker edges, bright centre */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 30%, var(--bg) 100%)' }}
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pointer-events-none">
          <div className="text-center">

            {/* Location overline */}
            <motion.p {...fade(0)} className="label text-white/40 mb-7 tracking-widest">
              Guntur, Andhra Pradesh
            </motion.p>

            {/* Brand name in Cormorant */}
            <motion.h1
              {...fade(1)}
              className="font-display font-light text-white"
              style={{
                fontSize: 'clamp(5rem, 14vw, 11rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                textShadow: '0 0 80px rgba(255,255,255,0.06)',
              }}
            >
              Drishya
            </motion.h1>

            {/* Italic Telugu name */}
            <motion.p
              {...fade(2)}
              className="font-display font-light italic text-white/30 mt-1"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}
            >
              దృశ్య
            </motion.p>

            {/* Tagline */}
            <motion.p
              {...fade(3)}
              className="label text-white/35 mt-8 tracking-widest"
            >
              {t('brand.tagline')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fade(4)}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 pointer-events-auto"
            >
              <a
                href="#portfolio"
                className="label text-white/70 hover:text-white transition-colors pb-px border-b border-white/20 hover:border-white"
              >
                {t('hero.cta_primary')}
              </a>
              <span className="text-white/15 text-lg">|</span>
              <a
                href={buildWaLink(t('contact.whatsapp_pretext'))}
                target="_blank"
                rel="noopener noreferrer"
                className="label text-white/40 hover:text-white/70 transition-colors"
              >
                {t('hero.cta_secondary')}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Hint */}
        <motion.p
          className="absolute bottom-16 left-1/2 -translate-x-1/2 label text-white/25 whitespace-nowrap pointer-events-none"
          animate={{ opacity: showHint ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          {t('hero.click_hint')}
        </motion.p>

        {/* Scroll cue */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none">
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent mx-auto"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
      </div>
    </section>
  )
}
