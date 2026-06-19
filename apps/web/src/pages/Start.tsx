import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createCase, getCaseByCode } from '../api/client'
import { AlvirassaLogo } from '../components/AlvirassaLogo'

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
      <div className="w-full max-w-md">
        <p className="font-serif italic text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          cognitive intelligence system
        </p>
        <AlvirassaLogo className="mb-6" />
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
          Submit observations. Preserve what remains unexplained. Connect residuals across domains.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm" style={{ background: '#7a303022', color: 'var(--red)', border: '1px solid var(--red-dim)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="mb-6">
          <label className="block text-xs font-sans uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            New Case
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={caseName}
              onChange={e => setCaseName(e.target.value)}
              placeholder="Case name"
              className="flex-1 px-3 py-2 text-sm rounded font-mono"
              style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            />
            <button
              type="submit"
              disabled={creating || !caseName.trim()}
              className="px-4 py-2 text-xs rounded font-sans uppercase tracking-widest disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'var(--bg)', fontWeight: 500 }}
            >
              {creating ? '...' : 'Begin'}
            </button>
          </div>
        </form>

        <form onSubmit={handleRetrieve}>
          <label className="block text-xs font-sans uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Open Case
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
              placeholder="ACCESS CODE"
              className="flex-1 px-3 py-2 text-sm rounded font-mono uppercase tracking-widest"
              style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            />
            <button
              type="submit"
              disabled={retrieving || !accessCode.trim()}
              className="px-4 py-2 text-xs rounded font-sans uppercase tracking-widest disabled:opacity-50"
              style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', fontWeight: 500 }}
            >
              {retrieving ? '...' : 'Open'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 flex gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link to="/about" className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>about</Link>
          <span style={{ color: 'var(--border2)' }} className="text-xs">·</span>
          <Link to="/research" className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>research</Link>
          <span style={{ color: 'var(--border2)' }} className="text-xs">·</span>
          <Link to="/plans" className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>plans</Link>
        </div>
      </div>
    </div>
  )
}
