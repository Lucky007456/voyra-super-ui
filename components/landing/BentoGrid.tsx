'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!gridRef.current) return
    const tiles = gridRef.current.querySelectorAll('.bento-tile')
    gsap.fromTo(tiles,
      { scale: 0.93, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.65, stagger: 0.08,
        scrollTrigger: { trigger: gridRef.current, start: 'top 75%' }
      }
    )
  }, [])

  return (
    <section id="intelligence" className="section-dark">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <span className="section-label" style={{ color: '#6E6E73' }}>Everything you need. Nothing you don&apos;t.</span>

        <div
          ref={gridRef}
          className="bento-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 48 }}
        >
          {/* Tile 1 — Full width */}
          <div
            className="bento-tile bento-tile-full glass-tile-dark"
            style={{
              gridColumn: '1 / -1', minHeight: 280, padding: 48,
              background: 'linear-gradient(135deg, #0a1628, #0d2040)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ maxWidth: 480 }}>
              <span className="section-label" style={{ color: '#60a5fa' }}>Voyage IQ™</span>
              <h3 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                Our AI doesn&apos;t just read reviews.<br />It reads between them.
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginTop: 12, lineHeight: 1.7 }}>
                250,000+ data points. Sentiment analysis. Recency weighting. Zero hallucination.
              </p>
            </div>
            {/* Animated SVG network */}
            <svg style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }} width="200" height="200" viewBox="0 0 200 200">
              <style>{`
                @keyframes dash { to { stroke-dashoffset: -20; } }
                .network-line { stroke-dasharray: 5 3; animation: dash 2s linear infinite; }
              `}</style>
              {[[100,30],[160,70],[170,130],[120,170],[50,160],[20,100],[40,40],[80,100]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r={6} fill="#0071E3" opacity={0.8} />
              ))}
              {[[0,7],[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,1],[7,3]].map(([a,b],i) => {
                const pts = [[100,30],[160,70],[170,130],[120,170],[50,160],[20,100],[40,40],[80,100]]
                const [x1,y1] = pts[a]; const [x2,y2] = pts[b]
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0071E3" strokeWidth={0.8} opacity={0.4} className="network-line" />
              })}
            </svg>
          </div>

          {/* Tile 2 — Crowd Radar */}
          <div className="bento-tile glass-tile-dark" style={{ minHeight: 240, padding: 36, background: '#1c1c1e' }}>
            <span className="section-label" style={{ color: '#34d399' }}>Crowd Radar</span>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 20 }}>See busyness before you arrive.</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50 }}>
              {[
                { h: 30, c: '#34C759' }, { h: 35, c: '#34C759' },
                { h: 55, c: '#FF9F0A' }, { h: 52, c: '#FF9F0A' },
                { h: 80, c: '#FF3B30' }, { h: 85, c: '#FF3B30' }, { h: 90, c: '#FF3B30' },
              ].map((b, i) => (
                <div key={i} style={{ flex: 1, height: `${b.h}%`, background: b.c, borderRadius: 3, opacity: 0.85 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Tile 3 — Price Truth */}
          <div className="bento-tile glass-tile-dark" style={{ minHeight: 240, padding: 36, background: '#1c1c1e' }}>
            <span className="section-label" style={{ color: '#fbbf24' }}>Price Truth</span>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 20 }}>What things actually cost.</h3>
            {[
              { label: 'Museum entry', blog: '$25', real: '$14' },
              { label: 'Street food lunch', blog: '$18', real: '$8' },
              { label: 'Day tour', blog: '$45', real: '$22' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{row.label}</span>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{row.blog}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>{row.real}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tile 4 — Hidden Layer */}
          <div className="bento-tile glass-tile-dark" style={{ minHeight: 240, padding: 36, background: '#0d2116' }}>
            <span className="section-label" style={{ color: '#34d399' }}>Hidden Layer</span>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 12 }}>500+ secret spots per city.</h3>
            <span style={{ background: '#FF3B30', color: '#fff', borderRadius: 980, padding: '4px 12px', fontSize: 12, fontWeight: 500 }}>
              Not on TripAdvisor
            </span>
            <div style={{ marginTop: 20, position: 'relative', height: 60 }}>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                {/* City grid */}
                {[20,50,80,110,140,170].map(x => <line key={x} x1={x} y1={0} x2={x} y2={60} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />)}
                {[15,30,45].map(y => <line key={y} x1={0} y1={y} x2={200} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />)}
                {/* Map pins */}
                {[[30,20],[80,35],[120,15],[170,40],[55,50]].map(([x,y],i) => (
                  <g key={i} style={{ animationDelay: `${i*0.4}s` }}>
                    <style>{`@keyframes pinPop{0%,${i*20}%{opacity:0;transform:translateY(-4px)}${i*20+5}%,100%{opacity:1;transform:translateY(0)}}`}</style>
                    <circle cx={x} cy={y} r={5} fill="#0071E3" opacity={0} style={{ animation: `pinPop 3s ${i*0.4}s infinite` }} />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Tile 5 — TimeShift */}
          <div className="bento-tile glass-tile-dark" style={{ minHeight: 240, padding: 36, background: '#1a0d2e' }}>
            <span className="section-label" style={{ color: '#c084fc' }}>TimeShift</span>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Best hour. Every attraction.</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 50, position: 'relative' }}>
              {[
                { h: 80, c: '#34C759' }, { h: 85, c: '#34C759' },
                { h: 40, c: '#636366' }, { h: 35, c: '#636366' },
                { h: 30, c: '#636366' }, { h: 45, c: '#636366' },
                { h: 60, c: '#636366' }, { h: 65, c: '#636366' },
                { h: 55, c: '#636366' }, { h: 40, c: '#636366' },
                { h: 30, c: '#636366' }, { h: 25, c: '#636366' },
                { h: 20, c: '#636366' }, { h: 18, c: '#636366' },
                { h: 15, c: '#636366' }, { h: 12, c: '#636366' },
              ].map((b, i) => (
                <div key={i} style={{ flex: 1, height: `${b.h}%`, background: b.c, borderRadius: 3, opacity: 0.85 }} />
              ))}
              <div style={{ position: 'absolute', top: -20, left: 0, fontSize: 10, color: '#34d399', whiteSpace: 'nowrap' }}>
                ← Best window 6–8 AM
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
              {['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>

          {/* Tile 6 — Group merge */}
          <div
            className="bento-tile bento-tile-full glass-tile-dark"
            style={{ gridColumn: '1 / -1', minHeight: 200, padding: 48, background: '#002244', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}
          >
            <div>
              <span className="section-label" style={{ color: '#60a5fa' }}>VOYRA for Groups</span>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>One trip. Every preference respected.</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 280 }}>
              {[
                { label: 'Person A — Foodie', pct: 90, color: '#0071E3' },
                { label: 'Person B — Culture', pct: 60, color: '#c084fc' },
                { label: 'Person C — Adventure', pct: 75, color: '#34d399' },
              ].map(p => (
                <div key={p.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                    <span>{p.label}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: p.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <div style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid #34d399', borderRadius: 10, padding: '10px 16px', marginTop: 8 }}>
                <div style={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>✓ VOYRA Merge: Balanced Plan Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
