import { supabase } from './supabase'
import { isValidSlug, isCoordInThailand } from './validation'
import type { Place, Category, Guide, GuideStep, EssentialApp } from '@/types'

// ── Public types ─────────────────────────────────────────────────────────────

export interface GuideRow {
  id: string
  title: string
  mins: number
  area: string
  body: string
  steps: GuideStep[]
  warnings: string[]
  cover_url: string | null
  status: 'published' | 'draft'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SubmissionRow {
  id: number
  name: string
  category: string | null
  city: string | null
  area: string | null
  description: string | null
  address: string | null
  hours: string | null
  price_level: number | null
  lat: number | null
  lng: number | null
  submitted_by: string | null
  status: string
  created_at: string
}

export interface UserRow {
  id: string
  email: string
  role: 'user' | 'admin'
}

function rowToGuide(r: GuideRow): Guide {
  return {
    id: r.id,
    title: r.title,
    mins: r.mins,
    area: r.area,
    body: r.body,
    steps: r.steps ?? [],
    warnings: r.warnings ?? [],
    cover_url: r.cover_url ?? undefined,
  } as Guide & { cover_url?: string }
}

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
    price: Math.min(4, Math.max(1, r.price_level ?? 2)),
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
    photos: Array.isArray(r.photos) ? r.photos.filter((p: unknown): p is string => typeof p === 'string') : [],
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

export async function fetchPlacesByCategory(category: string, city: string, excludeSlug: string): Promise<Place[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('places').select('*')
    .eq('status', 'approved').eq('category_slug', category).eq('city', city).neq('slug', excludeSlug)
    .order('rating', { ascending: false }).limit(3)
  if (error) { console.error('[db] fetchPlacesByCategory:', error.message); return [] }
  return (data ?? []).map(rowToPlace)
}

export async function fetchPlacesByStation(stationId: string): Promise<Place[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('places').select('*')
    .eq('status', 'approved').eq('nearest_station', stationId)
    .order('rating', { ascending: false })
  if (error) { console.error('[db] fetchPlacesByStation:', error.message); return [] }
  return (data ?? []).map(rowToPlace)
}

export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('categories').select('*').order('sort_order')
  if (error) { console.error('[db] fetchCategories:', error.message); return [] }
  return (data ?? []).map(rowToCategory)
}

export async function fetchSavedSlugs(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('saved_places').select('place_slug').eq('user_id', userId)
  if (error) { console.error('[db] fetchSavedSlugs:', error.message); return [] }
  return (data ?? []).map(r => r.place_slug)
}

export async function upsertSaved(userId: string, placeSlug: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('saved_places').upsert({ user_id: userId, place_slug: placeSlug })
  if (error) console.error('[db] upsertSaved:', error.message)
}

export async function deleteSaved(userId: string, placeSlug: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('saved_places').delete().eq('user_id', userId).eq('place_slug', placeSlug)
  if (error) console.error('[db] deleteSaved:', error.message)
}

// ── Recently viewed (per-user, cross-device) ───────────────────────────────────

export async function trackPlaceView(userId: string, placeSlug: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('place_views')
    .upsert(
      { user_id: userId, place_slug: placeSlug, viewed_at: new Date().toISOString() },
      { onConflict: 'user_id,place_slug' },
    )
  if (error) console.error('[db] trackPlaceView:', error.message)
}

export async function fetchRecentlyViewedSlugs(userId: string, limit = 12): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('place_views').select('place_slug').eq('user_id', userId)
    .order('viewed_at', { ascending: false }).limit(limit)
  if (error) { console.error('[db] fetchRecentlyViewedSlugs:', error.message); return [] }
  return (data ?? []).map(r => r.place_slug)
}

export interface SubmissionPayload {
  name: string
  category: string
  city: string
  area: string
  description: string
  address: string
  hours: string
  price_level: number | null
  lat: number | null
  lng: number | null
  submitted_by: string | null
}

export async function insertSubmission(payload: SubmissionPayload): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('user_submissions').insert({
    name: payload.name,
    category: payload.category,
    city: payload.city,
    area: payload.area || null,
    description: payload.description,
    address: payload.address || null,
    hours: payload.hours || null,
    price_level: payload.price_level,
    lat: payload.lat,
    lng: payload.lng,
    submitted_by: payload.submitted_by,
    status: 'pending',
  })
  if (error) { console.error('[db] insertSubmission:', error.message); return { error: error.message } }
  return { error: null }
}

export interface PromotePayload {
  submissionId: number
  slug: string
  name: string
  category: string
  city: string
  area: string
  description: string
  address: string
  hours: string
  price_level: number
  lat: number
  lng: number
  tags: string[]
}

