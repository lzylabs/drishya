import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Shaders ───────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMorphProgress;
  uniform float uBrightness;   /* 1.0 dark, 0.4 light */

  attribute float aScale;
  attribute float aOpacity;
  attribute vec3  aPositionB;

  varying float vOpacity;

  void main() {
    /* Morph between two particle clouds */
    vec3 pos = mix(position, aPositionB, uMorphProgress);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    /* Per-particle shimmer: extremely subtle */
    float hash = fract(sin(dot(pos.xz, vec2(127.1, 311.7))) * 43758.5453);
    float shimmer = 0.85 + 0.15 * sin(uTime * (0.6 + hash * 0.8) + hash * 6.28);

    /* Perspective point size — standard OpenGL formula */
    /* uSize controls world-space radius; dividing by -mv.z gives screen pixels */
    float dist = max(0.1, -mv.z);
    gl_PointSize = (uSize * aScale * uPixelRatio) / dist;
    gl_PointSize = clamp(gl_PointSize, 1.0, 140.0);

    vOpacity = aOpacity * shimmer * uBrightness;
  }
`

const fragmentShader = /* glsl */ `
  varying float vOpacity;

  void main() {
    /* Gaussian disc — the defining visual of a Gaussian Splat */
    vec2  uv   = gl_PointCoord - 0.5;   /* -0.5 … +0.5 */
    float r2   = dot(uv, uv);            /* 0 … 0.25 at edge */
    /* sigma=0.18 → tight bright core; sigma=0.35 → wider soft halo */
    float core = exp(-r2 * 22.0);        /* tight bright centre */
    float halo = exp(-r2 *  6.0);        /* wide soft glow */
    float alpha = (core * 0.55 + halo * 0.45) * vOpacity;

    if (alpha < 0.004) discard;

    /* Pure white — B&W aesthetic */
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`

/* ─── Gaussian random (Box-Muller) ──────────────────────────────────────── */
function gRand(mean = 0, std = 1) {
  const u = 1 - Math.random()
  const v = Math.random()
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/* ─── Generate two particle configs ─────────────────────────────────────── */
function buildBuffers(count) {
  const posA     = new Float32Array(count * 3)
  const posB     = new Float32Array(count * 3)
  const scales   = new Float32Array(count)
  const opacities= new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const t  = i / count  /* 0..1 */

    /* ── Config A: interior / architectural cloud ── */
    if (t < 0.25) {
      // Core cluster — dense, bright
      posA[i3]     = gRand(0, 0.9)
      posA[i3 + 1] = gRand(0, 0.75)
      posA[i3 + 2] = gRand(0, 0.9)
    } else if (t < 0.45) {
      // Vertical wall smear
      posA[i3]     = gRand(0, 0.25)
      posA[i3 + 1] = gRand(0, 1.8)
      posA[i3 + 2] = gRand(0, 0.25)
    } else if (t < 0.60) {
      // Floor plane
      posA[i3]     = gRand(0, 2.2)
      posA[i3 + 1] = gRand(-1.5, 0.18)
      posA[i3 + 2] = gRand(0, 2.2)
    } else if (t < 0.75) {
      // Ceiling
      posA[i3]     = gRand(0, 1.6)
      posA[i3 + 1] = gRand(1.6, 0.18)
      posA[i3 + 2] = gRand(0, 1.6)
    } else {
      // Wide ambient haze
      posA[i3]     = gRand(0, 3.0)
      posA[i3 + 1] = gRand(0, 3.0)
      posA[i3 + 2] = gRand(0, 3.0)
    }

    /* ── Config B: nebula / exterior sphere ── */
    const r     = 0.3 + Math.random() * 2.8
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    posB[i3]     = r * Math.sin(phi) * Math.cos(theta)
    posB[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55
    posB[i3 + 2] = r * Math.cos(phi)

    /* Splat size: most are medium, a few large for haze, some tiny accent */
    const sizeRand = Math.random()
    if (sizeRand < 0.15)      scales[i] = 0.3 + Math.random() * 0.4   // tiny accent
    else if (sizeRand < 0.55) scales[i] = 1.0 + Math.random() * 1.5   // medium body
    else                       scales[i] = 2.0 + Math.random() * 3.5   // large haze

    /* Opacity: large splats dimmer, small ones can be brighter */
    opacities[i] = scales[i] > 3.0
      ? 0.03 + Math.random() * 0.10  // haze blobs: very transparent
      : 0.08 + Math.random() * 0.35  // body + accent: more opaque
  }

  return { posA, posB, scales, opacities }
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function SplatParticles({ count = 4000, morphProgress = 0, isDark = true }) {
  const timeRef = useRef(0)

  const { geometry, material } = useMemo(() => {
    const { posA, posB, scales, opacities } = buildBuffers(count)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position',   new THREE.BufferAttribute(posA,     3))
    geo.setAttribute('aPositionB', new THREE.BufferAttribute(posB,     3))
    geo.setAttribute('aScale',     new THREE.BufferAttribute(scales,   1))
    geo.setAttribute('aOpacity',   new THREE.BufferAttribute(opacities,1))

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
      depthTest:   false,
      transparent: true,
      uniforms: {
        uTime:          { value: 0 },
        uSize:          { value: 2.8 },  /* world-space radius unit */
        uPixelRatio:    { value: Math.min(window.devicePixelRatio, 2) },
        uMorphProgress: { value: 0 },
        uBrightness:    { value: isDark ? 1.0 : 0.55 },
      },
    })

    return { geometry: geo, material: mat }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, isDark])

  useFrame((_, delta) => {
    timeRef.current += delta * 0.5
    material.uniforms.uTime.value = timeRef.current
    // Smooth morph lerp
    material.uniforms.uMorphProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uMorphProgress.value,
      morphProgress,
      0.025
    )
    material.uniforms.uBrightness.value = isDark ? 1.0 : 0.55
  })

  return <points geometry={geometry} material={material} />
}
