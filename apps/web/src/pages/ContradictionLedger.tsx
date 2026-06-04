import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContradictions } from '../hooks/useContradictions'
import { resolveContradiction } from '../api/client'
import type { Contradiction, ResolutionType } from '../types'

const RC_OPTIONS: Array<{ type: ResolutionType; label: string; description: string }> = [
  {
    type: 'RC-1',
    label: 'RC-1: Calibration Invalidation',
    description: 'The source of one signal is confirmed unreliable. The signal\'s basis is invalid, not the claim it made. Use when you have evidence that the observation method, source, or instrument was flawed, not that the underlying condition is necessarily false.',
  },
  {
    type: 'RC-2',
    label: 'RC-2: Falsification',
    description: 'One signal predicts an observable condition that is demonstrably absent. Direct evidence rules it out. Use when you can point to a specific observable that the signal implied, and confirm that observable is not present.',
  },
  {
    type: 'RC-3',
    label: 'RC-3: Domain Resolution',
    description: 'Someone with direct observational access confirms which condition is actually present. Use when a ground-truth observer with first-hand access to the domain has made a definitive statement about the actual state.',
  },
]

export function ContradictionLedger() {
  const { id } = useParams<{ id: string }>()
  const caseId = id!
  const qc = useQueryClient()

  const { data: contradictions, isLoading } = useContradictions(caseId)
  const [resolveTarget, setResolveTarget] = useState<Contradiction | null>(null)

  const resolveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof resolveContradiction>[1] }) =>
      resolveContradiction(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contradictions', caseId] })
      setResolveTarget(null)
    },
  })

  return (
    <div className="p-6">
      <h2 className="font-serif text-xl mb-6" style={{ color: 'var(--accent)' }}>Contradiction Ledger</h2>

      {isLoading && <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {!isLoading && (!contradictions || contradictions.length === 0) && (
        <div className="py-16 text-center" style={{ border: '1px dashed var(--border2)' }}>
          <p className="text-sm font-mono" style={{ color: 'var(--text-dim)' }}>No contradictions recorded.</p>
        </div>
      )}

      <div className="space-y-px">
        {(contradictions ?? []).map(c => (
          <ContradictionRow key={c.id} contradiction={c} onResolve={() => setResolveTarget(c)} />
        ))}
      </div>

      {resolveTarget && (
        <ResolutionModal
          contradiction={resolveTarget}
          isPending={resolveMutation.isPending}
          error={resolveMutation.error?.message}
          onClose={() => setResolveTarget(null)}
          onConfirm={(type, basis, signalId) =>
            resolveMutation.mutate({
              id: resolveTarget.id,
              data: { resolution_type: type, resolution_basis: basis, resolved_signal_id: signalId },
            })
          }
        />
      )}
    </div>
  )
}

function ContradictionRow({ contradiction: c, onResolve }: { contradiction: Contradiction; onResolve: () => void }) {
  const isActive = c.status === 'ACTIVE'
  const timeInState = c.resolved_at
    ? `Resolved ${new Date(c.resolved_at).toLocaleDateString()}`
    : `Active since ${new Date(c.created_at).toLocaleDateString()}`

  return (
    <div
      className="p-4 grid grid-cols-1 gap-3"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        borderLeft: `3px solid ${isActive ? 'var(--red)' : 'var(--green)'}`,
      }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 text-xs font-mono"
            style={{
              background: isActive ? '#c94f4f22' : '#4f9e6f22',
              color: isActive ? 'var(--red)' : 'var(--green)',
              border: `1px solid ${isActive ? '#c94f4f55' : '#4f9e6f55'}`,
            }}
          >
            {c.status}
          </span>
          {c.resolution_type && (
            <span className="text-xs font-mono px-2 py-0.5" style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>
              {c.resolution_type}
            </span>
          )}
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{timeInState}</span>
        </div>
        {isActive && (
          <button
            onClick={onResolve}
            className="px-3 py-1 text-xs rounded font-mono"
            style={{ background: 'var(--surface2)', color: 'var(--accent)', border: '1px solid var(--border2)' }}
          >
            Resolve
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Signal A</div>
          <p className="text-xs" style={{ color: 'var(--text)' }}>
            {c.signal_a?.content?.slice(0, 80) ?? c.signal_a_id}{(c.signal_a?.content?.length ?? 0) > 80 ? '…' : ''}
          </p>
        </div>
        <div className="p-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Signal B</div>
          <p className="text-xs" style={{ color: 'var(--text)' }}>
            {c.signal_b?.content?.slice(0, 80) ?? c.signal_b_id}{(c.signal_b?.content?.length ?? 0) > 80 ? '…' : ''}
          </p>
        </div>
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.description}</p>

      {c.resolution_basis && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="font-mono" style={{ color: 'var(--text-dim)' }}>Basis: </span>{c.resolution_basis}
        </p>
      )}
    </div>
  )
}

