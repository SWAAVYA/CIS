import type { CSSProperties } from 'react'

interface Props {
  className?: string
  style?: CSSProperties
  size?: string
  showSubtitle?: boolean
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
      background: 'radial-gradient(circle at 35% 35%, rgba(245,236,204,0.95), rgba(200,184,122,0.3))',
      boxShadow: `0 0 ${size * 2}px rgba(200,184,122,0.35)`,
      opacity,
      display: 'block',
      pointerEvents: 'none',
    }} />
  )
}

export function AlvirassaLogo({ className, style, size = '2rem', showSubtitle = false }: Props) {
  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <SignalDot top={-12} left={-16}    size={2.2} opacity={0.38} />
      <SignalDot top={-4}  left="24%"   size={1.5} opacity={0.22} />
      <SignalDot top={6}   right={-14}  size={2.6} opacity={0.28} />
      <SignalDot bottom={-8} left="62%" size={1.4} opacity={0.25} />

      {/* Wordmark + subtitle as a unified typographic mark */}
      <div style={{ display: 'inline-block' }}>
        <span style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: size,
          fontWeight: 400,
          color: '#c8b87a',
          letterSpacing: '0.16em',
          display: 'block',
          lineHeight: 1,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          alvissara
        </span>

        {showSubtitle && (
          <span style={{
            display: 'block',
            width: '100%',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '0.6rem',
            fontWeight: 300,
            color: 'rgba(200,184,122,0.45)',
            letterSpacing: '0.02em',
            marginTop: '0.45rem',
            textAlign: 'justify',
            textAlignLast: 'justify',
            userSelect: 'none',
            textTransform: 'uppercase',
          }}>
            cognitive intelligence system
          </span>
        )}
      </div>
    </div>
  )
}
