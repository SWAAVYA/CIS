// LAYER 3 FREEZE — 2026-06-02
// Future: HypothesisVulnerabilityPanel (AVA — Assumption Vulnerability Analysis)
// Shows STATE CAPTURE RISK alert when load-bearing, weakly-corroborated assumptions
// are being targeted by dismissed contradictions.
// Entry condition: 50 completed investigations with full telemetry records.
// Do not implement before that condition is met.
// See docs/CIS_ARCHITECTURE_LAYERS.md — Layer 3 Freeze section.
// ref: CIS_SPEC_AMENDMENTS.md — Blocking Issue 6, AVA addendum

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useHypotheses, usePlausibilityHistory } from '../hooks/useHypotheses'
import { useSignals } from '../hooks/useSignals'
import { addEvidence, resolveHypothesis, normaliseCompetitionSet } from '../api/client'
import { PlausibilityBar } from '../components/PlausibilityBar'
import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts'
import type { Hypothesis, EvidenceType, HypothesisStatus } from '../types'

export function HypothesisBoard() {
  const { id } = useParams<{ id: string }>()
  const caseId = id!
  const qc = useQueryClient()

  const { data: hypotheses, isLoading } = useHypotheses(caseId)
  const { data: allSignals } = useSignals(caseId)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [evidenceModalId, setEvidenceModalId] = useState<string | null>(null)
  const [resolveModalId, setResolveModalId] = useState<string | null>(null)
  const [normaliseModalId, setNormaliseModalId] = useState<string | null>(null)

  const expandedHyp = hypotheses?.find(h => h.id === expandedId)
  const evidenceHyp = hypotheses?.find(h => h.id === evidenceModalId)
  const resolveHyp = hypotheses?.find(h => h.id === resolveModalId)

  // Coverage stats for the header
  const activeHyps = (hypotheses ?? []).filter(h => h.status === 'ACTIVE')
  const coveredIds = new Set(
    activeHyps.flatMap(h => h.evidence ?? []).map(e => e.signal_id).filter(Boolean) as string[]
  )
  const activeObservations = (allSignals ?? []).filter(s =>
    s.lifecycle_status === 'ADMITTED' || s.lifecycle_status === 'RETAINED'
  )
  const coveredCount = activeObservations.filter(s => coveredIds.has(s.id)).length
  const uncoveredCount = activeObservations.length - coveredCount

  const normalise = useMutation({
    mutationFn: (setId: string) => normaliseCompetitionSet(setId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hypotheses', caseId] })
      setNormaliseModalId(null)
    },
  })

  return (
    <div className="p-6">
      <div className="flex items-baseline justify-between flex-wrap gap-4 mb-6">
        <h2 className="font-serif text-xl" style={{ color: 'var(--accent)' }}>Hypothesis Board</h2>
        {!isLoading && activeObservations.length > 0 && (
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {activeHyps.length} {activeHyps.length === 1 ? 'hypothesis' : 'hypotheses'} — covering{' '}
            <span style={{ color: 'var(--green)' }}>{coveredCount}</span> of{' '}
            {activeObservations.length} observations ·{' '}
            <span style={{ color: 'var(--accent)' }}>{uncoveredCount}</span> remain uncovered
          </span>
        )}
      </div>

      {isLoading && <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {!isLoading && (!hypotheses || hypotheses.length === 0) && (
        <div className="py-16 text-center" style={{ border: '1px dashed var(--border2)' }}>
          <p className="text-sm font-mono" style={{ color: 'var(--text-dim)' }}>No hypotheses yet. The SHG will generate them as signals accumulate.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(hypotheses ?? []).map(hyp => (
          <HypothesisCard
            key={hyp.id}
            hyp={hyp}
            expanded={expandedId === hyp.id}
            onExpand={() => setExpandedId(expandedId === hyp.id ? null : hyp.id)}
            onAddEvidence={() => setEvidenceModalId(hyp.id)}
            onResolve={() => setResolveModalId(hyp.id)}
            onNormalise={() => setNormaliseModalId(hyp.competition_set_id ?? null)}
          />
        ))}
      </div>

      {expandedHyp && (
        <ExpandedHypothesis
          hyp={expandedHyp}
          onClose={() => setExpandedId(null)}
          onNormalise={() => setNormaliseModalId(expandedHyp.competition_set_id ?? null)}
        />
      )}

      {evidenceHyp && (
        <EvidenceModal
          hyp={evidenceHyp}
          caseId={caseId}
          onClose={() => setEvidenceModalId(null)}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ['hypotheses', caseId] })
            setEvidenceModalId(null)
          }}
        />
      )}

      {resolveHyp && (
        <ResolveModal
          hyp={resolveHyp}
          onClose={() => setResolveModalId(null)}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ['hypotheses', caseId] })
            setResolveModalId(null)
          }}
        />
      )}

      {normaliseModalId && (
        <NormaliseModal
          setId={normaliseModalId}
          isPending={normalise.isPending}
          onConfirm={() => normalise.mutate(normaliseModalId)}
          onClose={() => setNormaliseModalId(null)}
        />
      )}
    </div>
  )
}

