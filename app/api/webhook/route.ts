import crypto from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

/**
 * Razorpay webhook — verifies signature and records subscription in Supabase.
 * Configure in Razorpay Dashboard → Webhooks → Add URL → /api/webhook
 * Events to enable: payment.captured, subscription.activated, subscription.cancelled
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('x-razorpay-signature') ?? ''
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!

  // Verify HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return new Response('Invalid signature', { status: 400 })
  }

  const event = JSON.parse(body)
  const supabase = await createServerSupabaseClient()

  // Payment captured → activate subscription
  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const notes = payment.notes || {}
    if (notes.userId) {
      await supabase.from('subscriptions').upsert({
        user_id: notes.userId,
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        plan: notes.plan || 'voyraPlus',
        billing: notes.billing || 'monthly',
        status: 'active',
        amount: payment.amount,
        currency: payment.currency,
        activated_at: new Date().toISOString(),
      })
    }
  }

  // Subscription cancelled
  if (event.event === 'subscription.cancelled') {
    const sub = event.payload.subscription.entity
    await supabase
      .from('subscriptions')
      .update({ plan: 'explorer', status: 'cancelled' })
      .eq('razorpay_subscription_id', sub.id)
  }

  return new Response('ok')
}
