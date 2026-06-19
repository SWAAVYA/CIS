import type { CSSProperties } from 'react'

interface Props {
  className?: string
  style?: CSSProperties
  size?: string  // CSS font-size, default '2rem'
}

function SignalDot({ top, left, right, bottom, size, opacity }: {
  top?: string | number, left?: string | number, right?: string | number, bottom?: string | number,
  size: number, opacity: number
}) {
  return (
    <span style={{
      position: 'absolute',
      top, left, right, bottom,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, rgba(245,236,204,0.9), rgba(200,184,122,0.4))`,
      boxShadow: `0 0 ${size * 1.5}px rgba(200,184,122,${opacity * 0.4})`,
      opacity,
      display: 'block',
      pointerEvents: 'none',
      flexShrink: 0,
    }} />
  )
}

export function AlvirassaLogo({ className, style, size = '2rem' }: Props) {
  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      {/* Signal dots — scattered weak signals at sea */}
      <SignalDot top={-14} left={-18}    size={2.2} opacity={0.35} />
      <SignalDot top={-6}  left="25%"    size={1.6} opacity={0.25} />
      <SignalDot top={8}   right={-16}   size={2.8} opacity={0.30} />
      <SignalDot bottom={-10} left="60%" size={1.4} opacity={0.28} />

      {/* Wordmark */}
      <span style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: size,
        fontWeight: 400,
        color: '#c8b87a',
        letterSpacing: '0.16em',
        display: 'inline-block',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        alvirassa
      </span>
    </div>
  )
}
