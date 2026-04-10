'use client'

import dynamic from 'next/dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import BudgetView from '@/components/trip/BudgetView'
import HiddenGemsView from '@/components/trip/HiddenGemsView'
import type { TripResult } from '@/lib/types'

const MapView = dynamic(() => import('@/components/trip/MapView'), { ssr: false })

const CATEGORY_COLORS: Record<string, string> = {
  food: '#FF9F0A', culture: '#5856D6', nature: '#34C759', transport: '#636366', accommodation: '#0071E3',
}

interface ItineraryViewProps {
  result: TripResult
  travelers: string
  budget: string
}

export default function ItineraryView({ result, travelers, budget }: ItineraryViewProps) {
  const allActivities = result.days.flatMap(d => d.activities).filter(a => a.lat && a.lng)

  const handleDownloadPDF = async () => {
    const { downloadPDF } = await import('@/components/trip/PDFExport')
    await downloadPDF(result)
  }

  const copyLink = () => navigator.clipboard.writeText(window.location.href)

  return (
    <>
      <Tabs defaultValue="itinerary">
        <TabsList style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 4 }}>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="gems">Hidden Gems</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" style={{ marginTop: 24 }}>
          <Accordion multiple defaultValue={['day-0']}>
            {result.days.map((day, dayIdx) => (
              <AccordionItem key={dayIdx} value={`day-${dayIdx}`} style={{ border: 'none', marginBottom: 12 }}>
                <AccordionTrigger className="glass-card" style={{ padding: '16px 24px', borderRadius: 16, fontWeight: 600 }}>
                  <span>Day {day.day} — {day.title}</span>
                  <span style={{ fontWeight: 400, fontSize: 13, color: '#6E6E73' }}>{day.date}</span>
                </AccordionTrigger>
                <AccordionContent style={{ paddingTop: 12 }}>
                  <div style={{ paddingLeft: 16, borderLeft: '2px solid #E5E5EA', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {day.activities.map((act, i) => (
                      <div key={i} className="glass-card" style={{ padding: 20, display: 'flex', gap: 16 }}>
                        <div>
                          <span style={{ background: '#0071E3', color: '#fff', borderRadius: 980, minWidth: 72, display: 'inline-block', textAlign: 'center', fontSize: 11, padding: '4px 10px', fontWeight: 500 }}>
                            {act.time}
                          </span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 600, fontSize: 15 }}>{act.name}</span>
                            <span style={{ background: CATEGORY_COLORS[act.category] + '1A', color: CATEGORY_COLORS[act.category], borderRadius: 980, padding: '2px 10px', fontSize: 11, fontWeight: 500 }}>{act.category}</span>
                          </div>
                          <p style={{ fontSize: 14, color: '#6E6E73', margin: '4px 0 0', lineHeight: 1.6 }}>{act.description}</p>
                          {act.insider_tip && (
                            <div style={{ marginTop: 12, borderLeft: '3px solid #0071E3', background: 'rgba(0,113,227,0.05)', borderRadius: '0 8px 8px 0', padding: '10px 12px' }}>
                              <span style={{ fontStyle: 'italic', fontSize: 13 }}>💡 {act.insider_tip}</span>
                            </div>
                          )}
                          <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 13, flexWrap: 'wrap' }}>
                            <span style={{ color: '#34C759', fontWeight: 500 }}>{act.estimated_cost}</span>
                            <span style={{ color: '#6E6E73' }}>
                              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 4, background: act.crowd_level === 'low' ? '#34C759' : act.crowd_level === 'medium' ? '#FF9F0A' : '#FF3B30' }} />
                              {act.crowd_level} crowds
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="map" style={{ marginTop: 24 }}>
          {allActivities.length > 0 ? <MapView activities={allActivities} /> : <div style={{ textAlign: 'center', padding: 48, color: '#6E6E73' }}>No location data available.</div>}
        </TabsContent>

        <TabsContent value="budget" style={{ marginTop: 24 }}>
          <div className="glass-card">
            <BudgetView breakdown={result.budget_breakdown} days={result.days.length} />
          </div>
        </TabsContent>

        <TabsContent value="gems" style={{ marginTop: 24 }}>
          {result.hidden_gems?.length > 0 ? <HiddenGemsView gems={result.hidden_gems} /> : <div style={{ textAlign: 'center', padding: 48, color: '#6E6E73' }}>No hidden gems found.</div>}
        </TabsContent>
      </Tabs>

      {/* Share row */}
      <div style={{ marginTop: 40, paddingTop: 32, borderTop: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn-ghost" onClick={copyLink}>📋 Copy Link</button>
        <button className="btn-primary" onClick={handleDownloadPDF}>📄 Download PDF</button>
      </div>
    </>
  )
}
