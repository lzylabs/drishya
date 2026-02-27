import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import SplatParticles from './SplatParticles.jsx'
import CameraController from './CameraController.jsx'
import useStore from '../../store/useStore.js'

function getCount() {
  if (typeof window === 'undefined') return 20000
  if (window.innerWidth < 480)  return 8000   // low-end mobile
  if (window.innerWidth < 768)  return 14000  // tablet / mid mobile
  if (window.innerWidth < 1024) return 20000  // small laptop
  return 28000                                 // desktop
}

export default function HeroScene({ mouseRef, clickRef }) {
  const { theme } = useStore()

  return (
    <Canvas
      camera={{ position: [0, 0.5, 5.5], fov: 55, near: 0.1, far: 80 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <SplatParticles
          count={getCount()}
          isDark={theme === 'dark'}
        />
        <CameraController mouseRef={mouseRef} clickRef={clickRef} />
      </Suspense>
    </Canvas>
  )
}
