'use client'

import Link from 'next/link'
import { PLACES } from '@/data'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import I from '@/components/ui/icons'

export default function RecentlyViewedPage() {
  const recentIds = useRecentlyViewed()
  const places = recentIds
    .map(id => PLACES.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Your history</div>
        <h1 className="h1" style={{ marginTop: 10 }}>
          Recently viewed
          {places.length > 0 && <span style={{ color: 'var(--muted)' }}> · {places.length}</span>}
        </h1>
      </section>
      <section className="wrap" style={{ marginBottom: 56 }}>
        {places.length === 0 ? (
          <div className="card card-flat" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-2)', color: 'var(--muted)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <I.clock size={28}/>
            </div>
            <div className="h4" style={{ margin: 0 }}>Nothing here yet</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Places you open will appear here so you can find them again.</div>
            <Link href="/map" className="btn btn-primary" style={{ marginTop: 14 }}>Browse the map</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {places.map(p => <PlaceCard key={p.id} place={p}/>)}
          </div>
        )}
      </section>
    </main>
  )
}
