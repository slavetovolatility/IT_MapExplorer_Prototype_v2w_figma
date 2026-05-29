'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/hooks/useT'

export function Footer() {
  const t = useT()
  return (
    <footer className="footer">
      <div className="wrap" style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div>
          <div className="header__brand" style={{ color: 'var(--text-on-deep)', marginBottom: 12 }}>
            <Image src="/logo.png" alt="Inside Thailand" width={32} height={32} style={{ borderRadius: 9 }}/>
            <span>Inside Thailand</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(245,238,220,.6)', maxWidth: 280, lineHeight: 1.5 }}>
            {t('footer.tagline')}
          </p>
        </div>
        <div>
          <h4>{t('footer.explore')}</h4>
          <Link href="/map">{t('nav.map')}</Link>
          <Link href="/cities/bangkok">{t('footer.bangkok')}</Link>
          <Link href="/cities/phuket">{t('footer.phuket')}</Link>
          <Link href="/categories/street-food">{t('footer.streetFood')}</Link>
          <Link href="/categories/temples">{t('footer.temples')}</Link>
        </div>
        <div>
          <h4>{t('footer.practical')}</h4>
          <Link href="/guides">{t('footer.allGuides')}</Link>
          <Link href="/transport">{t('footer.transport')}</Link>
          <Link href="/tools/scams">{t('drawer.scams')}</Link>
          <Link href="/tools/prices">{t('drawer.prices')}</Link>
          <Link href="/tools/emergency">{t('footer.emergency')}</Link>
        </div>
        <div>
          <h4>{t('footer.contribute')}</h4>
          <Link href="/submit">{t('footer.submitPlace')}</Link>
          <Link href="/account">{t('footer.myContributions')}</Link>
          <Link href="/saved">{t('footer.savedPlaces')}</Link>
        </div>
        <div>
          <h4>{t('footer.about')}</h4>
          <Link href="/">{t('footer.aboutUs')}</Link>
          <Link href="/">{t('footer.editorial')}</Link>
          <Link href="/">{t('footer.contact')}</Link>
          <Link href="/">{t('footer.press')}</Link>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <div>{t('footer.madeIn')}</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <Link href="/">{t('footer.privacy')}</Link>
          <Link href="/">{t('footer.terms')}</Link>
        </div>
      </div>
    </footer>
  )
}