export async function adminPromoteSubmission(p: PromotePayload): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }

  // Validate before touching the live places table.
  if (!isValidSlug(p.slug)) {
    return { error: 'Slug must be lowercase letters, numbers, and single hyphens only (e.g. "anh-kafe").' }
  }
  if (!isCoordInThailand(p.lat, p.lng)) {
    return { error: 'Coordinates are outside Thailand — check the latitude and longitude before publishing.' }
  }

  // Slug is the place key; refuse to overwrite an existing entry.
  const { data: existing, error: lookupErr } = await supabase
    .from('places').select('slug').eq('slug', p.slug).maybeSingle()
  if (lookupErr) { console.error('[db] adminPromoteSubmission lookup:', lookupErr.message); return { error: lookupErr.message } }
  if (existing) return { error: `A place with slug "${p.slug}" already exists. Choose a different slug.` }

  const { error: insertErr } = await supabase.from('places').insert({
    slug: p.slug,
    name: p.name,
    category_slug: p.category,
    city: p.city,
    area: p.area || null,
    description: p.description,
    address: p.address || null,
    hours: p.hours || null,
    price_level: p.price_level,
    lat: p.lat,
    lng: p.lng,
    status: 'approved',
    rating: 0,
    reviews_count: 0,
    is_open: true,
    is_optional: false,
    photos: [],
    tags_array: p.tags,
    tips_array: [],
    price_range_json: {},
    slot_tone: 'cream',
    slot_label: p.name,
    slot_sub: p.area || '',
  })
  if (insertErr) { console.error('[db] adminPromoteSubmission insert:', insertErr.message); return { error: insertErr.message } }
  const { error: updateErr } = await supabase
    .from('user_submissions').update({ status: 'approved' }).eq('id', p.submissionId)
  if (updateErr) console.error('[db] adminPromoteSubmission update:', updateErr.message)
  return { error: null }
}

// Submissions made by the signed-in user (matched on submitted_by = their email).
// RLS lets a user read only their own rows, so no extra filtering is needed server-side.
export async function fetchMySubmissions(email: string): Promise<SubmissionRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('user_submissions').select('*')
    .eq('submitted_by', email)
    .order('created_at', { ascending: false })
  if (error) { console.error('[db] fetchMySubmissions:', error.message); return [] }
  return (data ?? []) as SubmissionRow[]
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function fetchUserRole(userId: string): Promise<'user' | 'admin'> {
  if (!supabase) return 'user'
  try {
    const result = await Promise.race([
      supabase.from('profiles').select('role').eq('id', userId).single(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('role-timeout')), 6000)
      ),
    ])
    const { data, error } = result
    if (error) { console.error('[fetchUserRole]', error.message); return 'user' }
    return data?.role === 'admin' ? 'admin' : 'user'
  } catch {
    return 'user'
  }
}

// ── Public guides ─────────────────────────────────────────────────────────────

export async function fetchPublicGuides(): Promise<Guide[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('guides').select('*').eq('status', 'published').order('sort_order')
  if (error) { console.error('[db] fetchPublicGuides:', error.message); return [] }
  return (data as GuideRow[]).map(rowToGuide)
}

export async function fetchPublicGuide(id: string): Promise<Guide | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('guides').select('*').eq('id', id).eq('status', 'published').single()
  if (error) { console.error('[db] fetchPublicGuide:', error.message); return null }
  return data ? rowToGuide(data as GuideRow) : null
}

// ── Admin guides ──────────────────────────────────────────────────────────────

export async function adminFetchGuides(): Promise<GuideRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('guides').select('*').order('sort_order')
  if (error) { console.error('[db] adminFetchGuides:', error.message); return [] }
  return (data ?? []) as GuideRow[]
}

export interface GuideSavePayload {
  id: string
  title: string
  mins: number
  area: string
  body: string
  steps: GuideStep[]
  warnings: string[]
  cover_url: string | null
  status: 'published' | 'draft'
  sort_order: number
}

export async function adminSaveGuide(payload: GuideSavePayload): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('guides').upsert({
    ...payload,
    updated_at: new Date().toISOString(),
  })
  if (error) { console.error('[db] adminSaveGuide:', error.message); return { error: error.message } }
  return { error: null }
}

export async function adminDeleteGuide(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('guides').delete().eq('id', id)
  if (error) { console.error('[db] adminDeleteGuide:', error.message); return { error: error.message } }
  return { error: null }
}

// ── Admin submissions ─────────────────────────────────────────────────────────

export async function adminFetchSubmissions(status?: string): Promise<SubmissionRow[]> {
  if (!supabase) return []
  let q = supabase.from('user_submissions').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) { console.error('[db] adminFetchSubmissions:', error.message); return [] }
  return (data ?? []) as SubmissionRow[]
}

