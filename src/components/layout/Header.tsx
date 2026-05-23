'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useUIStore } from '@/store/ui'
import { supabase } from '@/lib/supabase'
import { CITIES } from '@/data'
import I from '@/components/ui/icons'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const city = useUIStore(s => s.city)
  const setCity = useUIStore(s => s.setCity)
  const signedIn = useUIStore(s => s.signedIn)
  const setDrawerOpen = useUIStore(s => s.setDrawerOpen)

  const isActive = (paths: string[]) =>
    paths.some(p => p === '/' ? pathname === '/' : pathname.startsWith(p))

  return (
    <header className="header">
      <div className="wrap header__inner">
        <Link href="/" className="header__brand">
          <Image src="/logo.png" alt="Inside Thailand" width={32} height={32} style={{ borderRadius: 9 }}/>
          <span>Inside Thailand</span>
        </Link>

        <nav className="header__nav" aria-label="Primary">
          <Link href="/map" className={isActive(['/map', '/places']) ? 'is-active' : ''}>Map</Link>
          <Link href="/cities/bangkok" className={isActive(['/cities', '/categories']) ? 'is-active' : ''}>Explore</Link>
          <Link href="/guides" className={isActive(['/guides', '/transport']) ? 'is-active' : ''}>Guides</Link>
          <Link href="/tools" className={isActive(['/tools']) ? 'is-active' : ''}>Tools</Link>
        </nav>

        <div className="header__spacer"/>

        <div className="header__search">
          <I.search size={16}/>
          <input
            placeholder='Search "boat market", "rooftop bar"…'
            onKeyDown={(e) => {
              if (e.key === 'Enter') router.push('/map?q=' + encodeURIComponent(e.currentTarget.value))
            }}
          />
        </div>

        <div className="header__city">
          <select
            className="select"
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{ padding: '8px 12px', fontSize: 13, borderRadius: 999, background: 'var(--bg-card)' }}
          >
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="header__actions">
          <Link href="/map" className="btn btn-sq btn-ghost only-mobile" aria-label="Search">
            <I.search size={18}/>
          </Link>
          {signedIn ? (
            <ProfileMenu/>
          ) : (
            <>
              <Link href="/signin" className="btn inline-only-tablet-up" style={{ background: 'transparent', boxShadow: 'none' }}>Sign in</Link>
              <Link href="/signin" className="btn btn-primary inline-only-desktop">Get the local edge</Link>
            </>
          )}
          <button className="btn btn-sq btn-ghost only-mobile" aria-label="Menu" onClick={() => setDrawerOpen(true)}>
            <I.menu size={20}/>
          </button>
        </div>
      </div>
    </header>
  )
}

function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const signOut = useUIStore(s => s.signOut)
  const userEmail = useUIStore(s => s.userEmail)
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : '?'
  const displayName = userEmail ? userEmail.split('@')[0] : 'User'

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[data-profile]')) setOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut()
    signOut()
    setOpen(false)
  }

  const menuRow: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', borderRadius: 10, fontSize: 13.5, color: 'var(--text)',
  }

  return (
    <div data-profile style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="btn btn-sq"
        aria-label="Profile"
        style={{ background: 'var(--bg-deep)', color: 'var(--text-on-deep)', boxShadow: 'none' }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{initials}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 50,
          background: 'var(--bg-card)', borderRadius: 14, boxShadow: 'var(--shadow-lg)',
          minWidth: 220, padding: 8, border: '1px solid var(--line)',
        }}>
          <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{displayName}</div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>{userEmail}</div>
          </div>
          <Link href="/saved" style={menuRow}><I.bookmark size={16}/> Saved places</Link>
          <Link href="/recently-viewed" style={menuRow}><I.clock size={16}/> Recently viewed</Link>
          <Link href="/submit" style={menuRow}><I.plus size={16}/> Submit a place</Link>
          <Link href="/account" style={menuRow}><I.sliders size={16}/> Account &amp; settings</Link>
          <div style={{ borderTop: '1px solid var(--line)', margin: '6px -8px 0' }}/>
          <button
            onClick={handleSignOut}
            style={{ ...menuRow, width: '100%', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
