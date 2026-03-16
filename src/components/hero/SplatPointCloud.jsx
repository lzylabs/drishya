import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { config } from './viewerConfig.js'

/* ─── Shaders ────────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBrightness;

  attribute vec3 aColor;

  varying float vOpacity;
  varying vec3  vColor;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    float hash    = fract(sin(dot(position.xz, vec2(127.1, 311.7))) * 43758.5453);
    float shimmer = 0.78 + 0.22 * sin(uTime * (0.35 + hash * 0.55) + hash * 6.28);

    float dist = max(0.1, -mv.z);
    gl_PointSize = (uSize * uPixelRatio) / dist;
    gl_PointSize = clamp(gl_PointSize, 1.0, 64.0);  /* hard cap — prevents giant squares */

    vOpacity = shimmer * uBrightness;
    vColor   = aColor;
  }
`

const fragmentShader = /* glsl */ `
  varying float vOpacity;
  varying vec3  vColor;

  void main() {
    vec2  uv  = gl_PointCoord - 0.5;
    float r2  = dot(uv, uv);
    if (r2 > 0.25) discard;          /* cut hard circle — no more squares */

    float core  = exp(-r2 * 18.0);   /* tight bright centre */
    float halo  = exp(-r2 * 10.0);   /* contained glow — doesn't bleed to corners */
    float alpha = (core * 0.5 + halo * 0.5) * vOpacity;
    if (alpha < 0.02) discard;

    gl_FragColor = vec4(vColor, alpha);
  }
`

/* ─── Component ─────────────────────────────────────────────────────────── */
/*
 * Tuning reference (adjust uSize + uBrightness in uniforms below):
 *
 *   uSize      — world-space size driving gl_PointSize; scene radius × 2 is a
 *                good starting point.  Default: set by HeroScene.
 *   uBrightness— per-particle peak opacity.  Real scenes need this LOW (0.08–0.15)
 *                because 60–80k additive particles overlap heavily → white blowout.
 *   clamp 40px — prevents individual sprites from being visible as blobs; keeps
 *                the "particle cloud" illusion intact at any camera distance.
 */
export default function SplatPointCloud({ data, isDark, uSize = 20 }) {
  const timeRef = useRef(0)

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(data.colors,    3))

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending:    THREE.NormalBlending,   /* DIAGNOSTIC: real colours, no blowout */
      depthWrite:  true,
      depthTest:   true,
      transparent: true,
      uniforms: {
        uTime:       { value: 0 },
        uSize:       { value: uSize },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uBrightness: { value: 1.0 },   /* full brightness for diagnosis */
      },
    })

    return { geometry: geo, material: mat }
  }, [data, uSize])

  useFrame((_, delta) => {
    timeRef.current += delta * 0.3
    material.uniforms.uTime.value       = timeRef.current
    material.uniforms.uSize.value       = config.uSize
    material.uniforms.uBrightness.value = config.brightness
  })

  return <points geometry={geometry} material={material} />
}
