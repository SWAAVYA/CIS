import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useCase } from '../hooks/useCase'
import { useSignals } from '../hooks/useSignals'
import { useHypotheses } from '../hooks/useHypotheses'
import { useContradictions } from '../hooks/useContradictions'
import { getLPFlags, generateBriefing, getBriefings, getDomains } from '../api/client'
import { StatusBadge } from '../components/StatusBadge'
import { SIScoreBar } from '../components/SIScoreBar'
import { PlausibilityBar } from '../components/PlausibilityBar'
import { DomainTag } from '../components/DomainTag'
import { LPFlag } from '../components/LPFlag'
import type { LifecycleStatus, LPCode } from '../types'

const LIFECYCLE_STATUSES: LifecycleStatus[] = ['CANDIDATE', 'ADMITTED', 'RETAINED', 'ASSESSED', 'RESOLVED', 'ARCHIVED', 'EXPIRED']

export function Dashboard() {
  const { id } = useParams<{ id: string }>()
  const caseId = id!
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: caseData, isLoading: caseLoading, error: caseError } = useCase(caseId)
  const { data: signalsData } = useSignals(caseId)
  const { data: hypotheses } = useHypotheses(caseId)
  const { data: contradictions } = useContradictions(caseId)
  const { data: lpFlags } = useQuery({
    queryKey: ['lp-flags', caseId],
    queryFn: () => getLPFlags(caseId),
    refetchInterval: 30000,
  })
  const { data: briefings } = useQuery({
    queryKey: ['briefings', caseId],
    queryFn: () => getBriefings(caseId),
    refetchInterval: 30000,
  })
  const { data: domains } = useQuery({
    queryKey: ['domains', caseId],
    queryFn: () => getDomains(caseId),
    refetchInterval: 30000,
  })

  const generateMutation = useMutation({
    mutationFn: () => generateBriefing(caseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['briefings', caseId] }),
  })

  if (caseLoading) return <div className="p-8 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>Loading case...</div>
  if (caseError) return <div className="p-8 font-mono text-sm" style={{ color: 'var(--red)' }}>Error loading case.</div>
  if (!caseData) return null

  const signals = signalsData ?? []
  const domainList = domains ?? []
  const domainCount = domainList.length
  const independenceCount = domainList.reduce((acc, d) => acc + (d.independence?.length ?? 0), 0)

  // Setup checklist conditions
  const needsSetup = domainCount < 2 || independenceCount < 1
  const hasSignals = signals.length > 0

  // Pool counts — from stats.by_status (lowercase keys) or fallback to counting signals
  const byStatus = caseData.stats?.by_status ?? {}
  const poolCounts: Record<LifecycleStatus, number> = LIFECYCLE_STATUSES.reduce((acc, s) => {
    acc[s] = byStatus[s.toLowerCase()] ?? 0
    return acc
  }, {} as Record<LifecycleStatus, number>)
  const quarantinedCount = caseData.stats?.quarantined ?? 0
  const connectedCount = caseData.stats?.connected ?? 0

  // Compute coverage: which signal IDs are referenced in active hypothesis evidence
  const activeHypList = (hypotheses ?? []).filter(h => h.status === 'ACTIVE')
  const coveredSignalIds = new Set(
    activeHypList.flatMap(h => h.evidence ?? []).map(e => e.signal_id).filter(Boolean) as string[]
  )
  const activeObservations = signals.filter(s =>
    s.lifecycle_status === 'ADMITTED' || s.lifecycle_status === 'RETAINED' || s.lifecycle_status === 'ASSESSED'
  )
  const uncoveredCount = activeObservations.filter(s => !coveredSignalIds.has(s.id)).length
  const totalObservations = activeObservations.length

  // Panel data
  const activeHypotheses = activeHypList
    .sort((a, b) => Number(b.plausibility) - Number(a.plausibility))
    .slice(0, 3)

  const activeContradictions = (contradictions ?? []).filter(c => c.status === 'ACTIVE')

  const topUncovered = activeObservations
    .filter(s => !coveredSignalIds.has(s.id))
    .sort((a, b) => Number(b.si_score) - Number(a.si_score))
    .slice(0, 5)

  const uncoveredObservations = signals.filter(s =>
    (s.lifecycle_status === 'ADMITTED' || s.lifecycle_status === 'RETAINED') &&
    Number(s.si_score) >= 0.50 &&
    !coveredSignalIds.has(s.id)
  ).slice(0, 5)

  const lastBriefing = briefings?.[0]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl" style={{ color: 'var(--accent)' }}>{caseData.title}</h1>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{caseData.access_code}</span>
        </div>
      </div>

      {/* Setup Checklist */}
      {needsSetup && (
        <div className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>CASE SETUP</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs" style={{ color: domainCount >= 2 ? 'var(--green)' : 'var(--text-muted)' }}>
                {domainCount >= 2 ? '✓' : '□'} Step 1: Add domains ({domainCount}/2)
              </span>
              <Link to={`/cases/${caseId}/domains`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>GO →</Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs" style={{ color: independenceCount >= 1 ? 'var(--green)' : 'var(--text-muted)' }}>
                {independenceCount >= 1 ? '✓' : '□'} Step 2: Declare independence
              </span>
              <Link to={`/cases/${caseId}/domains`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>GO →</Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs" style={{ color: hasSignals ? 'var(--green)' : 'var(--text-muted)' }}>
                {hasSignals ? '✓' : '□'} Step 3: Submit first observation
              </span>
              <Link to={`/cases/${caseId}/intake`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>GO →</Link>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            SHG cross-domain synthesis will not run until two domains with an independence declaration exist.
          </p>
        </div>
      )}

      {/* Primary metrics header — spec: uncovered observations is the primary figure */}
      <div className="p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
        <div className="flex flex-wrap items-baseline gap-6 mb-3">
          <button
            onClick={() => navigate(`/cases/${caseId}/signals`)}
            className="text-left"
          >
            <div className="font-mono text-3xl leading-none" style={{ color: 'var(--text)' }}>{totalObservations}</div>
            <div className="text-xs font-sans uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>observations</div>
          </button>
          <button
            onClick={() => navigate(`/cases/${caseId}/signals?filter=unexplained`)}
            className="text-left"
          >
            <div className="font-mono text-3xl leading-none" style={{ color: 'var(--accent)' }}>{uncoveredCount}</div>
            <div className="text-xs font-sans uppercase tracking-widest mt-0.5" style={{ color: 'var(--accent)' }}>unexplained</div>
          </button>
          <button
            onClick={() => navigate(`/cases/${caseId}/hypotheses`)}
            className="text-left"
          >
            <div className="font-mono text-3xl leading-none" style={{ color: 'var(--hypothesis-active)' }}>{activeHypList.length}</div>
            <div className="text-xs font-sans uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>hypotheses</div>
          </button>
          {quarantinedCount > 0 && (
            <button
              onClick={() => navigate(`/cases/${caseId}/contradictions`)}
              className="text-left"
            >
              <div className="font-mono text-3xl leading-none" style={{ color: 'var(--red)' }}>{quarantinedCount}</div>
              <div className="text-xs font-sans uppercase tracking-widest mt-0.5" style={{ color: 'var(--red)' }}>quarantined</div>
            </button>
          )}
        </div>
        {/* Secondary: full status breakdown */}
        <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          {LIFECYCLE_STATUSES.map(status => (
            <button
              key={status}
              onClick={() => navigate(`/cases/${caseId}/signals?status=${status}`)}
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono"
              style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
            >
              <StatusBadge status={status} />
              <span style={{ color: 'var(--text-dim)' }}>{poolCounts[status]}</span>
            </button>
          ))}
          {connectedCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-mono rounded" style={{ background: '#e8a03022', color: '#e8a030', border: '1px solid #e8a03033' }}>
              🔗 {connectedCount}
            </span>
          )}
        </div>
      </div>

      {/* 2x3 grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Panel 1: Active Hypotheses */}
        <div className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Active Hypotheses</span>
            <Link to={`/cases/${caseId}/hypotheses`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>GO →</Link>
          </div>
          {activeHypotheses.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>No active hypotheses.</p>
          ) : activeHypotheses.map(h => (
            <div key={h.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif" style={{ color: 'var(--text)' }}>{h.title}</span>
                <span className="text-xs font-mono px-1 rounded" style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}>{h.hypothesis_type}</span>
              </div>
              <PlausibilityBar plausibility={h.plausibility} />
            </div>
          ))}
        </div>

        {/* Panel 2: Quarantine Alert */}
        <div className="p-4 space-y-3" style={{ background: quarantinedCount > 0 ? '#c94f4f0a' : 'var(--surface)', border: `1px solid ${quarantinedCount > 0 ? '#c94f4f44' : 'var(--border2)'}` }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: quarantinedCount > 0 ? '#c94f4f' : 'var(--text-muted)' }}>
              Quarantine Alert
            </span>
            <Link to={`/cases/${caseId}/contradictions`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>RESOLVE →</Link>
          </div>
          {quarantinedCount === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>No quarantined observations.</p>
          ) : (
            <>
              <p className="font-mono text-2xl" style={{ color: '#c94f4f' }}>{quarantinedCount}</p>
              {activeContradictions.slice(0, 3).map(c => (
                <p key={c.id} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {c.description.slice(0, 80)}{c.description.length > 80 ? '…' : ''}
                </p>
              ))}
            </>
          )}
        </div>

        {/* Panel 3: High-weight uncovered observations */}
        <div className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>High-Weight Uncovered</span>
            <Link to={`/cases/${caseId}/signals?filter=unexplained`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>ALL →</Link>
          </div>
          {topUncovered.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>No uncovered observations.</p>
          ) : topUncovered.map(s => (
            <div key={s.id} className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                {s.domain && <DomainTag name={s.domain.name} />}
              </div>
              <p className="text-xs" style={{ color: 'var(--text)' }}>{s.content.slice(0, 80)}{s.content.length > 80 ? '…' : ''}</p>
              <SIScoreBar score={s.si_score} compact />
            </div>
          ))}
        </div>

        {/* Panel 4: LP Flags */}
        <div className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>LP Flags</span>
            <Link to={`/cases/${caseId}/briefing`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>VIEW ALL →</Link>
          </div>
          {(!lpFlags || lpFlags.length === 0) ? (
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>No LP flags recorded.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {lpFlags.slice(0, 10).map((f, i) => (
                <LPFlag key={i} code={f.lp_flag as LPCode} />
              ))}
            </div>
          )}
        </div>

        {/* Panel 5: Uncovered observations */}
        <div className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Uncovered Observations</span>
            <Link to={`/cases/${caseId}/signals?filter=unexplained`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>ALL →</Link>
          </div>
          {uncoveredObservations.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>No uncovered observations with structural weight ≥ 0.50.</p>
          ) : uncoveredObservations.map(s => (
            <div key={s.id} className="space-y-1">
              <p className="text-xs" style={{ color: 'var(--text)' }}>{s.content.slice(0, 100)}{s.content.length > 100 ? '…' : ''}</p>
              <div className="flex items-center gap-2">
                <SIScoreBar score={s.si_score} compact />
                {s.domain && <DomainTag name={s.domain.name} />}
              </div>
            </div>
          ))}
        </div>

        {/* Panel 6: Last Briefing */}
        <div className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Last Briefing</span>
            <Link to={`/cases/${caseId}/briefing`} className="text-xs font-mono" style={{ color: 'var(--accent)' }}>VIEW →</Link>
          </div>
          {lastBriefing ? (
            <div className="space-y-2">
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {new Date(lastBriefing.generated_at).toLocaleString()}
              </p>
              {lastBriefing.summary && (
                <p className="text-xs font-serif" style={{ color: 'var(--text)' }}>
                  {lastBriefing.summary.slice(0, 200)}{lastBriefing.summary.length > 200 ? '…' : ''}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>No briefing generated yet.</p>
          )}
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="px-3 py-1.5 text-xs rounded font-sans uppercase tracking-widest disabled:opacity-50"
            style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
          >
            {generateMutation.isPending ? 'Generating...' : 'Generate New'}
          </button>
        </div>
      </div>
    </div>
  )
}
