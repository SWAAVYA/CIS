import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCase, getCaseByCode } from '../api/client'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.65rem 0.8rem',
  background: 'var(--surface)',
  color: 'var(--text)',
  border: '1px solid var(--border2)',
  borderRadius: 3,
  fontFamily: 'DM Mono, monospace',
  fontSize: '0.78rem',
  outline: 'none',
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
    setCreating(true); setError(null)
    try {
      const c = await createCase(caseName.trim())
      navigate(`/cases/${c.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create case')
    } finally { setCreating(false) }
  }

  async function handleRetrieve(e: React.FormEvent) {
    e.preventDefault()
    if (!accessCode.trim()) return
    setRetrieving(true); setError(null)
    try {
      const c = await getCaseByCode(accessCode.trim().toUpperCase())
      navigate(`/cases/${c.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Case not found')
    } finally { setRetrieving(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SiteNav />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem 4rem',
      }}>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', color: 'rgba(200,184,122,0.45)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            cognitive intelligence system
          </p>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.9, marginBottom: '2.5rem', letterSpacing: '0.01em' }}>
            Submit observations. Preserve what remains unexplained. Connect residuals across domains.
          </p>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.6rem 0.8rem', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: 'var(--red)', background: '#7a303022', border: '1px solid var(--red-dim)', borderRadius: 3 }}>
              {error}
            </div>
          )}

          {/* New case */}
          <form onSubmit={handleCreate} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
              New Case
            </label>
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
                  padding: '0.65rem 1.1rem',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  border: 'none',
                  borderRadius: 3,
                  cursor: 'pointer',
                  opacity: creating || !caseName.trim() ? 0.4 : 1,
                  flexShrink: 0,
                }}
              >
                {creating ? '…' : 'Begin'}
              </button>
            </div>
          </form>

          {/* Open case */}
          <form onSubmit={handleRetrieve}>
            <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.45rem' }}>
              Open Case
            </label>
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
                  padding: '0.65rem 1.1rem',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border2)',
                  borderRadius: 3,
                  cursor: 'pointer',
                  opacity: retrieving || !accessCode.trim() ? 0.4 : 1,
                  flexShrink: 0,
                }}
              >
                {retrieving ? '…' : 'Open'}
              </button>
            </div>
          </form>

        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
