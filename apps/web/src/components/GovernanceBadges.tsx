interface Props {
  isQuarantined?: boolean
  isConnected?: boolean
  isWspProtected?: boolean
}

export function GovernanceBadges({ isQuarantined, isConnected, isWspProtected }: Props) {
  return (
    <span className="inline-flex gap-1 flex-wrap">
      {isQuarantined && (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono rounded"
          style={{ backgroundColor: '#c94f4f22', color: '#c94f4f', border: '1px solid #c94f4f55' }}>
          🔒 QUARANTINED
        </span>
      )}
      {isConnected && (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono rounded"
          style={{ backgroundColor: '#e8a03022', color: '#e8a030', border: '1px solid #e8a03055' }}>
          🔗 CONNECTED
        </span>
      )}
      {isWspProtected && (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono rounded"
          style={{ backgroundColor: '#4f7fc922', color: '#4f7fc9', border: '1px solid #4f7fc955' }}>
          🛡 WSP
        </span>
      )}
    </span>
  )
}
