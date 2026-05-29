'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useUIStore } from '@/store/ui'
import { useT } from '@/hooks/useT'
import { LANGS, type Lang } from '@/lib/i18n'
import { CITIES } from '@/data'
import I from '@/components/ui/icons'

export function MobileDrawer() {
  const open = useUIStore(s => s.drawerOpen)
  const setDrawerOpen = useUIStore(s => s.setDrawerOpen)
  const city = useUIStore(s => s.city)
  const setCity = useUIStore(s => s.setCity)
  const lang = useUIStore(s => s.lang)
  const setLang = useUIStore(s => s.setLang)
  const signedIn = useUIStore(s => s.signedIn)
  const signOut = useUIStore(s => s.signOut)
  const t = useT()

  const onClose = () => setDrawerOpen(false)

  return (
    <>
      <div className={'drawer-bg' + (open ? ' is-open' : '')} onClick={onClose}/>
      <div className={'drawer' + (open ? ' is-open' : '')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div className="header__brand">
            <Image src="/logo.png" alt="Inside Thailand" width={30} height={30} style={{ borderRadius: 8 }}/>
            <span>Inside Thailand</span>
          </div>
          <button className="btn btn-sq btn-ghost" onClick={onClose} aria-label="Close"><I.x size={20}/></button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>{t('common.city')}</label>
            <select className="select" value={city} onChange={e => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>{t('common.language')}</label>
            <select className="select" value={lang} onChange={e => setLang(e.target.value as Lang)}>
              {LANGS.map(l => <option key={l.id} value={l.id}>{l.native}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 18 }}>
          <DrawerLink href="/map" icon={<I.map size={18}/>} onClose={onClose}>{t('nav.map')}</DrawerLink>
          <DrawerLink href="/cities/bangkok" icon={<I.compass size={18}/>} onClose={onClose}>{t('drawer.exploreBangkok')}</DrawerLink>
          <DrawerLink href="/cities/phuket" icon={<I.beach size={18}/>} onClose={onClose}>{t('drawer.phuket')}</DrawerLink>
          <DrawerLink href="/guides" icon={<I.book size={18}/>} onClose={onClose}>{t('drawer.guides')}</DrawerLink>
          <DrawerLink href="/transport" icon={<I.train size={18}/>} onClose={onClose}>{t('drawer.transport')}</DrawerLink>
          <DrawerLink href="/tools" icon={<I.sliders size={18}/>} onClose={onClose}>{t('drawer.tools')}</DrawerLink>
          <DrawerLink href="/tools/scams" icon={<I.shield size={18}/>} onClose={onClose}>{t('drawer.scams')}</DrawerLink>
          <DrawerLink href="/tools/prices" icon={<I.tag size={18}/>} onClose={onClose}>{t('drawer.prices')}</DrawerLink>
          <DrawerLink href="/saved" icon={<I.bookmark size={18}/>} onClose={onClose}>{t('menu.saved')}</DrawerLink>
          <DrawerLink href="/submit" icon={<I.plus size={18}/>} onClose={onClose}>{t('menu.submit')}</DrawerLink>
        </div>

        {signedIn ? (
          <button onClick={() => { signOut(); onClose() }} className="btn" style={{ width: '100%' }}>{t('common.signout')}</button>
        ) : (
          <Link href="/signin" onClick={onClose} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{t('common.signin')}</Link>
        )}
      </div>
    </>
  )
}

function DrawerLink({ href, icon, onClose, children }: { href: string; icon: React.ReactNode; onClose: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', borderRadius: 10, fontSize: 15, color: 'var(--text)' }}>
      <span style={{ color: 'var(--muted)' }}>{icon}</span>
      {children}
    </Link>
  )
}
