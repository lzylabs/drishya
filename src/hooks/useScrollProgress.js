import { useEffect, useRef } from 'react'

/**
 * Returns a ref whose `.current` value is the scroll progress (0–1)
 * within a given trigger element. Updates on every scroll event without
 * triggering React re-renders (intentional — keeps 3D loop fast).
 */
export function useScrollProgress(triggerRef) {
  const progressRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = triggerRef?.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const viewH = window.innerHeight
      // progress 0 → 1 as the element scrolls past the viewport
      const progress = Math.min(1, Math.max(0, (-top) / (height - viewH)))
      progressRef.current = progress
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initialise
    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerRef])

  return progressRef
}
