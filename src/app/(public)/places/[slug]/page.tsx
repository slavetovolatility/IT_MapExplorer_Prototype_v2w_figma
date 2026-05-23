'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { PLACES, CATEGORIES, STATIONS } from '@/data'
import { usePlace } from '@/hooks/usePlaces'
import { trackView } from '@/lib/recentlyViewed'
import { Slot } from '@/components/ui/Slot'
import { PriceMark } from '@/components/ui/PriceMark'
import { StarRating } from '@/components/ui/StarRating'
import { SectionHead } from '@/components/ui/SectionHead'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { GMap } from '@/components/map/GMap'
import I from '@/components/ui/icons'

export default function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { place } = usePlace(slug)
  const savedSet = useUIStore(s => s.savedSet)
  const toggleSave = useUIStore(s => s.toggleSave)
  const signedIn = useUIStore(s => s.signedIn)

  useEffect(() => { if (place) trackView(place.id) }, [place])

  if (!place) {
    return (
      <main className="wrap route-mount" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="mono">Place not found</div>
        <h1 className="h1" style={{ marginTop: 10 }}>It may have been removed or never existed.</h1>
        <Link href="/" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>Go home</Link>
      </main>
    )
  }

  const cat = CATEGORIES.find(c => c.id === place.category)
  const saved = savedSet.has(place.id)
  const related = PLACES.filter(p => p.category === place.category && p.id !== place.id).slice(0, 3)

  return (
    <main className="route-mount">
      <div className="wrap" style={{ padding: '12px 0 0' }}>
        <div className="mono" style={{ display: 'flex', gap: 8 }}>
          <Link href="/" style={{ color: 'var(--muted)' }}>Home</Link>
          <span>/</span>
          <Link href={`/categories/${cat?.id}`} style={{ color: 'var(--muted)' }}>{cat?.label}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>{place.name}</span>
        </div>
      </div>

      <section className="wrap" style={{ padding: '16px 0 0', marginBottom: 24 }}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <span className="tag" style={{ background: cat!.accent + '18', color: cat!.accent, fontWeight: 700 }}>{cat?.label}</span>
            <h1 className="h1" style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', marginTop: 10 }}>{place.name}</h1>
            <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>{place.subcategory}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap', fontSize: 13 }}>
              <StarRating value={place.rating} reviews={place.reviews}/>
              <span className="dot-sep"/>
              <PriceMark n={place.price}/>
              <span className="dot-sep"/>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--muted)' }}>
                <I.pin size={13}/> {place.area}, {place.city === 'phuket' ? 'Phuket' : 'Bangkok'}
              </span>
              {place.station && <>
                <span className="dot-sep"/>
                <Link href={`/stations/${place.station}`} className="mono" style={{ color: 'var(--info)', textTransform: 'none', letterSpacing: 0, fontSize: 11.5 }}>
                  {(STATIONS.find(s => s.id === place.station) || {}).name || place.station}
                </Link>
              </>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22 }}>
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(place.name + ' ' + place.area)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                <I.ext size={16}/> Open in Google Maps
              </a>
              <button className="btn btn-lg" onClick={() => toggleSave(place.id)}>
                {saved ? <><I.bookmarkFill size={16}/> Saved</> : <><I.bookmark size={16}/> Save</>}
              </button>
              <button className="btn btn-lg"><I.share size={16}/> Share</button>
            </div>
            {!signedIn && (
              <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 12 }}>
                <Link href="/signin" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign in</Link> to keep your saved list across devices.
              </div>
            )}
          </div>
          <div>
            <Slot tone={place.slot.tone} label={place.slot.label} sub={place.slot.sub} h={360} tag="HERO IMAGE"/>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 36 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <Fact label="Status" value={<span className={place.open ? 'badge-open' : 'badge-closed'}>{place.open ? 'Open now' : 'Closed now'}</span>}/>
          <Fact label="Hours" value={place.hours}/>
          <Fact label="Area" value={place.area}/>
          <Fact label="Price" value={<PriceMark n={place.price}/>}/>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 48 }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(0, 1fr) min(360px, 100%)' }}>
          <div>
            <h3 className="h3">About</h3>
            <p style={{ marginTop: 8, fontSize: 15, lineHeight: 1.6 }}>{place.desc}</p>

            <h3 className="h3" style={{ marginTop: 32, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              Practical tips <span className="mono">from locals</span>
            </h3>
            <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {place.tips.map((tip, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#D9A23A22', color: 'var(--gold)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>{tip}</div>
                </li>
              ))}
            </ol>

            {place.priceRange && (
              <>
                <h3 className="h3" style={{ marginTop: 32 }}>Typical prices</h3>
                <div className="card card-flat" style={{ marginTop: 10, padding: 16 }}>
                  {Object.entries(place.priceRange).map(([k, v], i, arr) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', fontSize: 13.5 }}>
                      <span style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{k}</span>
                      <span className="mono" style={{ color: 'var(--text)', fontSize: 12, textTransform: 'none', fontWeight: 600 }}>{v as string}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
                    Crowd-sourced from contributors. See <Link href="/tools/prices" style={{ color: 'var(--info)' }}>price checker</Link> for benchmarks.
                  </div>
                </div>
              </>
            )}

            <h3 className="h3" style={{ marginTop: 32 }}>Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {place.tags.map(t => (
                <span key={t} className="tag" style={{ background: 'var(--bg-2)', color: 'var(--muted)', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
                  #{t.toLowerCase().replace(/\s+/g, '-')}
                </span>
              ))}
            </div>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 200 }}>
                <GMap pins={[place]} selectedId={place.id} city={place.city}/>
              </div>
              <div style={{ padding: 12 }}>
                <div className="mono" style={{ marginBottom: 4 }}>Location</div>
                <div style={{ fontSize: 13, marginBottom: 10 }}>{place.area}, {place.city === 'phuket' ? 'Phuket' : 'Bangkok'}</div>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(place.name)}`} target="_blank" rel="noopener noreferrer" className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }}>
                  <I.ext size={14}/> Open in Google Maps
                </a>
              </div>
            </div>
            <div className="card card-flat" style={{ padding: 14, fontSize: 12.5 }}>
              <div className="mono" style={{ marginBottom: 6 }}>Help us keep this honest</div>
              <div style={{ marginBottom: 10, color: 'var(--muted)' }}>Got an update? Spotted a closure?</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn" style={{ flex: 1, justifyContent: 'center' }}><I.flag size={14}/> Correct</button>
                <button className="btn" style={{ flex: 1, justifyContent: 'center' }}><I.warning size={14}/> Report</button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap" style={{ marginBottom: 56 }}>
          <SectionHead kicker="More like this" title={`Other ${cat?.label.toLowerCase()}`}/>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {related.map(p => <PlaceCard key={p.id} place={p}/>)}
          </div>
        </section>
      )}
    </main>
  )
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="mono" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  )
}
