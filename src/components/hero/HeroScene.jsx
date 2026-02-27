import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import SplatParticles from './SplatParticles.jsx'
import CameraController from './CameraController.jsx'
import useStore from '../../store/useStore.js'

function getCount() {
  if (typeof window === 'undefined') return 3000
  if (window.innerWidth < 480)  return 1000
  if (window.innerWidth < 768)  return 2000
  if (window.innerWidth < 1024) return 3000
  return 4000
}

export default function HeroScene({ mouseRef, clickRef, morphProgress }) {
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
          morphProgress={morphProgress}
          isDark={theme === 'dark'}
        />
        <CameraController mouseRef={mouseRef} clickRef={clickRef} />
      </Suspense>
    </Canvas>
  )
}
