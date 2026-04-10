'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/#discover', label: 'Discover' },
    { href: '/#features', label: 'Features' },
    { href: '/#intelligence', label: 'Intelligence' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const textColor = scrolled ? '#1D1D1F' : '#fff'

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 48, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', paddingLeft: 24, paddingRight: 24,
          transition: 'all 300ms ease',
          background: scrolled ? undefined : 'transparent',
          color: textColor,
        }}
        className={scrolled ? 'glass-nav' : ''}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 4 L20 16 L16 14 L12 16 Z" fill="#0071E3"/>
            <path d="M16 28 L12 16 L16 18 L20 16 Z" fill="currentColor" opacity="0.4"/>
          </svg>
          <span style={{ fontWeight: 600, letterSpacing: '-0.03em', fontSize: 18 }}>VOYRA</span>
        </Link>

        {/* Center nav */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden md:flex">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{ fontSize: 14, color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right — Clerk auth controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Signed out: show Sign In link */}
          <Show when="signed-out">
            <SignInButton>
              <button style={{
                fontSize: 14, color: textColor, background: 'none',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
              }}>
                Sign In
              </button>
            </SignInButton>
          </Show>

          {/* Signed in: show avatar */}
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 30, height: 30 },
                },
              }}
            />
          </Show>

          <Link href="/plan" className="hidden md:inline-flex">
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>
              Plan Your Trip
            </button>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 32,
        }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', top: 16, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
          >
            <X size={28} />
          </button>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ fontSize: 28, color: '#fff', textDecoration: 'none', fontWeight: 300 }}>
              {link.label}
            </a>
          ))}
          <Show when="signed-out">
            <SignUpButton>
              <button style={{
                fontSize: 18, color: '#fff', background: 'none',
                border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12,
                padding: '12px 32px', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Sign Up Free
              </button>
            </SignUpButton>
          </Show>
          <Link href="/plan" onClick={() => setMobileOpen(false)}>
            <button className="btn-white">Plan Your Trip</button>
          </Link>
        </div>
      )}
    </>
  )
}
