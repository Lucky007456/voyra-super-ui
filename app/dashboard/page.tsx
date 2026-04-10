'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import TripCard from '@/components/dashboard/TripCard'
import type { Trip } from '@/lib/types'

function DashboardInner() {
  // Dynamic import of Clerk hooks to avoid crashing without ClerkProvider
  const [authState, setAuthState] = useState<{ isSignedIn: boolean; isLoaded: boolean; user: { fullName?: string | null; firstName?: string | null; emailAddresses?: { emailAddress: string }[] } | null }>({
    isSignedIn: false,
    isLoaded: false,
    user: null,
  })
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [activeTab, setActiveTab] = useState('trips')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const hasValidClerk = clerkKey && !clerkKey.startsWith('your_') && clerkKey.length > 20

    if (!hasValidClerk) {
      setAuthState({ isSignedIn: false, isLoaded: true, user: null })
      setLoading(false)
      return
    }

    import('@clerk/nextjs').then(({ useUser }) => {
      // Can't call hooks from async functions — instead just check via API
      fetch('/api/trips').then(r => {
        if (r.status === 401) {
          setAuthState({ isSignedIn: false, isLoaded: true, user: null })
          setLoading(false)
          router.push('/sign-in')
        } else {
          r.json().then(data => {
            setAuthState({ isSignedIn: true, isLoaded: true, user: null })
            setTrips(Array.isArray(data) ? data : [])
            setLoading(false)
          })
        }
      }).catch(() => {
        setAuthState({ isSignedIn: false, isLoaded: true, user: null })
        setLoading(false)
      })
    }).catch(() => {
      setAuthState({ isSignedIn: false, isLoaded: true, user: null })
      setLoading(false)
    })
  }, [router])

  const deleteTrip = useCallback(async (id: string) => {
    await fetch('/api/trips', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setTrips(prev => prev.filter(t => t.id !== id))
  }, [])

  if (!authState.isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #E5E5EA', borderTopColor: '#0071E3', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userName={authState.user?.fullName || authState.user?.firstName || 'Traveler'}
        userEmail={authState.user?.emailAddresses?.[0]?.emailAddress || ''}
      />

      <main style={{ flex: 1, padding: 48 }}>
        {activeTab === 'trips' && (
          <>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>My Trips</h2>
            <p style={{ color: '#6E6E73', fontSize: 15, marginTop: 8, marginBottom: 32 }}>All your VOYRA-crafted itineraries</p>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #E5E5EA', borderTopColor: '#0071E3', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : trips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <Globe size={64} color="#E5E5EA" style={{ margin: '0 auto 24px', display: 'block' }} />
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1D1D1F', marginBottom: 8 }}>No trips yet.</h3>
                <p style={{ color: '#6E6E73', marginBottom: 32 }}>Plan your first adventure with VOYRA intelligence.</p>
                <Link href="/plan">
                  <button className="btn-primary">Plan a Trip →</button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {trips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onDelete={deleteTrip} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>Saved Tips</h2>
            <p style={{ color: '#6E6E73', fontSize: 15, marginTop: 8 }}>Coming soon — your bookmarked insider tips.</p>
          </>
        )}

        {activeTab === 'account' && (
          <>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>Account</h2>
            <div className="glass-card" style={{ padding: 24, marginTop: 24, maxWidth: 480 }}>
              <div style={{ fontSize: 13, color: '#6E6E73', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Current Plan</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Explorer</div>
              <div style={{ fontSize: 14, color: '#6E6E73', marginBottom: 20 }}>3 trips/month · Free forever</div>
              <Link href="/pricing">
                <button className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>Upgrade to VOYRA+ →</button>
              </Link>
            </div>
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#FF3B30' }}>Danger Zone</h3>
              <button
                onClick={() => window.location.href = '/sign-out'}
                style={{ background: 'rgba(255,59,48,0.08)', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14 }}
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardInner />
}
