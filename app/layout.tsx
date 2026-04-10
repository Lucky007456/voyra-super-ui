import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VOYRA — Travel Like You Know The Place',
  description: 'AI itineraries powered by 250,000 real traveler experiences. Insider tips, live pricing, crowd-free timing.',
  keywords: ['AI trip planner', 'travel itinerary', 'insider travel tips', 'VOYRA'],
  openGraph: {
    title: 'VOYRA — Travel Like You Know The Place',
    description: 'Not generic AI. Real traveler intelligence.',
    type: 'website',
    url: 'https://voyra.ai',
  },
  twitter: { card: 'summary_large_image' },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
