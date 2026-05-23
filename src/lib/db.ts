import { supabase } from './supabase'
import type { Place, Category } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPlace(r: Record<string, any>): Place {
  return {
    id: r.slug,
    name: r.name,
    category: r.category_slug ?? '',
    subcategory: r.subcategory ?? '',
    cuisine: r.cuisine ?? [],
    area: r.area ?? '',
    city: r.city ?? '',
    station: r.nearest_station ?? undefined,
    price: r.price_level ?? 2,
    rating: Number(r.rating ?? 0),
    reviews: r.reviews_count ?? undefined,
    distance: r.distance ?? undefined,
    open: r.is_open ?? true,
    hours: r.hours ?? '',
    tags: r.tags_array ?? [],
    desc: r.description ?? '',
    tips: r.tips_array ?? [],
    slot: {
      tone: r.slot_tone ?? 'cream',
      label: r.slot_label ?? r.name,
      sub: r.slot_sub ?? '',
    },
    coords: [Number(r.lat), Number(r.lng)],
    priceRange: r.price_range_json ?? {},
    optional: r.is_optional ?? false,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCategory(r: Record<string, any>): Category {
  return {
    id: r.slug,
    label: r.label,
    tone: r.tone ?? 'cream',
    accent: r.accent ?? '#C13D2F',
    icon: r.icon ?? 'dot',
    optional: r.optional ?? false,
  }
}

export async function fetchPlaces(city?: string): Promise<Place[]> {
  if (!supabase) return []
  let q = supabase.from('places').select('*').eq('status', 'approved')
  if (city) q = q.eq('city', city)

  const { data, error } = await q.order('rating', { ascending: false })
  if (error) { console.error('[db] fetchPlaces:', error.message); return [] }
  return (data ?? []).map(rowToPlace)
}

export async function fetchPlace(slug: string): Promise<Place | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('places').select('*').eq('slug', slug).eq('status', 'approved').single()
  if (error) { console.error('[db] fetchPlace:', error.message); return null }
  return data ? rowToPlace(data) : null
}

export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('categories').select('*').order('sort_order')
  if (error) { console.error('[db] fetchCategories:', error.message); return [] }
  return (data ?? []).map(rowToCategory)
}
