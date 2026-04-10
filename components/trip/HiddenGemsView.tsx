import type { HiddenGem } from '@/lib/types'

interface HiddenGemsViewProps {
  gems: HiddenGem[]
}

export default function HiddenGemsView({ gems }: HiddenGemsViewProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, padding: 24 }}>
      {gems.map((gem, i) => (
        <div key={i} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <h3 style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.3, margin: 0 }}>{gem.name}</h3>
            <span style={{
              background: '#FFF0F0', color: '#D70000', borderRadius: 980,
              padding: '4px 12px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0
            }}>
              Not on TripAdvisor
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#6E6E73', margin: '0 0 16px', lineHeight: 1.6 }}>{gem.why}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {gem.when && (
              <span style={{ background: '#EBF5FF', color: '#0071E3', borderRadius: 980, padding: '6px 14px', fontSize: 12, fontWeight: 500 }}>
                ⏰ {gem.when}
              </span>
            )}
            {gem.saves && (
              <span style={{ background: '#EDFAF2', color: '#1A7F3C', borderRadius: 980, padding: '6px 14px', fontSize: 12, fontWeight: 500 }}>
                💰 {gem.saves}
              </span>
            )}
          </div>
        </div>
      ))}
      <style>{`
        @media (max-width: 640px) {
          .gems-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
