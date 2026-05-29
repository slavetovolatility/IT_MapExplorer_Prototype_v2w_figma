'use client'

import { use, useState, useMemo } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { CATEGORIES, FOOD_FILTERS } from '@/data'
import { usePlaces } from '@/hooks/usePlaces'
import { Slot } from '@/components/ui/Slot'
import { PlaceCard } from '@/components/ui/PlaceCard'
import I from '@/components/ui/icons'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const cat = CATEGORIES.find(c => c.id === slug)
  const showCannabis = useUIStore(s => s.showCannabis)
  const city = useUIStore(s => s.city)
  const { places: cityPlaces } = usePlaces(city)
  const [sortBy, setSortBy] = useState('rating')

  const Ic = cat ? (I[cat.icon] || I.dot) : I.dot
  const places = useMemo(
    () => (cat ? cityPlaces.filter(p => (!p.optional || showCannabis) && p.category === cat.id) : []),
    [cat, showCannabis, cityPlaces]
  )

  const sorted = useMemo(() => {
    const r = [...places]
    if (sortBy === 'rating') r.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'price-asc') r.sort((a, b) => a.price - b.price)
    if (sortBy === 'reviews') r.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
    return r
  }, [places, sortBy])

  if (!cat) notFound()

  return (
    <main className="route-mount">
      <section style={{ background: cat.accent + '12', borderBottom: '1px solid var(--line)', padding: '32px 0 40px' }}>
        <div className="wrap" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Link href="/" style={{ color: 'var(--muted)' }}>Home</Link> / <span style={{ color: cat.accent }}>{cat.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: cat.accent, color: '#fff', display: 'grid', placeItems: 'center' }}><Ic size={28} stroke={1.8}/></div>
              <h1 className="h1" style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 48px)' }}>{cat.label}</h1>
            </div>
            <p style={{ color: 'var(--muted)', marginTop: 14, maxWidth: 520, fontSize: 14.5 }}>
              {places.length} {places.length === 1 ? 'place' : 'places'} in {city === 'phuket' ? 'Phuket' : 'Bangkok'}, hand-picked by editors.
              {cat.id === 'cannabis' ? ' Verify current legal status before visiting — laws are in flux.' : ''}
            </p>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href={`/map?cat=${cat.id}`} className="btn btn-primary"><I.map size={16}/> Show on map</Link>
            </div>
          </div>
          <div className="only-tablet-up">
            <Slot tone={cat.tone} label={cat.label} sub={`${places.length} places · ${city === 'phuket' ? 'Phuket' : 'Bangkok'}`} h={240}/>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="hide-scrollbar">
          {cat.id === 'food' && FOOD_FILTERS.slice(0, 6).map(t => (
            <button key={t} className="chip">{t}</button>
          ))}
          {cat.id !== 'food' && places.slice(0, 4).map(p => (
            <span key={p.id} className="chip" style={{ background: 'transparent' }}>{p.area}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{ color: 'var(--muted)' }}>Sort by</span>
          <select className="select" style={{ padding: '8px 12px', fontSize: 13 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="rating">Top rated</option>
            <option value="reviews">Most reviewed</option>
            <option value="price-asc">Price (low → high)</option>
          </select>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {sorted.map(p => <PlaceCard key={p.id} place={p}/>)}
        </div>
        {sorted.length === 0 && (
          <div className="card card-flat" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div className="h4">No {cat.label.toLowerCase()} listed yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Be the first — <Link href="/submit" style={{ color: 'var(--brand)', fontWeight: 600 }}>submit a place</Link>.</div>
          </div>
        )}
      </section>
    </main>
  )
}
