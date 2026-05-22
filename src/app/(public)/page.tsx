'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/store/ui'
import { CATEGORIES, CITIES, GUIDES, TOURIST_TOOLS } from '@/data'
import { usePlaces } from '@/hooks/usePlaces'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { CategoryTile } from '@/components/ui/CategoryTile'
import { SectionHead } from '@/components/ui/SectionHead'
import { GMap } from '@/components/map/GMap'
import I from '@/components/ui/icons'

export default function HomePage() {
  return <HomeHub/>
}

function HomeHub() {
  const router = useRouter()
  const city = useUIStore(s => s.city)
  const setCity = useUIStore(s => s.setCity)
  const showCannabis = useUIStore(s => s.showCannabis)

  const { places: cityPlaces } = usePlaces(city)
  const cats = CATEGORIES.filter(c => !c.optional || showCannabis)
  const places = cityPlaces.filter(p => !p.optional || showCannabis)
  const featured = places.slice(0, 6)
  const guides = GUIDES.slice(0, 4)

  return (
    <main className="route-mount">
      <section className="hero">
        <div className="wrap">
          <div className="mono" style={{ marginBottom: 14 }}>Inside Thailand · the local edge</div>
          <h1 className="h1" style={{ maxWidth: 980 }}>
            Thailand,&nbsp;
            <span style={{ color: 'var(--brand)' }} className="italic">from the inside</span>.
          </h1>
          <p style={{ maxWidth: 640 }}>
            A discovery hub for places, food, transport, and the practical stuff —
            written by people who actually live here, not a marketing department.
          </p>

          <form className="searchbar" onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const q = fd.get('q') as string
            router.push('/map' + (q ? `?q=${encodeURIComponent(q)}` : ''))
          }}>
            <select name="city" defaultValue={city} onChange={e => setCity(e.target.value)} className="only-tablet-up" style={{ border: 0, background: 'var(--bg-2)', padding: '0 14px', borderRadius: 12, font: 'inherit', fontSize: '13.5px', color: 'var(--text)' }}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input name="q" placeholder='"boat market", "rooftop bar", "muay thai"…'/>
            <button type="submit" className="btn btn-primary" aria-label="Search">
              <I.search size={18}/> <span className="inline-only-tablet-up">Search</span>
            </button>
          </form>

          <div className="hide-scrollbar" style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            {['Night markets', 'Street food', 'Rooftop bars', 'Temples', 'Muay Thai gyms', 'Beaches'].map((label, i) => (
              <Link key={i} href={`/categories/${label.toLowerCase().replace(/\s+/g, '-')}`} className="chip">
                <I.search size={12}/> {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <MapPreviewCard city={city}/>
          <ActionCard kicker="Scam-aware" title="Avoid the 8 most common Bangkok scams" cta="Read the list" href="/tools/scams" tone="brand" icon={<I.shield size={22}/>}/>
          <ActionCard kicker="Real prices" title="What things actually cost — taxi, food, beer, more" cta="Open price checker" href="/tools/prices" tone="gold" icon={<I.tag size={22}/>}/>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Browse" title="By category" subtitle="16 ways to slice Thailand." action={<Link href="/map" className="btn">All on map</Link>}/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {cats.map(c => <CategoryTile key={c.id} category={c}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Hand-picked" title={`Featured places in ${city === 'phuket' ? 'Phuket' : 'Bangkok'}`} action={<Link href="/map" className="btn">See all</Link>}/>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {featured.map(p => <PlaceCard key={p.id} place={p}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Tourist tools" title="The everyday utilities" subtitle="What we wish someone had built for us when we first arrived."/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {TOURIST_TOOLS.map(t => <ToolCard key={t.id} tool={t}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Practical" title="Popular guides" action={<Link href="/guides" className="btn">All guides</Link>}/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {guides.map(g => (
            <Link key={g.id} href={`/guides/${g.id}`} className="card card-hov" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#C13D2F15', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {String(GUIDES.indexOf(g) + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="h4" style={{ fontSize: 15 }}>{g.title}</div>
                <div className="mono" style={{ marginTop: 4 }}>{g.area} · {g.mins} min read</div>
              </div>
              <I.chevR size={16}/>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div className="card card-deep" style={{ padding: 28 }}>
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'center' }}>
            <div>
              <div className="mono" style={{ color: 'rgba(245,238,220,.55)' }}>Contribute</div>
              <h3 className="h2" style={{ marginTop: 6 }}>Know a place we missed?</h3>
              <p style={{ color: 'rgba(245,238,220,.75)', marginTop: 8, maxWidth: 540 }}>
                Every entry is reviewed by an editor before going live. Quality over quantity.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/submit" className="btn btn-primary btn-lg"><I.plus size={18}/> Submit a place</Link>
              <Link href="/" className="btn" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--text-on-deep)', boxShadow: 'none' }}>How review works</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export function MapPreviewCard({ city }: { city: string }) {
  const { places: cityPlaces } = usePlaces(city)
  const places = cityPlaces.slice(0, 8)
  return (
    <Link href="/map" className="card card-hov" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 200 }}>
        <GMap pins={places} city={city}/>
        <div style={{ position: 'absolute', left: 14, top: 12, padding: '5px 10px', background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>
          {city === 'phuket' ? 'Phuket' : 'Bangkok'} · {places.length}+ places
        </div>
      </div>
      <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--teal)', color: '#fff', display: 'grid', placeItems: 'center' }}><I.map size={22}/></div>
        <div style={{ flex: 1 }}>
          <div className="h4">Open the map</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Pan, filter, save — full screen</div>
        </div>
        <I.chevR size={18}/>
      </div>
    </Link>
  )
}

export function ActionCard({ kicker, title, cta, href, tone = 'brand', icon }: { kicker: string; title: string; cta: string; href: string; tone?: string; icon: React.ReactNode }) {
  const tones: Record<string, { bg: string; fg: string }> = {
    brand: { bg: 'var(--brand)', fg: '#fff' },
    gold: { bg: 'var(--gold)', fg: '#1B1816' },
    teal: { bg: 'var(--teal)', fg: '#fff' },
  }
  const c = tones[tone]
  return (
    <Link href={href} className="card" style={{ background: c.bg, color: c.fg, boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,.15)', display: 'grid', placeItems: 'center' }}>{icon}</div>
        <I.chevR size={20}/>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div className="mono" style={{ color: 'currentColor', opacity: .65, textTransform: 'uppercase' }}>{kicker}</div>
        <div className="h3" style={{ marginTop: 6, color: 'inherit' }}>{title}</div>
        <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, opacity: .9, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {cta} <I.arrowL size={14} style={{ transform: 'rotate(180deg)' }}/>
        </div>
      </div>
    </Link>
  )
}

export function ToolCard({ tool }: { tool: { id: string; name: string; desc: string; icon: string; tone: string; route: string } }) {
  const Ic = I[tool.icon] || I.dot
  return (
    <Link href={tool.route} className="card card-hov" style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 150 }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: tool.tone + '18', color: tool.tone, display: 'grid', placeItems: 'center' }}><Ic size={22}/></div>
      <div className="h4" style={{ fontSize: 15.5, marginTop: 4 }}>{tool.name}</div>
      <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.45, flex: 1 }}>{tool.desc}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: tool.tone }}>
        Open <I.arrowL size={12} style={{ transform: 'rotate(180deg)' }}/>
      </div>
    </Link>
  )
}
