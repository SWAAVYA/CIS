import { AlvirassaLogo } from '../components/AlvirassaLogo'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const border = 'var(--border)'

const body: React.CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '0.8rem',
  color: muted,
  lineHeight: 1.9,
  marginBottom: '1rem',
}

function H2({ children }: { children: string }) {
  return (
    <h2 style={{
      fontFamily: 'Instrument Serif, Georgia, serif',
      fontSize: '1.1rem',
      color: accent,
      fontWeight: 400,
      marginTop: '3rem',
      marginBottom: '0.4rem',
    }}>{children}</h2>
  )
}

function Rule() {
  return <div style={{ borderTop: `1px solid ${border}`, marginBottom: '1.4rem' }} />
}

export function About() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <div style={{ marginBottom: '3rem' }}>
          <AlvirassaLogo size="2.6rem" showSubtitle />
        </div>

        <p style={body}>Some observations refuse to go away.</p>
        <p style={body}>A witness statement that does not fit the timeline. A disease pattern that appears in places that should have nothing in common. A financial signal that survives every conventional explanation. A recurring discrepancy that keeps returning no matter how many times it is dismissed as coincidence.</p>
        <p style={body}>Most systems are built to explain observations. Few are built to preserve the ones that remain unexplained.</p>
        <p style={{ ...body, marginBottom: 0 }}>alvissara exists for those observations.</p>

        <H2>What It Is</H2>
        <Rule />
        <p style={body}>alvissara is a structural observation system for residuals that survive known explanations.</p>
        <p style={body}>A residual is an observation that remains after the available causes, models, assumptions, and evidence have been exhausted.</p>
        <p style={body}>These observations get discarded as noise, error, coincidence, or incomplete information. Sometimes they are. Sometimes they are the first sign of something not yet understood.</p>
        <p style={{ ...body, marginBottom: 0 }}>alvissara keeps them visible.</p>

        <H2>What It Does</H2>
        <Rule />
        <p style={body}>The system records residuals across independent domains and examines whether they exhibit the same structural behavior.</p>
        <p style={body}>Two observations may appear unrelated. One belongs to ecology, another to finance. One emerges from an investigation, another from a scientific study.</p>
        <p style={body}>What matters is structure, not subject.</p>
        <p style={body}>When residuals display the same pattern of deviation across independent domains, the system measures whether that correspondence is likely to have occurred by chance.</p>
        <p style={body}>Where correspondence persists beyond threshold, alvissara generates a hypothesis describing a possible hidden common cause.</p>
        <p style={body}>The purpose is identifying where investigation should begin.</p>
        <p style={{ ...body, marginBottom: 0 }}>Not proving the hypothesis.</p>

        <H2>How It Works</H2>
        <Rule />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            'Submit an observation because its behavior does not match what its context predicts.',
            'The system evaluates it across four structural dimensions: Rate, Direction, Relationship, Configuration.',
            'Observations that meet admissibility requirements enter the open pool.',
            'The system compares residuals across domains within the case.',
            'Structural correspondences are measured against the probability of independent co-occurrence.',
            'Where correspondence exceeds threshold, a hypothesis is generated.',
            'Contradictions are preserved, tracked, and incorporated into future analysis.',
            'The Briefing presents the current state: which residuals remain open, which connections are established, which hypotheses are active.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: accent, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85 }}>{step}</span>
            </div>
          ))}
        </div>

        <H2>For Whom</H2>
        <Rule />
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem 1.2rem', alignItems: 'start' }}>
          {[
            ['Investigators', 'Building the picture incrementally from structural anomalies rather than starting from a hypothesis.'],
            ['Researchers', 'Working with results that existing models acknowledge but cannot adequately explain.'],
            ['Analysts', 'Examining systems whose behavior emerges across multiple domains.'],
            ['Cold case work', 'Observations that remain unresolved for years. Continuity matters more than speed.'],
            ['Anyone', 'Who collects residuals: observations that have survived the known explanations and still demand investigation.'],
          ].map(([role, desc]) => (
            <div key={role} style={{ display: 'contents' }}>
              <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.88rem', color: accent, fontWeight: 400 }}>{role}</span>
              <p style={{ ...body, marginBottom: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        <H2>Why It Exists</H2>
        <Rule />
        <p style={body}>Most investigative systems begin with a hypothesis and search for confirming evidence.</p>
        <p style={body}>alvissara begins with the residual.</p>
        <p style={body}>The observation comes first. The explanation comes later.</p>
        <p style={body}>This changes what the system preserves. It keeps unresolved observations available for future correspondence, future evidence, future understanding.</p>
        <p style={body}>The archive is the system. It is what survives.</p>
        <p style={{ ...body, marginBottom: 0 }}>Because sometimes the most important observation is the one that survives every explanation you currently possess.</p>

      </div>
      <SiteFooter />
    </div>
  )
}
