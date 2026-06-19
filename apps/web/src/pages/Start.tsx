import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createCase, getCaseByCode } from '../api/client'
import { AlvirassaLogo } from '../components/AlvirassaLogo'

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.6rem 0.75rem',
  background: 'var(--surface)',
  color: 'var(--text)',
  border: '1px solid var(--border2)',
  borderRadius: 3,
  fontFamily: 'DM Mono, monospace',
  fontSize: '0.8rem',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'DM Mono, monospace',
  fontSize: '0.6rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--text-dim)',
  marginBottom: '0.4rem',
}

export function Start() {
  const navigate = useNavigate()
  const [caseName, setCaseName] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [retrieving, setRetrieving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!caseName.trim()) return
    setCreating(true)
    setError(null)
    try {
      const c = await createCase(caseName.trim())
      navigate(`/cases/${c.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create case')
    } finally {
      setCreating(false)
    }
  }

  async function handleRetrieve(e: React.FormEvent) {
    e.preventDefault()
    if (!accessCode.trim()) return
    setRetrieving(true)
    setError(null)
    try {
      const c = await getCaseByCode(accessCode.trim().toUpperCase())
      navigate(`/cases/${c.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Case not found')
    } finally {
      setRetrieving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Logo mark — subtitle justified to match wordmark width */}
        <AlvirassaLogo showSubtitle size="2rem" style={{ marginBottom: '2.8rem' }} />

        {/* Description */}
        <p style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          marginBottom: '2.4rem',
          opacity: 0.7,
        }}>
          Submit observations. Preserve what remains unexplained. Connect residuals across domains.
        </p>

        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.6rem 0.75rem', fontSize: '0.78rem', background: '#7a303022', color: 'var(--red)', border: '1px solid var(--red-dim)', fontFamily: 'DM Mono, monospace' }}>
            {error}
          </div>
        )}

        {/* New case */}
        <form onSubmit={handleCreate} style={{ marginBottom: '1.2rem' }}>
          <label style={labelStyle}>New Case</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={caseName}
              onChange={e => setCaseName(e.target.value)}
              placeholder="Case name"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={creating || !caseName.trim()}
              style={{
                padding: '0.6rem 1.1rem',
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'var(--accent)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: 3,
                cursor: 'pointer',
                opacity: creating || !caseName.trim() ? 0.45 : 1,
                flexShrink: 0,
              }}
            >
              {creating ? '…' : 'Begin'}
            </button>
          </div>
        </form>

        {/* Open case */}
        <form onSubmit={handleRetrieve}>
          <label style={labelStyle}>Open Case</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
              placeholder="Access code"
              style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            />
            <button
              type="submit"
              disabled={retrieving || !accessCode.trim()}
              style={{
                padding: '0.6rem 1.1rem',
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border2)',
                borderRadius: 3,
                cursor: 'pointer',
                opacity: retrieving || !accessCode.trim() ? 0.45 : 1,
                flexShrink: 0,
              }}
            >
              {retrieving ? '…' : 'Open'}
            </button>
          </div>
        </form>

        {/* Footer links */}
        <div style={{ marginTop: '3rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1.2rem' }}>
          <Link to="/about" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--text-dim)', textDecoration: 'none', letterSpacing: '0.08em' }}>about</Link>
          <Link to="/research" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--text-dim)', textDecoration: 'none', letterSpacing: '0.08em' }}>research</Link>
          <Link to="/plans" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--text-dim)', textDecoration: 'none', letterSpacing: '0.08em' }}>plans</Link>
        </div>

      </div>
    </div>
  )
}
