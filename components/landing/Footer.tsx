'use client'

import Link from 'next/link'

const LINKS = {
  VOYRA: [
    { label: 'Plan a Trip', href: '/plan' },
    { label: 'Destinations', href: '/#discover' },
    { label: 'How It Works', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Features: [
    { label: 'Voyage IQ™', href: '/#intelligence' },
    { label: 'Crowd Radar', href: '/#intelligence' },
    { label: 'Price Truth', href: '/#intelligence' },
    { label: 'Hidden Layer', href: '/#intelligence' },
    { label: 'TimeShift', href: '/#intelligence' },
    { label: 'Group Merge', href: '/#intelligence' },
  ],
  Community: [
    { label: 'Traveler Tips', href: '#' },
    { label: 'Submit a Tip', href: '#' },
    { label: 'Ambassadors', href: '#' },
    { label: 'Forum', href: '#' },
    { label: 'Newsletter', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Affiliate Program', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: '#F5F5F7' }}>
      <div
        className="footer-grid"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}
      >
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', marginBottom: 20, letterSpacing: '-0.01em' }}>
              {section}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} style={{ fontSize: 14, color: '#6E6E73', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#1D1D1F')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6E6E73')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '24px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#6E6E73' }}>Copyright © 2025 VOYRA Inc. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Cookies'].map(label => (
            <a key={label} href="#" style={{ fontSize: 13, color: '#6E6E73', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
