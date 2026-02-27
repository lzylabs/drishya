import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Shaders ───────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMorphProgress;
  uniform float uBrightness;

  attribute float aScale;
  attribute float aOpacity;
  attribute vec3  aPositionB;
  attribute vec3  aColor;

  varying float vOpacity;
  varying vec3  vColor;

  void main() {
    vec3 pos = mix(position, aPositionB, uMorphProgress);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    /* Per-particle shimmer */
    float hash = fract(sin(dot(pos.xz, vec2(127.1, 311.7))) * 43758.5453);
    float shimmer = 0.88 + 0.12 * sin(uTime * (0.5 + hash * 0.7) + hash * 6.28);

    float dist = max(0.1, -mv.z);
    gl_PointSize = (uSize * aScale * uPixelRatio) / dist;
    gl_PointSize = clamp(gl_PointSize, 1.0, 250.0);

    vOpacity = aOpacity * shimmer * uBrightness;
    vColor   = aColor;
  }
`

const fragmentShader = /* glsl */ `
  varying float vOpacity;
  varying vec3  vColor;

  void main() {
    /* Dual-sigma Gaussian disc.
     * sigma values tuned for dense nebula: very soft falloff so particles
     * accumulate into a smooth cloud rather than showing as individual dots.
     *
     * gl_PointCoord: 0…1 across the point sprite
     * uv: -0.5…+0.5, r2: 0 (centre) → 0.25 (edge)
     *
     * At edge with these sigmas:
     *   core = exp(-0.25 × 8)  = exp(-2.0) = 0.135
     *   halo = exp(-0.25 × 1.5) = exp(-0.375) = 0.687
     * → combined ≈ 0.52 × vOpacity  (still visible at edge → soft disc)
     */
    vec2  uv   = gl_PointCoord - 0.5;
    float r2   = dot(uv, uv);
    float core = exp(-r2 * 8.0);    /* moderate centre boost */
    float halo = exp(-r2 * 1.5);    /* very wide soft glow */
    float alpha = (core * 0.30 + halo * 0.70) * vOpacity;

    if (alpha < 0.0015) discard;

    gl_FragColor = vec4(vColor, alpha);
  }
