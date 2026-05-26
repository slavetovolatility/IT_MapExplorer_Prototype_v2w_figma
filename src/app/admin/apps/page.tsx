'use client'

import { useEffect, useState } from 'react'
import { adminFetchApps, adminSaveApp, adminDeleteApp, type AppRow, type AppSavePayload } from '@/lib/db'
import I from '@/components/ui/icons'

const BLANK: AppRow = {
  id: '', name: '', use_desc: '', ios_url: null, android_url: null,
  icon_char: '', sort_order: 0, active: true,
}

export default function AdminAppsPage() {
  const [apps, setApps] = useState<AppRow[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [editing, setEditing] = useState<AppRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const data = await adminFetchApps()
      setApps(data)
    } catch (e) {
      setFetchError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { reload() }, [])

  async function save() {
    if (!editing) return
    if (!editing.id.trim() || !editing.name.trim()) { setError('ID and Name are required'); return }
    setSaving(true); setError(null)
    const payload: AppSavePayload = {
      id: editing.id.trim(),
      name: editing.name.trim(),
      use_desc: editing.use_desc.trim(),
      ios_url: editing.ios_url?.trim() || null,
      android_url: editing.android_url?.trim() || null,
      icon_char: editing.icon_char?.trim() || '',
      sort_order: Number(editing.sort_order) || 0,
      active: editing.active,
    }
    const { error: e } = await adminSaveApp(payload)
    setSaving(false)
    if (e) { setError(e); return }
    setEditing(null)
    reload()
  }

  async function del(id: string) {
    if (!confirm(`Delete "${id}"?`)) return
    await adminDeleteApp(id)
    reload()
  }

  const field = (label: string, node: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="mono" style={{ fontSize: 11 }}>{label}</label>
      {node}
    </div>
  )

  const inp = (key: keyof AppRow, placeholder = '') => (
    <input
      className="input"
      value={(editing?.[key] ?? '') as string}
      placeholder={placeholder}
      onChange={e => setEditing(prev => prev ? { ...prev, [key]: e.target.value } : prev)}
    />
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 className="h2" style={{ margin: 0 }}>Essential apps</h1>
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}>
          <I.plus size={16}/> New app
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: 24, marginBottom: 28 }}>
          <h3 className="h3" style={{ margin: '0 0 20px' }}>{editing.id && apps.find(a => a.id === editing.id) ? 'Edit app' : 'New app'}</h3>
          {error && <p style={{ color: 'var(--brand)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }}>
            {field('ID (slug, no spaces) *', inp('id', 'e.g. grab'))}
            {field('Name *', inp('name', 'e.g. Grab'))}
            {field('Description', inp('use_desc', 'e.g. Taxis, food, delivery'))}
            {field('Icon character', inp('icon_char', 'e.g. G or an emoji'))}
            {field('App Store URL (iOS)', inp('ios_url', 'https://apps.apple.com/…'))}
            {field('Google Play URL (Android)', inp('android_url', 'https://play.google.com/…'))}
            {field('Sort order', inp('sort_order', '0'))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18, alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.active}
                onChange={e => setEditing(prev => prev ? { ...prev, active: e.target.checked } : prev)}/>
              Active (visible on site)
            </label>
            <div style={{ flex: 1 }}/>
            <button className="btn btn-ghost" onClick={() => { setEditing(null); setError(null) }}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save app'}</button>
          </div>
        </div>
      )}

      {fetchError && (
        <div style={{ color: 'var(--brand)', fontSize: 13, marginBottom: 16, padding: '10px 14px', background: '#C13D2F10', borderRadius: 8 }}>
          Error loading apps: {fetchError}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>}
        {apps.map(app => (
          <div key={app.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#C13D2F18', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
              {app.icon_char || app.name[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{app.name}</span>
                {!app.active && <span className="tag" style={{ fontSize: 10, background: '#00000010', color: 'var(--muted)' }}>hidden</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{app.use_desc}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {app.ios_url
                  ? <span style={{ fontSize: 11, color: 'var(--brand)' }}>✓ App Store</span>
                  : <span style={{ fontSize: 11, color: 'var(--muted)' }}>— App Store</span>}
                {app.android_url
                  ? <span style={{ fontSize: 11, color: 'var(--brand)' }}>✓ Google Play</span>
                  : <span style={{ fontSize: 11, color: 'var(--muted)' }}>— Google Play</span>}
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', minWidth: 28, textAlign: 'center' }}>#{app.sort_order}</div>
            <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setEditing({ ...app })}>
              <I.edit size={13}/> Edit
            </button>
            <button className="btn btn-sq" style={{ background: 'transparent', color: 'var(--brand)' }} onClick={() => del(app.id)}>
              <I.trash size={14}/>
            </button>
          </div>
        ))}
        {!loading && apps.length === 0 && !fetchError && <p style={{ color: 'var(--muted)', fontSize: 14 }}>No apps yet.</p>}
      </div>
    </div>
  )
}
