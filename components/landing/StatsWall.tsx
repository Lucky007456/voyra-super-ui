'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 250000, suffix: '+', label: 'Real Tips', display: '250,000+' },
  { value: 148, suffix: '+', label: 'Countries', display: '148+' },
  { value: 4.9, suffix: '★', label: 'App Rating', display: '4.9★', isDecimal: true },
  { value: 60, suffix: ' sec', label: 'Avg Plan Time', display: '60 sec', isTime: true },
]

export default function StatsWall() {
  const sectionRef = useRef<HTMLElement>(null)
  const valRefs = useRef<(HTMLSpanElement | null)[]>([])

  useGSAP(() => {
    STATS.forEach((stat, i) => {
      const el = valRefs.current[i]
      if (!el || stat.isTime) return

      const obj = { val: 0 }
      gsap.to(obj, {
        val: stat.value,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        onUpdate: () => {
          if (stat.isDecimal) {
            el.textContent = obj.val.toFixed(1) + stat.suffix
          } else {
            el.textContent = Math.floor(obj.val).toLocaleString() + stat.suffix
          }
        }
      })
    })
  }, [])

  return (
    <section ref={sectionRef} style={{ background: '#000', padding: '100px 24px' }}>
      <div
        className="stats-wall"
        style={{ display: 'flex', maxWidth: 960, margin: '0 auto', textAlign: 'center' }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-item"
            style={{
              flex: 1,
              padding: 32,
              borderRight: i < STATS.length - 1 ? '0.5px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <div style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>
              {stat.isTime
                ? <span>{stat.display}</span>
                : <span ref={el => { valRefs.current[i] = el }}>0{stat.suffix}</span>
              }
            </div>
            <div style={{ fontSize: 14, color: '#6E6E73', marginTop: 8, letterSpacing: '0.05em' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
