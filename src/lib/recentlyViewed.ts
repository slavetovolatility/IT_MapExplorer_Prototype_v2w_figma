const KEY = 'it.recentlyViewed'
const MAX = 8

export function trackView(id: string) {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(KEY)
    const list: string[] = stored ? JSON.parse(stored) : []
    const next = [id, ...list.filter(x => x !== id)].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
}

export function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
