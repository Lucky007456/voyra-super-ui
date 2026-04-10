import Navbar from '@/components/landing/Navbar'
import Pricing from '@/components/landing/Pricing'
import Footer from '@/components/landing/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — VOYRA',
  description: 'Simple, honest pricing. Start free. Upgrade when you\'re ready.',
}

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes, instantly. No questions asked, no hidden fees. Your plan downgrades at the end of the billing period.' },
  { q: 'What\'s in the free plan?', a: '3 AI trips per month, basic itineraries, community tips, and Crowd Radar for up to 3 cities. No credit card required.' },
  { q: 'How is this different from ChatGPT?', a: 'VOYRA uses real traveler data — 250,000+ verified tips, dated and geo-tagged. ChatGPT generates plausible-sounding content that may be outdated or entirely made up. We don\'t hallucinate prices, crowd patterns, or insider access.' },
  { q: 'Do you offer refunds?', a: 'Yes — 14-day money-back guarantee, no questions asked. Just email us.' },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Pricing />
      <section style={{ background: '#F5F5F7', padding: '80px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 40, textAlign: 'center' }}>
            Frequently asked questions
          </h2>
          <Accordion>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <AccordionTrigger style={{ fontSize: 16, fontWeight: 500, textAlign: 'left', padding: '20px 0' }}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.7, paddingBottom: 20 }}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <Footer />
    </>
  )
}
