import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroCanvas from '../components/HeroCanvas'
import HeroSection from '../components/HeroSection'
import useLenis from '../hooks/useLenis'
import { HERO_CONFIG } from '../config/hero.config'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollSceneRef = useRef(null)
  const triggerRef = useRef(null)

  // Initialize Lenis
  useLenis()

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const pinDistance = isMobile
      ? HERO_CONFIG.scroll.mobilePinDistance
      : HERO_CONFIG.scroll.desktopPinDistance

    const el = scrollSceneRef.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: `+=${pinDistance}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        setScrollProgress(self.progress)
      },
    })

    triggerRef.current = trigger

    return () => {
      trigger.kill()
    }
  }, [])

  return (
    <div
      ref={scrollSceneRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: HERO_CONFIG.background.color }}
    >
      <HeroCanvas scrollProgress={scrollProgress} />
      <HeroSection scrollProgress={scrollProgress} />
    </div>
  )
}