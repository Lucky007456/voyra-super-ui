'use client'

import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import dynamic from 'next/dynamic'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, X, Sparkles, Loader2 } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import BudgetView from '@/components/trip/BudgetView'
import HiddenGemsView from '@/components/trip/HiddenGemsView'
import { parseTripJSON, formatCurrency } from '@/lib/utils'
import type { TripResult } from '@/lib/types'

const MapView = dynamic(() => import('@/components/trip/MapView'), { ssr: false })

const INTEREST_OPTIONS = [
  { emoji: '🍜', label: 'Food' },
  { emoji: '🏛️', label: 'Culture' },
  { emoji: '🌿', label: 'Nature' },
  { emoji: '🧗', label: 'Adventure' },
  { emoji: '🌙', label: 'Nightlife' },
  { emoji: '💎', label: 'Hidden Gems' },
  { emoji: '📸', label: 'Photography' },
  { emoji: '🏖️', label: 'Beach' },
  { emoji: '🎭', label: 'Arts' },
]

const QUICK_DESTINATIONS = [
  { flag: '🗾', name: 'Tokyo' },
  { flag: '🇮🇹', name: 'Rome' },
  { flag: '🇮🇩', name: 'Bali' },
  { flag: '🇦🇪', name: 'Dubai' },
  { flag: '🇮🇸', name: 'Iceland' },
  { flag: '🇵🇹', name: 'Lisbon' },
]

const CATEGORY_COLORS: Record<string, string> = {
  food: '#FF9F0A',
  culture: '#5856D6',
  nature: '#34C759',
  transport: '#636366',
  accommodation: '#0071E3',
}

