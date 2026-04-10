'use client'

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import type { TripResult } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', backgroundColor: '#fff' },
  cover: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  brand: { fontSize: 14, color: '#0071E3', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 32 },
  coverDest: { fontSize: 48, fontWeight: 'bold', color: '#1D1D1F', textAlign: 'center', marginBottom: 12 },
  coverTagline: { fontSize: 16, color: '#6E6E73', textAlign: 'center' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 24, borderBottom: '1px solid #E5E5EA', paddingBottom: 12 },
  dayTitle: { fontSize: 16, fontWeight: 'bold', color: '#0071E3', marginTop: 20, marginBottom: 12 },
  activityRow: { marginBottom: 12, paddingLeft: 12, borderLeft: '2px solid #E5E5EA' },
  activityName: { fontSize: 13, fontWeight: 'bold', color: '#1D1D1F' },
  activityMeta: { fontSize: 11, color: '#6E6E73', marginTop: 2 },
  tip: { fontSize: 11, color: '#1D1D1F', fontStyle: 'italic', marginTop: 4, paddingLeft: 8, borderLeft: '2px solid #0071E3' },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingVertical: 6, borderBottom: '0.5px solid #F5F5F7' },
  gemCard: { marginBottom: 16, padding: 12, backgroundColor: '#F5F5F7', borderRadius: 8 },
  gemName: { fontSize: 14, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 4 },
  gemDesc: { fontSize: 11, color: '#6E6E73' },
})

function TripDocument({ result }: { result: TripResult }) {
  return (
    <Document>
      {/* Cover */}
      <Page size="A4" style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.brand}>VOYRA</Text>
          <Text style={styles.coverDest}>{result.destination}</Text>
          <Text style={styles.coverTagline}>{result.tagline}</Text>
        </View>
      </Page>

      {/* Itinerary */}
      {result.days.map(day => (
        <Page key={day.day} size="A4" style={styles.page}>
          <Text style={styles.pageTitle}>Your Itinerary</Text>
          <Text style={styles.dayTitle}>Day {day.day} — {day.title}</Text>
          <Text style={{ fontSize: 11, color: '#6E6E73', marginBottom: 16 }}>{day.date}</Text>
          {day.activities.map((act, i) => (
            <View key={i} style={styles.activityRow}>
              <Text style={styles.activityName}>{act.time} · {act.name}</Text>
              <Text style={styles.activityMeta}>{act.description}</Text>
              <Text style={styles.tip}>💡 {act.insider_tip}</Text>
              <Text style={{ ...styles.activityMeta, color: '#34C759', marginTop: 4 }}>{act.estimated_cost}</Text>
            </View>
          ))}
        </Page>
      ))}

      {/* Budget */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Budget Breakdown</Text>
        {[
          { label: 'Accommodation', val: result.budget_breakdown.accommodation },
          { label: 'Food', val: result.budget_breakdown.food },
          { label: 'Activities', val: result.budget_breakdown.activities },
          { label: 'Transport', val: result.budget_breakdown.transport },
          { label: 'TOTAL', val: result.budget_breakdown.total },
        ].map(row => (
          <View key={row.label} style={styles.budgetRow}>
            <Text style={{ fontSize: 13, color: row.label === 'TOTAL' ? '#1D1D1F' : '#6E6E73', fontWeight: row.label === 'TOTAL' ? 'bold' : 'normal' }}>{row.label}</Text>
            <Text style={{ fontSize: 13, fontWeight: row.label === 'TOTAL' ? 'bold' : 'normal', color: row.label === 'TOTAL' ? '#0071E3' : '#1D1D1F' }}>
              {formatCurrency(row.val, result.budget_breakdown.currency)}
            </Text>
          </View>
        ))}
      </Page>

      {/* Hidden Gems */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Hidden Gems</Text>
        {result.hidden_gems.map((gem, i) => (
          <View key={i} style={styles.gemCard}>
            <Text style={styles.gemName}>{gem.name}</Text>
            <Text style={styles.gemDesc}>{gem.why}</Text>
            <Text style={{ ...styles.gemDesc, color: '#0071E3', marginTop: 4 }}>Best: {gem.when} · {gem.saves}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}

export async function downloadPDF(result: TripResult) {
  const blob = await pdf(<TripDocument result={result} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `voyra-${result.destination.toLowerCase().replace(/\s+/g, '-')}.pdf`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default TripDocument
