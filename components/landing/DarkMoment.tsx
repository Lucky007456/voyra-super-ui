'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const TEXT = 'Every destination. Every hidden gem. Every right moment.'

export default function DarkMoment() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLSpanElement[]>([])

  useGSAP(() => {
    wordsRef.current.forEach((word, i) => {
      if (!word) return
      gsap.fromTo(word,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.5,
          delay: i * 0.055,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          }
        }
      )
    })
  }, [])

  const words = TEXT.split(' ')

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '90vh', overflow: 'hidden', background: '#000' }}
    >
      <img
        src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=85"
        alt="Santorini"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.68)' }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '0 24px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          color: '#fff',
          maxWidth: 900,
        }}>
          {words.map((word, i) => (
            <span
              key={i}
              ref={el => { if (el) wordsRef.current[i] = el }}
              style={{ display: 'inline-block', opacity: 0, marginRight: '0.25em' }}
            >
              {word}
            </span>
          ))}
        </p>

        <Link href="/plan" style={{ marginTop: 56 }}>
          <button className="btn-outline">Explore Destinations →</button>
        </Link>
      </div>
    </section>
  )
}
