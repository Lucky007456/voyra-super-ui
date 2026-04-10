import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TripResult } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD') {
  try {
    // If it's a standard 3-letter ISO code (e.g., USD, EUR, INR)
    if (currency.trim().length === 3 && /^[A-Z]{3}$/i.test(currency.trim())) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.trim().toUpperCase(),
        maximumFractionDigits: 0
      }).format(amount)
    }
    
    // Otherwise it's likely a symbol like €, ₹, or £ returned by the AI
    const formattedNum = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(amount)
    return `${currency.trim()}${formattedNum}`
  } catch (err) {
    // Ultimate fallback if Intl throws a RangeError
    return `${currency}${amount}`
  }
}

/**
 * Robustly parse the streaming JSON from Groq.
 * Handles:
 * - Markdown code fences (```json ... ```)
 * - Wrapper objects like { "itinerary": { ... } } or { "trip": { ... } }
 * - Trailing commas and minor JSON errors
 * - Partial/truncated JSON (extracts largest valid object)
 */
export function parseTripJSON(text: string): TripResult {
  // 1. Strip markdown code fences if present
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  // 2. Find the outermost JSON object
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('No JSON object found in response')
  }
  cleaned = cleaned.slice(start, end + 1)

  // 3. Parse
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // 3a. Try fixing trailing commas (common LLM artifact)
    const fixed = cleaned
      .replace(/,\s*([}\]])/g, '$1')  // remove trailing commas
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // ensure quoted keys
    try {
      parsed = JSON.parse(fixed)
    } catch {
      throw new Error('JSON parse failed even after cleanup')
    }
  }

  // 4. Unwrap if model nested everything under a key
  //    e.g. { "itinerary": { "destination": ... } }
  //    or   { "trip": { ... } }
  //    or   { "data": { ... } }
  const WRAPPER_KEYS = ['itinerary', 'trip', 'data', 'result', 'travel_plan', 'plan', 'response']
  if (!parsed.destination && !parsed.days) {
    for (const key of WRAPPER_KEYS) {
      const candidate = parsed[key]
      if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
        const c = candidate as Record<string, unknown>
        if (c.destination || c.days) {
          parsed = c
          break
        }
      }
    }
    // Last resort: find any nested object that has "days"
    if (!parsed.days) {
      for (const val of Object.values(parsed)) {
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          const c = val as Record<string, unknown>
          if (Array.isArray(c.days)) {
            parsed = c
            break
          }
        }
      }
    }
  }

  // 5. Normalize and provide safe defaults for all fields
  return {
    destination: String(parsed.destination || 'Unknown Destination'),
    tagline: String(parsed.tagline || ''),
    days: Array.isArray(parsed.days) ? parsed.days : [],
    budget_breakdown: {
      accommodation: Number((parsed.budget_breakdown as Record<string,unknown>)?.accommodation ?? 0),
      food:          Number((parsed.budget_breakdown as Record<string,unknown>)?.food ?? 0),
      activities:    Number((parsed.budget_breakdown as Record<string,unknown>)?.activities ?? 0),
      transport:     Number((parsed.budget_breakdown as Record<string,unknown>)?.transport ?? 0),
      misc:          Number((parsed.budget_breakdown as Record<string,unknown>)?.misc ?? 0),
      total:         Number((parsed.budget_breakdown as Record<string,unknown>)?.total ?? 0),
      currency:      String((parsed.budget_breakdown as Record<string,unknown>)?.currency ?? 'USD'),
      per_day_avg:   Number((parsed.budget_breakdown as Record<string,unknown>)?.per_day_avg ?? 0),
      money_saving_tip: String((parsed.budget_breakdown as Record<string,unknown>)?.money_saving_tip ?? ''),
    },
    hidden_gems: Array.isArray(parsed.hidden_gems) ? parsed.hidden_gems : [],
    local_warnings: Array.isArray(parsed.local_warnings) ? parsed.local_warnings : [],
    best_neighborhoods: Array.isArray(parsed.best_neighborhoods) ? parsed.best_neighborhoods : [],
    transport_cheat_sheet: parsed.transport_cheat_sheet as TripResult['transport_cheat_sheet'] ?? undefined,
    seasonal_intel: parsed.seasonal_intel as TripResult['seasonal_intel'] ?? undefined,
  }
}
