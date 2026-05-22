'use client'
import { useState, useEffect } from 'react'
import type { Place } from '@/types'
import { fetchPlaces } from '@/lib/db'
import { PLACES } from '@/data'

export function usePlaces(city: string) {
  const [places, setPlaces] = useState<Place[]>(() => PLACES.filter(p => p.city === city))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPlaces(city).then(rows => {
      if (cancelled) return
      setPlaces(rows.length > 0 ? rows : PLACES.filter(p => p.city === city))
      setLoading(false)
    }).catch(() => {
      if (!cancelled) {
        setPlaces(PLACES.filter(p => p.city === city))
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [city])

  return { places, loading }
}
