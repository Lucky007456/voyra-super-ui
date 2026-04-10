import { groq, GROQ_MODEL, GROQ_MODEL_FALLBACK, SYSTEM_PROMPT, getTemporalContext } from '@/lib/groq'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export const maxDuration = 120 // seconds — Llama 4 needs more time for 8K output

// ─── Schema ──────────────────────────────────────────────────────────────────
const SCHEMA = `{
  "destination": "Full destination name (City, Country)",
  "tagline": "One evocative sentence that captures the soul of this destination",
  "days": [
    {
      "day": 1,
      "date": "Day label e.g. Day 1 · Monday 14 Apr",
      "title": "Thematic title for the day e.g. Old City, Hidden Alleys & Rooftop Sunsets",
      "theme_color": "hex color representing the day mood e.g. #FF6B35",
      "activities": [
        {
          "time": "08:30 AM",
          "name": "Exact place name",
          "category": "food|culture|nature|transport|accommodation|experience",
          "description": "Two vivid, specific sentences. Name real details — dish names, architectural details, view specifics.",
          "insider_tip": "One hyper-specific local secret: exact timing, vendor name, price trick, transit hack, or crowd-avoidance strategy.",
          "estimated_cost": "Free | $8 pp | $25 pp | Included",
          "crowd_level": "low|medium|high",
          "best_time_note": "Specific timing advice e.g. Go before 9 AM or after 5 PM",
          "transit_from_prev": "How to get here from the previous activity e.g. 12-min walk south on Via del Corso",
          "duration_mins": 90,
          "lat": 0.000000,
          "lng": 0.000000
        }
      ]
    }
  ],
  "budget_breakdown": {
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "transport": 0,
    "misc": 0,
    "total": 0,
    "currency": "USD",
    "per_day_avg": 0,
    "money_saving_tip": "One specific way to cut costs without losing quality"
  },
  "hidden_gems": [
    {
      "name": "Place name",
      "why": "Why it beats the tourist version — be specific",
      "when": "Best time of day/week/season",
      "saves": "What this replaces and how much you save e.g. Saves $35 vs Blue Lagoon + 90% fewer crowds",
      "lat": 0.000000,
      "lng": 0.000000
    }
  ],
  "local_warnings": [
    "Specific scam/trap/cultural rule with actionable avoidance strategy"
  ],
  "best_neighborhoods": [
    {
      "name": "Neighborhood name",
      "vibe": "2-word vibe descriptor e.g. Bohemian · Budget",
      "best_for": "What type of traveler or activity",
      "where_to_stay": "Specific hotel/hostel/riad name in this neighborhood",
      "signature_street": "One specific street or piazza worth walking"
    }
  ],
  "transport_cheat_sheet": {
    "airport_to_center": "Exact instructions: which bus/train, cost, travel time",
    "best_local_transit": "Primary way to get around",
    "avoid": "What not to use and why e.g. Taxis from Termini — always overcharge",
    "transit_app": "Best app for this city e.g. Moovit, Rome2Rio, Grab"
  },
  "seasonal_intel": {
    "current_season_notes": "What's happening right now — festivals, crowds, weather, prices",
    "best_months": "Actual best months for this destination",
    "book_ahead": "What must be pre-booked and how far in advance"
  }
}`

