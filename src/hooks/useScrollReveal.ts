'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollRevealOptions {
  threshold?: number       // 0–1, default 0.08
  rootMargin?: string      // default '-40px'
  once?: boolean           // default true — animasi cukup sekali
}

/**
 * Hook ringan untuk scroll-triggered reveal.
 * Pakai IntersectionObserver agar tidak membebani main thread.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.08,
    rootMargin = '-40px',
    once = true,
  } = options

  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Jika browser tidak support IO, langsung tampil
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}