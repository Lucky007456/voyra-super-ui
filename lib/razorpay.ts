import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Prices in paise (INR × 100)
export const PLANS = {
  voyraPlus: {
    monthly: { amount: 66700, label: '₹667/mo' },   // ~$8 USD
    yearly:  { amount: 564800, label: '₹5,648/yr' }, // ~$67.2 USD (save 30%)
  },
  voyraProPlan: {
    monthly: { amount: 150000, label: '₹1,500/mo' }, // ~$18 USD
    yearly:  { amount: 126000, label: '₹1,260/yr' }, // save 30%
  },
}
