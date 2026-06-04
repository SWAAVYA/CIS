import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateBriefing, getBriefings, getBriefing } from '../api/client'
import { LPFlag } from '../components/LPFlag'
import { StatusBadge } from '../components/StatusBadge'
import type { LPCode, Briefing } from '../types'

export function CognitiveBriefing() {
  const { id } = useParams<{ id: string }>()
  const caseId = id!
  const qc = useQueryClient()

  const { data: briefings } = useQuery({
    queryKey: ['briefings', caseId],
    queryFn: () => getBriefings(caseId),
  })

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const activeBriefingId = selectedId ?? briefings?.[0]?.id

  const { data: briefing } = useQuery({
    queryKey: ['briefing', activeBriefingId],
    queryFn: () => getBriefing(activeBriefingId!),
    enabled: !!activeBriefingId,
  })

  const generateMutation = useMutation({
    mutationFn: () => generateBriefing(caseId),
    onSuccess: (newBriefing: Briefing) => {
      qc.invalidateQueries({ queryKey: ['briefings', caseId] })
      setSelectedId(newBriefing.id)
    },
  })

  function exportText() {
    if (!briefing) return
    const lines: string[] = [
      `COGNITIVE BRIEFING — ${new Date(briefing.generated_at).toLocaleString()}`,
      '',
      'POOL STATUS',
      `  ADMITTED: ${briefing.signals_admitted ?? 0}  RETAINED: ${briefing.signals_retained ?? 0}  ASSESSED: ${briefing.signals_assessed ?? 0}  RESOLVED: ${briefing.signals_resolved ?? 0}  EXPIRED: ${briefing.signals_expired ?? 0}`,
      '',
    ]
    if (briefing.summary) {
      lines.push('SUMMARY', briefing.summary, '')
    }
    if ((briefing.content?.active_signals?.length ?? 0) > 0) {
      lines.push('ACTIVE SIGNALS')
      briefing.content!.active_signals.forEach(s => lines.push(`  - ${s.content ?? ''}`))
      lines.push('')
    }
    if ((briefing.content?.active_hypotheses?.length ?? 0) > 0) {
      lines.push('ACTIVE HYPOTHESES')
      briefing.content!.active_hypotheses.forEach(h => lines.push(`  - ${h.title ?? ''} (${h.plausibility})`))
      lines.push('')
    }
    if ((briefing.lp_flags_since_last?.length ?? 0) > 0) {
      lines.push('LOSS POINTS', briefing.lp_flags_since_last!.join(', '), '')
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `briefing-${briefing.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-xl" style={{ color: 'var(--accent)' }}>Cognitive Briefing</h2>
        <div className="flex gap-2 flex-wrap">
          {briefings && briefings.length > 1 && (
            <select
              value={selectedId ?? ''}
              onChange={e => setSelectedId(e.target.value || null)}
              className="px-3 py-1.5 text-xs rounded font-mono"
              style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)' }}
            >
              {briefings.map(b => (
                <option key={b.id} value={b.id}>
                  {new Date(b.generated_at).toLocaleString()}
                </option>
              ))}
            </select>
          )}
          {briefing && (
            <button
              onClick={exportText}
              className="px-3 py-1.5 text-xs rounded font-mono"
              style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border2)' }}
            >
              Export .txt
            </button>
          )}
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="px-4 py-1.5 text-xs rounded font-sans uppercase tracking-widest disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            {generateMutation.isPending ? 'Generating...' : 'Generate New'}
          </button>
        </div>
      </div>

      {!briefing && !generateMutation.isPending && (
        <div className="py-16 text-center" style={{ border: '1px dashed var(--border2)' }}>
          <p className="text-sm font-mono" style={{ color: 'var(--text-dim)' }}>No briefings yet. Generate one to see a synthesised summary.</p>
        </div>
      )}

      {briefing && (
        <div className="space-y-6" style={{ fontFamily: 'Instrument Serif, serif' }}>
          <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Generated {new Date(briefing.generated_at).toLocaleString()}
          </div>

          {/* Pool status — flat columns from DB */}
          <section>
            <SectionHeader>Pool Status</SectionHeader>
            <div className="flex flex-wrap gap-2">
              {([
                ['CANDIDATE', briefing.signals_candidate],
                ['ADMITTED', briefing.signals_admitted],
                ['RETAINED', briefing.signals_retained],
                ['ASSESSED', briefing.signals_assessed],
                ['RESOLVED', briefing.signals_resolved],
                ['ARCHIVED', briefing.signals_archived],
                ['EXPIRED', briefing.signals_expired],
              ] as [string, number | undefined][]).filter(([, v]) => v != null && v > 0).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <StatusBadge status={status as Parameters<typeof StatusBadge>[0]['status']} />
                  <span className="font-mono text-sm" style={{ color: 'var(--text)' }}>{count}</span>
                </div>
              ))}
              {(briefing.signals_quarantined ?? 0) > 0 && (
                <span className="px-2 py-0.5 text-xs font-mono rounded" style={{ background: '#c94f4f22', color: 'var(--red)', border: '1px solid #c94f4f55' }}>
                  🔒 {briefing.signals_quarantined} quarantined
                </span>
              )}
              {(briefing.signals_connected ?? 0) > 0 && (
                <span className="px-2 py-0.5 text-xs font-mono rounded" style={{ background: '#e8a03022', color: 'var(--flag)', border: '1px solid #e8a03055' }}>
                  🔗 {briefing.signals_connected} connected
                </span>
              )}
            </div>
          </section>

          {briefing.summary && (
            <section>
              <SectionHeader>Summary</SectionHeader>
              <p className="leading-relaxed" style={{ color: 'var(--text)', fontSize: 15 }}>{briefing.summary}</p>
            </section>
          )}

          {(briefing.content?.active_signals?.length ?? 0) > 0 && (
            <section>
              <SectionHeader>Active Signals ({briefing.content!.active_signals.length})</SectionHeader>
              <div className="space-y-2">
                {briefing.content!.active_signals.map((s, i) => (
                  <div key={i} className="p-3" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text)', fontSize: 14 }}>{s.content}</p>
                    {s.lifecycle_status && (
                      <div className="mt-2"><StatusBadge status={s.lifecycle_status} /></div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(briefing.content?.active_hypotheses?.length ?? 0) > 0 && (
            <section>
              <SectionHeader>Active Hypotheses ({briefing.content!.active_hypotheses.length})</SectionHeader>
              <div className="space-y-2">
                {briefing.content!.active_hypotheses.map((h, i) => (
                  <div key={i} className="p-3 flex items-start justify-between" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text)', fontSize: 14 }}>{h.title}</p>
                    {h.plausibility !== undefined && (
                      <span className="font-mono text-sm ml-4 flex-shrink-0" style={{ color: 'var(--accent)' }}>
                        {(Number(h.plausibility) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(briefing.content?.quarantined?.length ?? 0) > 0 && (
            <section>
              <SectionHeader>Quarantine</SectionHeader>
              <div className="space-y-1">
                {briefing.content!.quarantined.map((q, i) => (
                  <p key={i} className="text-sm" style={{ color: 'var(--text-muted)' }}>{JSON.stringify(q)}</p>
                ))}
              </div>
            </section>
          )}

          {(briefing.lp_flags_since_last?.length ?? 0) > 0 && (
            <section>
              <SectionHeader>Loss Points</SectionHeader>
              <div className="flex flex-wrap gap-2">
                {briefing.lp_flags_since_last!.map((f, i) => (
                  <LPFlag key={i} code={f as LPCode} />
                ))}
              </div>
            </section>
          )}

          {(briefing.content?.open_questions?.length ?? 0) > 0 && (
            <section>
              <SectionHeader>Open Questions</SectionHeader>
              <div className="space-y-2">
                {briefing.content!.open_questions.map((q: unknown, i) => (
                  <p key={i} className="text-sm" style={{ color: 'var(--text-muted)' }}>{JSON.stringify(q)}</p>
                ))}
              </div>
            </section>
          )}

          {(briefing.content?.resolved?.length ?? 0) > 0 && (
            <section>
              <SectionHeader>Resolved This Session</SectionHeader>
              <div className="space-y-2">
                {briefing.content!.resolved.map((r: unknown, i) => (
                  <p key={i} className="text-sm" style={{ color: 'var(--green)' }}>{JSON.stringify(r)}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-xs font-sans uppercase tracking-widest mb-3 pb-1"
      style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontFamily: 'IBM Plex Sans, sans-serif' }}
    >
      {children}
    </h3>
  )
}
