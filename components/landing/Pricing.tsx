'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

// Razorpay types (loaded via CDN script)
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void }
  }
}
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  image?: string
  prefill?: { name?: string; email?: string }
  theme?: { color?: string }
  handler(response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }): void
  modal?: { ondismiss?(): void }
}

const PLANS = [
  {
    name: 'Explorer',
    price: { monthly: '0', yearly: '0' },
    priceINR: { monthly: 'Free', yearly: 'Free' },
    sub: 'Free forever', subColor: '#34C759',
    features: ['3 AI trips per month', 'Basic itineraries', 'Community tips', 'Crowd Radar (3 cities)', 'Web access'],
    cta: 'Get Started →', ctaClass: 'btn-secondary', highlight: false,
  },
  {
    name: 'VOYRA+',
    price: { monthly: '8', yearly: '5.60' },
    priceINR: { monthly: '₹667', yearly: '₹470' },
    saveLabel: 'Save 30%', badge: 'Most Popular',
    features: ['Unlimited trips', 'Full Crowd Radar', 'Price Truth', 'Offline access', 'Hidden Layer', 'TimeShift', 'PDF export', 'Priority support'],
    cta: 'Start Free Trial →', ctaClass: 'btn-primary', highlight: true, planKey: 'voyraPlus',
  },
  {
    name: 'VOYRA Pro',
    price: { monthly: '18', yearly: '12.60' },
    priceINR: { monthly: '₹1,500', yearly: '₹1,050' },
    features: ['All VOYRA+ features', 'Group Merge (12 people)', 'White-label PDF', 'API access', 'Dedicated account manager'],
    cta: 'Contact Sales →', ctaClass: 'btn-secondary', highlight: false, planKey: 'voyraProPlan',
  },
]

// Load Razorpay script lazily
function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Razorpay Payment Page — no API key needed
const RAZORPAY_PAYMENT_PAGE = 'https://razorpay.me/@vyoraplanner'

interface PricingProps { embedded?: boolean }

export default function Pricing({ embedded = false }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = (planKey: string) => {
    setLoading(planKey)
    // Open Razorpay Payment Page in a new tab
    window.open(RAZORPAY_PAYMENT_PAGE, '_blank')
    setTimeout(() => setLoading(null), 1000)
  }

  return (
    <section id="pricing" className="section-light">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>
          Simple, honest pricing.
        </h2>
        <p style={{ fontSize: 17, color: '#6E6E73', marginBottom: 40 }}>Start free. Upgrade when you&apos;re ready.</p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: '#F5F5F7', borderRadius: 980, padding: 4, gap: 2, marginBottom: 64 }}>
          {['Monthly', 'Yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setIsYearly(period === 'Yearly')}
              style={{
                borderRadius: 980, padding: '8px 20px', fontSize: 14, fontWeight: 500,
                border: 'none', cursor: 'pointer',
                background: (period === 'Yearly') === isYearly ? '#1D1D1F' : 'transparent',
                color: (period === 'Yearly') === isYearly ? '#fff' : '#6E6E73',
                transition: 'all 0.2s ease',
              }}
            >
              {period}
              {period === 'Yearly' && (
                <span style={{ marginLeft: 8, background: '#34C759', color: '#fff', borderRadius: 980, padding: '2px 8px', fontSize: 11 }}>
                  Save 30%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plans */}
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'left' }}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className="pricing-col"
              style={{
                padding: '0 40px',
                borderTop: plan.highlight ? '2px solid #0071E3' : '2px solid transparent',
                borderRight: i < PLANS.length - 1 ? '0.5px solid rgba(0,0,0,0.08)' : 'none',
                paddingTop: 32,
              }}
            >
              {plan.badge && (
                <div style={{ fontSize: 11, fontWeight: 600, color: '#0071E3', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {plan.badge}
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: plan.sub ? 4 : 16 }}>
                <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em' }}>
                  {isYearly ? plan.priceINR.yearly : plan.priceINR.monthly}
                </span>
                {plan.planKey && <span style={{ fontSize: 15, color: '#6E6E73' }}>/month</span>}
              </div>
              {plan.sub && (
                <div style={{ fontSize: 13, color: plan.subColor || '#6E6E73', marginBottom: 8 }}>{plan.sub}</div>
              )}
              {plan.saveLabel && isYearly && (
                <div style={{ fontSize: 13, color: '#34C759', marginBottom: 8 }}>{plan.saveLabel}</div>
              )}
              <div style={{ height: 0.5, background: 'rgba(0,0,0,0.08)', margin: '16px 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                    <Check size={15} color="#0071E3" style={{ flexShrink: 0, marginTop: 1 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={plan.ctaClass}
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center', opacity: loading === plan.planKey ? 0.7 : 1 }}
                onClick={() => plan.planKey && handleCheckout(plan.planKey)}
                disabled={loading === plan.planKey}
              >
                {loading === plan.planKey ? 'Opening payment...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Razorpay badge */}
        <p style={{ marginTop: 40, fontSize: 13, color: '#6E6E73' }}>
          🔒 Payments secured by <strong>Razorpay</strong> · 14-day money-back guarantee
        </p>
      </div>
    </section>
  )
}
