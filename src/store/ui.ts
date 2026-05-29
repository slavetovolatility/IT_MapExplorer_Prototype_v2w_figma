import { create } from 'zustand'
import { upsertSaved, deleteSaved } from '@/lib/db'
import type { Lang } from '@/lib/i18n'

interface UIState {
  city: string
  setCity: (city: string) => void

  lang: Lang
  setLang: (lang: Lang) => void

  savedSet: Set<string>
  toggleSave: (id: string) => void
  loadSaved: (ids: string[]) => void

  userId: string | null
  userEmail: string | null
  role: 'user' | 'admin' | null
  signedIn: boolean
  authReady: boolean
  signIn: (userId: string, email: string) => void
  signOut: () => void
  setRole: (role: 'user' | 'admin') => void
  setAuthReady: (v: boolean) => void

  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void

  showCannabis: boolean
  setShowCannabis: (v: boolean) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  city: 'bangkok',
  setCity: (city) => set({ city }),

  // Defaults to 'en' on both server and first client render (so there's no
  // hydration mismatch); LangProvider restores the saved choice after mount.
  lang: 'en',
  setLang: (lang) => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
      document.documentElement.lang = lang
    }
    set({ lang })
  },

  savedSet: new Set<string>(),
  toggleSave: (id) => {
    const state = get()
    const next = new Set(state.savedSet)
    if (next.has(id)) {
      next.delete(id)
      if (state.userId) deleteSaved(state.userId, id)
    } else {
      next.add(id)
      if (state.userId) upsertSaved(state.userId, id)
    }
    set({ savedSet: next })
  },
  loadSaved: (ids) => set({ savedSet: new Set(ids) }),

  userId: null,
  userEmail: null,
  role: null,
  signedIn: false,
  authReady: false,
  // signIn keeps the existing role: it's set separately by setRole once the
  // profiles lookup resolves, so background token refreshes don't reset it.
  signIn: (userId, email) => set({ signedIn: true, userId, userEmail: email, authReady: true }),
  signOut: () => set({ signedIn: false, userId: null, userEmail: null, role: null, savedSet: new Set(), authReady: true }),
  setRole: (role) => set({ role }),
  setAuthReady: (v) => set({ authReady: v }),

  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),

  showCannabis: false,
  setShowCannabis: (v) => set({ showCannabis: v }),
}))

