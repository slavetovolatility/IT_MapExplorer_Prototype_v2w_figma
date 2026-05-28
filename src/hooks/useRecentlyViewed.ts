'use client'

import { useState, useEffect } from 'react'
import { useUIStore } from '@/store/ui'
import { getRecentlyViewed } from '@/lib/recentlyViewed'
import { fetchRecentlyViewedSlugs } from '@/lib/db'

// Returns recently-viewed place slugs, newest first.
// Anonymous users get their localStorage history. Signed-in users get their
// cross-device history from the DB — the local list paints instantly, then is
// replaced once the DB responds (same static-first pattern as usePlaces).
export function useRecentlyViewed() {
  const signedIn = useUIStore(s => s.signedIn)
  const userId = useUIStore(s => s.userId)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    setRecent(getRecentlyViewed())
    if (signedIn && userId) {
      fetchRecentlyViewedSlugs(userId).then(slugs => {
        if (!cancelled && slugs.length > 0) setRecent(slugs)
      })
    }
    return () => { cancelled = true }
  }, [signedIn, userId])

  return recent
}
