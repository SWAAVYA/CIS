import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useSignals } from '../hooks/useSignals'
import { useHypotheses } from '../hooks/useHypotheses'
import { getDomains, getSignal, transitionSignal } from '../api/client'
import { StatusBadge } from '../components/StatusBadge'
import { GovernanceBadges } from '../components/GovernanceBadges'
import { SIScoreBar } from '../components/SIScoreBar'
import { DomainTag } from '../components/DomainTag'
import type { LifecycleStatus, Signal, SignalEvent } from '../types'

type TabId = 'UNEXPLAINED' | 'ALL' | LifecycleStatus
const TABS: TabId[] = ['UNEXPLAINED', 'ALL', 'CANDIDATE', 'ADMITTED', 'RETAINED', 'ASSESSED', 'RESOLVED', 'ARCHIVED', 'EXPIRED']

export function SignalPool() {
  const { id } = useParams<{ id: string }>()
  const caseId = id!
  const [searchParams] = useSearchParams()
  // Default to UNEXPLAINED per spec; status param or filter=unexplained overrides
  const initialFilter = searchParams.get('filter')
  const initialStatus = searchParams.get('status')
  const defaultTab: TabId = initialFilter === 'unexplained' ? 'UNEXPLAINED'
    : initialStatus ? (initialStatus as LifecycleStatus)
    : 'UNEXPLAINED'

  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)
  const [domainFilter, setDomainFilter] = useState('')
  const [minSI, setMinSI] = useState(0)
  const [sort, setSort] = useState('created_at')
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerSignalId, setDrawerSignalId] = useState<string | null>(null)

  const { data: domainsData } = useQuery({
    queryKey: ['domains', caseId],
    queryFn: () => getDomains(caseId),
  })

  const { data: hypotheses } = useHypotheses(caseId)
  const coveredSignalIds = new Set(
    (hypotheses ?? [])
      .filter(h => h.status === 'ACTIVE')
      .flatMap(h => h.evidence ?? [])
      .map(e => e.signal_id)
      .filter(Boolean) as string[]
  )

  // For UNEXPLAINED tab, fetch all admitted/retained and filter client-side
  const isUnexplainedTab = activeTab === 'UNEXPLAINED'
  const params = {
    status: (isUnexplainedTab || activeTab === 'ALL') ? undefined : activeTab as LifecycleStatus,
    domain_id: domainFilter || undefined,
    min_si: minSI > 0 ? minSI : undefined,
    sort: sort !== 'created_at' ? sort : undefined,
  }
  const { data: signalsData, isLoading } = useSignals(caseId, params)

  const { data: drawerSignal } = useQuery({
    queryKey: ['signal', drawerSignalId],
    queryFn: () => getSignal(drawerSignalId!),
    enabled: !!drawerSignalId,
  })

  const qc = useQueryClient()
  const [transitionError, setTransitionError] = useState<string | null>(null)
  const transitionMutation = useMutation({
    mutationFn: ({ signalId, status, reason }: { signalId: string; status: string; reason: string }) =>
      transitionSignal(signalId, status, reason),
    onSuccess: () => {
      setTransitionError(null)
      qc.invalidateQueries({ queryKey: ['signals', caseId] })
      qc.invalidateQueries({ queryKey: ['signal', drawerSignalId] })
    },
    onError: (e) => setTransitionError(e instanceof Error ? e.message : 'Transition failed'),
  })

  function openDrawer(signal: Signal) {
    setSelectedSignal(signal)
    setDrawerSignalId(signal.id)
    setDrawerOpen(true)
  }

  const allSignals = signalsData ?? []
  // Apply UNEXPLAINED client-side filter: active observations not covered by any active hypothesis
  const signals = isUnexplainedTab
    ? allSignals.filter(s =>
        (s.lifecycle_status === 'ADMITTED' || s.lifecycle_status === 'RETAINED') &&
        !coveredSignalIds.has(s.id)
      )
    : allSignals

  return (
    <div className="p-6">
      <h2 className="font-serif text-xl mb-4" style={{ color: 'var(--accent)' }}>Open Observations</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-3 py-1 text-xs font-mono"
            style={{
              background: activeTab === tab ? 'var(--surface2)' : 'transparent',
              color: activeTab === tab ? 'var(--text)' : 'var(--text-muted)',
              border: `1px solid ${activeTab === tab ? 'var(--border2)' : 'transparent'}`,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-4 p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          className="px-2 py-1 text-xs rounded font-mono"
          style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
        >
          <option value="">All domains</option>
          {(domainsData ?? []).map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          Min SI: {minSI.toFixed(2)}
          <input
            type="range" min={0} max={1} step={0.05}
            value={minSI}
            onChange={e => setMinSI(Number(e.target.value))}
            className="w-24"
          />
        </label>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-2 py-1 text-xs rounded font-mono"
          style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
        >
          <option value="created_at">Sort: Date</option>
          <option value="si_score">Sort: SI Score</option>
          <option value="significance">Sort: Significance</option>
        </select>
      </div>

      {/* Signal rows */}
      {isLoading ? (
        <div className="text-xs font-mono py-8" style={{ color: 'var(--text-muted)' }}>Loading signals...</div>
      ) : signals.length === 0 ? (
        <div className="py-12 text-center" style={{ border: '1px dashed var(--border2)' }}>
          <p className="text-sm font-mono" style={{ color: 'var(--text-dim)' }}>
            {isUnexplainedTab ? 'No uncovered observations.' : 'No observations found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-px">
          {signals.map(signal => (
            <div
              key={signal.id}
              className="flex items-start gap-3 px-4 py-3"
              style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex flex-col gap-1 flex-shrink-0">
                <StatusBadge status={signal.lifecycle_status} />
                <GovernanceBadges
                  isQuarantined={signal.is_quarantined}
                  isConnected={signal.is_connected}
                  isWspProtected={signal.is_wsp_protected}
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {signal.domain && <DomainTag name={signal.domain.name} />}
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {signal.observation_period}d
                  </span>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    sig:{Number(signal.significance).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text)' }}>
                  {signal.content.slice(0, 120)}{signal.content.length > 120 ? '…' : ''}
                </p>
                <SIScoreBar score={signal.si_score} compact />
              </div>
              <button
                onClick={() => openDrawer(signal)}
                className="flex-shrink-0 px-3 py-1 text-xs rounded font-mono"
                style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border2)' }}
              >
                Detail
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={() => setDrawerOpen(false)} />
          <div
            className="w-full max-w-lg overflow-y-auto"
            style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border2)' }}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Observation Detail</span>
              <button onClick={() => setDrawerOpen(false)} className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>✕ Close</button>
            </div>
            {drawerSignal ? (
              <div className="p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={drawerSignal.lifecycle_status} />
                  <GovernanceBadges
                    isQuarantined={drawerSignal.is_quarantined}
                    isConnected={drawerSignal.is_connected}
                    isWspProtected={drawerSignal.is_wsp_protected}
                  />
                </div>

                <p className="text-sm" style={{ color: 'var(--text)' }}>{drawerSignal.content}</p>

                <div className="grid grid-cols-2 gap-3">
                  <ScoreCard label="SI Score" value={<SIScoreBar score={drawerSignal.si_score} />} />
                  <ScoreCard label="Significance" value={Number(drawerSignal.significance).toFixed(3)} />
                  <ScoreCard label="SI Rate" value={Number(drawerSignal.si_rate).toFixed(3)} />
                  <ScoreCard label="SI Direction" value={Number(drawerSignal.si_direction).toFixed(3)} />
                  <ScoreCard label="SI Relationship" value={Number(drawerSignal.si_relationship).toFixed(3)} />
                  <ScoreCard label="SI Config" value={Number(drawerSignal.si_configuration).toFixed(3)} />
                </div>

                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Significance Breakdown</div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      ['SI', drawerSignal.sig_si],
                      ['Persistence', drawerSignal.sig_persistence],
                      ['Corroboration', drawerSignal.sig_corroboration],
                      ['Proximity', drawerSignal.sig_proximity],
                      ['Rarity', drawerSignal.sig_rarity],
                      ['Relevance', drawerSignal.sig_relevance],
                    ].map(([label, val]) => (
                      <div key={String(label)} className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>{label}</span>
                        <span style={{ color: 'var(--text)' }}>{Number(val).toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {drawerSignal.events && drawerSignal.events.length > 0 && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Lifecycle Events</div>
                    <div className="space-y-2">
                      {drawerSignal.events.map((ev: SignalEvent) => (
                        <div key={ev.id} className="text-xs p-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                          <div className="flex justify-between font-mono mb-0.5">
                            <span style={{ color: 'var(--text)' }}>{ev.from_state ?? '—'} → {ev.to_state}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{new Date(ev.created_at).toLocaleDateString()}</span>
                          </div>
                          <p style={{ color: 'var(--text-muted)' }}>{ev.reason}</p>
                          {ev.lp_flag && <span className="font-mono" style={{ color: 'var(--flag)' }}>{ev.lp_flag}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {drawerSignal.admission_reason && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Admission Reason</div>
                    <p className="text-xs" style={{ color: 'var(--text)' }}>{drawerSignal.admission_reason}</p>
                  </div>
                )}

                {selectedSignal && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Manual Transition</div>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {(['RETAINED', 'ASSESSED', 'RESOLVED', 'ARCHIVED', 'EXPIRED'] as LifecycleStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => { setTransitionError(null); transitionMutation.mutate({ signalId: selectedSignal.id, status: s, reason: 'Manual transition' }) }}
                          disabled={transitionMutation.isPending || drawerSignal.lifecycle_status === s}
                          className="px-2 py-1 text-xs rounded font-mono disabled:opacity-40"
                          style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border2)' }}
                        >
                          → {s}
                        </button>
                      ))}
                    </div>
                    {transitionError && (
                      <p className="text-xs p-2" style={{ color: 'var(--red)', background: '#c94f4f11', border: '1px solid var(--red-dim)' }}>
                        {transitionError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Loading...</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
      <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-sm font-mono" style={{ color: 'var(--text)' }}>{value}</div>
    </div>
  )
}
