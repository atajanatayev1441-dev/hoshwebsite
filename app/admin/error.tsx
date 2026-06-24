'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AdminError]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'monospace', padding: '40px',
    }}>
      <div style={{ maxWidth: 700, width: '100%' }}>
        <p style={{ color: '#C9A84C', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
          Admin Panel Error
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 300, marginBottom: 24, color: '#ef4444' }}>
          {error.message || 'Unknown client-side error'}
        </h1>
        {error.digest && (
          <p style={{ color: '#666', fontSize: 12, marginBottom: 16 }}>
            Digest: {error.digest}
          </p>
        )}
        <pre style={{
          background: '#111', border: '1px solid #222',
          padding: 20, fontSize: 12, lineHeight: 1.6,
          color: '#aaa', overflow: 'auto', marginBottom: 24,
          maxHeight: 400,
        }}>
          {error.stack || 'No stack trace available'}
        </pre>
        <button
          onClick={reset}
          style={{
            background: '#C9A84C', color: '#000',
            border: 'none', padding: '10px 24px',
            fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Попробовать снова
        </button>
      </div>
    </div>
  )
}