function ResolutionModal({
  contradiction,
  isPending,
  error,
  onClose,
  onConfirm,
}: {
  contradiction: Contradiction
  isPending: boolean
  error?: string
  onClose: () => void
  onConfirm: (type: ResolutionType, basis: string, signalId?: string) => void
}) {
  const [selectedType, setSelectedType] = useState<ResolutionType | null>(null)
  const [basis, setBasis] = useState('')
  const [resolvedSignalId, setResolvedSignalId] = useState('')

  function handleConfirm() {
    if (!selectedType || !basis.trim()) return
    onConfirm(selectedType, basis.trim(), resolvedSignalId || undefined)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#00000088' }}>
      <div className="w-full max-w-2xl overflow-y-auto max-h-screen" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Resolve Contradiction</span>
          <button onClick={onClose} className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Both signals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>Signal A</div>
              <p className="text-sm" style={{ color: 'var(--text)' }}>{contradiction.signal_a?.content ?? contradiction.signal_a_id}</p>
            </div>
            <div className="p-3" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>Signal B</div>
              <p className="text-sm" style={{ color: 'var(--text)' }}>{contradiction.signal_b?.content ?? contradiction.signal_b_id}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Select Resolution Type</p>
            <div className="space-y-2">
              {RC_OPTIONS.map(rc => (
                <button
                  key={rc.type}
                  onClick={() => setSelectedType(rc.type)}
                  className="w-full text-left p-4"
                  style={{
                    background: selectedType === rc.type ? 'var(--surface2)' : 'transparent',
                    border: `1px solid ${selectedType === rc.type ? 'var(--border2)' : 'var(--border)'}`,
                  }}
                >
                  <div className="font-mono text-sm mb-1" style={{ color: selectedType === rc.type ? 'var(--accent)' : 'var(--text)' }}>
                    {rc.label}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{rc.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Resolution Basis *
            </label>
            <textarea
              value={basis} onChange={e => setBasis(e.target.value)} rows={3} required
              placeholder="Explain the basis for this resolution..."
              className="w-full px-3 py-2 text-sm rounded font-mono resize-y"
              style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Accepted Signal (optional)
            </label>
            <select
              value={resolvedSignalId}
              onChange={e => setResolvedSignalId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded font-mono"
              style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            >
              <option value="">— neither / not applicable —</option>
              <option value={contradiction.signal_a_id}>Signal A — {contradiction.signal_a_id}</option>
              <option value={contradiction.signal_b_id}>Signal B — {contradiction.signal_b_id}</option>
            </select>
          </div>

          {error && <p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p>}

          <button
            onClick={handleConfirm}
            disabled={!selectedType || !basis.trim() || isPending}
            className="w-full px-4 py-2 text-sm rounded font-sans uppercase tracking-widest disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            {isPending ? 'Saving...' : 'Confirm Resolution'}
          </button>
        </div>
      </div>
    </div>
  )
}
