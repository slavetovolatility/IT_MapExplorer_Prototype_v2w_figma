'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useUIStore } from '@/store/ui'
import { CATEGORIES, FOOD_FILTERS } from '@/data'
import { usePlaces } from '@/hooks/usePlaces'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { Slot } from '@/components/ui/Slot'
import { PriceMark } from '@/components/ui/PriceMark'
import { StarRating } from '@/components/ui/StarRating'
import { GMap } from '@/components/map/GMap'
import I from '@/components/ui/icons'

export default function MapPage() {
  return (
    <Suspense>
      <MapPageInner/>
    </Suspense>
  )
}

function MapPageInner() {
  const searchParams = useSearchParams()
  return <MapFloating initialQuery={searchParams.get('q') ?? ''} initialCat={searchParams.get('cat') ?? 'all'}/>
}

function useMapState(initialQuery: string, initialCategory: string) {
  const city = useUIStore(s => s.city)
  const showCannabis = useUIStore(s => s.showCannabis)
  const { places: cityPlaces } = usePlaces(city)
  const [query, setQuery] = useState(initialQuery)
  const [activeCat, setCat] = useState(initialCategory)
  const [foodTags, setFoodTags] = useState<string[]>([])
  const [selectedId, setSel] = useState<string | null>(null)
  const [openFilters, setOpenFilters] = useState(false)

  const all = cityPlaces.filter(p => !p.optional || showCannabis)

  const filtered = useMemo(() => {
    let r = all
    if (activeCat !== 'all') r = r.filter(p => p.category === activeCat)
    if (foodTags.length) r = r.filter(p => foodTags.some(t => (p.cuisine || []).includes(t)))
    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter(p => [
        p.name, p.subcategory, p.area, p.category, ...(p.tags || []), ...(p.cuisine || []),
        (CATEGORIES.find(c => c.id === p.category) || {}).label || '',
      ].join(' ').toLowerCase().includes(q))
    }
    return r
  }, [all, activeCat, foodTags, query])

  return { query, setQuery, activeCat, setCat, foodTags, setFoodTags, filtered, cityPlaces, selectedId, setSel, openFilters, setOpenFilters }
}

type MapState = ReturnType<typeof useMapState>

function MapFloating({ initialQuery, initialCat }: { initialQuery: string; initialCat: string }) {
  const st = useMapState(initialQuery, initialCat)
  const city = useUIStore(s => s.city)
  return (
    <main className="map-page route-mount">
      <GMap pins={st.filtered} selectedId={st.selectedId} onSelect={p => st.setSel(p.id)} city={city}/>

      <div className="map-filterbar">
        <I.search size={16}/>
        <input value={st.query} onChange={e => st.setQuery(e.target.value)} placeholder='Search places, cuisines, areas…'/>
        {st.query && <button className="btn btn-sq btn-ghost" onClick={() => st.setQuery('')}><I.x size={14}/></button>}
        <button className="btn btn-sq btn-ghost" onClick={() => st.setOpenFilters(true)} aria-label="Filters"><I.sliders size={16}/></button>
      </div>

      <div style={{ position: 'absolute', top: 76, left: 14, right: 14, zIndex: 5, display: 'flex', gap: 6, overflowX: 'auto' }} className="hide-scrollbar">
        <CategoryStrip st={st}/>
      </div>

      <SelectedPopup st={st}/>
      <FabColumn/>

      <div className="only-tablet-up" style={{ position: 'absolute', left: 14, bottom: 24, zIndex: 5, background: 'var(--bg-card)', borderRadius: 14, padding: 12, boxShadow: 'var(--shadow)', minWidth: 240, maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="h4" style={{ fontSize: 14 }}>{st.filtered.length} {st.filtered.length === 1 ? 'place' : 'places'}</div>
          <button className="btn btn-ghost" style={{ padding: 4, fontSize: 11 }} onClick={() => st.setOpenFilters(true)}><I.sliders size={14}/> Filter</button>
        </div>
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360 }}>
          {st.filtered.slice(0, 8).map(p => <PlaceCard key={p.id} place={p} compact/>)}
        </div>
      </div>

      <MobileSheet st={st}/>
      {st.openFilters && <FilterModal st={st} onClose={() => st.setOpenFilters(false)}/>}
    </main>
  )
}

function CategoryStrip({ st }: { st: MapState }) {
  const showCannabis = useUIStore(s => s.showCannabis)
  const cats = CATEGORIES.filter(c => !c.optional || showCannabis)
  return (
    <div className="hide-scrollbar" style={{ display: 'flex', gap: 6 }}>
      <button onClick={() => st.setCat('all')} className={'chip' + (st.activeCat === 'all' ? ' is-on' : '')}>All</button>
      {cats.map(c => (
        <button key={c.id} onClick={() => st.setCat(c.id === st.activeCat ? 'all' : c.id)}
                className={'chip chip-brand' + (c.id === st.activeCat ? ' is-on' : '')}>{c.label}</button>
      ))}
    </div>
  )
}

