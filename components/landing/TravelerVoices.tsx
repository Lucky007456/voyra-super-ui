'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const QUOTES = [
  {
    location: '🇮🇹 Venice',
    date: 'March 2025',
    quote: 'Skip Rialto Market. Mercato di San Polo on Tuesday mornings — same vendors, 40% cheaper, zero tourists. Locals actually talk to you.',
    author: '— Giulia M.',
  },
  {
    location: '🇯🇵 Kyoto',
    date: 'November 2024',
    quote: 'Fushimi Inari at 6:15 AM. Torii gates completely to yourself. By 9 AM it\'s wall-to-wall tourists. The difference is surreal.',
    author: '— Kenji R.',
  },
  {
    location: '🇲🇦 Marrakech',
    date: 'January 2025',
    quote: 'Never eat on Jemaa el-Fna. Walk one alley back — half price, real tagine, eating next to Moroccan families.',
    author: '— Amara L.',
  },
  {
    location: '🇵🇹 Lisbon',
    date: 'April 2025',
    quote: 'Tram 28 is overrun with pickpockets. Walk Alfama — same views, no crowds, places not on any map.',
    author: '— Diego F.',
  },
]

export default function TravelerVoices() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(card,
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7,
          delay: i * 0.12,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
        }
      )
    })
  }, [])

  // Drag scroll
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0)
    scrollLeft.current = containerRef.current?.scrollLeft || 0
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - (containerRef.current.offsetLeft || 0)
    const walk = (x - startX.current) * 1.5
    containerRef.current.scrollLeft = scrollLeft.current - walk
  }
  const onMouseUp = () => {
    isDragging.current = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
  }

  return (
    <section className="section-light" style={{ overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 56, padding: '0 24px' }}>
        <span className="section-label">VOYRA Intel</span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Not generated. Lived.
        </h2>
      </div>

      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          cursor: 'grab',
          padding: `0 max(24px, calc((100vw - 1100px) / 2))`,
          paddingBottom: 8,
          userSelect: 'none',
        }}
      >
        {QUOTES.map((q, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el }}
            className="glass-card"
            style={{ minWidth: 380, flexShrink: 0, padding: 40, display: 'flex', flexDirection: 'column', gap: 20, opacity: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="chip-dark">{q.location}</span>
              <span style={{ fontSize: 13, color: '#6E6E73' }}>{q.date}</span>
            </div>
            <blockquote style={{ fontStyle: 'italic', fontSize: 19, lineHeight: 1.6, flex: 1, margin: 0, color: '#1D1D1F' }}>
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <div style={{ fontSize: 14, color: '#6E6E73' }}>{q.author}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