// ─── Build the prompt ─────────────────────────────────────────────────────────
function buildPrompt(params: {
  destination: string
  duration: number
  travelers: string
  budget: string
  interests: string[]
  dateFrom?: string
  dateTo?: string
  userContext?: string
}): string {
  const { destination, duration, travelers, budget, interests, dateFrom, dateTo, userContext } = params
  const temporal = getTemporalContext()
  const travelWindow = dateFrom && dateTo
    ? `Travel dates: ${dateFrom} to ${dateTo}`
    : `Planning window: approximately ${duration} days, flexible dates`

  const interestContext = interests.length > 0
    ? `Primary interests: ${interests.join(', ')} — weight activities toward these heavily`
    : 'General travel — mix of culture, food, and highlights'

  const budgetContext = {
    'Budget (<$100/day)': 'Strict budget — prioritize free/low-cost alternatives, street food, public transit, hostels. Avoid tourist pricing.',
    'Mid ($100–250)': 'Mid-range — comfortable hotels, sit-down restaurants, some paid attractions. Good value focus.',
    'Luxury ($250+)': 'Luxury — boutique hotels, chef-driven restaurants, private guides, skip-the-line access. Best-in-class experiences.'
  }[budget] || 'Mid-range comfort travel'

  return `You are planning a ${duration}-day trip to ${destination}.

${temporal}
${travelWindow}
Party: ${travelers}
Budget tier: ${budgetContext}
${interestContext}

ITINERARY REQUIREMENTS:
1. Plan exactly ${duration} days, each with 4–6 activities timed realistically (include transit time)
2. Activities must be geographically clustered per day — no unnecessary cross-city travel
3. Balance activity types: mornings for sights/culture, afternoons for exploration, evenings for food/atmosphere
4. Every single activity needs a real lat/lng coordinate for the exact location (not city center)
5. Every single activity needs a hyper-specific insider_tip — name real vendors, exact hours, price hacks
6. transit_from_prev: tell how to get from the previous spot (walk time + direction OR transit route)
7. Include at least 1 meal activity per day with specific restaurant name, signature dish, and ordering tip
8. Include ${Math.min(duration + 2, 8)} hidden gems — places locals love that most tourists miss

BUDGET REQUIREMENTS:
- Calculate realistic costs for ${travelers} for ${duration} days in ${destination} at ${budget} level
- per_day_avg should equal total ÷ ${duration}
- money_saving_tip must be destination-specific (not generic advice)

SEASONAL REQUIREMENTS:
- Incorporate what's actually happening in ${destination} in ${getTemporalContext().split(':')[1]?.trim() || 'current season'}
- Note any closures, festivals, or seasonal attractions
- book_ahead: specify exact venues that need pre-booking and how far in advance

${userContext ? `USER CONTEXT (IMPORTANT):\n${userContext}` : ''}

OUTPUT: Respond ONLY with the JSON. No markdown fences. No explanation. Start directly with {`
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Auth check — we fetch userId to log usage or personalize if they are signed in.
  // But we DO NOT block generation if they are unauthenticated (guests can try it free).
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const hasClerk = clerkKey && !clerkKey.startsWith('your_')
  let userId = null
  if (hasClerk) {
    const authSession = await auth()
    userId = authSession.userId
  }

  const body = await req.json()
  const { destination, duration, travelers, budget, interests, dateFrom, dateTo, userContext } = body

  if (!destination) {
    return new Response('Missing destination', { status: 400 })
  }

  const userMessage = buildPrompt({
    destination,
    duration: Number(duration) || 5,
    travelers: travelers || '2 People',
    budget: budget || 'Mid ($100–250)',
    interests: interests || [],
    dateFrom,
    dateTo,
    userContext,
  })

  // Try primary model, fall back to llama3-70b-8192
  const tryModel = async (model: string) => {
    return groq.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT + `\n\n## JSON Schema (follow EXACTLY)\n\`\`\`json\n${SCHEMA}\n\`\`\``
        },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 8000,
      temperature: 0.65,
      top_p: 0.9,
      stream: true,
      // NOTE: response_format is NOT used here — incompatible with stream:true on Groq
    })
  }

  try {
    let stream
    try {
      stream = await tryModel(GROQ_MODEL)
    } catch (primaryErr) {
      console.warn(`[generate] Primary model (${GROQ_MODEL}) failed, falling back:`, primaryErr)
      stream = await tryModel(GROQ_MODEL_FALLBACK)
    }

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        let usedModel = GROQ_MODEL
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) controller.enqueue(encoder.encode(text))
            // Capture actual model used from first chunk
            if (chunk.model) usedModel = chunk.model
          }
        } finally {
          controller.close()
        }
        console.log(`[generate] Completed with model: ${usedModel}`)
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-AI-Provider': 'groq',
        'X-AI-Model': GROQ_MODEL,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[VOYRA /api/generate] Fatal error:', message)
    // Surface the actual Groq error to help diagnose model/quota issues
    return new Response(
      JSON.stringify({ error: 'AI generation failed', detail: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
