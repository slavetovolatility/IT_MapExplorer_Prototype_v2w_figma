'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PASSWORD_RULES, isPasswordValid } from '@/lib/validation'
import I from '@/components/ui/icons'

type Mode = 'signin' | 'signup'

export default function SignInPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)   // true once user starts typing a password during signup
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signedUp, setSignedUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { setError('Auth not configured'); return }

    if (mode === 'signup' && !isPasswordValid(password)) {
      setTouched(true)
      setError('Please satisfy all password requirements below.')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.session) {
          router.push('/')
        } else {
          setSignedUp(true)
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  if (signedUp) {
    return (
      <main className="wrap route-mount" style={{ padding: '40px var(--gutter)', maxWidth: 460 }}>
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#C13D2F18', color: 'var(--brand)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <I.mail size={24}/>
          </div>
          <h2 className="h3" style={{ margin: '0 0 8px' }}>Check your email</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
          </p>
          <button
            className="btn"
            style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}
            onClick={() => { setSignedUp(false); setMode('signin') }}
          >
            Back to sign in
          </button>
          <Link href="/" className="btn" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>Continue browsing</Link>
        </div>
      </main>
    )
  }

  const toggle = (m: Mode) => { setMode(m); setError(''); setTouched(false) }

  // Show the checklist as soon as the user starts typing a password during signup
  const showChecklist = mode === 'signup' && (touched || password.length > 0)

  return (
    <main className="wrap route-mount" style={{ padding: '40px var(--gutter)', maxWidth: 460 }}>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Image src="/logo.png" alt="Inside Thailand" width={32} height={32} style={{ borderRadius: 9 }}/>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>Inside Thailand</span>
        </div>
        <h1 className="h2" style={{ margin: '8px 0 4px' }}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 22, fontSize: 14 }}>
          Save places, submit new ones, and sync across devices.
        </p>

        <button onClick={handleGoogle} className="btn" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', color: 'var(--muted)', fontSize: 11.5 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
          OR
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: 'var(--bg-2)', borderRadius: 10, padding: 4 }}>
          {(['signin', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => toggle(m)}
              style={{
                flex: 1, padding: '7px 0', border: 0, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: mode === m ? 'var(--bg-card)' : 'transparent',
                color: mode === m ? 'var(--text)' : 'var(--muted)',
                boxShadow: mode === m ? 'var(--shadow)' : 'none',
              }}
            >
              {m === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder={mode === 'signup' ? 'Create a password' : ''}
                value={password}
                onChange={e => { setPassword(e.target.value); if (mode === 'signup') setTouched(true) }}
                required
                minLength={mode === 'signup' ? 8 : undefined}
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 0, cursor: 'pointer', color: 'var(--muted)', padding: 4,
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <I.eyeOff size={16}/> : <I.eye size={16}/>}
              </button>
            </div>

            {showChecklist && (
              <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {PASSWORD_RULES.map(rule => {
                  const ok = rule.test(password)
                  return (
                    <li key={rule.key} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
                      <span style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        display: 'grid', placeItems: 'center',
                        background: ok ? '#2D6A4F20' : '#C13D2F14',
                        color: ok ? '#2D6A4F' : 'var(--brand)',
                      }}>
                        {ok ? <I.check size={10}/> : <I.x size={10}/>}
                      </span>
                      <span style={{ color: ok ? '#2D6A4F' : 'var(--muted)' }}>{rule.label}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {error && (
            <div style={{ fontSize: 13, color: 'var(--brand)', background: '#C13D2F12', borderRadius: 8, padding: '8px 12px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ justifyContent: 'center' }}
            disabled={loading || (mode === 'signup' && touched && !isPasswordValid(password))}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
          By continuing you agree to our{' '}
          <Link href="/privacy" style={{ color: 'var(--info)' }}>Privacy Policy</Link>.
        </div>
      </div>
    </main>
  )
}
