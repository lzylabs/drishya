import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { config } from './viewerConfig.js'

/**
 * Mouse-only camera rotation — scroll is fully decoupled.
 *
 * Mouse X  →  azimuth  θ  (left/right orbit)
 * Mouse Y  →  elevation φ (up/down tilt, slight)
 * Click    →  θ offset snapped by parent via GSAP
 *
 * All values read from refs (no React state) → zero re-renders.
 */
export default function CameraController({ mouseRef, clickRef, rRef }) {
  const { camera } = useThree()
  const cur = useRef({ theta: 0, phi: Math.PI / 3.5, r: 5.5 })

  useFrame(() => {
    const mx = mouseRef.current.x  //  -1 … +1
    const my = mouseRef.current.y  //  -1 … +1

    // All motion params live-driven from config (editable via ViewerControls panel)
    const targetTheta = mx * config.rotationRange + clickRef.current.theta
    const targetPhi   = Math.PI / 3.5 + my * config.elevationRange
    const targetR     = config.orbitR

    cur.current.theta = THREE.MathUtils.lerp(cur.current.theta, targetTheta, config.lerpSpeed)
    cur.current.phi   = THREE.MathUtils.lerp(cur.current.phi,   targetPhi,   config.lerpSpeed)
    cur.current.r     = THREE.MathUtils.lerp(cur.current.r,     targetR,     0.03)

    const { theta, phi, r } = cur.current
    camera.position.set(
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.cos(theta),
    )
    camera.lookAt(0, 0, 0)
    camera.far = Math.max(200, r * 6)
    camera.updateProjectionMatrix()
  })

  return null
}
