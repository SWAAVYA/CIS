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
  marginBottom: '0.75rem',
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

function H3({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: 'Instrument Serif, Georgia, serif',
      fontSize: '0.9rem',
      color: accent,
      marginTop: '1.4rem',
      marginBottom: '0.4rem',
    }}>{children}</p>
  )
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
        <p style={body}>alvissara exists for those observations.</p>

        <H2>What It Is</H2>
        <Rule />
        <p style={body}>alvissara is a structural observation system for residuals that survive known explanations.</p>
        <p style={body}>A residual is an observation that remains after the available causes, models, assumptions, and evidence have been exhausted.</p>
        <p style={body}>These observations are often discarded as noise, error, coincidence, or incomplete information. Sometimes they are. Sometimes they are the first visible sign of something not yet understood.</p>
        <p style={body}>alvissara is designed to keep them visible.</p>

        <H2>What It Does</H2>
        <Rule />
        <p style={body}>The system records residuals across independent domains and examines whether they exhibit the same structural behaviour.</p>
        <p style={body}>Two observations may appear unrelated on the surface. One may belong to ecology, another to finance. One may emerge from an investigation, another from a scientific study.</p>
        <p style={body}>What matters is not the subject. It is the structure.</p>
        <p style={body}>When residuals display the same pattern of deviation across independent domains, the system measures whether that correspondence is likely to have occurred by chance.</p>
        <p style={body}>Where correspondence persists beyond threshold, alvissara generates a hypothesis describing a possible hidden common cause.</p>
        <p style={body}>The purpose is not to prove the hypothesis.</p>
        <p style={body}>The purpose is to identify where investigation should begin.</p>

        <H2>How It Works</H2>
        <Rule />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            'An observation is submitted because its behaviour does not match what its context predicts.',
            'The observation is evaluated across structural dimensions including rate, direction, relationship, and configuration.',
            'Residuals that satisfy admissibility requirements enter the observation pool.',
            'The system compares residuals across domains.',
            'Structural correspondences are measured against the probability of independent co-occurrence.',
            'Where correspondence exceeds threshold, a hypothesis is generated.',
            'Contradictions are preserved, tracked, and incorporated into future analysis.',
            'The Briefing presents the current state of investigation, including active residuals, established correspondences, unresolved contradictions, and active hypotheses.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: accent, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85 }}>{step}</span>
            </div>
          ))}
        </div>

        <H2>For Whom</H2>
        <Rule />
        {[
          ['Investigators', 'Building understanding from unexplained observations rather than beginning with a preferred conclusion.'],
          ['Researchers', 'Working with results that existing models acknowledge but cannot adequately explain.'],
          ['Analysts', 'Examining systems whose behaviour emerges across multiple domains.'],
          ['Historical and Cold Case Work', 'Where observations remain unresolved for years and continuity matters more than speed.'],
          ['Anyone Following a Persistent Question', 'Where the evidence remains incomplete, but the observation refuses to disappear.'],
        ].map(([role, desc]) => (
          <div key={role} style={{ marginBottom: '1.1rem' }}>
            <H3>{role}</H3>
            <p style={{ ...body, marginBottom: 0 }}>{desc}</p>
          </div>
        ))}

        <H2>Why It Exists</H2>
        <Rule />
        <p style={body}>Most investigative systems begin with a hypothesis and search for supporting evidence.</p>
        <p style={body}>alvissara begins with the residual.</p>
        <p style={body}>The observation comes first.</p>
        <p style={body}>The explanation comes later.</p>
        <p style={body}>This distinction changes what the system preserves.</p>
        <p style={body}>Instead of discarding unresolved observations, it keeps them available for future correspondence, future evidence, and future understanding.</p>
        <p style={body}>The archive is not a by-product of the system.</p>
        <p style={body}>The archive is the system.</p>
        <p style={{ ...body, marginBottom: 0 }}>Because sometimes the most important observation is the one that survives every explanation you currently possess.</p>

      </div>
      <SiteFooter />
    </div>
  )
}
