'use client'

import { useEffect } from 'react'

export function SmoothScrollProvider() {
  useEffect(() => {
    // Skip Lenis on touch/mobile devices — native scroll is already smooth
    // and Lenis adds significant jank + CPU cost on mobile
    if (window.matchMedia('(pointer: coarse)').matches) return

    let cleanup: (() => void) | undefined
    ;(async () => {
      const { default: Lenis } = await import('lenis')
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
      const id = requestAnimationFrame(raf)
      cleanup = () => { cancelAnimationFrame(id); lenis.destroy() }
    })()

    return () => cleanup?.()
  }, [])

  return null
}