export default function PlanPage() {
  const [destination, setDestination] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [travelers, setTravelers] = useState('2 People')
  const [budget, setBudget] = useState('Mid ($100–250)')
  const [interests, setInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TripResult | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [destPhoto, setDestPhoto] = useState<{ url: string; author: string } | null>(null)

  const calculateDuration = () => {
    if (dateFrom && dateTo) {
      const diff = Math.ceil((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : 5
    }
    return 5
  }

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  useGSAP(() => {}, [])

  const generateTrip = async () => {
    if (!destination) return
    setLoading(true)
    setStreaming(true)
    setStreamedText('')
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          duration: calculateDuration(),
          travelers,
          budget,
          interests,
          userContext: `User Locale: ${navigator.language || 'en-US'}, Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}. IMPORTANT: Detect the currency used in this timezone and return the TOTAL budget and all ALLOCATIONS formatted natively in this local currency (e.g. ₹ for India, £ for UK, € for Europe). Ensure the "currency" field is also set to the local currency code.`
        }),
      })

      if (!res.ok) {
        // Read actual error from server for better debugging
        const errData = await res.json().catch(() => ({}))
        const detail = errData.detail || errData.error || `HTTP ${res.status}`
        console.error('[generate] API error:', detail)
        throw new Error(detail)
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        accumulated += chunk
        setStreamedText(accumulated)
      }

      const parsed = parseTripJSON(accumulated)
      console.log('[VOYRA] Parsed result:', {
        destination: parsed.destination,
        days: parsed.days?.length,
        hasHiddenGems: parsed.hidden_gems?.length,
        rawLength: accumulated.length,
        rawPreview: accumulated.slice(0, 200),
      })
      setResult(parsed)

      // Fetch destination photo from Unsplash
      fetch(`/api/photos?q=${encodeURIComponent(destination + ' travel landmark')}&count=1&mode=destination`)
        .then(r => r.json())
        .then(data => {
          if (data.photo) setDestPhoto({ url: data.photo.url, author: data.photo.author })
        })
        .catch(() => {})

      setTimeout(() => {
        gsap.fromTo('#results-panel', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7 })
        document.getElementById('results-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  const saveTrip = async () => {
    if (!result) return
    setSaveStatus('saving')
    try {
      const saveRes = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: result.destination,
          duration: result.days.length,
          travelers,
          budget,
          interests,
          result,
        }),
      })
      if (saveRes.status === 401) {
        window.location.href = '/sign-in'
        return
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (e) {
      console.error(e)
      setSaveStatus('idle')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleDownloadPDF = async () => {
    if (!result) return
    const { downloadPDF } = await import('@/components/trip/PDFExport')
    await downloadPDF(result)
  }

  const allActivities = result
    ? result.days.flatMap(d => d.activities).filter(a => a.lat && a.lng)
    : []

  const inputStyle = {
    height: 44,
    borderRadius: 22,
    border: '0.5px solid rgba(0,0,0,0.15)',
    padding: '0 16px',
    fontSize: 14,
    background: '#fff',
    color: '#1D1D1F',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  }

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* Top Section */}
      <div style={{ paddingTop: 100, paddingBottom: 60, textAlign: 'center', padding: '100px 24px 60px' }}>
        <span className="section-label">TRY IT FREE</span>
        <h2 style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Where are you going?
        </h2>

        {/* Search */}
        <div style={{ maxWidth: 600, margin: '40px auto 0', position: 'relative' }}>
          <Search
            size={20}
            color="#6E6E73"
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}
          />
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="City, country, or region..."
            style={{
              width: '100%',
              height: 64,
              borderRadius: 50,
              border: '1.5px solid rgba(0,0,0,0.12)',
              fontSize: 18,
              padding: '0 48px 0 52px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#0071E3'
              e.target.style.boxShadow = '0 0 0 4px rgba(0,113,227,0.15)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(0,0,0,0.12)'
              e.target.style.boxShadow = 'none'
            }}
          />
          {destination && (
            <button
              onClick={() => setDestination('')}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6E6E73' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
          {QUICK_DESTINATIONS.map(d => (
            <button
              key={d.name}
              onClick={() => setDestination(d.name)}
              className="chip-dark"
              style={{ background: destination === d.name ? '#0071E3' : undefined, color: destination === d.name ? '#fff' : undefined }}
            >
              {d.flag} {d.name}
            </button>
          ))}
        </div>

        {/* Trip details */}
        <div style={{ maxWidth: 700, margin: '24px auto 0', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={inputStyle}
            />
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={inputStyle}
            />
          </div>

          <select value={travelers} onChange={e => setTravelers(e.target.value)} style={inputStyle}>
            {['Solo', '2 People', 'Family (3–4)', 'Group (5+)'].map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select value={budget} onChange={e => setBudget(e.target.value)} style={inputStyle}>
            {['Budget (<$100/day)', 'Mid ($100–250)', 'Luxury ($250+)'].map(b => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Interests */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 24 }}>
          {INTEREST_OPTIONS.map(({ emoji, label }) => (
            <button
              key={label}
              onClick={() => toggleInterest(label)}
              style={{
                background: interests.includes(label) ? '#0071E3' : 'rgba(0,0,0,0.06)',
                color: interests.includes(label) ? '#fff' : '#1D1D1F',
                border: interests.includes(label) ? '0.5px solid transparent' : '0.5px solid rgba(0,0,0,0.10)',
                borderRadius: 980, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        {/* Generate button */}
        <div style={{ marginTop: 40 }}>
          <button
            className="btn-primary"
            style={{ width: 280, height: 56, fontSize: 18, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            onClick={generateTrip}
            disabled={loading || !destination}
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Crafting your trip...</>
            ) : (
              <><Sparkles size={20} /> Generate My Itinerary</>
            )}
          </button>
        </div>

        {/* Streaming preview */}
        {streaming && streamedText && (
          <div style={{ maxWidth: 600, margin: '16px auto 0' }}>
            <pre style={{ fontSize: 11, color: '#6E6E73', maxHeight: 120, overflow: 'hidden', fontFamily: 'monospace', opacity: 0.6, textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {streamedText.slice(-300)}
            </pre>
          </div>
        )}
      </div>

      {/* Results Panel */}
      {result && (
        <div
          id="results-panel"
          style={{ background: '#F5F5F7', borderRadius: '32px 32px 0 0', marginTop: 60, padding: '48px 24px 80px' }}
        >
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Destination hero photo */}
            {destPhoto && (
              <div style={{ position: 'relative', height: 280, borderRadius: 20, overflow: 'hidden', marginBottom: 32 }}>
                <img
                  src={destPhoto.url}
                  alt={result.destination}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
                }} />
                <div style={{ position: 'absolute', bottom: 24, left: 28, color: '#fff' }}>
                  <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>{result.destination}</h2>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{result.tagline}</p>
                </div>
                {destPhoto.author && (
                  <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    📸 {destPhoto.author} on Unsplash
                  </div>
                )}
              </div>
            )}

            {/* Fallback header when no photo */}
            {!destPhoto && (
              <>
                <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>{result.destination}</h2>
                <p style={{ fontSize: 17, color: '#6E6E73', marginTop: 8 }}>{result.tagline}</p>
              </>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <span className="chip-dark">📅 {result.days.length} days</span>
              <span className="chip-dark">👥 {travelers}</span>
              <span className="chip-dark">💰 Total {formatCurrency(result.budget_breakdown.total, result.budget_breakdown.currency)}</span>
            </div>

            <Tabs defaultValue="itinerary" style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TabsList className="glass-tabs-list">
                <TabsTrigger className="glass-tab" value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger className="glass-tab" value="map">Map</TabsTrigger>
                <TabsTrigger className="glass-tab" value="budget">Budget</TabsTrigger>
                <TabsTrigger className="glass-tab" value="gems">Hidden Gems</TabsTrigger>
              </TabsList>

              {/* Itinerary Tab */}
              <TabsContent value="itinerary" style={{ marginTop: 40, width: '100%', maxWidth: 900 }}>
                <Accordion multiple defaultValue={result.days.length > 0 ? ['day-0'] : []}>
                  {result.days.map((day, dayIdx) => (
                    <AccordionItem key={dayIdx} value={`day-${dayIdx}`} style={{ border: 'none', marginBottom: 24 }}>
                      <AccordionTrigger className="glass-card" style={{ padding: '20px 32px', borderRadius: 24, fontWeight: 600 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                          <span style={{ fontSize: 18, color: '#1D1D1F' }}>Day {day.day} — {day.title}</span>
                          <span style={{ fontWeight: 500, fontSize: 14, color: '#0071E3' }}>{day.date}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent style={{ paddingTop: 24 }}>
                        <div style={{ paddingLeft: 40, position: 'relative', display: 'flex', flexDirection: 'column', gap: 32 }}>
                          {/* Continuous timeline line */}
                          <div style={{ position: 'absolute', left: 40, top: 20, bottom: 20, width: 2, background: 'linear-gradient(to bottom, rgba(0,113,227,0.2), rgba(0,113,227,0.05))', borderRadius: 2, zIndex: 0 }} />
                          
                          {day.activities.map((act, actIdx) => (
                            <div key={actIdx} style={{ position: 'relative', zIndex: 1, paddingLeft: 32 }}>
                              <div className="timeline-dot" />
                              <div className="glass-card" style={{ 
                                padding: '24px', 
                                display: 'flex', 
                                gap: 24, 
                                borderRadius: 20,
                                background: '#FFFFFF',
                                transition: 'transform 0.2s',
                                cursor: 'default'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 90 }}>
                                  <span style={{
                                    background: 'rgba(0,113,227,0.1)', color: '#0071E3', borderRadius: 8,
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, padding: '6px 12px', fontWeight: 600, border: '1px solid rgba(0,113,227,0.2)'
                                  }}>
                                    {act.time}
                                  </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                  {/* Transit from previous */}
                                {act.transit_from_prev && actIdx > 0 && (
                                  <div style={{ fontSize: 12, color: '#6E6E73', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ background: '#F5F5F7', borderRadius: 6, padding: '2px 8px', fontWeight: 500 }}>🚶 {act.transit_from_prev}</span>
                                  </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 600, fontSize: 15 }}>{act.name}</span>
                                  <span style={{
                                    background: CATEGORY_COLORS[act.category] + '1A',
                                    color: CATEGORY_COLORS[act.category],
                                    borderRadius: 980, padding: '2px 10px', fontSize: 11, fontWeight: 500,
                                  }}>
                                    {act.category}
                                  </span>
                                  {act.duration_mins && (
                                    <span style={{ fontSize: 11, color: '#6E6E73', background: '#F5F5F7', borderRadius: 6, padding: '2px 8px' }}>
                                      ⏱ {act.duration_mins >= 60 ? `${Math.floor(act.duration_mins/60)}h${act.duration_mins%60 ? ` ${act.duration_mins%60}m` : ''}` : `${act.duration_mins}m`}
                                    </span>
                                  )}
                                </div>
                                <p style={{ fontSize: 14, color: '#6E6E73', margin: '4px 0 0', lineHeight: 1.6 }}>{act.description}</p>
                                {act.insider_tip && (
                                  <div style={{
                                    marginTop: 12, borderLeft: '3px solid #0071E3', paddingLeft: 12,
                                    background: 'rgba(0,113,227,0.05)', borderRadius: '0 8px 8px 0', padding: '10px 12px',
                                  }}>
                                    <span style={{ fontStyle: 'italic', fontSize: 13, color: '#1D1D1F' }}>💡 {act.insider_tip}</span>
                                  </div>
                                )}
                                <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 13, flexWrap: 'wrap' }}>
                                  <span style={{ color: '#34C759', fontWeight: 500 }}>{act.estimated_cost}</span>
                                  <span style={{ color: '#6E6E73' }}>
                                    <span style={{
                                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 4,
                                      background: act.crowd_level === 'low' ? '#34C759' : act.crowd_level === 'medium' ? '#FF9F0A' : '#FF3B30',
                                    }} />
                                    {act.crowd_level} crowds
                                  </span>
                                  {act.best_time_note && <span style={{ color: '#6E6E73' }}>🕐 {act.best_time_note}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map" style={{ marginTop: 24 }}>
                {allActivities.length > 0 ? (
                  <MapView activities={allActivities} />
                ) : (
                  <div style={{ textAlign: 'center', padding: 48, color: '#6E6E73' }}>
                    No location data available for this itinerary.
                  </div>
                )}
              </TabsContent>

              {/* Budget Tab */}
              <TabsContent value="budget" style={{ marginTop: 24 }}>
                <div className="glass-card">
                  <BudgetView breakdown={result.budget_breakdown} days={result.days.length} />
                </div>
              </TabsContent>

              {/* Hidden Gems Tab */}
              <TabsContent value="gems" style={{ marginTop: 24 }}>
                {result.hidden_gems?.length > 0 ? (
                  <HiddenGemsView gems={result.hidden_gems} />
                ) : (
                  <div style={{ textAlign: 'center', padding: 48, color: '#6E6E73' }}>No hidden gems found.</div>
                )}
              </TabsContent>
            </Tabs>

            {/* Warnings + Neighborhoods */}
            {result.local_warnings?.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Local Heads-Up</h3>
                {result.local_warnings.map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 14 }}>
                    <span>⚠️</span>
                    <span style={{ color: '#1D1D1F' }}>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {result.best_neighborhoods?.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Best Neighborhoods</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {result.best_neighborhoods.map((n, i) => (
                    <div key={i} className="glass-card" style={{ padding: '16px 20px', minWidth: 200, flex: '1 1 200px' }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{n.name}</div>
                      <div style={{ color: '#0071E3', fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{n.vibe}</div>
                      {n.best_for && <div style={{ color: '#6E6E73', fontSize: 12, marginBottom: 4 }}>🎯 {n.best_for}</div>}
                      {n.where_to_stay && <div style={{ color: '#6E6E73', fontSize: 12, marginBottom: 4 }}>🏨 {n.where_to_stay}</div>}
                      {n.signature_street && <div style={{ color: '#6E6E73', fontSize: 12 }}>📍 {n.signature_street}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transport Cheat Sheet */}
            {result.transport_cheat_sheet && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 16 }}>🚇 Transport Cheat Sheet</h3>
                <div className="glass-card" style={{ padding: 20, display: 'grid', gap: 12 }}>
                  {result.transport_cheat_sheet.airport_to_center && (
                    <div style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                      <span style={{ minWidth: 100, fontWeight: 500, color: '#1D1D1F' }}>✈️ Airport</span>
                      <span style={{ color: '#6E6E73' }}>{result.transport_cheat_sheet.airport_to_center}</span>
                    </div>
                  )}
                  {result.transport_cheat_sheet.best_local_transit && (
                    <div style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                      <span style={{ minWidth: 100, fontWeight: 500, color: '#1D1D1F' }}>🚌 Around city</span>
                      <span style={{ color: '#6E6E73' }}>{result.transport_cheat_sheet.best_local_transit}</span>
                    </div>
                  )}
                  {result.transport_cheat_sheet.avoid && (
                    <div style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                      <span style={{ minWidth: 100, fontWeight: 500, color: '#FF3B30' }}>🚫 Avoid</span>
                      <span style={{ color: '#6E6E73' }}>{result.transport_cheat_sheet.avoid}</span>
                    </div>
                  )}
                  {result.transport_cheat_sheet.transit_app && (
                    <div style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                      <span style={{ minWidth: 100, fontWeight: 500, color: '#1D1D1F' }}>📱 Best app</span>
                      <span style={{ color: '#0071E3', fontWeight: 500 }}>{result.transport_cheat_sheet.transit_app}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seasonal Intel */}
            {result.seasonal_intel && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 16 }}>📅 Right Now in {result.destination.split(',')[0]}</h3>
                <div className="glass-card" style={{ padding: 20, display: 'grid', gap: 12 }}>
                  {result.seasonal_intel.current_season_notes && (
                    <div style={{ fontSize: 14, color: '#1D1D1F', lineHeight: 1.6, paddingBottom: 12, borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                      {result.seasonal_intel.current_season_notes}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {result.seasonal_intel.best_months && (
                      <div style={{ fontSize: 13 }}>
                        <div style={{ fontWeight: 500, marginBottom: 4, color: '#34C759' }}>🌟 Best months</div>
                        <div style={{ color: '#6E6E73' }}>{result.seasonal_intel.best_months}</div>
                      </div>
                    )}
                    {result.seasonal_intel.book_ahead && (
                      <div style={{ fontSize: 13 }}>
                        <div style={{ fontWeight: 500, marginBottom: 4, color: '#FF9F0A' }}>📌 Book ahead</div>
                        <div style={{ color: '#6E6E73' }}>{result.seasonal_intel.book_ahead}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Share row */}
            <div style={{
              marginTop: 32, paddingTop: 32, borderTop: '0.5px solid rgba(0,0,0,0.1)',
              display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
            }}>
              <button className="btn-ghost" onClick={copyLink}>📋 Copy Link</button>
              <button className="btn-primary" onClick={handleDownloadPDF}>📄 Download PDF</button>
              <button
                className="btn-primary"
                onClick={saveTrip}
                disabled={saveStatus === 'saving'}
                style={{ opacity: saveStatus === 'saving' ? 0.7 : 1 }}
              >
                {saveStatus === 'saving' ? '...' : '💾 Save Trip'}
              </button>
              {saveStatus === 'saved' && (
                <span style={{ color: '#34C759', fontWeight: 500, fontSize: 15 }}>Saved! ✓</span>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
