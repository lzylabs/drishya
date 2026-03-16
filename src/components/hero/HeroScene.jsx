import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import SplatPointCloud from './SplatPointCloud.jsx'
import SplatParticles  from './SplatParticles.jsx'
import CameraController from './CameraController.jsx'
import { config } from './viewerConfig.js'
import useStore from '../../store/useStore.js'

const SPLAT_URL = import.meta.env.VITE_SPLAT_URL || ''

/* ─── Particle counts (procedural fallback) ──────────────────────────────── */
function getCount() {
  if (typeof window === 'undefined') return 20000
  if (window.innerWidth < 480)  return 8000
  if (window.innerWidth < 768)  return 14000
  if (window.innerWidth < 1024) return 20000
  return 28000
}

function getMaxPoints() {
  if (typeof window === 'undefined') return 30000
  if (window.innerWidth < 480)  return 20000
  if (window.innerWidth < 768)  return 35000
  if (window.innerWidth < 1024) return 55000
  return 80000
}

/* ─── .splat binary parser ───────────────────────────────────────────────── */
/*
 * .splat format — 32 bytes per Gaussian:
 *   bytes  0-11 : position xyz (3 × float32)
 *   bytes 12-23 : scale    xyz (3 × float32)
 *   bytes 24-27 : color   rgba (4 × uint8)
 *   bytes 28-31 : rotation wxyz (4 × uint8)
 *
 * After sampling we:
 *   1. Compute the cloud centroid
 *   2. Subtract it so the cloud sits at world origin (camera always looks at 0,0,0)
 *   3. Compute the scene radius so the camera can auto-fit
 */
function parseSplat(buffer, maxPoints) {
  const u8  = new Uint8Array(buffer)
  const f32 = new Float32Array(buffer)

  const totalSplats = Math.floor(buffer.byteLength / 32)
  const step        = Math.max(1, Math.floor(totalSplats / maxPoints))
  const count       = Math.floor(totalSplats / step)

  const positions = new Float32Array(count * 3)
  const colors    = new Float32Array(count * 3)

  // Pass 1 — read positions + colors, accumulate centroid
  let cx = 0, cy = 0, cz = 0
  for (let i = 0; i < count; i++) {
    const si = i * step
    const f  = si * 8          // float32 index
    const b  = si * 32 + 24   // byte index for RGBA

    const x = f32[f], y = f32[f + 1], z = f32[f + 2]
    positions[i * 3]     = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    cx += x; cy += y; cz += z

    colors[i * 3]     = u8[b]     / 255
    colors[i * 3 + 1] = u8[b + 1] / 255
    colors[i * 3 + 2] = u8[b + 2] / 255
  }

  cx /= count; cy /= count; cz /= count

  // Pass 2 — centre, flip Y (3DGS is Y-down; Three.js is Y-up), compute raw radius
  let rawRadius = 0
  for (let i = 0; i < count; i++) {
    positions[i * 3]     -= cx
    positions[i * 3 + 1]  = -(positions[i * 3 + 1] - cy)   // Y-flip
    positions[i * 3 + 2] -= cz
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2]
    const d = Math.sqrt(x * x + y * y + z * z)
    if (d > rawRadius) rawRadius = d
  }

  // Pass 3 — normalise to a fixed world radius so every scene fills the hero
  // regardless of how it was captured / exported
  const TARGET_RADIUS = 5.0
  const scale = TARGET_RADIUS / rawRadius
  for (let i = 0; i < count * 3; i++) positions[i] *= scale

  // Diagnostic — open browser DevTools console to read these
  console.info(`[splat] count=${count}  rawRadius=${rawRadius.toFixed(4)}  scale=${scale.toFixed(4)}`)
  console.info(`[splat] first pos: (${positions[0].toFixed(3)}, ${positions[1].toFixed(3)}, ${positions[2].toFixed(3)})`)
  console.info(`[splat] first col: (${colors[0].toFixed(3)}, ${colors[1].toFixed(3)}, ${colors[2].toFixed(3)})`)

  return { positions, colors, count, radius: TARGET_RADIUS }
}

/* ─── Scene ──────────────────────────────────────────────────────────────── */
export default function HeroScene({ mouseRef, clickRef }) {
  const { theme } = useStore()
  const isDark = theme === 'dark'

  const [splatData, setSplatData] = useState(null)

  // Shared ref so CameraController can smoothly lerp to the right distance
  // once the splat radius is known — avoids a prop re-render on load
  const cameraRRef = useRef(6.0)

  useEffect(() => {
    if (!SPLAT_URL) return
    let cancelled = false

    fetch(SPLAT_URL)
      .then(r => r.arrayBuffer())
      .then(buf => {
        if (cancelled) return
        const data = parseSplat(buf, getMaxPoints())
        // Target camera radius = 2.2× the scene radius for a comfortable framing
        config.orbitR = 6.0   // also updates the live slider default
        setSplatData(data)
      })
      .catch(err => console.error('[HeroScene] splat fetch error:', err))

    return () => { cancelled = true }
  }, [])

  // uSize scales with scene radius so points stay proportional regardless of
  // how large or small the scan is (radius × 1.8, clamped 8–35)
  const uSize = 22   // fixed — scene is always normalised to radius 5

  return (
    <Canvas
      camera={{ position: [0, 1, 5.5], fov: 55, near: 0.1, far: 1000 }}
      gl={{
        antialias:       true,
        alpha:           true,
        powerPreference: 'high-performance',
        stencil:         false,
        depth:           true,
      }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {SPLAT_URL && splatData ? (
          <SplatPointCloud data={splatData} isDark={isDark} uSize={uSize} />
        ) : (
          <SplatParticles count={getCount()} isDark={isDark} />
        )}
        <CameraController mouseRef={mouseRef} clickRef={clickRef} rRef={cameraRRef} />
      </Suspense>
    </Canvas>
  )
}