export async function adminUpdateSubmission(id: number, status: 'approved' | 'rejected'): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('user_submissions').update({ status }).eq('id', id)
  if (error) { console.error('[db] adminUpdateSubmission:', error.message); return { error: error.message } }
  return { error: null }
}

// ── Admin users ───────────────────────────────────────────────────────────────

export async function adminFetchUsers(): Promise<UserRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase.rpc('get_users_with_roles')
  if (error) { console.error('[db] adminFetchUsers:', error.message); return [] }
  return (data ?? []) as UserRow[]
}

export async function adminUpdateUserRole(userId: string, role: 'user' | 'admin'): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) { console.error('[db] adminUpdateUserRole:', error.message); return { error: error.message } }
  return { error: null }
}

// ── Essential apps ────────────────────────────────────────────────────────────

export interface AppRow {
  id: string
  name: string
  use_desc: string
  ios_url: string | null
  android_url: string | null
  icon_char: string
  sort_order: number
  active: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToApp(r: Record<string, any>): EssentialApp {
  return {
    id: r.id,
    name: r.name,
    use: r.use_desc,
    ios_url: r.ios_url ?? undefined,
    android_url: r.android_url ?? undefined,
    icon_char: r.icon_char ?? undefined,
    sort_order: r.sort_order ?? 0,
  }
}

export async function fetchPublicApps(): Promise<EssentialApp[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('essential_apps').select('*').eq('active', true).order('sort_order')
  if (error) { console.error('[db] fetchPublicApps:', error.message); return [] }
  return (data ?? []).map(rowToApp)
}

export async function adminFetchApps(): Promise<AppRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('essential_apps').select('*').order('sort_order')
  if (error) { console.error('[db] adminFetchApps:', error.message); return [] }
  return (data ?? []) as AppRow[]
}

export interface AppSavePayload {
  id: string
  name: string
  use_desc: string
  ios_url: string | null
  android_url: string | null
  icon_char: string
  sort_order: number
  active: boolean
}

async function getToken(): Promise<string | null> {
  if (!supabase) return null
  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('auth-timeout')), 6000)
      ),
    ])
    return result.data.session?.access_token ?? null
  } catch {
    return null
  }
}

export async function adminSaveApp(payload: AppSavePayload): Promise<{ error: string | null }> {
  try {
    const token = await getToken()
    if (!token) return { error: 'Not authenticated. Please sign in again.' }
    const res = await fetch('/api/admin/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { error: `HTTP ${res.status}: ${text || res.statusText}` }
    }
    const json = await res.json()
    return { error: json.error ?? null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[db] adminSaveApp:', msg)
    return { error: msg.includes('abort') ? 'Save timed out after 15s' : msg }
  }
}

export async function adminDeleteApp(id: string): Promise<{ error: string | null }> {
  try {
    const token = await getToken()
    if (!token) return { error: 'Not authenticated. Please sign in again.' }
    const res = await fetch('/api/admin/apps', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { error: `HTTP ${res.status}: ${text || res.statusText}` }
    }
    const json = await res.json()
    return { error: json.error ?? null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[db] adminDeleteApp:', msg)
    return { error: msg.includes('abort') ? 'Delete timed out after 15s' : msg }
  }
}

// ── Admin places (photo management) ────────────────────────────────────────────

export interface AdminPlaceRow {
  slug: string
  name: string
  city: string | null
  area: string | null
  category_slug: string | null
  status: string
  photos: string[]
  nearest_station: string | null
  tags: string[]
}

export async function adminFetchPlaces(): Promise<AdminPlaceRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('places')
    .select('slug, name, city, area, category_slug, status, photos, nearest_station, tags_array')
    .order('name')
  if (error) { console.error('[db] adminFetchPlaces:', error.message); return [] }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: Record<string, any>) => ({
    slug: r.slug,
    name: r.name,
    city: r.city ?? null,
    area: r.area ?? null,
    category_slug: r.category_slug ?? null,
    status: r.status ?? 'approved',
    photos: Array.isArray(r.photos) ? r.photos.filter((p: unknown): p is string => typeof p === 'string') : [],
    nearest_station: r.nearest_station ?? null,
    tags: Array.isArray(r.tags_array) ? r.tags_array.filter((t: unknown): t is string => typeof t === 'string') : [],
  }))
}

export async function adminSavePlaceTags(slug: string, tags: string[]): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('places')
    .update({ tags_array: tags })
    .eq('slug', slug)
  if (error) { console.error('[db] adminSavePlaceTags:', error.message); return { error: error.message } }
  return { error: null }
}

