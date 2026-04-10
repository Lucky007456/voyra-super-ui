'use client'

import { useRef, useState, useEffect } from 'react'

const PANELS = [
  {
    id: 'itinerary',
    title: 'Day Itinerary',
    content: (
      <div className="glass-card" style={{ maxWidth: 440, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 17 }}>Day 2 — Kyoto</div>
            <div style={{ fontSize: 13, color: '#6E6E73' }}>Tuesday, Nov 19</div>
          </div>
          <span style={{ background: '#EBF5FF', color: '#0071E3', borderRadius: 980, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>3 Activities</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderLeft: '2px solid #E5E5EA', paddingLeft: 16 }}>
          {/* Highlighted activity */}
          <div style={{ background: '#EBF5FF', borderRadius: 12, padding: 16 }}>
            <span style={{ background: '#0071E3', color: '#fff', borderRadius: 980, padding: '4px 12px', fontSize: 11, fontWeight: 500 }}>6:30 AM</span>
            <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>Fushimi Inari Shrine</div>
            <div style={{ borderLeft: '3px solid #0071E3', paddingLeft: 12, marginTop: 10, fontStyle: 'italic', fontSize: 13, color: '#1D1D1F', background: 'rgba(0,113,227,0.05)', borderRadius: '0 8px 8px 0', padding: '8px 12px' }}>
              💡 Enter from the back via Nishino Inari — skips 80% of crowds even on weekends.
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: '#34C759', fontWeight: 500 }}>¥0 — Free Entry</div>
          </div>
          <div style={{ padding: '8px 0', fontSize: 14, color: '#6E6E73' }}>
            <strong style={{ color: '#1D1D1F' }}>9:00 AM</strong> · Arashiyama Bamboo Grove · ¥500
          </div>
          <div style={{ padding: '8px 0', fontSize: 14, color: '#6E6E73' }}>
            <strong style={{ color: '#1D1D1F' }}>12:30 PM</strong> · Nishiki Market lunch · ~¥1,200
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'crowd',
    title: 'Crowd Radar',
    content: (
      <div className="glass-card" style={{ maxWidth: 440, padding: 32 }}>
        <span className="section-label">Crowd Radar</span>
        <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 20 }}>Fushimi Inari — Live Busyness</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80, marginBottom: 8 }}>
          {[
            { h: 20, color: '#34C759' }, { h: 25, color: '#34C759' },
            { h: 70, color: '#FF3B30' }, { h: 80, color: '#FF3B30' },
            { h: 75, color: '#FF3B30' }, { h: 65, color: '#FF9F0A' },
            { h: 45, color: '#FF9F0A' }, { h: 40, color: '#FF9F0A' },
            { h: 30, color: '#FF9F0A' }, { h: 55, color: '#FF9F0A' },
            { h: 60, color: '#FF3B30' }, { h: 70, color: '#FF3B30' },
            { h: 50, color: '#FF9F0A' }, { h: 35, color: '#FF9F0A' },
            { h: 20, color: '#34C759' }, { h: 15, color: '#34C759' },
            { h: 12, color: '#34C759' }, { h: 10, color: '#34C759' },
          ].map((bar, i) => (
            <div key={i} style={{ flex: 1, height: `${bar.h}%`, background: bar.color, borderRadius: 3 }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6E6E73', marginBottom: 16 }}>
          {['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'].map(t => <span key={t}>{t}</span>)}
        </div>
        <div style={{ background: '#EDFAF2', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#1A7F3C', display: 'inline-flex', gap: 8 }}>
          ✓ Best time: 6–8 AM · Last updated 2 hrs ago
        </div>
      </div>
    )
  },
  {
    id: 'budget',
    title: 'Budget Reality',
    content: (
      <div className="glass-card" style={{ maxWidth: 440, padding: 32 }}>
        <span className="section-label">Price Truth</span>
        <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 24 }}>5 Days in Kyoto — Real Costs</div>
        {[
          { label: 'Accommodation', pct: 40, amt: '$320', color: '#0071E3' },
          { label: 'Food', pct: 25, amt: '$200', color: '#34C759' },
          { label: 'Activities', pct: 20, amt: '$160', color: '#FF9F0A' },
          { label: 'Transport', pct: 15, amt: '$120', color: '#636366' },
        ].map(row => (
          <div key={row.label} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: '#1D1D1F', fontWeight: 500 }}>{row.label}</span>
              <span style={{ color: row.color, fontWeight: 600 }}>{row.amt}</span>
            </div>
            <div style={{ height: 6, background: '#F5F5F7', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: 16, marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 20 }}>Total $800 <span style={{ fontSize: 14, color: '#6E6E73', fontWeight: 400 }}>· $160/day avg</span></div>
          <div style={{ fontSize: 12, color: '#6E6E73', marginTop: 6 }}>Based on 847 real traveler reports</div>
        </div>
      </div>
    )
  },
  {
    id: 'tips',
    title: 'Insider Tips',
    content: (
      <div className="glass-card" style={{ maxWidth: 440, padding: 40 }}>
        <blockquote style={{ fontSize: 22, fontStyle: 'italic', lineHeight: 1.5, color: '#1D1D1F', margin: 0 }}>
          "The Philosopher's Path at 7 AM in November — cherry trees bare, mist on the canal, absolute silence. I cried. Don't miss it."
        </blockquote>
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', margin: '24px 0' }} />
        <div style={{ fontSize: 14, color: '#6E6E73' }}>— Nadia W. · Kyoto · November 2024</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          <span className="chip-dark">🌿 Nature</span>
          <span className="chip-dark">⏰ Timing</span>
          <span className="chip-dark">📸 Photography</span>
        </div>
      </div>
    )
  }
]

export default function FeatureWalk() {
  const [activePanel, setActivePanel] = useState(0)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = panelRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) setActivePanel(idx)
          }
        })
      },
      { threshold: 0.5 }
    )
    panelRefs.current.forEach(ref => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="section-light">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0 }}>
        {/* Left sticky panel */}
        <div
          className="feature-walk-left"
          style={{ width: '42%', position: 'sticky', top: 96, alignSelf: 'flex-start', paddingRight: 64 }}
        >
          <span className="section-label">VOYRA Intelligence</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
            Your itinerary. Built like a local planned it.
          </h2>
          <p style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.7, marginBottom: 40 }}>
            Each day crafted around real traveler timing, verified crowd patterns, and insider access you won't find in any travel blog.
          </p>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {PANELS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activePanel ? 8 : 6,
                  height: i === activePanel ? 8 : 6,
                  borderRadius: '50%',
                  background: i === activePanel ? '#0071E3' : '#D1D1D6',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => panelRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              />
            ))}
          </div>
        </div>

        {/* Right scroll panels */}
        <div className="feature-walk-right" style={{ width: '58%', display: 'flex', flexDirection: 'column' }}>
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              ref={el => { panelRefs.current[i] = el }}
              className="feature-walk-panel"
              style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}
            >
              {panel.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
