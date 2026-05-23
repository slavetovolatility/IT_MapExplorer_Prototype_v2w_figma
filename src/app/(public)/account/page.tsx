'use client'

import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { supabase } from '@/lib/supabase'
import { SectionHead } from '@/components/ui/SectionHead'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { CITIES, PLACES } from '@/data'
import I from '@/components/ui/icons'

export default function AccountPage() {
  const signedIn = useUIStore(s => s.signedIn)
  const signOut = useUIStore(s => s.signOut)
  const userEmail = useUIStore(s => s.userEmail)
  const city = useUIStore(s => s.city)
  const setCity = useUIStore(s => s.setCity)
  const showCannabis = useUIStore(s => s.showCannabis)
  const setShowCannabis = useUIStore(s => s.setShowCannabis)
  const savedSet = useUIStore(s => s.savedSet)
  const recentIds = useRecentlyViewed()

  const savedPlaces = PLACES.filter(p => savedSet.has(p.id))
  const recentPlaces = recentIds
    .map(id => PLACES.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4)

  if (!signedIn) {
    return (
      <main className="wrap route-mount" style={{ padding: '60px var(--gutter)', maxWidth: 540, textAlign: 'center' }}>
        <h1 className="h2">Sign in to view your account</h1>
        <Link href="/signin" className="btn btn-primary btn-lg" style={{ marginTop: 18 }}>Sign in</Link>
      </main>
    )
  }

  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : '?'
  const displayName = userEmail ? userEmail.split('@')[0] : 'User'

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut()
    signOut()
  }

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--bg-deep)', color: 'var(--text-on-deep)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
          }}>
            {initials}
          </div>
          <div>
            <div className="mono">Member</div>
            <h1 className="h2" style={{ margin: '4px 0 2px' }}>{displayName}</h1>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{userEmail}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={handleSignOut} className="btn">Sign out</button>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <SectionHead title="Account &amp; settings"/>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--line)', alignItems: 'center', fontSize: 14 }}>
            <span>Email</span>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>{userEmail}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--line)', alignItems: 'center', fontSize: 14 }}>
            <span>Default city</span>
            <select
              className="select"
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{ fontSize: 13, padding: '5px 10px', borderRadius: 8 }}
            >
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', alignItems: 'center', fontSize: 14 }}>
            <div>
              <div>Show cannabis shops</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Verify local laws before visiting</div>
            </div>
            <button
              onClick={() => setShowCannabis(!showCannabis)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 0, cursor: 'pointer',
                background: showCannabis ? 'var(--brand)' : 'var(--line-2)',
                position: 'relative', transition: 'background .2s',
              }}
              aria-label={showCannabis ? 'Disable cannabis shops' : 'Enable cannabis shops'}
            >
              <span style={{
                position: 'absolute', top: 2, left: showCannabis ? 22 : 2,
                width: 20, height: 20, borderRadius: 10, background: '#fff',
                transition: 'left .2s', display: 'block',
              }}/>
            </button>
          </div>
        </div>
      </section>

      {recentPlaces.length > 0 && (
        <section className="wrap" style={{ marginBottom: 32 }}>
          <SectionHead title="Recently viewed"/>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {recentPlaces.map(p => <PlaceCard key={p.id} place={p} compact/>)}
          </div>
        </section>
      )}

      <section className="wrap" style={{ marginBottom: 32 }}>
        <SectionHead
          title={`Saved places${savedPlaces.length > 0 ? ` · ${savedPlaces.length}` : ''}`}
          action={savedPlaces.length > 0 ? <Link href="/saved" className="btn">View all</Link> : undefined}
        />
        {savedPlaces.length === 0 ? (
          <div className="card card-flat" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              Tap the <I.bookmark size={13} style={{ verticalAlign: 'middle' }}/> bookmark on any place to save it. Your list syncs across devices.
            </div>
            <Link href="/map" className="btn btn-primary" style={{ marginTop: 14, display: 'inline-flex' }}>Browse the map</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {savedPlaces.slice(0, 6).map(p => <PlaceCard key={p.id} place={p} compact/>)}
          </div>
        )}
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Contribute" action={<Link href="/submit" className="btn"><I.plus size={14}/> Submit a place</Link>}/>
        <div className="card card-flat" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            Know a spot that deserves to be on the map? <Link href="/submit" style={{ color: 'var(--brand)', fontWeight: 600 }}>Submit it</Link> — editors review within 48 hours.
          </div>
        </div>
      </section>
    </main>
  )
}
