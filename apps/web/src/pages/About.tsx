import { AlvirassaLogo } from '../components/AlvirassaLogo'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const border = 'var(--border)'
const text = 'var(--text)'

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
      <SiteNav />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <div style={{ marginBottom: '3rem' }}>
          <AlvirassaLogo size="2rem" showSubtitle />
        </div>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: text, lineHeight: 1.9, marginBottom: '0.8rem' }}>Some observations refuse to go away.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '2rem' }}>A witness statement that does not fit the timeline. A disease pattern that appears in places that should have nothing in common. A financial signal that survives every conventional explanation. A recurring discrepancy that keeps returning no matter how many times it is dismissed as coincidence.</p>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: text, lineHeight: 1.9, marginBottom: '0.8rem' }}>Most systems are built to explain observations. Few are built to preserve the ones that remain unexplained.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem' }}>alvissara exists for those observations.</p>

        <SectionLabel>What it is</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>alvissara is a structural observation system for residuals that survive known explanations.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>A residual is an observation that remains after the available causes, models, assumptions, and evidence have been exhausted.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>These observations get discarded as noise, error, coincidence, or incomplete information. Sometimes they are. Sometimes they are the first sign of something not yet understood.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem' }}>alvissara keeps them visible.</p>

        <SectionLabel>What it does</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>The system records residuals across independent domains and examines whether they exhibit the same structural behavior.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>Two observations may appear unrelated. One belongs to ecology, another to finance. One emerges from an investigation, another from a scientific study. What matters is structure, not subject.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>When residuals display the same pattern of deviation across independent domains, the system measures whether that correspondence is likely to have occurred by chance.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>Where correspondence persists beyond threshold, alvissara generates a hypothesis describing a possible hidden common cause.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem' }}>The purpose is identifying where investigation should begin. Not proving the hypothesis.</p>

        <SectionLabel>How it works</SectionLabel>
        <Divider />
        {[
          'Submit an observation because its behavior does not match what its context predicts.',
          'The system evaluates it across four structural dimensions: Rate, Direction, Relationship, Configuration.',
          'Observations that meet admissibility requirements enter the open pool.',
          'The system compares residuals across domains within the case.',
          'Structural correspondences are measured against the probability of independent co-occurrence.',
          'Where correspondence exceeds threshold, a hypothesis is generated.',
          'Contradictions are preserved, tracked, and incorporated into future analysis.',
          'The Briefing presents the current state: which residuals remain open, which connections are established, which hypotheses are active.',
        ].map((item, i) => (
          <p key={i} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}><span style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</span> {item}</p>
        ))}
        <div style={{ marginBottom: '3rem' }} />

        <SectionLabel>For whom</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}><span style={{ color: text }}>Investigators.</span> Building the picture incrementally from structural anomalies rather than starting from a hypothesis.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}><span style={{ color: text }}>Researchers.</span> Working with results that existing models acknowledge but cannot adequately explain.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}><span style={{ color: text }}>Analysts.</span> Examining systems whose behavior emerges across multiple domains.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}><span style={{ color: text }}>Cold case work.</span> Observations that remain unresolved for years. Continuity matters more than speed.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem' }}><span style={{ color: text }}>Anyone.</span> Who collects residuals: observations that have survived the known explanations and still demand investigation.</p>

        <SectionLabel>Why it exists</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>Most investigative systems begin with a hypothesis and search for confirming evidence.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>alvissara begins with the residual. The observation comes first. The explanation comes later.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>This changes what the system preserves. It keeps unresolved observations available for future correspondence, future evidence, future understanding.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem' }}>The archive is the system. It is what survives.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9 }}>Because sometimes the most important observation is the one that survives every explanation you currently possess.</p>

      </div>
      <SiteFooter />
    </div>
  )
}
