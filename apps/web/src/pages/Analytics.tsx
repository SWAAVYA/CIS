import { useAnalytics } from '../hooks/useAnalytics'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'

export function Analytics() {
  const { data, isLoading, error } = useAnalytics()

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xs font-mono" style={{ color: 'var(--red)' }}>Failed to load analytics.</p>
    </div>
  )

  const isAllZero = data && data.total_cases === 0

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="font-serif italic text-sm mb-1" style={{ color: 'var(--text-muted)' }}>cognitive intelligence system</p>
          <h1 className="font-serif text-3xl" style={{ color: 'var(--accent)' }}>System Analytics</h1>
        </div>
        <Link to="/" className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>← Back</Link>
      </div>

      {isAllZero ? (
        <div className="py-24 text-center" style={{ border: '1px dashed var(--border2)' }}>
          <p className="text-sm font-mono" style={{ color: 'var(--text-dim)' }}>No investigations recorded yet.</p>
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Headline metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Total Cases"
              value={data.total_cases}
              description="Active and completed investigations."
            />
            <MetricCard
              label="Signals Admitted"
              value={`${(Number(data.admission_rate) * 100).toFixed(0)}%`}
              description={`${data.total_signals_admitted} of ${data.total_signals_submitted} submitted.`}
            />
            <MetricCard
              label="HCL Confirmations"
              value={`${(Number(data.hcl_confirmation_rate) * 100).toFixed(0)}%`}
              description={`${data.total_hypotheses_confirmed} hypotheses confirmed.`}
            />
            <MetricCard
              label="Avg SI Score"
              value={data.avg_si_score != null ? Number(data.avg_si_score).toFixed(3) : '—'}
              description={`Avg significance: ${data.avg_significance != null ? Number(data.avg_significance).toFixed(3) : '—'}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LP Distribution */}
            {Object.keys(data.lp_distribution).length > 0 && (
              <div className="p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
                <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>LP Flag Distribution</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={Object.entries(data.lp_distribution).map(([lp, count]) => ({ lp, count }))}>
                    <XAxis dataKey="lp" tick={{ fill: '#606078', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#606078', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 4 }}
                      labelStyle={{ color: 'var(--text-muted)', fontSize: 11 }}
                    />
                    <Bar dataKey="count" fill="var(--flag)" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Loss points represent process failures — signals that fell through without proper evaluation.
                </p>
              </div>
            )}

            {/* Lifecycle funnel */}
            <div className="p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
              <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Signal Lifecycle</div>
              <div className="space-y-2">
                <FunnelRow label="Submitted" value={data.total_signals_submitted} max={data.total_signals_submitted} color="var(--text-muted)" />
                <FunnelRow label="Admitted" value={data.total_signals_admitted} max={data.total_signals_submitted} color="var(--signal-admitted)" />
                <FunnelRow label="Hypotheses" value={data.total_hypotheses} max={data.total_signals_admitted} color="var(--hypothesis-active)" />
                <FunnelRow label="Contradictions" value={data.total_contradictions} max={data.total_signals_admitted} color="var(--red)" />
                <FunnelRow label="Contradictions Resolved" value={data.total_contradictions_resolved} max={data.total_contradictions || 1} color="var(--green)" />
              </div>
            </div>
          </div>

          {/* More metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard
              label="SHG Trigger Rate"
              value={`${(Number(data.shg_trigger_rate) * 100).toFixed(0)}%`}
              description="Rate at which multi-domain synthesis triggered."
            />
            <MetricCard
              label="Total Hypotheses"
              value={data.total_hypotheses}
              description="All hypotheses generated across all cases."
            />
            <MetricCard
              label="Contradictions"
              value={data.total_contradictions}
              description={`${data.total_contradictions_resolved} resolved.`}
            />
          </div>

          <p className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
            Snapshot at {new Date(data.snapshot_at).toLocaleString()}
          </p>
        </div>
      ) : null}
    </div>
  )
}

function MetricCard({ label, value, description }: { label: string; value: string | number; description: string }) {
  return (
    <div className="p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
      <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="font-mono text-2xl mb-1" style={{ color: 'var(--accent)' }}>{value}</div>
      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{description}</p>
    </div>
  )
}

function FunnelRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-mono mb-1">
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 w-full" style={{ background: 'var(--border2)' }}>
        <div className="h-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
