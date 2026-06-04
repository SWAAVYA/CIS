const DOMAIN_COLORS = [
  '#4f7fc9', '#4f9e6f', '#4f9faf', '#9e7f4f',
  '#c94f4f', '#c8b87a', '#7f4fc9', '#4fa0c9',
]

function hashName(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return h % DOMAIN_COLORS.length
}

interface Props {
  name: string
}

export function DomainTag({ name }: Props) {
  const color = DOMAIN_COLORS[hashName(name)]
  const label = name.length > 20 ? name.slice(0, 20) + '…' : name
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-mono rounded"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
      title={name}
    >
      {label}
    </span>
  )
}
