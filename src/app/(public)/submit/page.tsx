'use client'

import { useState, Fragment } from 'react'
import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { insertSubmission } from '@/lib/db'
import { CATEGORIES, CITIES } from '@/data'
import I from '@/components/ui/icons'

type Form = {
  name: string; category: string; city: string; area: string
  desc: string; address: string; hours: string; price: number | null
  lat: number | null; lng: number | null
}

const EMPTY: Form = { name: '', category: '', city: 'bangkok', area: '', desc: '', address: '', hours: '', price: null, lat: null, lng: null }

export default function SubmitPage() {
  const signedIn = useUIStore(s => s.signedIn)
  const userEmail = useUIStore(s => s.userEmail)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<Form>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = (k: keyof Form, v: string | number | null) => setForm(f => ({ ...f, [k]: v }))

  if (!signedIn) {
    return (
      <main className="wrap route-mount" style={{ padding: '32px var(--gutter) 64px', maxWidth: 720 }}>
        <div className="mono">Contribute</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Submit a place</h1>
        <div className="card" style={{ padding: 28, marginTop: 22 }}>
          <p style={{ marginTop: 0 }}>Submissions are tied to a contributor account so we can credit you and follow up if an editor has questions.</p>
          <Link href="/signin" className="btn btn-primary btn-lg">Sign in to submit →</Link>
        </div>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="wrap route-mount" style={{ padding: '60px var(--gutter)', maxWidth: 540, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#5E7A3A20', color: 'var(--moss)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
          <I.send size={28}/>
        </div>
        <h1 className="h2">{"Thanks — we'll take a look."}</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>An editor will review your submission within 48 hours. We&apos;ll email you if we have questions.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
          <button className="btn" onClick={() => { setForm(EMPTY); setStep(1); setSubmitted(false) }}>Submit another</button>
          <Link href="/map" className="btn btn-primary">Back to the map</Link>
        </div>
      </main>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) { setStep(step + 1); return }
    setSubmitting(true)
    setSubmitError(null)
    const { error } = await insertSubmission({
      name: form.name,
      category: form.category,
      city: form.city,
      area: form.area,
      description: form.desc,
      address: form.address,
      hours: form.hours,
      price_level: form.price,
      lat: form.lat,
      lng: form.lng,
      submitted_by: userEmail,
    })
    setSubmitting(false)
    if (error) { setSubmitError('Something went wrong — please try again.'); return }
    setSubmitted(true)
  }

  return (
    <main className="wrap route-mount" style={{ padding: '32px var(--gutter) 64px', maxWidth: 720 }}>
      <div className="mono">Contribute · editor reviewed</div>
      <h1 className="h1" style={{ marginTop: 10 }}>Submit a place</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 540, marginTop: 8 }}>Tell us about a place we should add. We&apos;ll review for accuracy and edit for clarity — but your name stays on the entry.</p>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 24, marginBottom: 20 }}>
        {[1, 2, 3].map(n => (
          <Fragment key={n}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: n <= step ? 'var(--brand)' : 'var(--bg-2)', color: n <= step ? '#fff' : 'var(--muted)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>{n}</div>
              <div className="mono" style={{ color: n === step ? 'var(--text)' : 'var(--muted)' }}>{['Basics', 'Details', 'Review'][n - 1]}</div>
            </div>
            {n < 3 && <div style={{ flex: 1, height: 2, background: n < step ? 'var(--brand)' : 'var(--line)' }}/>}
          </Fragment>
        ))}
      </div>

      <form className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={handleSubmit}>
        {step === 1 && <>
          <div className="field">
            <label>Place name *</label>
            <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sang Som Noodles"/>
          </div>
          <div className="field">
            <label>Category *</label>
            <select className="select" required value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">— select —</option>
              {CATEGORIES.filter(c => !c.optional).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>City *</label>
            <select className="select" required value={form.city} onChange={e => set('city', e.target.value)}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Area / neighbourhood</label>
            <input className="input" value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. Thong Lor"/>
          </div>
        </>}

        {step === 2 && <>
          <div className="field">
            <label>Short description *</label>
            <textarea className="textarea" required value={form.desc} onChange={e => set('desc', e.target.value)}
              placeholder="What's special? What do regulars order? Anything to skip? 2–3 sentences is perfect."/>
            <div className="hint">No marketing copy please. Honest, specific, useful.</div>
          </div>
          <div className="field">
            <label>Address or Google Maps link</label>
            <input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="https://maps.google.com/..."/>
          </div>
          <div className="field">
            <label>Opening hours</label>
            <input className="input" value={form.hours} onChange={e => set('hours', e.target.value)} placeholder="e.g. Daily 10:00 – 22:00"/>
          </div>
          <div className="field">
            <label>Price level</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4].map(n => (
                <button key={n} type="button" className="chip" onClick={() => set('price', form.price === n ? null : n)}
                  style={{ flex: 1, justifyContent: 'center', background: form.price === n ? 'var(--brand)' : undefined, color: form.price === n ? '#fff' : undefined }}>
                  {'฿'.repeat(n)}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Map coordinates</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" type="number" step="any" value={form.lat ?? ''} onChange={e => set('lat', e.target.value ? parseFloat(e.target.value) : null)} placeholder="Latitude (e.g. 13.7563)" style={{ flex: 1 }}/>
              <input className="input" type="number" step="any" value={form.lng ?? ''} onChange={e => set('lng', e.target.value ? parseFloat(e.target.value) : null)} placeholder="Longitude (e.g. 100.5018)" style={{ flex: 1 }}/>
            </div>
            <div className="hint">In Google Maps: right-click the place → &quot;What&apos;s here?&quot; → copy the two numbers that appear.</div>
          </div>
        </>}

        {step === 3 && <>
          <div className="card card-flat" style={{ padding: 14 }}>
            <div className="mono" style={{ marginBottom: 8 }}>Review your submission</div>
            <div style={{ fontSize: 14.5 }}><strong>{form.name || '(no name)'}</strong> — {(CATEGORIES.find(c => c.id === form.category) || {}).label || '(no category)'}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
              {[form.area, form.city === 'phuket' ? 'Phuket' : 'Bangkok'].filter(Boolean).join(', ')}
              {form.hours && <span> · {form.hours}</span>}
              {form.price && <span> · {'฿'.repeat(form.price)}</span>}
            </div>
            {form.address && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{form.address}</div>}
            {form.lat != null && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{form.lat}, {form.lng}</div>}
            <div style={{ fontSize: 13, marginTop: 12, lineHeight: 1.55 }}>{form.desc || '(description)'}</div>
          </div>
          {submitError && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#C13D2F12', color: 'var(--brand)', fontSize: 13 }}>
              {submitError}
            </div>
          )}
          {form.lat == null && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#D9A23A18', color: 'var(--gold)', fontSize: 12.5 }}>
              No coordinates added — an editor will need to pin this manually before it appears on the map.
            </div>
          )}
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: 12.5, color: 'var(--text)' }}>
            <input type="checkbox" required style={{ marginTop: 2, flexShrink: 0 }}/>
            <span>This is a genuine, honest recommendation. I am not submitting this as an advertisement or on behalf of the owner/business. I understand that commercial self-promotion will result in removal.</span>
          </label>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>By submitting you agree to our editorial standards. We may edit for accuracy and tone. You&apos;ll be credited.</div>
        </>}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {step > 1 && <button type="button" className="btn" onClick={() => setStep(step - 1)}>← Back</button>}
          <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto' }} disabled={submitting}>
            {step < 3 ? 'Continue →' : submitting ? 'Submitting…' : <><I.send size={16}/> Submit</>}
          </button>
        </div>
      </form>
    </main>
  )
}
