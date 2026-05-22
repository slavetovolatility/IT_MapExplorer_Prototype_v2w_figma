import { create } from 'zustand'

interface UIState {
  city: string
  setCity: (city: string) => void

  savedSet: Set<string>
  toggleSave: (id: string) => void

  signedIn: boolean
  signIn: () => void
  signOut: () => void

  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void

  showCannabis: boolean
}

export const useUIStore = create<UIState>((set) => ({
  city: 'bangkok',
  setCity: (city) => set({ city }),

  savedSet: new Set(['or-tor-kor', 'wat-arun']),
  toggleSave: (id) =>
    set((state) => {
      const next = new Set(state.savedSet)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return { savedSet: next }
    }),

  signedIn: false,
  signIn: () => set({ signedIn: true }),
  signOut: () => set({ signedIn: false }),

  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),

  showCannabis: false,
}))
