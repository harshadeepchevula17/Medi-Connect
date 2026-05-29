import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation(ref, options = {}) {
  const {
    animation = 'fadeUp',
    delay = 0,
    duration = 1,
    start = 'top 85%',
    toggleActions = 'play none none reverse',
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const animations = {
      fadeUp: { y: 60, opacity: 0 },
      fadeLeft: { x: -60, opacity: 0 },
      fadeRight: { x: 60, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      rotate: { rotation: 15, opacity: 0 },
    }

    const fromVars = animations[animation] || animations.fadeUp

    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, {
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions,
        },
      })
    })

    return () => ctx.revert()
  }, [ref, animation, delay, duration, start, toggleActions])
}

export function useParallax(ref, speed = 0.5) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => (1 - speed) * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [ref, speed])
}
