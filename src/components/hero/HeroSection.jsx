import { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { buildWaLink } from '../ui/WhatsAppButton.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import ViewerControls from './ViewerControls.jsx'

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

  // Mouse + click refs fed directly into CameraController (zero re-renders)
  const mouseRef  = useRef({ x: 0, y: 0 })
  const clickRef  = useRef({ theta: 0 })

  const [showHint, setShowHint]     = useState(false)
  const [webGL]                     = useState(() => hasWebGL())
  const [gyroGranted, setGyroGranted] = useState(false)
  const isIOSGyro = typeof DeviceOrientationEvent !== 'undefined' &&
                    typeof DeviceOrientationEvent.requestPermission === 'function'

  /* ── Desktop mouse → camera ──────────────────────────────────── */
  useEffect(() => {
    if (reducedMotion) return
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (isMobile) return
    const fn = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [reducedMotion])

  /* ── Mobile gyroscope + touch-drag → camera ─────────────────── */
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
                     ('ontouchstart' in window)
    if (!isMobile) return

    // Smoothed gyro target — lerped into mouseRef by rAF so we never jitter
    const GYRO_LERP = 0.05
    const gyroTarget = { x: 0, y: 0 }
    let gyroActive = false
    let rafId = null

    const tick = () => {
      if (gyroActive) {
        mouseRef.current.x += (gyroTarget.x - mouseRef.current.x) * GYRO_LERP
        mouseRef.current.y += (gyroTarget.y - mouseRef.current.y) * GYRO_LERP
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const handleOrientation = (e) => {
      // Some devices report 0,0 not null when sensor is unavailable — both are fine
      const gamma = e.gamma ?? 0
      const beta  = (e.beta  ?? 0) - 45
      gyroTarget.x = Math.max(-1, Math.min(1, gamma / 30))
      gyroTarget.y = Math.max(-1, Math.min(1, beta  / 30))
      gyroActive = true
    }

    // Touch-drag fallback — active when gyro hasn't fired yet
    let touchStart = null
    const handleTouchStart = (e) => {
      const t = e.touches[0]
      touchStart = { x: t.clientX, y: t.clientY,
                     mx: mouseRef.current.x, my: mouseRef.current.y }
    }
    const handleTouchMove = (e) => {
      if (!touchStart || gyroActive) return
      const dx = (e.touches[0].clientX - touchStart.x) / window.innerWidth
      const dy = (e.touches[0].clientY - touchStart.y) / window.innerHeight
      mouseRef.current.x = Math.max(-1, Math.min(1, touchStart.mx + dx * 2))
      mouseRef.current.y = Math.max(-1, Math.min(1, touchStart.my + dy * 2))
    }
    const handleTouchEnd = () => { touchStart = null }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove',  handleTouchMove,  { passive: true })
    window.addEventListener('touchend',   handleTouchEnd,   { passive: true })

    // Android: try deviceorientationabsolute first (Chrome preferred),
    // fall back to deviceorientation. Both are fine to attach simultaneously —
    // whichever fires first sets gyroActive = true.
    const isIOS = typeof DeviceOrientationEvent?.requestPermission === 'function'
    if (!isIOS && typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientationabsolute', handleOrientation, { passive: true })
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
    }
    // iOS: permission requested via "Enable tilt" button in JSX

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('deviceorientationabsolute', handleOrientation)
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove',  handleTouchMove)
      window.removeEventListener('touchend',   handleTouchEnd)
    }
  }, [])

  /* ── Hint ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const id = setTimeout(() => setShowHint(true), 3000)
    return () => clearTimeout(id)
  }, [])

  /* ── iOS gyro permission (called from button tap) ────────────── */
  const requestIOSGyro = useCallback(async () => {
    try {
      const perm = await DeviceOrientationEvent.requestPermission()
      if (perm === 'granted') {
        const handleOrientation = (e) => {
          if (e.gamma === null && e.beta === null) return
          const gamma = e.gamma || 0
          const beta  = (e.beta  || 0) - 45
          // mouseRef is shared — write directly (rAF loop in gyro effect handles lerp)
          mouseRef.current.x = Math.max(-1, Math.min(1, gamma / 30))
          mouseRef.current.y = Math.max(-1, Math.min(1, beta  / 30))
        }
        window.addEventListener('deviceorientation', handleOrientation, { passive: true })
        setGyroGranted(true)
      }
    } catch (_) {
      setGyroGranted(true) // hide button even if denied
    }
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
    /* Single-viewport hero — scroll is fully free */
    <section
      style={{ height: '100dvh', position: 'relative', overflow: 'hidden' }}
      aria-label="Drishya hero"
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'var(--hero-bg)' }} />

      {/* 3D Gaussian Splat Canvas */}
      {webGL && !reducedMotion ? (
        <div className="absolute inset-0 cursor-default" onClick={handleClick}>
          <Suspense fallback={null}>
            <HeroScene
              mouseRef={mouseRef}
              clickRef={clickRef}
            />
          </Suspense>
        </div>
      ) : (
        <div className="absolute inset-0" style={{ background: 'var(--hero-bg)' }} />
      )}

      {/* Vignette — darker edges + subtle centre scrim for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, var(--bg) 100%)' }}
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pointer-events-none">
        <div className="text-center">

          {/* Brand name in Cormorant */}
          <motion.h1
            {...fade(1)}
            className="font-display font-light text-white"
            style={{
              fontSize: 'clamp(5rem, 14vw, 11rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 32px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.6)',
            }}
          >
            Drishya
          </motion.h1>

          {/* Italic Telugu name */}
          <motion.p
            {...fade(2)}
            className="font-display font-light italic text-white/60 mt-1"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
            }}
          >
            దృశ్య
          </motion.p>

          {/* Tagline */}
          <motion.p
            {...fade(3)}
            className="label text-white/70 mt-8 tracking-widest"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            {t('brand.tagline')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fade(4)}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 pointer-events-auto"
          >
            <a
              href="#gallery"
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

      {/* iOS gyro permission button */}
      {isIOSGyro && !gyroGranted && (
        <button
          onClick={requestIOSGyro}
          className="absolute top-5 right-5 pointer-events-auto"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 6,
            padding: '6px 12px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(8px)',
          }}
        >
          Enable tilt
        </button>
      )}

      {/* Viewer tuning panel */}
      {webGL && !reducedMotion && <ViewerControls />}

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent mx-auto"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>
    </section>
  )
}
