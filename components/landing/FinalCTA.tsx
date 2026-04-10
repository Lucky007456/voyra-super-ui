'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85'

export default function FinalCTA() {
  const [bgUrl, setBgUrl] = useState(FALLBACK)
  const [attribution, setAttribution] = useState('')

  useEffect(() => {
    fetch('/api/photos?q=epic+mountain+travel+adventure+landscape&count=1&mode=destination')
      .then(r => r.json())
      .then(data => {
        if (data.photo?.url) setBgUrl(data.photo.url)
        if (data.photo?.author) setAttribution(`📸 ${data.photo.author}`)
      })
      .catch(() => {})
  }, [])

  return (
    <section style={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
      <img
        src={bgUrl}
        alt="Epic travel landscape"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.8s' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.60)' }} />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 24px',
      }}>
        <h2 style={{
          fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 700,
          letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.15, marginBottom: 40,
        }}>
          The world is waiting.<br />Stop guessing.
        </h2>
        <Link href="/plan">
          <button className="btn-white" style={{ height: 56, padding: '0 36px', fontSize: 18 }}>
            Plan My Trip — It&apos;s Free
          </button>
        </Link>
        <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
          No credit card. No account needed.
        </p>
      </div>

      {attribution && (
        <div style={{ position: 'absolute', bottom: 12, right: 16, zIndex: 3, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          {attribution} on Unsplash
        </div>
      )}
    </section>
  )
}