function SelectedPopup({ st, offsetForDrawer }: { st: MapState; offsetForDrawer?: boolean }) {
  const place = st.selectedId ? st.cityPlaces.find(p => p.id === st.selectedId) : null
  const savedSet = useUIStore(s => s.savedSet)
  const toggleSave = useUIStore(s => s.toggleSave)
  if (!place) return null
  return (
    <div className="map-popup only-tablet-up" style={{ right: 24, top: 24, left: offsetForDrawer ? 'calc(min(420px, 86vw) + 24px)' : 'auto' }}>
      <Slot tone={place.slot.tone} label={place.slot.label} sub={place.slot.sub} h={130} style={{ borderRadius: 0 }}/>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-.01em' }}>{place.name}</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{place.subcategory}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 7, fontSize: 11.5 }}>
          <StarRating value={place.rating}/>
          <span className="dot-sep"/>
          <PriceMark n={place.price}/>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <Link href={`/places/${place.id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: 12 }}>Details</Link>
          <button className="btn btn-sq" onClick={() => toggleSave(place.id)} aria-label="Save">
            {savedSet.has(place.id) ? <I.bookmarkFill size={16}/> : <I.bookmark size={16}/>}
          </button>
          <button className="btn btn-sq" onClick={() => st.setSel(null)} aria-label="Close"><I.x size={14}/></button>
        </div>
      </div>
    </div>
  )
}

function FabColumn() {
  return (
    <div className="map-fab-col">
      <button className="fab" aria-label="Locate"><I.locate size={18}/></button>
      <button className="fab" aria-label="Open in Google Maps"><I.ext size={18}/></button>
      <button className="fab" aria-label="Zoom in"><I.plus size={16}/></button>
      <button className="fab" aria-label="Zoom out"><I.minus size={16}/></button>
    </div>
  )
}

function MobileSheet({ st }: { st: MapState }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="map-sheet only-mobile" style={{ maxHeight: open ? '50%' : '64px' }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: 'transparent', border: 0, padding: 0 }}>
        <div className="map-sheet__handle"/>
      </button>
      <div className="map-sheet__head">
        <div>
          <span className="h4" style={{ fontSize: 14 }}>{st.filtered.length} places</span>
          {st.activeCat !== 'all' && <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 6 }}>· {(CATEGORIES.find(c => c.id === st.activeCat) || {}).label}</span>}
        </div>
        <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => st.setOpenFilters(true)}><I.sliders size={14}/> Filter</button>
      </div>
      <div className="map-sheet__body">
        {st.filtered.map(p => <PlaceCard key={p.id} place={p} compact/>)}
      </div>
    </div>
  )
}

function FilterModal({ st, onClose }: { st: MapState; onClose: () => void }) {
  const showCannabis = useUIStore(s => s.showCannabis)
  const cats = CATEGORIES.filter(c => !c.optional || showCannabis)
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520, padding: 24 }} onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}><I.x size={20}/></button>
        <h3 className="h3" style={{ margin: 0 }}>Filter</h3>
        <p className="muted" style={{ fontSize: 13, marginTop: 4, marginBottom: 18 }}>Narrow the {st.filtered.length} results.</p>
        <div className="mono" style={{ marginBottom: 8 }}>Category</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          <button onClick={() => st.setCat('all')} className={'chip' + (st.activeCat === 'all' ? ' is-on' : '')}>All</button>
          {cats.map(c => (
            <button key={c.id} onClick={() => st.setCat(c.id === st.activeCat ? 'all' : c.id)}
                    className={'chip chip-brand' + (c.id === st.activeCat ? ' is-on' : '')}>{c.label}</button>
          ))}
        </div>
        <div className="mono" style={{ marginBottom: 8 }}>Food filters</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
          {FOOD_FILTERS.map(t => {
            const on = st.foodTags.includes(t)
            return (
              <button key={t} onClick={() => st.setFoodTags(on ? st.foodTags.filter(x => x !== t) : [...st.foodTags, t])}
                      className={'chip' + (on ? ' is-on' : '')} style={on ? { background: 'var(--gold)', color: '#1B1816' } : undefined}>
                {t}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <button onClick={() => { st.setCat('all'); st.setFoodTags([]); st.setQuery('') }} className="btn btn-ghost">Clear all</button>
          <button onClick={onClose} className="btn btn-primary">Show {st.filtered.length} places</button>
        </div>
      </div>
    </div>
  )
}

