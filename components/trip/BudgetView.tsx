'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { BudgetBreakdown } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface BudgetViewProps {
  breakdown: BudgetBreakdown
  days?: number
}

const COLORS: Record<string, string> = {
  Accommodation: '#0071E3',
  Food: '#34C759',
  Activities: '#FF9F0A',
  Transport: '#636366',
}

export default function BudgetView({ breakdown, days = 5 }: BudgetViewProps) {
  const data = [
    { name: 'Accommodation', value: breakdown.accommodation, color: COLORS.Accommodation },
    { name: 'Food', value: breakdown.food, color: COLORS.Food },
    { name: 'Activities', value: breakdown.activities, color: COLORS.Activities },
    { name: 'Transport', value: breakdown.transport, color: COLORS.Transport },
  ]

  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: { name: string, value: number, color: string }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card" style={{ padding: '12px 16px' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{payload[0].name}</p>
          <p style={{ margin: '4px 0 0', color: payload[0].color, fontWeight: 700 }}>
            {formatCurrency(payload[0].value, breakdown.currency)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ padding: 24 }}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6E6E73' }} axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={{ fontSize: 11, fill: '#6E6E73' }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v, breakdown.currency)} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: 20, marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          Total {formatCurrency(breakdown.total, breakdown.currency)}
        </div>
        <div style={{ fontSize: 14, color: '#6E6E73' }}>
          {formatCurrency(Math.round(breakdown.total / days), breakdown.currency)}/day avg
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#6E6E73', marginTop: 8 }}>Based on real traveler data</p>
    </div>
  )
}
