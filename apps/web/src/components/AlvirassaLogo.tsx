import type { CSSProperties } from 'react'

interface Props {
  className?: string
  style?: CSSProperties
  size?: string  // CSS font-size, default '1.9rem'
}

function ShinyDot({ top, left, right, bottom, size, opacity, blur }: {
  top?: string | number, left?: string | number, right?: string | number, bottom?: string | number,
  size: number, opacity: number, blur: number
}) {
  return (
    <span style={{
      position: 'absolute',
      top, left, right, bottom,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, #f5eccc 0%, #c8b87a 65%, transparent 100%)`,
      boxShadow: `0 0 ${blur}px ${blur * 0.6}px rgba(200,184,122,${opacity * 0.55})`,
      opacity,
      display: 'block',
      pointerEvents: 'none',
      flexShrink: 0,
    }} />
  )
}

export function AlvirassaLogo({ className, style, size = '1.9rem' }: Props) {
  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      {/* Shiny signal dots — sparse, like distant lights at sea */}
      <ShinyDot top={-11} left={-16}     size={2.5} opacity={0.40} blur={5} />
      <ShinyDot top={-5}  left="20%"     size={1.8} opacity={0.28} blur={3} />
      <ShinyDot top={3}   right={-13}    size={3}   opacity={0.22} blur={6} />
      <ShinyDot bottom={-7} left="58%"   size={1.5} opacity={0.32} blur={3} />

      {/* Wordmark */}
      <span style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: size,
        color: '#c8b87a',
        letterSpacing: '0.12em',
        display: 'inline-block',
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        alvi
        {/* The v — the crow's nest. A tiny glowing dot marks the gajeiro on the rim. */}
        <span style={{ position: 'relative', display: 'inline-block' }}>
          v
          <span style={{
            position: 'absolute',
            top: '0.06em',
            left: '0.07em',
            width: '0.14em',
            height: '0.14em',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #f5eccc 0%, #c8b87a 75%)',
            boxShadow: '0 0 4px 1px rgba(245,236,204,0.5)',
            display: 'block',
            pointerEvents: 'none',
          }} />
        </span>
        rassa
      </span>
    </div>
  )
}
