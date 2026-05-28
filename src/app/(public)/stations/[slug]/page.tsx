'use client'

import { use } from 'react'
import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { STATIONS } from '@/data'
import { usePlacesByStation } from '@/hooks/usePlaces'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { SectionHead } from '@/components/ui/SectionHead'
import I from '@/components/ui/icons'

export default function StationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const showCannabis = useUIStore(s => s.showCannabis)
  const { places: stationPlaces } = usePlacesByStation(slug)
  const station = STATIONS.find(s => s.id === slug)

  if (!station) {
    return (
      <main className="wrap route-mount" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="mono">Station not found</div>
        <h1 className="h1" style={{ marginTop: 10 }}>No such station.</h1>
        <Link href="/" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>Go home</Link>
      </main>
    )
  }

  const places = stationPlaces.filter(p => !p.optional || showCannabis)

  return (
    <main className="route-mount">
      <section style={{ background: station.color + '14', padding: '32px 0 32px' }}>
        <div className="wrap">
          <div className="mono" style={{ marginBottom: 12 }}>
            <Link href="/transport" style={{ color: 'var(--muted)' }}>Transport</Link> / <span style={{ color: station.color }}>{station.line}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: station.color, color: '#fff', display: 'grid', placeItems: 'center' }}>
              <I.train size={28} stroke={1.8}/>
            </div>
            <div>
              <h1 className="h1" style={{ margin: 0, fontSize: 'clamp(26px, 4vw, 42px)' }}>{station.name}</h1>
              <div className="mono" style={{ marginTop: 4 }}>{station.line}</div>
            </div>
          </div>
          <p style={{ marginTop: 18, maxWidth: 560 }}>{station.knownFor}</p>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 24, marginBottom: 48 }}>
        <SectionHead title={`Places near ${station.name}`} subtitle={`${places.length} ${places.length === 1 ? 'place' : 'places'} within easy walk.`}/>
        {places.length > 0 ? (
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {places.map(p => <PlaceCard key={p.id} place={p}/>)}
          </div>
        ) : (
          <div className="card card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
            <div className="h4">Nothing tagged here yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Help fill the map — <Link href="/submit" style={{ color: 'var(--brand)', fontWeight: 600 }}>submit a place</Link>.</div>
          </div>
        )}
      </section>
    </main>
  )
}
