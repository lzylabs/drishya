import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { config } from './viewerConfig.js'

const PARAMS = [
  {
    key:    'uSize',
    label:  'Particle Size',
    min:    4, max: 80, step: 1,
    fmt:    v => Math.round(v),
  },
  {
    key:    'brightness',
    label:  'Brightness',
    min:    0.01, max: 1.5, step: 0.01,
    fmt:    v => v.toFixed(2),
  },
  {
    key:    'rotationRange',
    label:  'Rotation Range',
    min:    0.1, max: Math.PI, step: 0.05,
    fmt:    v => `${Math.round(v * 180 / Math.PI)}°`,
  },
  {
    key:    'elevationRange',
    label:  'Elevation',
    min:    0.02, max: 0.8, step: 0.01,
    fmt:    v => `${Math.round(v * 180 / Math.PI)}°`,
  },
  {
    key:    'lerpSpeed',
    label:  'Rotation Speed',
    min:    0.01, max: 0.2, step: 0.01,
    fmt:    v => v.toFixed(2),
  },
  {
    key:    'orbitR',
    label:  'Camera Distance',
    min:    1, max: 20, step: 0.5,
    fmt:    v => v.toFixed(1),
  },
]

export default function ViewerControls() {
  const [open, setOpen] = useState(false)
  const [vals, setVals] = useState(() => ({ ...config }))

  const set = (key, raw) => {
    const value = parseFloat(raw)
    config[key] = value
    setVals(v => ({ ...v, [key]: value }))
  }

  return (
    <div className="absolute bottom-20 right-4 z-20 flex flex-col items-end gap-3">

      {/* Slider panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:    'rgba(8, 8, 12, 0.72)',
              backdropFilter:'blur(18px)',
              border:        '1px solid rgba(255,255,255,0.08)',
              borderRadius:  '14px',
              padding:       '18px 20px',
              width:         '260px',
              boxShadow:     '0 8px 40px rgba(0,0,0,0.5)',
            }}
          >
            <p style={{ fontSize:'0.65rem', letterSpacing:'0.12em', color:'rgba(255,255,255,0.3)', marginBottom:'14px', textTransform:'uppercase' }}>
              Viewer
            </p>

            {PARAMS.map(p => (
              <div key={p.key} style={{ marginBottom: '14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.5)', letterSpacing:'0.04em' }}>
                    {p.label}
                  </span>
                  <span style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.8)', fontVariantNumeric:'tabular-nums', minWidth:'36px', textAlign:'right' }}>
                    {p.fmt(vals[p.key])}
                  </span>
                </div>
                <input
                  type="range"
                  min={p.min} max={p.max} step={p.step}
                  value={vals[p.key]}
                  onChange={e => set(p.key, e.target.value)}
                  className="viewer-slider"
                  style={{ width: '100%' }}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Viewer controls"
        style={{
          width:         '38px',
          height:        '38px',
          borderRadius:  '50%',
          background:    open ? 'rgba(255,255,255,0.12)' : 'rgba(8,8,12,0.65)',
          backdropFilter:'blur(12px)',
          border:        `1px solid ${open ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          cursor:        'pointer',
          transition:    'all 0.2s ease',
        }}
      >
        {/* Sliders icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: open ? 1 : 0.5 }}>
          <line x1="2" y1="4"  x2="14" y2="4"  stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="2" y1="8"  x2="14" y2="8"  stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="2" y1="12" x2="14" y2="12" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="5"  cy="4"  r="2" fill="white"/>
          <circle cx="10" cy="8"  r="2" fill="white"/>
          <circle cx="6"  cy="12" r="2" fill="white"/>
        </svg>
      </button>

    </div>
  )
}
