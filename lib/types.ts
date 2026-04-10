export interface Activity {
  time: string
  name: string
  category: 'food' | 'culture' | 'nature' | 'transport' | 'accommodation' | 'experience'
  description: string
  insider_tip: string
  estimated_cost: string
  crowd_level: 'low' | 'medium' | 'high'
  best_time_note: string
  transit_from_prev?: string   // How to get here from previous activity
  duration_mins?: number       // Suggested time to spend
  lat?: number
  lng?: number
}

export interface Day {
  day: number
  date: string
  title: string
  theme_color?: string         // Hex color for the day card
  activities: Activity[]
}

export interface BudgetBreakdown {
  accommodation: number
  food: number
  activities: number
  transport: number
  misc?: number
  total: number
  currency: string
  per_day_avg?: number
  money_saving_tip?: string
}

export interface HiddenGem {
  name: string
  why: string
  when: string
  saves: string
  lat?: number
  lng?: number
}

export interface Neighborhood {
  name: string
  vibe: string
  best_for?: string
  where_to_stay?: string
  signature_street?: string
}

export interface TransportCheatSheet {
  airport_to_center: string
  best_local_transit: string
  avoid: string
  transit_app?: string
}

export interface SeasonalIntel {
  current_season_notes: string
  best_months: string
  book_ahead: string
}

export interface TripResult {
  destination: string
  tagline: string
  days: Day[]
  budget_breakdown: BudgetBreakdown
  hidden_gems: HiddenGem[]
  local_warnings: string[]
  best_neighborhoods: Neighborhood[]
  transport_cheat_sheet?: TransportCheatSheet  // New
  seasonal_intel?: SeasonalIntel               // New
}

export interface Trip {
  id: string
  user_id: string
  destination: string
  duration: number
  travelers: string
  budget: string
  interests: string[]
  result: TripResult
  created_at: string
}

export interface PlanFormData {
  destination: string
  dateFrom: string
  dateTo: string
  duration: number
  travelers: string
  budget: string
  interests: string[]
}

export interface InsiderTip {
  id: number
  city: string
  country: string
  flag: string
  tip: string
  author: string
  date: string
  category: string
}
