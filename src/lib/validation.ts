// Shared input-validation helpers. Kept in one place so form attributes,
// client-side checks, and db-layer guards stay consistent.

// ── Password ──────────────────────────────────────────────────────────────────

// These rules must match the Supabase Auth password policy configured in
// the dashboard (Auth → Settings → Password policy). Currently set to:
//   - Minimum length: 8
//   - Require lowercase: yes
//   - Require uppercase: yes
//   - Require number: yes
export const PASSWORD_RULES = [
  { key: 'length',    label: 'At least 8 characters',     test: (p: string) => p.length >= 8 },
  { key: 'lower',     label: 'One lowercase letter',       test: (p: string) => /[a-z]/.test(p) },
  { key: 'upper',     label: 'One uppercase letter',       test: (p: string) => /[A-Z]/.test(p) },
  { key: 'number',    label: 'One number',                 test: (p: string) => /\d/.test(p) },
] as const

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every(r => r.test(password))
}

// ── Coordinates ───────────────────────────────────────────────────────────────

// Bounding box for Thailand (with a little padding) — used to sanity-check
// place coordinates so a typo doesn't drop a pin in the ocean or another country.
// Thailand spans roughly 5.6–20.5°N and 97.3–105.6°E.
export const THAILAND_BOUNDS = { latMin: 5, latMax: 21, lngMin: 96, lngMax: 106 }

// Slug: lowercase letters/numbers in hyphen-separated groups. No leading,
// trailing, or doubled hyphens.
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export function isCoordInThailand(lat: number, lng: number): boolean {
  const b = THAILAND_BOUNDS
  return (
    Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= b.latMin && lat <= b.latMax &&
    lng >= b.lngMin && lng <= b.lngMax
  )
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Field length caps. Referenced by `maxLength` attributes on inputs and by
// any server-side length guards.
export const MAXLEN = {
  name: 120,
  area: 80,
  description: 1000,
  address: 300,
  hours: 120,
  reportMessage: 1000,
  email: 120,
  slug: 80,
} as const
