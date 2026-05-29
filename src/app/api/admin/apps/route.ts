import { NextRequest, NextResponse } from 'next/server'
import { makeClient, verifyAdmin } from '../_lib'

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!await verifyAdmin(token)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const payload = await request.json()
    const sb = makeClient(token)
    const { error } = await sb.from('essential_apps').upsert(
      { ...payload, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
    if (error) { console.error('[api/admin/apps] POST:', error.message); return NextResponse.json({ error: 'Operation failed.' }, { status: 400 }) }
    return NextResponse.json({ error: null })
  } catch (err) {
    console.error('[api/admin/apps] POST catch:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!await verifyAdmin(token)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const { id } = await request.json()
    const sb = makeClient(token)
    const { error } = await sb.from('essential_apps').delete().eq('id', id)
    if (error) { console.error('[api/admin/apps] DELETE:', error.message); return NextResponse.json({ error: 'Operation failed.' }, { status: 400 }) }
    return NextResponse.json({ error: null })
  } catch (err) {
    console.error('[api/admin/apps] DELETE catch:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
