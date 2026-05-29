import { createClient } from '@supabase/supabase-js'

export function makeClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }
  )
}

export async function verifyAdmin(token: string): Promise<boolean> {
  const sb = makeClient(token)
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return false
  const { data } = await sb.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin'
}
