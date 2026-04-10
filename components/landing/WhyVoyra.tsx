'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MapPin, Activity, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: <MapPin size={22} color="#0071E3" />,
    title: 'Real Voices',
    desc: '250,000+ curated tips. Zero hallucination. Dated, verified, and geo-tagged to the exact neighborhood.',
  },
  {
    icon: <Activity size={22} color="#0071E3" />,
    title: 'Live Intelligence',
    desc: 'Current entry fees, crowd patterns, and seasonal pricing — updated weekly by real travelers on the ground.',
  },
  {
    icon: <Clock size={22} color="#0071E3" />,
    title: 'Timing Mastery',
    desc: 'The exact hour to visit every attraction. When locals actually go — not what the tourist brochure says.',
  },
]

export default function WhyVoyra() {
  const colRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

  useGSAP(() => {
    colRefs.forEach((ref, i) => {
      if (!ref.current) return
      gsap.fromTo(ref.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 78%',
          }
        }
      )
    })
  }, [])

  return (
    <section id="discover" className="section-alt">
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <span className="section-label">Why VOYRA</span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 72 }}>
          Generic AI tells you what.{' '}
          <span className="gradient-text">VOYRA tells you how.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }} className="responsive-3col">
          {features.map((f, i) => (
            <div key={f.title} ref={colRefs[i]} style={{ opacity: 0 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: '#E8E8ED',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.02em' }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .responsive-3col { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
