'use client'

import Link from 'next/link'

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ padding: '80px 20px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
      <div className="mono" style={{ marginBottom: 8 }}>Something went wrong</div>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
        An unexpected error occurred. You can try again or go back to the home page.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn">Go home</Link>
      </div>
    </main>
  )
}
