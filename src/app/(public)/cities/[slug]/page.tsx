'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { CATEGORIES, CITIES } from '@/data'
import { usePlaces } from '@/hooks/usePlaces'
import { Slot } from '@/components/ui/Slot'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { CategoryTile } from '@/components/ui/CategoryTile'
import { SectionHead } from '@/components/ui/SectionHead'
import I from '@/components/ui/icons'

const intros: Record<string, { knownFor: string; bestFor: string; transport: string; tips: string[] }> = {
  bangkok: {
    knownFor: 'Street food, temples, nightlife, malls, chaos that somehow works.',
    bestFor: 'First-timers, food obsessives, anyone with a layover that became a week.',
    transport: 'BTS + MRT cover most tourist areas. Use Bolt or Grab — Bangkok taxis often refuse meter.',
    tips: [
      'Avoid Khao San Road tuk-tuks.',
      'Sundays the BTS gets brutal — go early.',
      'Best weather Nov–Feb. Apr is hellfire.',
    ],
  },
  phuket: {
    knownFor: 'Beaches, big nightlife, day-trip islands.',
    bestFor: 'Beach holidays, families on the west coast, parties at Patong.',
    transport: 'No real public transport. Grab limited. Rent a scooter or hire a driver.',
    tips: [
      "Avoid Patong if you don't want noise.",
      'Jet ski scam is still very real.',
      'Wet season Apr–Oct — rough water.',
    ],
  },
}

export default function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const city = CITIES.find(c => c.id === slug)
  const showCannabis = useUIStore(s => s.showCannabis)
  const { places: cityPlaces } = usePlaces(slug)

  if (!city) notFound()

  const places = cityPlaces.filter(p => !p.optional || showCannabis)
  const cats = CATEGORIES.filter(c => !c.optional || showCannabis).slice(0, 8)
  const featured = places.slice(0, 6)
  const intro = intros[slug] || intros.bangkok

  return (
    <main className="route-mount">
      <section style={{ position: 'relative' }}>
        <Slot tone={slug === 'phuket' ? 'teal' : 'clay'} label={city.name} sub={city.tagline} h={'clamp(220px, 30vw, 360px)' as never} style={{ borderRadius: 0 }} tag={slug === 'bangkok' ? 'MVP focus' : 'Coming soon'}/>
        <div className="wrap" style={{ marginTop: -60, position: 'relative', zIndex: 2 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="mono" style={{ marginBottom: 6 }}>City guide · {city.country}</div>
            <h1 className="h1" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 56px)' }}>{city.name}</h1>
            <div style={{ color: 'var(--muted)', marginTop: 8 }}>{city.tagline} · {city.placeCount} places mapped</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <Link href="/map" className="btn btn-primary"><I.map size={16}/> Browse on map</Link>
              <Link href="/guides" className="btn">Practical guides</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 32, marginBottom: 48 }}>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <Fact label="Known for" value={intro.knownFor}/>
          <Fact label="Best for" value={intro.bestFor}/>
          <Fact label="Getting around" value={intro.transport}/>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 48 }}>
        <SectionHead title="Browse by category" action={<Link href="/map" className="btn">All on map</Link>}/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {cats.map(c => <CategoryTile key={c.id} category={c}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 48 }}>
        <SectionHead kicker="Hand-picked" title={`Featured places in ${city.name}`}/>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {featured.map(p => <PlaceCard key={p.id} place={p}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Local tips"/>
        <div className="card card-deep" style={{ padding: 28 }}>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,238,220,.9)' }}>
            {intro.tips.map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}
          </ul>
        </div>
      </section>
    </main>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="mono" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{value}</div>
    </div>
  )
}