function HypothesisCard({
  hyp, expanded, onExpand, onAddEvidence, onResolve, onNormalise,
}: {
  hyp: Hypothesis
  expanded: boolean
  onExpand: () => void
  onAddEvidence: () => void
  onResolve: () => void
  onNormalise: () => void
}) {
  const statusColor = hyp.status === 'CONFIRMED' ? 'var(--hypothesis-confirmed)'
    : hyp.status === 'FALSIFIED' ? 'var(--hypothesis-falsified)'
    : hyp.status === 'ARCHIVED' ? 'var(--text-muted)'
    : 'var(--hypothesis-active)'

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-sm leading-snug" style={{ color: 'var(--text)' }}>{hyp.title}</h3>
          <div className="flex gap-1 flex-shrink-0">
            <span className="px-1.5 py-0.5 text-xs font-mono rounded" style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>
              {hyp.hypothesis_type}
            </span>
            <span className="px-1.5 py-0.5 text-xs font-mono rounded" style={{ background: `${statusColor}22`, color: statusColor }}>
              {hyp.status}
            </span>
          </div>
        </div>

        <PlausibilityBar plausibility={hyp.plausibility} />

        <div className="flex items-center gap-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--green)' }}>+{hyp.evidence?.filter(e => e.evidence_type === 'SUPPORTING').length ?? 0}</span>
          <span style={{ color: 'var(--red)' }}>−{hyp.evidence?.filter(e => e.evidence_type === 'CONTRADICTING').length ?? 0}</span>
          <span>~{hyp.evidence?.filter(e => e.evidence_type === 'CONTEXTUAL').length ?? 0}</span>
          <span className="ml-auto" style={{ color: 'var(--text-dim)' }}>{hyp.generated_by}</span>
        </div>

        {hyp.competition_set_id && (hyp.competition_set_sum ?? 0) > 1.0 && (
          <div className="text-xs p-2" style={{ background: '#7a303022', color: 'var(--red)', border: '1px solid var(--red-dim)' }}>
            Combined plausibility exceeds 100%.{' '}
            <button onClick={onNormalise} className="underline">NORMALISE MANUALLY →</button>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onExpand} className="px-3 py-1 text-xs rounded font-mono"
            style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border2)' }}>
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          {hyp.status === 'ACTIVE' && (
            <>
              <button onClick={onAddEvidence} className="px-3 py-1 text-xs rounded font-mono"
                style={{ background: 'var(--surface2)', color: 'var(--accent)', border: '1px solid var(--border2)' }}>
                Add Evidence
              </button>
              <button onClick={onResolve} className="px-3 py-1 text-xs rounded font-mono"
                style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border2)' }}>
                Resolve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ExpandedHypothesis({ hyp, onClose, onNormalise }: { hyp: Hypothesis; onClose: () => void; onNormalise: () => void }) {
  const { data: history } = usePlausibilityHistory(hyp.id)

  const chartData = (history ?? []).map(h => ({
    t: new Date(h.recorded_at).toLocaleTimeString(),
    p: Number(h.plausibility),
    reason: h.reason,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#00000088' }}>
      <div className="w-full max-w-2xl overflow-y-auto max-h-screen" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-serif text-lg" style={{ color: 'var(--accent)' }}>{hyp.title}</h3>
          <button onClick={onClose} className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>✕ Close</button>
        </div>
        <div className="p-4 space-y-4">
          {hyp.description && (
            <p className="text-sm font-serif" style={{ color: 'var(--text)' }}>{hyp.description}</p>
          )}

          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Plausibility History</div>
            {chartData.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>No history yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <XAxis dataKey="t" tick={{ fill: '#606078', fontSize: 10 }} />
                  <YAxis domain={[0, 1]} tick={{ fill: '#606078', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 4 }}
                    labelStyle={{ color: 'var(--text-muted)', fontSize: 11 }}
                  />
                  <ReferenceLine y={0.10} stroke="#c94f4f" strokeDasharray="3 3" />
                  <ReferenceLine y={0.85} stroke="#4f9e6f" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="p" stroke="#c8b87a" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {hyp.competition_set_id && (
            <div className="p-3" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Competition Set</div>
              {(hyp.competition_set_sum ?? 0) > 1.0 && (
                <div className="text-xs p-2 mb-2" style={{ background: '#7a303022', color: 'var(--red)', border: '1px solid var(--red-dim)' }}>
                  Combined plausibility ({(Number(hyp.competition_set_sum ?? 0) * 100).toFixed(0)}%) exceeds 100%.{' '}
                  <button onClick={onNormalise} className="underline">NORMALISE MANUALLY →</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EvidenceModal({
  hyp, caseId: _caseId, onClose, onSuccess,
}: {
  hyp: Hypothesis
  caseId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [type, setType] = useState<EvidenceType>('SUPPORTING')
  const [weight, setWeight] = useState(0.5)
  const [content, setContent] = useState('')
  const [signalId, setSignalId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const expectedDelta =
    type === 'SUPPORTING' ? weight * (1 - hyp.plausibility) * 0.3
    : type === 'CONTRADICTING' ? -weight * hyp.plausibility * 0.3
    : 0

  async function handleSubmit() {
    if (!content.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await addEvidence(hyp.id, {
        content: content.trim(),
        evidence_type: type,
        weight,
        signal_id: signalId || undefined,
      })
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  const TYPE_STYLES: Record<EvidenceType, { label: string; desc: string; color: string }> = {
    SUPPORTING: { label: 'Supporting', desc: 'Evidence that increases plausibility of this hypothesis.', color: 'var(--green)' },
    CONTRADICTING: { label: 'Contradicting', desc: 'Evidence that decreases plausibility of this hypothesis.', color: 'var(--red)' },
    CONTEXTUAL: { label: 'Contextual', desc: 'Background evidence that does not directly change plausibility.', color: 'var(--text-muted)' },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#00000088' }}>
      <div className="w-full max-w-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Add Evidence</span>
          <button onClick={onClose} className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TYPE_STYLES) as EvidenceType[]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="p-3 text-left"
                style={{
                  background: type === t ? `${TYPE_STYLES[t].color}22` : 'var(--surface2)',
                  border: `1px solid ${type === t ? TYPE_STYLES[t].color : 'var(--border2)'}`,
                }}
              >
                <div className="text-xs font-mono mb-1" style={{ color: TYPE_STYLES[t].color }}>{TYPE_STYLES[t].label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{TYPE_STYLES[t].desc}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Weight: {weight.toFixed(2)}
            </label>
            <input type="range" min={0} max={1} step={0.05} value={weight}
              onChange={e => setWeight(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Content</label>
            <textarea
              value={content} onChange={e => setContent(e.target.value)} rows={4}
              className="w-full px-3 py-2 text-sm rounded font-mono resize-y"
              style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Signal ID (optional)
            </label>
            <input type="text" value={signalId} onChange={e => setSignalId(e.target.value)}
              placeholder="Link to a signal..."
              className="w-full px-3 py-2 text-sm rounded font-mono"
              style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            />
          </div>

          {type !== 'CONTEXTUAL' && (
            <div className="text-xs font-mono p-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              Expected plausibility delta:{' '}
              <span style={{ color: expectedDelta >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {expectedDelta >= 0 ? '+' : ''}{(expectedDelta * 100).toFixed(1)}%
              </span>
            </div>
          )}

          {error && <p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p>}

          <button onClick={handleSubmit} disabled={submitting || !content.trim()}
            className="w-full px-4 py-2 text-sm rounded font-sans uppercase tracking-widest disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            {submitting ? 'Submitting...' : 'Submit Evidence'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ResolveModal({ hyp, onClose, onSuccess }: { hyp: Hypothesis; onClose: () => void; onSuccess: () => void }) {
  const [status, setStatus] = useState<HypothesisStatus>('CONFIRMED')
  const [basis, setBasis] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!basis.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await resolveHypothesis(hyp.id, status, basis.trim())
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#00000088' }}>
      <div className="w-full max-w-md" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Resolve Hypothesis</span>
          <button onClick={onClose} className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(['CONFIRMED', 'FALSIFIED', 'ARCHIVED'] as HypothesisStatus[]).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className="p-3 text-center text-xs font-mono"
                style={{
                  background: status === s ? 'var(--surface2)' : 'transparent',
                  border: `1px solid ${status === s ? 'var(--border2)' : 'var(--border)'}`,
                  color: s === 'CONFIRMED' ? 'var(--green)' : s === 'FALSIFIED' ? 'var(--red)' : 'var(--text-muted)',
                }}>
                {s}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Resolution Basis *
            </label>
            <textarea value={basis} onChange={e => setBasis(e.target.value)} rows={3} required
              className="w-full px-3 py-2 text-sm rounded font-mono resize-y"
              style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }} />
          </div>

          {error && <p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p>}

          <button onClick={handleSubmit} disabled={submitting || !basis.trim()}
            className="w-full px-4 py-2 text-sm rounded font-sans uppercase tracking-widest disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            {submitting ? 'Saving...' : 'Confirm Resolution'}
          </button>
        </div>
      </div>
    </div>
  )
}

function NormaliseModal({ setId: _setId, isPending, onConfirm, onClose }: {
  setId: string
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  const [confirmed, setConfirmed] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#00000088' }}>
      <div className="w-full max-w-md" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Normalise Competition Set</span>
          <button onClick={onClose} className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="p-3 text-sm" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>What is normalisation?</p>
            <p className="mb-2">When hypotheses compete to explain the same phenomenon, their combined plausibility must not exceed 1.0 (100%). Normalisation rescales each hypothesis proportionally so that the sum equals exactly 1.0.</p>
            <p className="mb-2"><strong>Example:</strong> If two competing hypotheses have plausibility 0.7 and 0.6 (sum = 1.3), normalisation scales them to 0.54 and 0.46 (sum = 1.0), preserving their relative strength.</p>
            <p style={{ color: 'var(--text-muted)' }}>This operation is irreversible. The plausibility history will record the normalisation event.</p>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-muted)' }}>
            <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
            I understand that this will proportionally rescale all hypotheses in this set.
          </label>
          <button
            onClick={onConfirm}
            disabled={!confirmed || isPending}
            className="w-full px-4 py-2 text-sm rounded font-sans uppercase tracking-widest disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            {isPending ? 'Normalising...' : 'Confirm Normalisation'}
          </button>
        </div>
      </div>
    </div>
  )
}
