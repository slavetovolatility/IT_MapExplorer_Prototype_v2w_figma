'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store/ui'
import { isLang } from '@/lib/i18n'

// Hydrates the saved language preference from localStorage after mount.
// The store defaults to 'en' so the server render and first client render
// match (no hydration mismatch); if a different language was saved, this
// flips it a tick later.
export function LangProvider({ children }: { children: React.ReactNode }) {
  const setLang = useUIStore(s => s.setLang)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang')
      if (isLang(saved)) setLang(saved)
    } catch { /* ignore */ }
  }, [setLang])
  return <>{children}</>
}
