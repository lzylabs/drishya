import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Mouse-only camera rotation — scroll is fully decoupled.
 *
 * Mouse X  →  azimuth  θ  (left/right orbit)
 * Mouse Y  →  elevation φ (up/down tilt, slight)
 * Click    →  θ offset snapped by parent via GSAP
 *
 * All values read from refs (no React state) → zero re-renders.
 */
export default function CameraController({ mouseRef, clickRef }) {
  const { camera } = useThree()
  const cur = useRef({ theta: 0, phi: Math.PI / 3.5, r: 5.5 })

  useFrame(() => {
    const mx = mouseRef.current.x  //  -1 … +1
    const my = mouseRef.current.y  //  -1 … +1

    // Target angles — mouse gives ±30° azimuth, ±8° elevation
    const targetTheta = mx * (Math.PI / 6) + clickRef.current.theta
    const targetPhi   = Math.PI / 3.5 + my * 0.14

    // Slow lerp for cinematic feel
    cur.current.theta = THREE.MathUtils.lerp(cur.current.theta, targetTheta, 0.03)
    cur.current.phi   = THREE.MathUtils.lerp(cur.current.phi,   targetPhi,   0.03)

    const { theta, phi, r } = cur.current
    camera.position.set(
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.cos(theta),
    )
    camera.lookAt(0, 0, 0)
  })

  return null
}
