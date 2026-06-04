interface Props {
  plausibility: number
}

function getColor(p: number): string {
  if (p > 0.85) return '#4f9e6f'
  if (p >= 0.10) return '#e8a030'
  return '#c94f4f'
}

export function PlausibilityBar({ plausibility: rawP }: Props) {
  const plausibility = Number(rawP)
  const color = getColor(plausibility)
  const pct = Math.min(100, Math.max(0, plausibility * 100))

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1 h-2.5 bg-[#1a1a2e]">
        <div
          className="absolute top-0 left-0 h-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        <div className="absolute top-0 h-full w-px bg-[#606078] opacity-70" style={{ left: '10%' }} />
        <div className="absolute top-0 h-full w-px bg-[#606078] opacity-70" style={{ left: '85%' }} />
      </div>
      <span className="font-mono text-xs" style={{ color }}>
        {(plausibility * 100).toFixed(0)}%
      </span>
    </div>
  )
}
