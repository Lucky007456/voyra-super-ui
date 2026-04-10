'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

// Fallback static images while live ones load
const DESTINATIONS = [
  { name: 'Swiss Alps',  country: 'Switzerland', flag: '🇨🇭', query: 'Swiss Alps mountains snow' },
  { name: 'Santorini',   country: 'Greece',       flag: '🇬🇷', query: 'Santorini Greece blue domes' },
  { name: 'Tokyo',       country: 'Japan',        flag: '🇯🇵', query: 'Tokyo Japan city night' },
  { name: 'Iceland',     country: 'Iceland',      flag: '🇮🇸', query: 'Iceland northern lights waterfall' },
  { name: 'Marrakech',   country: 'Morocco',      flag: '🇲🇦', query: 'Marrakech Morocco medina' },
]

const FALLBACKS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=85',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=85',
  'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1920&q=85',
  'https://images.unsplash.com/photo-1533630871071-fe3d9e3afcef?w=1920&q=85',
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [photos, setPhotos] = useState<string[]>(FALLBACKS)
  const [photoAttribution, setPhotoAttribution] = useState<string>('')

  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)

  // Fetch live Unsplash photos on mount
  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled(
        DESTINATIONS.map(async (dest, i) => {
          const res = await fetch(`/api/photos?q=${encodeURIComponent(dest.query)}&count=1&mode=destination`)
          if (!res.ok) return FALLBACKS[i]
          const data = await res.json()
          return data.photo?.url || FALLBACKS[i]
        })
      )
      setPhotos(results.map((r, i) =>
        r.status === 'fulfilled' ? r.value : FALLBACKS[i]
      ))
    }
    fetchAll()
  }, [])

  // Fetch attribution for current photo
  useEffect(() => {
    const fetchAttribution = async () => {
      const res = await fetch(`/api/photos?q=${encodeURIComponent(DESTINATIONS[currentIndex].query)}&count=1&mode=destination`)
      if (!res.ok) return
      const data = await res.json()
      if (data.photo?.author) setPhotoAttribution(`📸 ${data.photo.author} on Unsplash`)
    }
    fetchAttribution()
  }, [currentIndex])

  // Photo cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % DESTINATIONS.length)
        setIsTransitioning(false)
      }, 1500)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const goTo = useCallback((i: number) => {
    if (i === currentIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(i)
      setIsTransitioning(false)
    }, 600)
  }, [currentIndex])

  // Ken Burns
  useGSAP(() => {
    if (!imgRef.current) return
    gsap.fromTo(imgRef.current,
      { scale: 1 },
      { scale: 1.08, duration: 10, ease: 'none', repeat: -1, yoyo: true }
    )
  }, [currentIndex])

  // Entrance animation
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(h1Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .fromTo(bodyRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .fromTo(btnsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
      .fromTo(chipsRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
  }, [])

  return (
    <section ref={sectionRef} style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Background images */}
      {DESTINATIONS.map((dest, i) => (
        <img
          key={dest.name}
          ref={i === currentIndex ? imgRef : undefined}
          src={photos[i]}
          alt={dest.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === currentIndex ? (isTransitioning ? 0 : 1) : 0,
            transition: 'opacity 1500ms ease',
            transformOrigin: 'center',
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100%', textAlign: 'center',
        padding: '0 24px', color: '#fff',
      }}>
        <span ref={labelRef} className="section-label" style={{ color: 'rgba(255,255,255,0.7)', opacity: 0 }}>
          Introducing VOYRA Intelligence
        </span>

        <h1 ref={h1Ref} style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', fontWeight: 700,
          letterSpacing: '-0.03em', lineHeight: 1.05, maxWidth: 800,
          marginBottom: 24, opacity: 0,
        }}>
          Travel Like You Know<br />The Place.
        </h1>

        <p ref={bodyRef} style={{
          fontSize: 19, color: 'rgba(255,255,255,0.82)',
          maxWidth: 520, lineHeight: 1.6, marginBottom: 40, opacity: 0,
        }}>
          Hyper-local itineraries built from 250,000+ real traveler experiences.
          Not search results. Not hallucinations. Lived intelligence.
        </p>

        <div ref={btnsRef} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', opacity: 0 }}>
          <Link href="/plan">
            <button className="btn-white">Plan My Trip — Free</button>
          </Link>
          <button className="btn-outline">Watch the Story</button>
        </div>

        {/* Destination chips */}
        <div ref={chipsRef} style={{
          display: 'flex', gap: 8, marginTop: 40,
          overflowX: 'auto', maxWidth: '100vw', padding: '0 24px', opacity: 0,
        }}>
          {DESTINATIONS.map((dest, i) => (
            <button
              key={dest.name}
              onClick={() => goTo(i)}
              className="chip"
              style={{
                background: i === currentIndex ? 'rgba(255,255,255,0.22)' : undefined,
                border: i === currentIndex ? '0.5px solid rgba(255,255,255,0.5)' : undefined,
              }}
            >
              {dest.flag} {dest.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, color: 'rgba(255,255,255,0.5)',
      }}>
        <span style={{ fontSize: 10, letterSpacing: '0.15em', fontWeight: 500 }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.4)', animation: 'pulse 2s infinite' }} />
      </div>

      {/* Photo attribution */}
      {photoAttribution && (
        <div style={{
          position: 'absolute', bottom: 12, right: 16, zIndex: 3,
          fontSize: 11, color: 'rgba(255,255,255,0.4)',
        }}>
          {photoAttribution}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </section>
  )
}
