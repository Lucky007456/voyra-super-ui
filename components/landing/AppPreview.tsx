'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SCREENS = [
  {
    id: 'chat',
    content: (
      <div style={{ background: '#fff', padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          VOYRA <span style={{ width: 7, height: 7, background: '#34C759', borderRadius: '50%', display: 'inline-block' }} />
        </div>
        {/* User bubble */}
        <div style={{ alignSelf: 'flex-end', background: '#0071E3', color: '#fff', borderRadius: 14, padding: '10px 14px', fontSize: 12, maxWidth: '80%', lineHeight: 1.5 }}>
          Plan 5 days Tokyo, 2 people, $2000 budget, food + culture
        </div>
        {/* Typing indicator */}
        <div style={{ alignSelf: 'flex-start', background: '#f5f5f7', borderRadius: 14, padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <span key={i} style={{ width: 6, height: 6, background: '#6E6E73', borderRadius: '50%', display: 'inline-block', animation: `bounce 0.8s ${delay}s infinite` }} />
          ))}
        </div>
        {/* AI response */}
        <div style={{ background: '#f5f5f7', borderRadius: 14, padding: 12, fontSize: 12, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>✦ Building your Tokyo itinerary...</div>
          <div style={{ height: 6, background: '#e5e5e7', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '70%', background: '#0071E3', borderRadius: 3, animation: 'progressBar 3s ease infinite' }} />
          </div>
        </div>
        <style>{`
          @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
          @keyframes progressBar { 0%{width:0%} 100%{width:95%} }
        `}</style>
      </div>
    )
  },
  {
    id: 'map',
    content: (
      <div style={{ background: '#1c1c1e', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Dark map SVG */}
        <svg width="100%" height="60%" viewBox="0 0 300 160" style={{ flex: 1 }}>
          {/* Grid lines */}
          {[40,80,120,160,200,240].map(x => <line key={x} x1={x} y1={0} x2={x} y2={160} stroke="#2c2c2e" strokeWidth={1} />)}
          {[30,60,90,120].map(y => <line key={y} x1={0} y1={y} x2={300} y2={y} stroke="#2c2c2e" strokeWidth={1} />)}
          {/* Blue pins */}
          {[[60,40],[120,70],[180,45],[240,80],[90,110],[200,120]].map(([x,y],i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={10} fill="#0071E3" opacity={0.9} />
              <text x={x} y={y+4} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">{i+1}</text>
            </g>
          ))}
        </svg>
        {/* Bottom sheet */}
        <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Day 2 — 6 stops planned</div>
          {['Senso-ji Temple · 8:00 AM', 'Tsukiji Market · 10:30 AM', 'Shibuya Crossing · 2:00 PM'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 16, height: 16, background: '#0071E3', borderRadius: '50%', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
              <span style={{ fontSize: 11, color: '#6E6E73' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'tips',
    content: (
      <div style={{ background: '#f5f5f5', height: '100%', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Voyra Intel · Tokyo</div>
        {[
          { flag: '🇯🇵', city: 'Tokyo', tip: 'Tsukiji before 7 AM — freshest sushi, no queues', upvotes: 847 },
          { flag: '🇯🇵', city: 'Shinjuku', tip: 'Golden Gai on Tuesday nights — local bartenders open up', upvotes: 634 },
          { flag: '🇯🇵', city: 'Harajuku', tip: 'Takeshita-dori at 9 AM is empty — same street, no crowds', upvotes: 521 },
        ].map((tip, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 10, padding: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{tip.flag}</span>
              <span style={{ background: '#f5f5f7', borderRadius: 980, padding: '2px 8px', fontSize: 10, fontWeight: 500 }}>{tip.city}</span>
            </div>
            <div style={{ fontSize: 11, color: '#1D1D1F', lineHeight: 1.5 }}>{tip.tip}</div>
            <div style={{ fontSize: 10, color: '#6E6E73', marginTop: 4 }}>▲ {tip.upvotes}</div>
          </div>
        ))}
      </div>
    )
  }
]

export default function AppPreview() {
  const [activeScreen, setActiveScreen] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen(prev => (prev + 1) % SCREENS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="section-alt">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Browser mockup */}
        <div style={{ width: 'min(480px, 100%)', background: '#1c1c1e', borderRadius: 12, border: '1px solid #3a3a3c', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
          {/* Browser chrome */}
          <div style={{ background: '#2c2c2e', height: 36, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#FF3B30', '#FF9F0A', '#34C759'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
            <div style={{ flex: 1, background: '#1c1c1e', borderRadius: 4, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#6E6E73' }}>voyra.ai</span>
            </div>
          </div>
          {/* Screen content */}
          <div style={{ height: 340, overflow: 'hidden', position: 'relative' }}>
            {SCREENS.map((screen, i) => (
              <div
                key={screen.id}
                style={{
                  position: 'absolute', inset: 0,
                  opacity: i === activeScreen ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              >
                {screen.content}
              </div>
            ))}
          </div>
          {/* Screen dots */}
          <div style={{ background: '#1c1c1e', padding: '8px', display: 'flex', justifyContent: 'center', gap: 6 }}>
            {SCREENS.map((_, i) => (
              <div
                key={i}
                onClick={() => setActiveScreen(i)}
                style={{ width: i === activeScreen ? 16 : 6, height: 6, borderRadius: 3, background: i === activeScreen ? '#0071E3' : '#3a3a3c', transition: 'all 0.3s ease', cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 400 }}>
          <span className="section-label">VOYRA FOR WEB & MOBILE</span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
            Your trip. <span className="gradient-text">In your pocket.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#6E6E73', lineHeight: 1.7, marginBottom: 40 }}>
            Real-time crowd alerts, offline-ready itineraries, and your full trip plan — accessible anywhere, even 30,000 feet up.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/plan">
              <button className="btn-primary">Start Planning Free</button>
            </Link>
            <button className="btn-ghost">View Live Demo</button>
          </div>
        </div>
      </div>
    </section>
  )
}
