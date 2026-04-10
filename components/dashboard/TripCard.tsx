'use client'

import { useEffect, useState } from 'react'
import { Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Trip } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface TripCardProps {
  trip: Trip
  onDelete: (id: string) => void
}

export default function TripCard({ trip, onDelete }: TripCardProps) {
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoAuthor, setPhotoAuthor] = useState('')

  useEffect(() => {
    fetch(`/api/photos?q=${encodeURIComponent(trip.destination + ' travel')}&count=1&mode=destination`)
      .then(r => r.json())
      .then(data => {
        if (data.photo?.thumb) setPhoto(data.photo.thumb)
        if (data.photo?.author) setPhotoAuthor(data.photo.author)
      })
      .catch(() => {})
  }, [trip.destination])

  const created = new Date(trip.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Destination photo banner */}
      <div style={{ height: 140, background: '#1c1c1e', position: 'relative', overflow: 'hidden' }}>
        {photo && (
          <img
            src={photo}
            alt={trip.destination}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
        }} />
        {/* Destination name on image */}
        <div style={{
          position: 'absolute', bottom: 12, left: 16,
          color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em',
          textShadow: '0 1px 6px rgba(0,0,0,0.4)',
        }}>
          {trip.destination}
        </div>
        {/* Attribution */}
        {photoAuthor && (
          <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
            📸 {photoAuthor}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <span className="chip-dark">📅 {trip.duration} days</span>
          <span className="chip-dark">👥 {trip.travelers}</span>
          <span className="chip-dark">💰 {trip.result?.budget_breakdown ? formatCurrency(trip.result.budget_breakdown.total, trip.result.budget_breakdown.currency) : trip.budget}</span>
        </div>
        <p style={{
          fontSize: 14, color: '#6E6E73', lineHeight: 1.5, margin: '0 0 16px',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>
          {trip.result?.tagline || 'Your personalized travel itinerary'}
        </p>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 12, borderTop: '0.5px solid rgba(0,0,0,0.06)',
        }}>
          <div>
            <Link href={`/trip/${trip.id}`} style={{ textDecoration: 'none' }}>
              <span style={{
                color: '#0071E3', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}>
                View Itinerary <ExternalLink size={12} />
              </span>
            </Link>
            <div style={{ fontSize: 12, color: '#6E6E73', marginTop: 4 }}>{created}</div>
          </div>
          <button
            onClick={() => onDelete(trip.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#6E6E73', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FF3B30')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6E6E73')}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
