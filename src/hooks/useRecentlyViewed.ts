'use client'

import { useState, useEffect } from 'react'
import { getRecentlyViewed } from '@/lib/recentlyViewed'

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<string[]>([])
  useEffect(() => { setRecent(getRecentlyViewed()) }, [])
  return recent
}
