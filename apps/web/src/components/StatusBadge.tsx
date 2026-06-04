import type { LifecycleStatus } from '../types'

const STATUS_COLORS: Record<LifecycleStatus, string> = {
  CANDIDATE: '#4a4a6a',
  ADMITTED: '#4f7fc9',
  RETAINED: '#4f9e6f',
  ASSESSED: '#4f9faf',
  RESOLVED: '#3a3a5a',
  ARCHIVED: '#2a2a3a',
  EXPIRED: '#2a2a2a',
}

interface Props {
  status: LifecycleStatus
}

export function StatusBadge({ status }: Props) {
  const color = STATUS_COLORS[status] ?? '#4a4a6a'
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium rounded"
      style={{
        backgroundColor: `${color}33`,
        color,
        border: `1px solid ${color}55`,
      }}
    >
      {status}
    </span>
  )
}