// Uploads through a server route (like apps) so the write isn't blocked by
// ad-blocker extensions that drop direct POSTs to the Supabase domain. The route
// stores the file in the `place-photos` bucket and saves the public URL on the place.
export async function adminUploadPlacePhoto(slug: string, file: File): Promise<{ url: string | null; error: string | null }> {
  try {
    const token = await getToken()
    if (!token) return { url: null, error: 'Not authenticated. Please sign in again.' }
    const fd = new FormData()
    fd.append('slug', slug)
    fd.append('file', file)
    const res = await fetch('/api/admin/places', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { url: null, error: `HTTP ${res.status}: ${text || res.statusText}` }
    }
    const json = await res.json()
    return { url: json.url ?? null, error: json.error ?? null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[db] adminUploadPlacePhoto:', msg)
    return { url: null, error: msg.includes('abort') ? 'Upload timed out after 30s' : msg }
  }
}

export async function adminRemovePlacePhoto(slug: string): Promise<{ error: string | null }> {
  try {
    const token = await getToken()
    if (!token) return { error: 'Not authenticated. Please sign in again.' }
    const res = await fetch('/api/admin/places', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ slug }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { error: `HTTP ${res.status}: ${text || res.statusText}` }
    }
    const json = await res.json()
    return { error: json.error ?? null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[db] adminRemovePlacePhoto:', msg)
    return { error: msg.includes('abort') ? 'Remove timed out after 15s' : msg }
  }
}

// ── Stations ──────────────────────────────────────────────────────────────────

export interface StationRow {
  id: string
  name: string
  line: string
  color: string
  known_for: string
  city: string
  sort_order: number
  active: boolean
}

export interface StationSavePayload {
  id: string
  name: string
  line: string
  color: string
  known_for: string
  city: string
  sort_order: number
  active: boolean
}

export async function fetchPublicStations(city?: string): Promise<StationRow[]> {
  if (!supabase) return []
  let q = supabase.from('stations').select('*').eq('active', true).order('sort_order')
  if (city) q = q.eq('city', city)
  const { data, error } = await q
  if (error) { console.error('[db] fetchPublicStations:', error.message); return [] }
  return (data ?? []) as StationRow[]
}

export async function adminFetchStations(): Promise<StationRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('stations').select('*').order('sort_order')
  if (error) { console.error('[db] adminFetchStations:', error.message); return [] }
  return (data ?? []) as StationRow[]
}

export async function adminSaveStation(payload: StationSavePayload): Promise<{ error: string | null }> {
  try {
    const token = await getToken()
    if (!token) return { error: 'Not authenticated. Please sign in again.' }
    const res = await fetch('/api/admin/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { error: `HTTP ${res.status}: ${text || res.statusText}` }
    }
    const json = await res.json()
    return { error: json.error ?? null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[db] adminSaveStation:', msg)
    return { error: msg.includes('abort') ? 'Save timed out after 15s' : msg }
  }
}

export async function adminDeleteStation(id: string): Promise<{ error: string | null }> {
  try {
    const token = await getToken()
    if (!token) return { error: 'Not authenticated. Please sign in again.' }
    const res = await fetch('/api/admin/stations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { error: `HTTP ${res.status}: ${text || res.statusText}` }
    }
    const json = await res.json()
    return { error: json.error ?? null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[db] adminDeleteStation:', msg)
    return { error: msg.includes('abort') ? 'Delete timed out after 15s' : msg }
  }
}

export async function adminSetPlaceStation(slug: string, stationId: string | null): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('places')
    .update({ nearest_station: stationId })
    .eq('slug', slug)
  if (error) { console.error('[db] adminSetPlaceStation:', error.message); return { error: error.message } }
  return { error: null }
}

// ── Reports ───────────────────────────────────────────────────────────────────

export interface ReportRow {
  id: number
  place_slug: string
  place_name: string | null
  kind: 'correction' | 'report'
  message: string
  contact: string | null
  submitted_by: string | null
  status: 'open' | 'resolved' | 'dismissed'
  created_at: string
}

export interface ReportPayload {
  place_slug: string
  place_name: string
  kind: 'correction' | 'report'
  message: string
  contact?: string
  submitted_by?: string | null
}

export async function insertReport(payload: ReportPayload): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('reports').insert({
    place_slug: payload.place_slug,
    place_name: payload.place_name,
    kind: payload.kind,
    message: payload.message,
    contact: payload.contact || null,
    submitted_by: payload.submitted_by || null,
  })
  if (error) { console.error('[db] insertReport:', error.message); return { error: error.message } }
  return { error: null }
}

export async function adminFetchReports(status?: string): Promise<ReportRow[]> {
  if (!supabase) return []
  let q = supabase.from('reports').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) { console.error('[db] adminFetchReports:', error.message); return [] }
  return (data ?? []) as ReportRow[]
}

export async function adminUpdateReport(id: number, status: 'resolved' | 'dismissed'): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('reports').update({ status }).eq('id', id)
  if (error) { console.error('[db] adminUpdateReport:', error.message); return { error: error.message } }
  return { error: null }
}