`

/* ─── Gaussian random (Box-Muller) ──────────────────────────────────────── */
function gRand(mean = 0, std = 1) {
  const u = 1 - Math.random()
  const v = Math.random()
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/* ─── Color palette ──────────────────────────────────────────────────────── */
/* Weighted toward gold and warm white for a premium interior feel          */
const PALETTE = [
  [0.96, 0.77, 0.09],  // gold     #F5C518   (×3 weight)
  [0.96, 0.77, 0.09],
  [0.96, 0.77, 0.09],
  [0.49, 0.23, 0.93],  // violet   #7C3AED
  [0.02, 0.71, 0.83],  // cyan     #06B6D4
  [1.00, 0.95, 0.85],  // warm white
  [0.80, 0.70, 1.00],  // soft lavender
  [1.00, 1.00, 1.00],  // pure white
]

/* ─── Particle distributions ─────────────────────────────────────────────── */
/*
 * Camera sits at [0, 0.5, 5.5] looking at origin, fov=55.
 * Visible width at z=0  ≈ ±5 units.
 * Visible height at z=0 ≈ ±2.9 units.
 *
 * Config A — architectural room cloud (what you see inside a scanned space)
 *   Zone 1 (35%): main body — wide X/Z spread, moderate Y
 *   Zone 2 (25%): floor sweep — very wide, thin at Y ≈ -1.7
 *   Zone 3 (20%): bright focus cluster — tight at origin
 *   Zone 4 (20%): wide ambient haze
 *
 * Config B — nebula sphere (morph target)
 *   Uniformly distributed on shell of radius 0.5–4
 */
function buildBuffers(count) {
  const posA     = new Float32Array(count * 3)
  const posB     = new Float32Array(count * 3)
  const scales   = new Float32Array(count)
  const opacities= new Float32Array(count)
  const colors   = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const t  = i / count

    /* ── Config A ── */
    if (t < 0.35) {
      // Zone 1: main body cloud — wide and moderately deep
      posA[i3]     = gRand(0, 3.5)
      posA[i3 + 1] = gRand(0, 1.5)
      posA[i3 + 2] = gRand(0, 2.0)
    } else if (t < 0.60) {
      // Zone 2: floor sweep — wide and flat at y≈-1.7
      posA[i3]     = gRand(0, 4.0)
      posA[i3 + 1] = gRand(-1.7, 0.35)
      posA[i3 + 2] = gRand(0, 3.5)
    } else if (t < 0.80) {
      // Zone 3: bright focus cluster — tight core at origin
      posA[i3]     = gRand(0, 1.0)
      posA[i3 + 1] = gRand(0, 0.8)
      posA[i3 + 2] = gRand(0, 1.0)
    } else {
      // Zone 4: wide ambient haze — fills edges of frame
      posA[i3]     = gRand(0, 5.0)
      posA[i3 + 1] = gRand(0, 2.5)
      posA[i3 + 2] = gRand(0, 4.0)
    }

    /* ── Config B: nebula sphere ── */
    const r     = 0.5 + Math.random() * 3.5
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    posB[i3]     = r * Math.sin(phi) * Math.cos(theta)
    posB[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
    posB[i3 + 2] = r * Math.cos(phi)

    /* Scale — biased toward medium/large for the dense accumulation look */
    const sr = Math.random()
    if      (sr < 0.10) scales[i] = 0.3 + Math.random() * 0.4  // tiny accent
    else if (sr < 0.50) scales[i] = 0.8 + Math.random() * 1.2  // medium body
    else                scales[i] = 1.5 + Math.random() * 3.0  // large haze

    /*
     * Opacity — critically low so 25K particles accumulate rather than
     * each being individually visible. Additive blending stacks them.
     *   Large haze blobs:  0.008–0.018  (nearly invisible alone, but 5+ overlap = glow)
     *   Medium/tiny:       0.012–0.040  (slightly more visible for structure)
     */
    opacities[i] = scales[i] > 2.5
      ? 0.008 + Math.random() * 0.010
      : 0.012 + Math.random() * 0.028

    /* Color from palette */
    const col = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    colors[i3]     = col[0]
    colors[i3 + 1] = col[1]
    colors[i3 + 2] = col[2]
  }

  return { posA, posB, scales, opacities, colors }
}

/* ─── Component ─────────────────────────────────────────────────────────── */
/*
 * TUNING GUIDE (change these numbers to adjust the look):
 *
 *   uSize  (default 120):  larger = bigger particles, more overlap, smoother cloud
 *   clamp  (default 250):  max pixel size per particle; raise for even softer haze
 *   sigma core (8.0):      lower = softer centre; raise = tighter bright dot
 *   sigma halo (1.5):      lower = wider glow; raise = tighter glow
 *   opacity min/max:       lower = more ethereal; higher = more opaque
 *   count:                 more particles = denser cloud, heavier GPU load
 */
export default function SplatParticles({ count = 28000, isDark = true }) {
  const timeRef = useRef(0)

  const { geometry, material } = useMemo(() => {
    const { posA, posB, scales, opacities, colors } = buildBuffers(count)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position',   new THREE.BufferAttribute(posA,     3))
    geo.setAttribute('aPositionB', new THREE.BufferAttribute(posB,     3))
    geo.setAttribute('aScale',     new THREE.BufferAttribute(scales,   1))
    geo.setAttribute('aOpacity',   new THREE.BufferAttribute(opacities,1))
    geo.setAttribute('aColor',     new THREE.BufferAttribute(colors,   3))

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
      depthTest:   false,
      transparent: true,
      uniforms: {
        uTime:          { value: 0 },
        uSize:          { value: 120 },
        uPixelRatio:    { value: Math.min(window.devicePixelRatio, 2) },
        uMorphProgress: { value: 0 },
        uBrightness:    { value: isDark ? 1.0 : 0.45 },
      },
    })

    return { geometry: geo, material: mat }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  useFrame((_, delta) => {
    timeRef.current += delta * 0.4
    material.uniforms.uTime.value = timeRef.current
    // Slow sine morph: ~38s full cycle
    const autoMorph = (Math.sin(timeRef.current * 0.165) + 1) / 2
    material.uniforms.uMorphProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uMorphProgress.value,
      autoMorph,
      0.035
    )
    material.uniforms.uBrightness.value = isDark ? 1.0 : 0.45
  })

  return <points geometry={geometry} material={material} />
}
