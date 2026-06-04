import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  getDomains,
  submitSignal,
  extractFromDocument,
  synthesizeFields,
  confirmCandidates,
} from '../api/client'
import { StatusBadge } from '../components/StatusBadge'
import { SIScoreBar } from '../components/SIScoreBar'
import type {
  SignalSubmissionResult,
  SignalCandidate,
  Correspondence,
  SynthesisResult,
  ConfirmedCandidate,
  Domain,
} from '../types'

const MISMATCH_TYPES = ['RATE', 'DIRECTION', 'RELATIONSHIP', 'CONFIGURATION']
const DEVIATION_DIRECTIONS = ['UP', 'DOWN', 'DIVERGING', 'CONVERGING', 'STABLE']

type Mode = 'manual' | 'document' | 'synthesize'

// ─── Mode Picker ────────────────────────────────────────────────────────────

function IntakeModePicker({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const cards: { id: Mode; title: string; desc: string }[] = [
    {
      id: 'manual',
      title: 'Manual Entry',
      desc: 'Directly enter a single observation. Full control over all fields.',
    },
    {
      id: 'document',
      title: 'Document Extraction',
      desc: 'Paste or upload a document. AI extracts structurally anomalous observations.',
    },
    {
      id: 'synthesize',
      title: 'Cross-Field Synthesis',
      desc: 'Provide content from two independent domains. AI identifies structural correspondences.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {cards.map(c => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className="text-left p-4"
          style={{
            background: mode === c.id ? 'var(--surface2)' : 'var(--surface)',
            border: `1px solid ${mode === c.id ? 'var(--accent)' : 'var(--border2)'}`,
            color: 'var(--text)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <div
            className="text-xs uppercase tracking-widest mb-1"
            style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, color: mode === c.id ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            {c.title}
          </div>
          <div className="text-xs" style={{ fontFamily: 'IBM Plex Sans, sans-serif', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {c.desc}
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Manual Form (Mode 1 — unchanged behavior) ──────────────────────────────

function ManualForm({ caseId, domains }: { caseId: string; domains: Domain[] }) {
  const [domainId, setDomainId] = useState('')
  const [content, setContent] = useState('')
  const [period, setPeriod] = useState(1)
  const [mismatchType, setMismatchType] = useState('')
  const [deviationDir, setDeviationDir] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SignalSubmissionResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!domainId || !content.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await submitSignal(caseId, {
        content: content.trim(),
        domain_id: domainId,
        observation_period: period,
        mismatch_type: mismatchType || undefined,
        deviation_direction: deviationDir || undefined,
      })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setContent('')
    setMismatchType('')
    setDeviationDir('')
    setPeriod(1)
    setResult(null)
    setError(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Domain *
          </label>
          <select
            value={domainId}
            onChange={e => setDomainId(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded font-mono"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          >
            <option value="">Select domain...</option>
            {domains.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Observation Period (days) *
          </label>
          <input
            type="number"
            value={period}
            onChange={e => setPeriod(Number(e.target.value))}
            min={1}
            required
            className="w-full px-3 py-2 text-sm rounded font-mono"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Observation *
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={6}
            placeholder="Describe the signal observation..."
            className="w-full px-3 py-2 text-sm rounded font-mono resize-y"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          />
        </div>

        <div className="p-3 text-xs" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          Tag signals to enable cross-domain synthesis. AI will infer — override if needed.
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Mismatch Type (optional)
          </label>
          <select
            value={mismatchType}
            onChange={e => setMismatchType(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded font-mono"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          >
            <option value="">— none / inferred —</option>
            {MISMATCH_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Deviation Direction (optional)
          </label>
          <select
            value={deviationDir}
            onChange={e => setDeviationDir(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded font-mono"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          >
            <option value="">— none / inferred —</option>
            {DEVIATION_DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {error && (
          <div className="p-3 text-xs" style={{ background: '#7a303022', color: 'var(--red)', border: '1px solid var(--red-dim)' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !domainId || !content.trim()}
          className="w-full px-4 py-2.5 text-sm rounded font-sans uppercase tracking-widest disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'var(--bg)', fontWeight: 500 }}
        >
          {submitting ? 'Submitting...' : 'Submit Observation'}
        </button>
      </form>

      <div>
        {result ? (
          <div className="space-y-4">
            <div className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
              <div className="flex items-center gap-2">
                <StatusBadge status={result.signal.lifecycle_status} />
                <span className="text-xs font-mono" style={{ color: result.admission.decision === 'ADMITTED' ? 'var(--green)' : 'var(--text-muted)' }}>
                  {result.admission.decision}
                </span>
              </div>

              <div>
                <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>SI Score</div>
                <SIScoreBar score={result.signal.si_score} />
              </div>

              <div className="flex gap-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Significance</div>
                  <span className="font-mono text-sm" style={{ color: 'var(--text)' }}>{Number(result.signal.significance).toFixed(3)}</span>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>SI Threshold</div>
                  <span className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{result.admission.si_threshold}</span>
                </div>
              </div>

              {result.connections.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Connections Detected</div>
                  <span className="font-mono text-sm" style={{ color: 'var(--blue)' }}>{result.connections.length}</span>
                </div>
              )}

              {result.hypotheses.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Hypotheses Generated</div>
                  <span className="font-mono text-sm" style={{ color: 'var(--hypothesis-active)' }}>{result.hypotheses.length}</span>
                </div>
              )}

              {result.lp_flags.length > 0 && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--flag)' }}>LP Flags</div>
                  <div className="flex gap-1 flex-wrap">
                    {result.lp_flags.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs font-mono rounded" style={{ background: 'var(--flag-bg)', color: 'var(--flag)' }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={resetForm}
              className="w-full px-4 py-2 text-sm rounded font-sans uppercase tracking-widest"
              style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
            >
              Submit Another Observation
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48" style={{ border: '1px dashed var(--border2)' }}>
            <p className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>Submission result will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Candidate Review Panel ──────────────────────────────────────────────────

interface CandidateReviewPanelProps {
  candidates: SignalCandidate[]
  caseId: string
  domains: Domain[]
  onSuccess: () => void
}

function CandidateReviewPanel({ candidates: initial, caseId, domains, onSuccess }: CandidateReviewPanelProps) {
  const [items, setItems] = useState<SignalCandidate[]>(() =>
    initial.map((c, i) => ({ ...c, id: c.id ?? String(i), included: true }))
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitResult, setSubmitResult] = useState<{ submitted: number; signals: unknown[] } | null>(null)

  function update(idx: number, patch: Partial<SignalCandidate>) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it))
  }

  const included = items.filter(it => it.included)
  const missingFields = included.some(it => !it.domain_id || it.observation_period == null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      const payload: ConfirmedCandidate[] = included.map(it => ({
        text: it.text,
        si_dimension: it.si_dimension ?? '',
        deviation_direction: it.deviation_direction ?? '',
        observation_period: it.observation_period ?? 1,
        domain_id: it.domain_id ?? '',
        mismatch_type: it.si_dimension ?? '',
      }))
      const res = await confirmCandidates(caseId, payload)
      setSubmitResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitResult) {
    return (
      <div className="space-y-4">
        <div className="p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--green)' }}>
            Intake Complete
          </div>
          <div className="text-sm font-mono" style={{ color: 'var(--text)' }}>
            {submitResult.submitted} signal{submitResult.submitted !== 1 ? 's' : ''} admitted to case.
          </div>
        </div>
        <button
          onClick={onSuccess}
          className="px-4 py-2 text-sm rounded font-sans uppercase tracking-widest"
          style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
        >
          Return to Intake
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Review Extracted Candidates
      </div>

      {items.map((item, idx) => (
        <div
          key={item.id}
          className="p-4 space-y-3"
          style={{
            background: item.included ? 'var(--surface)' : 'var(--surface2)',
            border: `1px solid ${item.included ? 'var(--border2)' : 'var(--border)'}`,
            opacity: item.included ? 1 : 0.5,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <textarea
              value={item.text}
              onChange={e => update(idx, { text: e.target.value })}
              rows={3}
              className="flex-1 px-3 py-2 text-sm rounded font-mono resize-y"
              style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            />
            <button
              onClick={() => update(idx, { included: !item.included })}
              className="px-3 py-1.5 text-xs rounded font-sans uppercase tracking-widest flex-shrink-0"
              style={{
                background: item.included ? '#1a3a1a' : 'var(--surface2)',
                color: item.included ? 'var(--green)' : 'var(--text-muted)',
                border: `1px solid ${item.included ? 'var(--green)' : 'var(--border2)'}`,
              }}
            >
              {item.included ? 'Include' : 'Exclude'}
            </button>
          </div>

          {item.structural_note && (
            <p className="text-xs italic" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
              {item.structural_note}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>SI Dimension</label>
              <select
                value={item.si_dimension ?? ''}
                onChange={e => update(idx, { si_dimension: e.target.value as SignalCandidate['si_dimension'] })}
                className="w-full px-2 py-1.5 text-xs rounded font-mono"
                style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
              >
                <option value="">— none —</option>
                {MISMATCH_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Direction</label>
              <select
                value={item.deviation_direction ?? ''}
                onChange={e => update(idx, { deviation_direction: e.target.value as SignalCandidate['deviation_direction'] })}
                className="w-full px-2 py-1.5 text-xs rounded font-mono"
                style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
              >
                <option value="">— none —</option>
                {DEVIATION_DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Domain *</label>
              <select
                value={item.domain_id ?? ''}
                onChange={e => update(idx, { domain_id: e.target.value })}
                className="w-full px-2 py-1.5 text-xs rounded font-mono"
                style={{ background: 'var(--bg)', color: 'var(--text)', border: `1px solid ${item.included && !item.domain_id ? 'var(--red)' : 'var(--border2)'}`, outline: 'none' }}
              >
                <option value="">Select...</option>
                {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Period (days) *</label>
              <input
                type="number"
                value={item.observation_period ?? ''}
                onChange={e => update(idx, { observation_period: e.target.value ? Number(e.target.value) : null })}
                min={1}
                className="w-full px-2 py-1.5 text-xs rounded font-mono"
                style={{ background: 'var(--bg)', color: 'var(--text)', border: `1px solid ${item.included && item.observation_period == null ? 'var(--red)' : 'var(--border2)'}`, outline: 'none' }}
              />
            </div>
          </div>
        </div>
      ))}

      {error && (
        <div className="p-3 text-xs" style={{ background: '#7a303022', color: 'var(--red)', border: '1px solid var(--red-dim)' }}>
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {included.length} of {items.length} selected
        </span>
        <button
          onClick={handleConfirm}
          disabled={submitting || included.length === 0 || missingFields}
          className="px-6 py-2.5 text-sm rounded font-sans uppercase tracking-widest disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'var(--bg)', fontWeight: 500 }}
        >
          {submitting ? 'Submitting...' : 'Confirm Selected'}
        </button>
      </div>
    </div>
  )
}

// ─── Correspondence Panel ────────────────────────────────────────────────────

interface CorrespondencePanelProps {
  correspondences: Correspondence[]
  onAddPair: (a: SignalCandidate, b: SignalCandidate) => void
}

function CorrespondencePanel({ correspondences, onAddPair }: CorrespondencePanelProps) {
  if (correspondences.length === 0) {
    return (
      <div className="p-4 text-xs font-mono" style={{ border: '1px dashed var(--border2)', color: 'var(--text-muted)' }}>
        No structural correspondences found between these domains.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Structural Correspondences
      </div>

      {correspondences.map((c, i) => (
        <div key={i} className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className="p-3 text-xs"
              style={{ fontFamily: 'DM Mono, monospace', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', lineHeight: 1.6 }}
            >
              {c.observation_a}
            </div>
            <div
              className="p-3 text-xs"
              style={{ fontFamily: 'DM Mono, monospace', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', lineHeight: 1.6 }}
            >
              {c.observation_b}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 text-xs font-mono" style={{ background: 'var(--surface2)', color: 'var(--accent)', border: '1px solid var(--border2)' }}>
              ↔ {c.correspondence_type}
            </span>
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-1.5" style={{ background: 'var(--border2)' }}>
                <div
                  className="h-full"
                  style={{
                    width: `${Math.round(c.correspondence_strength * 100)}%`,
                    background: `linear-gradient(90deg, var(--blue), var(--green))`,
                  }}
                />
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {c.correspondence_strength.toFixed(2)}
              </span>
            </div>
            {c.observation_period_match && (
              <span className="text-xs font-mono" style={{ color: 'var(--green)' }}>period match</span>
            )}
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            {c.structural_note}
          </p>

          <p className="text-xs italic" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            <span style={{ color: 'var(--text-dim)', fontStyle: 'normal' }}>Candidate shared cause: </span>
            {c.candidate_shared_cause}
          </p>

          <button
            onClick={() => {
              const makeCandidate = (text: string): SignalCandidate => ({
                id: String(Math.random()),
                text,
                si_dimension: null,
                deviation_direction: null,
                observation_period: null,
                domain_id: null,
                included: true,
              })
              onAddPair(makeCandidate(c.observation_a), makeCandidate(c.observation_b))
            }}
            className="px-3 py-1.5 text-xs rounded font-sans uppercase tracking-widest"
            style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
          >
            Include Both Signals
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Document Mode ───────────────────────────────────────────────────────────

function DocumentMode({ caseId, domains, onReset }: { caseId: string; domains: Domain[]; onReset: () => void }) {
  const [docText, setDocText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<SignalCandidate[] | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setDocText((ev.target?.result as string) ?? '')
    reader.readAsText(file)
  }

  async function handleExtract() {
    if (!docText.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await extractFromDocument(caseId, docText.trim())
      setCandidates(res.candidates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed')
    } finally {
      setLoading(false)
    }
  }

  if (candidates) {
    return (
      <CandidateReviewPanel
        candidates={candidates}
        caseId={caseId}
        domains={domains}
        onSuccess={onReset}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          Document Content
        </label>
        <textarea
          value={docText}
          onChange={e => setDocText(e.target.value)}
          rows={14}
          placeholder="Paste document text, paper abstract, or report content..."
          className="w-full px-3 py-2 text-sm rounded font-mono resize-y"
          style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
        />
      </div>

      <div className="flex items-center gap-3">
        <input ref={fileRef} type="file" accept=".txt,.md,.csv" className="hidden" onChange={handleFile} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2 text-sm rounded font-sans uppercase tracking-widest"
          style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
        >
          Upload File
        </button>
        <span className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>txt, md, csv</span>
      </div>

      {error && (
        <div className="p-3 text-xs" style={{ background: '#7a303022', color: 'var(--red)', border: '1px solid var(--red-dim)' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleExtract}
        disabled={loading || !docText.trim()}
        className="w-full px-4 py-2.5 text-sm rounded font-sans uppercase tracking-widest disabled:opacity-50"
        style={{ background: 'var(--accent)', color: 'var(--bg)', fontWeight: 500 }}
      >
        {loading ? 'Extracting observations from document...' : 'Extract Signals'}
      </button>
    </div>
  )
}

// ─── Synthesis Mode ──────────────────────────────────────────────────────────

function SynthesisMode({ caseId, domains, onReset }: { caseId: string; domains: Domain[]; onReset: () => void }) {
  const [domainAId, setDomainAId] = useState('')
  const [domainBId, setDomainBId] = useState('')
  const [contentA, setContentA] = useState('')
  const [contentB, setContentB] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SynthesisResult | null>(null)
  const [extraCandidates, setExtraCandidates] = useState<SignalCandidate[]>([])

  async function handleSynthesize() {
    if (!domainAId || !domainBId || !contentA.trim() || !contentB.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await synthesizeFields(
        caseId,
        { domain_id: domainAId, content: contentA.trim() },
        { domain_id: domainBId, content: contentB.trim() }
      )
      // Pre-set domain_id from the selectors
      const withDomainA = (res.candidates_a ?? []).map((c: SignalCandidate) => ({ ...c, domain_id: c.domain_id ?? domainAId }))
      const withDomainB = (res.candidates_b ?? []).map((c: SignalCandidate) => ({ ...c, domain_id: c.domain_id ?? domainBId }))
      setResult({ ...res, candidates_a: withDomainA, candidates_b: withDomainB })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Synthesis failed')
    } finally {
      setLoading(false)
    }
  }

  function handleAddPair(a: SignalCandidate, b: SignalCandidate) {
    setExtraCandidates(prev => [...prev, { ...a, domain_id: a.domain_id ?? domainAId }, { ...b, domain_id: b.domain_id ?? domainBId }])
  }

  if (result) {
    const allCandidates = [...result.candidates_a, ...result.candidates_b, ...extraCandidates]
    return (
      <div className="space-y-8">
        <CandidateReviewPanel
          candidates={allCandidates}
          caseId={caseId}
          domains={domains}
          onSuccess={onReset}
        />
        <CorrespondencePanel
          correspondences={result.correspondences ?? []}
          onAddPair={handleAddPair}
        />
      </div>
    )
  }

  const domainsForA = domains.filter(d => d.id !== domainBId)
  const domainsForB = domains.filter(d => d.id !== domainAId)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain A */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Domain A *
            </label>
            <select
              value={domainAId}
              onChange={e => setDomainAId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded font-mono"
              style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            >
              <option value="">Select domain...</option>
              {domainsForA.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <textarea
            value={contentA}
            onChange={e => setContentA(e.target.value)}
            rows={12}
            placeholder="Paste content from Domain A..."
            className="w-full px-3 py-2 text-sm rounded font-mono resize-y"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          />
        </div>

        {/* Domain B */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Domain B *
            </label>
            <select
              value={domainBId}
              onChange={e => setDomainBId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded font-mono"
              style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
            >
              <option value="">Select domain...</option>
              {domainsForB.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <textarea
            value={contentB}
            onChange={e => setContentB(e.target.value)}
            rows={12}
            placeholder="Paste content from Domain B..."
            className="w-full px-3 py-2 text-sm rounded font-mono resize-y"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs" style={{ background: '#7a303022', color: 'var(--red)', border: '1px solid var(--red-dim)' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSynthesize}
        disabled={loading || !domainAId || !domainBId || !contentA.trim() || !contentB.trim()}
        className="w-full px-4 py-2.5 text-sm rounded font-sans uppercase tracking-widest disabled:opacity-50"
        style={{ background: 'var(--accent)', color: 'var(--bg)', fontWeight: 500 }}
      >
        {loading ? 'Analyzing structural correspondence across domains...' : 'Find Structural Correspondence'}
      </button>
    </div>
  )
}

// ─── Top-level ───────────────────────────────────────────────────────────────

export function SignalIntake() {
  const { id } = useParams<{ id: string }>()
  const caseId = id!
  const [mode, setMode] = useState<Mode>('manual')

  const { data: domains } = useQuery({
    queryKey: ['domains', caseId],
    queryFn: () => getDomains(caseId),
  })

  const domainList = domains ?? []

  function resetToManual() {
    setMode('manual')
  }

  return (
    <div className="p-6">
      <h2 className="font-serif text-xl mb-6" style={{ color: 'var(--accent)' }}>Observation Intake</h2>

      <IntakeModePicker mode={mode} onChange={setMode} />

      {mode === 'manual' && <ManualForm caseId={caseId} domains={domainList} />}
      {mode === 'document' && <DocumentMode caseId={caseId} domains={domainList} onReset={resetToManual} />}
      {mode === 'synthesize' && <SynthesisMode caseId={caseId} domains={domainList} onReset={resetToManual} />}
    </div>
  )
}
