/**
 * Shared mutable config for the hero viewer.
 *
 * Written by ViewerControls (UI sliders) and read every frame by
 * SplatPointCloud and CameraController — no React state overhead.
 */
export const config = {
  uSize:          22,
  brightness:     1.0,          // diagnostic: 1.0 (NormalBlending); switch to 0.12 for additive
  rotationRange:  Math.PI / 2,  // ±90° — more room to wiggle
  elevationRange: 0.25,         // ±14° up/down
  lerpSpeed:      0.07,         // snappier than the old 0.04
  orbitR:         6.0,
}
