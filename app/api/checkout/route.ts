import { auth } from '@clerk/nextjs/server'
import { razorpay, PLANS } from '@/lib/razorpay'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, billing } = await req.json()
  const planConfig = PLANS[plan as keyof typeof PLANS]?.[billing as 'monthly' | 'yearly']
  if (!planConfig) return Response.json({ error: 'Invalid plan' }, { status: 400 })

  try {
    const order = await razorpay.orders.create({
      amount: planConfig.amount,
      currency: 'INR',
      receipt: `voyra_${userId}_${Date.now()}`,
      notes: {
        userId,
        plan,
        billing,
      },
    })

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[/api/checkout] Razorpay error:', err)
    return Response.json({ error: 'Order creation failed' }, { status: 500 })
  }
}
