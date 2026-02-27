import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Splat } from '@react-three/drei'
import SplatParticles from './SplatParticles.jsx'
import CameraController from './CameraController.jsx'
import useStore from '../../store/useStore.js'

/*
 * VITE_SPLAT_URL — set this to a publicly accessible .splat file URL.
 *
 * In development (.env.local):
 *   VITE_SPLAT_URL=https://your-cdn.com/property.splat
 *
 * In production (GitHub Actions → deploy.yml env block):
 *   VITE_SPLAT_URL: https://your-cdn.com/property.splat
 *
 * Capture pipeline:
 *   1. Shoot ~150-300 photos of the property with Luma AI / Polycam
 *   2. Let their cloud process it → download the .ply file
 *   3. Open https://playcanvas.com/supersplat/editor
 *   4. Import .ply → export as .splat (or .ksplat for streaming)
 *   5. Upload to Cloudflare R2 / AWS S3 / GitHub LFS
 *   6. Set the URL in the env variable above
 *
 * If VITE_SPLAT_URL is empty the hero falls back to the
 * SplatParticles procedural simulation.
 */
const SPLAT_URL = import.meta.env.VITE_SPLAT_URL || ''

function getCount() {
  if (typeof window === 'undefined') return 20000
  if (window.innerWidth < 480)  return 8000
  if (window.innerWidth < 768)  return 14000
  if (window.innerWidth < 1024) return 20000
  return 28000
}

/* Real Gaussian Splat — loaded from .splat file via drei */
function RealSplat() {
  return (
    <Splat
      src={SPLAT_URL}
      /* alphaTest: discard splats below this opacity threshold (0–1) */
      alphaTest={0.1}
      /*
       * chunkSize: number of splats streamed per chunk.
       * Higher = faster load but more memory spikes.
       * Lower = smoother progressive load.
       */
      chunkSize={25000}
    />
  )
}

export default function HeroScene({ mouseRef, clickRef }) {
  const { theme } = useStore()

  /*
   * depth: false  →  fine for particles (no depth conflicts)
   * depth: true   →  required for correct splat rendering when using
   *                  a real .splat file, so we switch it on when needed.
   */
  const useRealSplat = Boolean(SPLAT_URL)

  return (
    <Canvas
      camera={{ position: [0, 0.5, 5.5], fov: 55, near: 0.1, far: 80 }}
      gl={{
        antialias:          true,
        alpha:              true,
        powerPreference:    'high-performance',
        stencil:            false,
        depth:              useRealSplat,   // splats need depth buffer
      }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {useRealSplat ? (
          <RealSplat />
        ) : (
          <SplatParticles
            count={getCount()}
            isDark={theme === 'dark'}
          />
        )}
        <CameraController mouseRef={mouseRef} clickRef={clickRef} />
      </Suspense>
    </Canvas>
  )
}
