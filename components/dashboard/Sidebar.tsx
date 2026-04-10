'use client'

import { Briefcase, Heart, Settings } from 'lucide-react'
import Link from 'next/link'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userName?: string
  userEmail?: string
}

const NAV_ITEMS = [
  { id: 'trips', label: 'My Trips', icon: Briefcase },
  { id: 'saved', label: 'Saved Tips', icon: Heart },
  { id: 'account', label: 'Account', icon: Settings },
]

export default function Sidebar({ activeTab, onTabChange, userName = 'Traveler', userEmail = '' }: SidebarProps) {
  return (
    <aside
      className="dashboard-sidebar"
      style={{
        width: 240, background: '#F5F5F7', minHeight: '100vh',
        borderRight: '0.5px solid rgba(0,0,0,0.08)',
        padding: 24, display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0,
      }}
    >
      <Link href="/" style={{ textDecoration: 'none', color: '#1D1D1F', fontWeight: 600, fontSize: 16, letterSpacing: '-0.02em', marginBottom: 32, display: 'block' }}>
        VOYRA
      </Link>

      {/* User avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0071E3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{userName}</div>
          {userEmail && <div style={{ fontSize: 12, color: '#6E6E73' }}>{userEmail.slice(0, 22)}</div>}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
              fontSize: 14, border: 'none',
              background: activeTab === id ? '#fff' : 'transparent',
              fontWeight: activeTab === id ? 500 : 400,
              color: '#1D1D1F', textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (activeTab !== id) e.currentTarget.style.background = '#fff' }}
            onMouseLeave={e => { if (activeTab !== id) e.currentTarget.style.background = 'transparent' }}
          >
            <Icon size={16} color={activeTab === id ? '#0071E3' : '#6E6E73'} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom CTA */}
      <Link href="/plan" style={{ display: 'block', marginTop: 24 }}>
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '10px 16px' }}>
          Plan New Trip
        </button>
      </Link>
    </aside>
  )
}
