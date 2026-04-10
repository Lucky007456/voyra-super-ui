import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import Navbar from '@/components/landing/Navbar'
import type { TripResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import ItineraryView from './ItineraryView'

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createServerSupabaseClient()
  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!trip) redirect('/dashboard')

  const result: TripResult = trip.result

  return (
    <>
      <Navbar />
      <main style={{ background: '#F5F5F7', minHeight: '100vh', paddingTop: 64 }}>
        {/* Trip header */}
        <div style={{ background: '#fff', padding: '40px 24px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <a href="/dashboard" style={{ fontSize: 14, color: '#0071E3', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
              ← Dashboard
            </a>
            <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>{trip.destination}</h1>
            <p style={{ fontSize: 17, color: '#6E6E73', marginTop: 8 }}>{result.tagline}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <span className="chip-dark">📅 {trip.duration} days</span>
              <span className="chip-dark">👥 {trip.travelers}</span>
              <span className="chip-dark">💰 {result?.budget_breakdown ? formatCurrency(result.budget_breakdown.total, result.budget_breakdown.currency) : trip.budget}</span>
              <span className="chip-dark">📆 {new Date(trip.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
          <ItineraryView result={result} travelers={trip.travelers} budget={trip.budget} />
        </div>
      </main>
    </>
  )
}
