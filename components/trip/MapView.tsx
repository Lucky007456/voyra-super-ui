'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Activity } from '@/lib/types'

interface MapViewProps {
  activities: Activity[]
}

export default function MapView({ activities }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    const validActivities = activities.filter(a => typeof a.lat === 'number' && typeof a.lng === 'number')
    if (!mapRef.current || validActivities.length === 0) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    let map: mapboxgl.Map | null = null

    const initMap = () => {
      if (!mapRef.current || map) return

      map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [validActivities[0].lng!, validActivities[0].lat!],
        zoom: 12,
      })

      mapInstance.current = map

      validActivities.forEach((activity, i) => {
        if (activity.lat === undefined || activity.lng === undefined) return

        const el = document.createElement('div')
        el.style.cssText = `
          width: 28px; height: 28px; background: #0071E3; border-radius: 50%;
          border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,113,227,0.4);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 11px; font-weight: 700; cursor: pointer;
        `
        el.textContent = String(i + 1)

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; font-family: -apple-system, sans-serif;">
            <strong style="font-size: 13px; color: #1D1D1F;">${activity.name}</strong>
            <div style="font-size: 12px; color: #6E6E73; margin-top: 4px;">${activity.time}</div>
            <div style="font-size: 12px; color: #34C759; margin-top: 4px; font-weight: 500;">${activity.estimated_cost}</div>
          </div>
        `)

        new mapboxgl.Marker({ element: el })
          .setLngLat([activity.lng, activity.lat])
          .setPopup(popup)
          .addTo(map!)
      })
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          if (!map) {
            initMap()
          } else {
            map.resize()
          }
        }
      }
    })

    resizeObserver.observe(mapRef.current)

    return () => {
      resizeObserver.disconnect()
      if (map) {
        map.remove()
      }
    }
  }, [activities])

  return (
    <div ref={mapRef} style={{ height: 500, borderRadius: 16, overflow: 'hidden', border: '0.5px solid rgba(0,0,0,0.08)' }} />
  )
}
