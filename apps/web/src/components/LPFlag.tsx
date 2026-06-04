import type { LPCode } from '../types'

const LP_DESCRIPTIONS: Record<LPCode, string> = {
  'LP-1': 'Signal rejected before candidate creation',
  'LP-2': 'Signal expired before minimum retention period',
  'LP-3': 'Cross-domain signal not connected',
  'LP-4': 'High-SI signal resolved by explanation',
  'LP-5': 'Signal cluster not aggregated before expiry',
  'LP-6': 'Significant signal score decayed without reassessment',
  'LP-7': 'Contradiction closed without RC evidence',
}

interface Props {
  code: LPCode
}

export function LPFlag({ code }: Props) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-mono rounded cursor-help"
      style={{ backgroundColor: '#1e1408', color: '#e8a030', border: '1px solid #e8a03055' }}
      title={LP_DESCRIPTIONS[code]}
    >
      {code}
    </span>
  )
}
