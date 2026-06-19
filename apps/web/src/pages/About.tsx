import { Link } from 'react-router-dom'
import { AlvirassaLogo } from '../components/AlvirassaLogo'

const accent   = 'var(--accent)'
const muted    = 'var(--text-muted)'
const dim      = 'var(--text-dim)'
const surface  = 'var(--surface)'
const border   = 'var(--border)'
const text     = 'var(--text)'

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: 'DM Mono, monospace',
      fontSize: '0.65rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: accent,
      marginBottom: '1.2rem',
      marginTop: '3rem',
    }}>
      {children}
    </p>
  )
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${border}`, marginBottom: '1.5rem' }} />
}

export function About() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${border}`, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <AlvirassaLogo size="1.4rem" />
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/research" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none', letterSpacing: '0.1em' }}>research</Link>
          <Link to="/plans" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none', letterSpacing: '0.1em' }}>plans</Link>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '4rem 2rem 6rem' }}>

        {/* Hero */}
        <div style={{ marginBottom: '3.5rem' }}>
          <AlvirassaLogo size="2.8rem" />
          <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: '0.82rem', color: muted, marginTop: '1rem', letterSpacing: '0.05em' }}>
            cognitive intelligence system
          </p>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: muted, lineHeight: 1.8, marginTop: '1.5rem', maxWidth: 500 }}>
            Structural observation system for residuals that survive all known explanations.
          </p>
        </div>

        {/* What it does */}
        <SectionLabel>What it does</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85 }}>
          alvirassa captures observations that deviate structurally from what their context predicts. These are not anomalies in the sense of noise or error. They are residuals — observations that remain after every known cause has been accounted for.
        </p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85, marginTop: '0.9rem' }}>
          The system stores these across independent domains and measures structural correspondence: do two residuals from completely separate fields show the same type of deviation, in the same direction, in the same observation period? When the answer is yes, and the probability of independent co-occurrence is below threshold, the system generates a hypothesis. That hypothesis identifies a hidden common variable that could explain both observations simultaneously.
        </p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85, marginTop: '0.9rem' }}>
          Nothing is discarded. Residuals accumulate. The system is built for cases where you do not yet know what you are looking for.
        </p>

        {/* How it works */}
        <SectionLabel>How it works</SectionLabel>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {[
            'Submit an observation: something structurally incongruent with its context.',
            'The system scores it across four dimensions: Rate, Direction, Relationship, Configuration.',
            'Observations that exceed threshold are admitted to the open pool.',
            'The system compares admitted observations across domains within the case.',
            'When two observations from independent domains show correspondence exceeding the probability of independent co-occurrence, a hypothesis is generated.',
            'Contradictions are flagged where observations conflict with each other.',
            'The Briefing synthesizes the current state: which residuals remain open, which connections are established, which hypotheses are active.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: accent, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: muted, lineHeight: 1.75 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Who uses it */}
        <SectionLabel>For whom</SectionLabel>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            ['Investigators', 'Building the picture incrementally from structural anomalies rather than starting from a hypothesis.'],
            ['Researchers', 'Who notice observations at the edges of their data that their methodology does not explain.'],
            ['Analysts', 'Working across domains where structural patterns may emerge from unrelated fields.'],
            ['Cold case work', 'Where observations accumulate without current explanation and the system must hold them open indefinitely.'],
            ['Anyone', 'Who collects residuals — observations that have survived the known explanations and still demand investigation.'],
          ].map(([role, desc]) => (
            <div key={role} style={{ display: 'flex', gap: '1.2rem', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.84rem', color: accent, minWidth: 130, flexShrink: 0 }}>{role}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.77rem', color: muted, lineHeight: 1.75 }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Why it's different */}
        <SectionLabel>Why it exists</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85 }}>
          Conventional analysis starts with a hypothesis and searches for confirming evidence. Residual analysis starts with unexplained observations and searches for hidden common causes. This is not a refinement of conventional analysis. It is a different method operating on different principles.
        </p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85, marginTop: '0.9rem' }}>
          The system does not generate hypotheses on demand. It waits for cross-domain structural correspondence. This constraint eliminates low-probability speculation and focuses investigation on patterns that are unlikely to occur by chance across independent domains.
        </p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85, marginTop: '0.9rem' }}>
          Nothing is discarded. The archive is the product. The system is built for the cases where you have not yet found the answer.
        </p>

        <div style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: `1px solid ${border}`, display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none' }}>home</Link>
          <Link to="/research" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none' }}>research</Link>
          <Link to="/plans" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none' }}>plans</Link>
        </div>

      </div>
    </div>
  )
}
