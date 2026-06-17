import type { SVGProps } from 'react'

export function AlvirassaLogo(props: SVGProps<SVGSVGElement>) {
  // Layout: DM Mono at 40px, forced to 26px/char via textLength
  // "al" (52px) | crow's-nest v (26px) | "irassa" (156px) = 234px
  // Left margin 18px, total viewBox width 270px
  const base = 54
  const capTop = 24  // base - 30 (cap height at 40px)

  return (
    <svg viewBox="0 0 270 72" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Weak signal dots — sparse, faint */}
      <circle cx="5"   cy="12" r="1.5" fill="#c8b87a" opacity="0.18" />
      <circle cx="142" cy="5"  r="1.8" fill="#c8b87a" opacity="0.13" />
      <circle cx="250" cy="30" r="1.3" fill="#c8b87a" opacity="0.20" />
      <circle cx="263" cy="60" r="1.0" fill="#c8b87a" opacity="0.11" />

      {/* "al" */}
      <text
        fontFamily="'DM Mono', 'Courier New', monospace"
        fontSize="40"
        fill="#c8b87a"
        x="18"
        y={base}
        textLength="52"
        lengthAdjust="spacingAndGlyphs"
      >
        al
      </text>

      {/* Crow's nest V — the gajeiro's lookout platform */}
      {/* Box: x=70..96, y=capTop..base (26×30px) */}
      <g transform={`translate(70, ${capTop})`} fill="#c8b87a">
        {/* Left arm */}
        <path d="M1,0 L10,28 L14,28 L14,26 L13,26 L5,0 Z" />
        {/* Right arm */}
        <path d="M25,0 L15,28 L13,28 L13,26 L14,26 L21,0 Z" />
        {/* Nest platform — the crow's nest floor */}
        <rect x="11" y="26" width="4" height="2" />
        {/* Gajeiro — lookout at the rim of the left arm */}
        <circle cx="3" cy="4" r="2.5" />
      </g>

      {/* "irassa" */}
      <text
        fontFamily="'DM Mono', 'Courier New', monospace"
        fontSize="40"
        fill="#c8b87a"
        x="96"
        y={base}
        textLength="156"
        lengthAdjust="spacingAndGlyphs"
      >
        irassa
      </text>
    </svg>
  )
}
