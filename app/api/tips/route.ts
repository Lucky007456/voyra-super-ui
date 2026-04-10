import { groq, GROQ_MODEL_FALLBACK, getTemporalContext } from '@/lib/groq'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 3600 // Cache tips for 1 hour

/**
 * GET /api/tips?destination=Tokyo&count=5
 * Returns AI-generated hyper-local insider tips for the destination.
 * Falls back to curated static tips if no destination provided.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const destination = searchParams.get('destination')?.trim()
  const count = Math.min(Number(searchParams.get('count') || '6'), 12)

  // If no destination, return curated featured tips
  if (!destination) {
    return NextResponse.json(FEATURED_TIPS)
  }

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL_FALLBACK, // Use fast model for tips
      messages: [
        {
          role: 'system',
          content: `You are a hyper-local travel intelligence expert. Generate insider tips that MOST TOURISTS NEVER DISCOVER. Tips must be:
- Hyper-specific (real place names, exact times, actual prices)
- Actionable right now
- Based on real local knowledge, not generic advice
- Each tip should make the traveler feel like a local

Respond with ONLY a JSON array. No markdown. No explanation.`
        },
        {
          role: 'user',
          content: `Generate ${count} hyper-specific insider travel tips for ${destination}.
${getTemporalContext()}

Each tip object must have exactly this shape:
{
  "id": number,
  "city": "${destination.split(',')[0].trim()}",
  "country": "Country name",
  "flag": "Flag emoji",
  "tip": "The specific insider tip (2-3 sentences max, extremely specific)",
  "author": "Realistic local name + initial e.g. Marco T.",
  "date": "Month Year (recent, within last 6 months)",
  "category": "Food|Timing|Money|Safety|Hidden Gem|Transport|Culture"
}

Focus on: timing secrets, cheaper local alternatives, crowd avoidance, hidden spots, transport tricks, food secrets.
Respond ONLY with the JSON array starting with [`
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content || '[]'

    // Parse — Groq json_object mode wraps in an object sometimes
    let parsed
    try {
      const raw = JSON.parse(content)
      parsed = Array.isArray(raw) ? raw : (raw.tips || raw.data || Object.values(raw)[0] || [])
    } catch {
      parsed = FEATURED_TIPS.filter(t =>
        t.city.toLowerCase().includes(destination.toLowerCase()) ||
        destination.toLowerCase().includes(t.city.toLowerCase())
      )
    }

    return NextResponse.json(parsed)

  } catch (err) {
    console.error('[/api/tips] Groq error:', err)
    // Fall back to curated tips filtered by destination
    const filtered = FEATURED_TIPS.filter(t =>
      t.city.toLowerCase().includes(destination.toLowerCase()) ||
      destination.toLowerCase().includes(t.city.toLowerCase())
    )
    return NextResponse.json(filtered.length > 0 ? filtered : FEATURED_TIPS.slice(0, count))
  }
}

// ─── Curated fallback tips ────────────────────────────────────────────────────
const FEATURED_TIPS = [
  {
    id: 1, city: 'Venice', country: 'Italy', flag: '🇮🇹',
    tip: 'Skip Rialto Market. Go to Mercato di San Polo on Tuesday mornings — same vendors, 40% cheaper, zero tourists.',
    author: 'Giulia M.', date: 'March 2025', category: 'Food'
  },
  {
    id: 2, city: 'Kyoto', country: 'Japan', flag: '🇯🇵',
    tip: 'Fushimi Inari at 6:15 AM. Torii gates completely to yourself. By 9 AM it\'s wall-to-wall tourists.',
    author: 'Kenji R.', date: 'November 2024', category: 'Timing'
  },
  {
    id: 3, city: 'Marrakech', country: 'Morocco', flag: '🇲🇦',
    tip: 'Never eat on Jemaa el-Fna. Walk one alley back — half price, real tagine, eating next to Moroccan families.',
    author: 'Amara L.', date: 'January 2025', category: 'Food'
  },
  {
    id: 4, city: 'Lisbon', country: 'Portugal', flag: '🇵🇹',
    tip: 'Tram 28 is overrun with pickpockets. Walk Alfama instead — same views, no crowds, places not on any map.',
    author: 'Diego F.', date: 'April 2025', category: 'Safety'
  },
  {
    id: 5, city: 'Barcelona', country: 'Spain', flag: '🇪🇸',
    tip: 'Book Sagrada Família for 9 AM entry on weekdays. You\'ll have the nave mostly to yourself for 30 magical minutes.',
    author: 'Sofia T.', date: 'February 2025', category: 'Timing'
  },
  {
    id: 6, city: 'Tokyo', country: 'Japan', flag: '🇯🇵',
    tip: 'Tsukiji outer market is better than Toyosu for breakfast sushi. Arrive before 7 AM for the freshest cuts at Daiwa.',
    author: 'Hiroshi K.', date: 'December 2024', category: 'Food'
  },
  {
    id: 7, city: 'Santorini', country: 'Greece', flag: '🇬🇷',
    tip: 'Everyone watches sunset at Oia. Go to Imerovigli instead — same caldera views, 80% fewer people, better restaurants.',
    author: 'Elena P.', date: 'September 2024', category: 'Hidden Gem'
  },
  {
    id: 8, city: 'Bali', country: 'Indonesia', flag: '🇮🇩',
    tip: 'Tegallalang charges ₹35,000 entry now. Go to Jatiluwih instead — UNESCO site, half the price, triple the views.',
    author: 'Nadia W.', date: 'March 2025', category: 'Money'
  },
  {
    id: 9, city: 'Iceland', country: 'Iceland', flag: '🇮🇸',
    tip: 'Blue Lagoon is a tourist trap at $80+. Myvatn Nature Baths in the north cost $25 and are far less crowded.',
    author: 'Björn A.', date: 'February 2025', category: 'Money'
  },
  {
    id: 10, city: 'Dubai', country: 'UAE', flag: '🇦🇪',
    tip: 'Dubai Frame has stunning views of old and new Dubai for $14. Skip Burj Khalifa top floors at $60+ — Frame wins on contrast.',
    author: 'Ahmed R.', date: 'January 2025', category: 'Hidden Gem'
  },
]
