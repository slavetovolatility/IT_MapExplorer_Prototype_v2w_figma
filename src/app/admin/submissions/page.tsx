'use client'

import { useEffect, useState } from 'react'
import {
  adminFetchSubmissions, adminUpdateSubmission, adminPromoteSubmission,
  type SubmissionRow, type PromotePayload,
} from '@/lib/db'
import { CATEGORIES } from '@/data'
import I from '@/components/ui/icons'

const STATUS_TABS = ['pending', 'approved', 'rejected'] as const
const PRICE = ['', '฿', '฿฿', '฿฿฿', '฿฿฿฿']

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface PromoteState {
  row: SubmissionRow
  slug: string
  lat: string
  lng: string
  saving: boolean
  error: string | null
}

export default function SubmissionsPage() {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [rows, setRows] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [promote, setPromote] = useState<PromoteState | null>(null)

  const load = async (status: string) => {
    setLoading(true)
    const data = await adminFetchSubmissions(status)
    setRows(data)
    setLoading(false)
  }

  useEffect(() => { load(tab) }, [tab])

  const handleReject = async (id: number) => {
    setUpdating(id)
    await adminUpdateSubmission(id, 'rejected')
    setRows(r => r.filter(x => x.id !== id))
    setUpdating(null)
  }

  const openPromote = (row: SubmissionRow) => {
    setPromote({
      row,
      slug: slugify(row.name),
      lat: row.lat != null ? String(row.lat) : '',
      lng: row.lng != null ? String(row.lng) : '',
      saving: false,
      error: null,
    })
  }

  const handlePromote = async () => {
    if (!promote) return
    const latNum = parseFloat(promote.lat)
    const lngNum = parseFloat(promote.lng)
    if (!promote.slug) { setPromote(p => p && ({ ...p, error: 'Slug is required.' })); return }
    if (isNaN(latNum) || isNaN(lngNum)) { setPromote(p => p && ({ ...p, error: 'Valid latitude and longitude are required to place this on the map.' })); return }
    setPromote(p => p && ({ ...p, saving: true, error: null }))
    const row = promote.row
    const payload: PromotePayload = {
      submissionId: row.id,
      slug: promote.slug,
      name: row.name,
      category: row.category ?? '',
      city: row.city ?? 'bangkok',
      area: row.area ?? '',
      description: row.description ?? '',
      address: row.address ?? '',
      hours: row.hours ?? '',
      price_level: row.price_level ?? 2,
      lat: latNum,
      lng: lngNum,
    }
    const { error } = await adminPromoteSubmission(payload)
    if (error) { setPromote(p => p && ({ ...p, saving: false, error })); return }
    setRows(r => r.filter(x => x.id !== row.id))
    setPromote(null)
  }

  const catLabel = (id: string | null) =>
    CATEGORIES.find(c => c.id === id)?.label ?? id ?? '—'

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <h1 className="h2">Submissions</h1>
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="chip"
              style={{ background: tab === t ? 'var(--brand)' : undefined, color: tab === t ? '#fff' : undefined, textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>}

      {!loading && rows.length === 0 && (
        <div className="card card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
          No {tab} submissions.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map(row => (
          <div key={row.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                  <strong style={{ fontSize: 15 }}>{row.name}</strong>
                  <span className="tag">{catLabel(row.category)}</span>
                  {row.city && <span className="tag" style={{ background: 'var(--bg-2)' }}>{row.city}</span>}
                  {row.price_level && <span className="tag" style={{ background: 'var(--bg-2)' }}>{PRICE[row.price_level]}</span>}
                  {row.lat != null
                    ? <span className="tag" style={{ background: '#2D6A4F18', color: '#2D6A4F', fontSize: 10 }}>has coords</span>
                    : <span className="tag" style={{ background: '#C13D2F12', color: 'var(--brand)', fontSize: 10 }}>no coords</span>
                  }
                </div>
                {row.area && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 4 }}>{row.area}</div>}
                {row.description && <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, color: 'var(--text)' }}>{row.description}</p>}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
                  {row.address && <span><I.pin size={12}/> {row.address}</span>}
                  {row.hours && <span><I.clock size={12}/> {row.hours}</span>}
                  {row.lat != null && <span><I.map size={12}/> {row.lat}, {row.lng}</span>}
                  <span><I.user size={12}/> {row.submitted_by ?? 'anonymous'}</span>
                  <span>{new Date(row.created_at).toLocaleDateString()}</span>
                </div>

                {promote?.row.id === row.id && (
                  <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="mono" style={{ fontSize: 12 }}>Promote to live map</div>
                    <div className="field" style={{ margin: 0 }}>
                      <label style={{ fontSize: 12 }}>URL slug *</label>
                      <input className="input" value={promote.slug} onChange={e => setPromote(p => p && ({ ...p, slug: e.target.value }))} placeholder="e.g. anh-kafe" style={{ fontSize: 13 }}/>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div className="field" style={{ margin: 0, flex: 1 }}>
                        <label style={{ fontSize: 12 }}>Latitude *</label>
                        <input className="input" type="number" step="any" value={promote.lat} onChange={e => setPromote(p => p && ({ ...p, lat: e.target.value }))} placeholder="13.7563" style={{ fontSize: 13 }}/>
                      </div>
                      <div className="field" style={{ margin: 0, flex: 1 }}>
                        <label style={{ fontSize: 12 }}>Longitude *</label>
                        <input className="input" type="number" step="any" value={promote.lng} onChange={e => setPromote(p => p && ({ ...p, lng: e.target.value }))} placeholder="100.5018" style={{ fontSize: 13 }}/>
                      </div>
                    </div>
                    {promote.error && <div style={{ fontSize: 12, color: 'var(--brand)' }}>{promote.error}</div>}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary" onClick={handlePromote} disabled={promote.saving} style={{ background: '#2D6A4F', gap: 6 }}>
                        <I.check size={14}/> {promote.saving ? 'Publishing…' : 'Publish to map'}
                      </button>
                      <button className="btn" onClick={() => setPromote(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {tab === 'pending' && promote?.row.id !== row.id && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    className="btn btn-primary"
                    disabled={updating === row.id}
                    onClick={() => openPromote(row)}
                    style={{ gap: 6, background: '#2D6A4F' }}
                  >
                    <I.check size={15}/> Approve & Publish
                  </button>
                  <button
                    className="btn"
                    disabled={updating === row.id}
                    onClick={() => handleReject(row.id)}
                    style={{ gap: 6, color: 'var(--brand)' }}
                  >
                    <I.x size={15}/> Reject
                  </button>
                </div>
              )}
              {tab !== 'pending' && (
                <span className="tag" style={{ background: tab === 'approved' ? '#2D6A4F20' : '#C13D2F15', color: tab === 'approved' ? '#2D6A4F' : 'var(--brand)', flexShrink: 0 }}>
                  {tab}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
