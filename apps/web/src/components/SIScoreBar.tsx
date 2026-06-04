interface Props {
  score: number
  compact?: boolean
}

function getColor(score: number): string {
  if (score > 0.55) return '#4f9faf'
  if (score >= 0.25) return '#e8a030'
  return '#606078'
}

export function SIScoreBar({ score: rawScore, compact }: Props) {
  const score = Number(rawScore)
  const color = getColor(score)
  const pct = Math.min(100, Math.max(0, score * 100))

  return (
    <div className={`flex items-center gap-2 ${compact ? 'w-24' : 'w-full max-w-xs'}`}>
      <div className="relative flex-1 h-2 bg-[#1a1a2e]" style={{ minWidth: compact ? 60 : 100 }}>
        {/* Fill */}
        <div
          className="absolute top-0 left-0 h-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        {/* Threshold markers */}
        <div className="absolute top-0 h-full w-px bg-[#606078] opacity-70" style={{ left: '25%' }} />
        <div className="absolute top-0 h-full w-px bg-[#606078] opacity-70" style={{ left: '55%' }} />
      </div>
      <span className="font-mono text-xs" style={{ color }}>
        {score.toFixed(2)}
      </span>
    </div>
  )
}
