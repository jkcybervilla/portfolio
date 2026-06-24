import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { HERO_CONFIG } from '../config/hero.config'

const goldColor = HERO_CONFIG.brand.accentColor

export default function HeroSection({ scrollProgress }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const contentRef = useRef(null)
  const prevIndexRef = useRef(0)

  // Determine active stage from scrollProgress
  useEffect(() => {
    const progress = scrollProgress
    let idx = 0
    for (let i = 0; i < HERO_CONFIG.stages.length; i++) {
      const [start, end] = HERO_CONFIG.stages[i].range
      if (progress >= start && progress < end) {
        idx = i
        break
      }
      // If at the end, keep last stage
      if (progress >= 0.99) {
        idx = HERO_CONFIG.stages.length - 1
      }
    }

    if (idx !== prevIndexRef.current) {
      prevIndexRef.current = idx
      setActiveIndex(idx)

      // GSAP animation on content change
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
      }
    }
  }, [scrollProgress])

  const activeStage = HERO_CONFIG.stages[activeIndex]

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Top center — Brand */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <h1
          className="text-xs md:text-sm tracking-[0.3em] uppercase font-light"
          style={{ color: goldColor }}
        >
          {HERO_CONFIG.brand.companyName}
        </h1>
        <p
          className="text-[10px] md:text-xs italic mt-1 opacity-70"
          style={{ color: HERO_CONFIG.brand.textColor }}
        >
          {HERO_CONFIG.brand.tagline}
        </p>
      </div>

      {/* Left side — Active stage content */}
      <div
        ref={contentRef}
        className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 max-w-xs pointer-events-auto"
      >
        <h2
          className="text-2xl md:text-4xl font-light tracking-widest leading-tight"
          style={{ color: HERO_CONFIG.brand.textColor }}
        >
          {activeStage && activeStage.title}
        </h2>
        <p
          className="text-sm md:text-base mt-3 leading-relaxed"
          style={{ color: `${HERO_CONFIG.brand.textColor}b3` }}
        >
          {activeStage && activeStage.description}
        </p>
        <button
          className="mt-6 px-6 py-2 border text-sm tracking-wider transition-colors duration-300"
          style={{
            borderColor: goldColor,
            color: goldColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = goldColor
            e.currentTarget.style.color = '#000'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = goldColor
          }}
        >
          LEARN MORE
        </button>
      </div>

      {/* Right side — Dot navigation */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
        {HERO_CONFIG.stages.map((stage, i) => (
          <button
            key={stage.id}
            className="w-3 h-3 rounded-full border transition-all duration-300"
            style={{
              borderColor: i === activeIndex ? goldColor : 'rgba(255,255,255,0.3)',
              backgroundColor: i === activeIndex ? goldColor : 'transparent',
            }}
            aria-label={stage.title}
          />
        ))}
      </div>

      {/* Bottom center — Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={goldColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5" />
            <path d="M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>
    </div>
  )
}