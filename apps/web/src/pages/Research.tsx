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

function Dimension({ label, children }: { label: string; children: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1rem', alignItems: 'start' }}>
      <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.88rem', color: 'var(--text)', fontWeight: 400 }}>{label}</span>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.79rem', color: muted, lineHeight: 1.85 }}>{children}</span>
    </div>
  )
}

export function Research() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.6rem', color: accent, fontWeight: 400, marginBottom: '1.2rem' }}>Research</h1>

        <p style={body}>alvissara is built upon three theoretical frameworks developed to study observations that persist beyond available explanations.</p>
        <p style={{ ...body, marginBottom: '3rem' }}>Together they provide methodology for identifying structural deviations, understanding how explanatory frameworks change, and generating hypotheses from patterns that emerge across independent domains. The frameworks are presented here as research in their own right and form the theoretical foundation of alvissara.</p>

        <H2>Structural Incongruence Theory</H2>
        <Rule />
        <p style={body}>Structural Incongruence Theory examines observations whose behavior no longer matches the structure within which they are understood.</p>
        <p style={body}>Rather than focusing on isolated anomalies, the theory studies deviations in rate, direction, relationship, and configuration. Significance emerges through persistence, accumulation, and correspondence across dimensions.</p>
        <p style={{ ...body, marginBottom: '1.2rem' }}>The theory provides the formal basis for evaluating observations within alvissara.</p>
        <Dimension label="Rate">Something moves at a level, speed, or frequency inconsistent with what its governing structure predicts.</Dimension>
        <Dimension label="Direction">A pattern continues in the same direction across multiple observation periods where reversal would normally be expected.</Dimension>
        <Dimension label="Relationship">Variables, records, or sources that should move together begin to diverge or contradict one another.</Dimension>
        <Dimension label="Configuration">Multiple independent dimensions simultaneously approach their limits or converge upon the same point of tension.</Dimension>
        <p style={{ ...body, marginTop: '0.5rem', marginBottom: 0 }}>Observations are evaluated across all four dimensions. The resulting structural profile determines whether an observation enters the active observation pool.</p>

        <H2>Residual Transfer Theory</H2>
        <Rule />
        <p style={body}>Residual Transfer Theory examines how explanatory frameworks change when observations accumulate beyond their ability to account for them.</p>
        <p style={body}>Unresolved residuals do not disappear. They accumulate. As they accumulate, pressure builds between observation and explanation. When that pressure exceeds what a framework can absorb, alternative frameworks emerge and compete.</p>
        <p style={body}>The theory models the conditions under which explanatory systems persist, weaken, compete, and are eventually replaced.</p>
        <p style={{ ...body, marginBottom: 0 }}>Within alvissara, Residual Transfer Theory provides the basis for understanding how unresolved observations may signal emerging transitions rather than isolated exceptions.</p>

        <H2>Hidden Common Link Theory</H2>
        <Rule />
        <p style={body}>Hidden Common Link Theory examines how observations from independent domains may be connected through the same underlying structural condition.</p>
        <p style={body}>Two observations may appear unrelated. One emerges from public health, another from economics. One originates in a scientific dataset, another in an investigation. Direct connections may be absent.</p>
        <p style={body}>The theory proposes that structural correspondence across independent domains can indicate the presence of a shared cause visible through its effects but not yet directly observed.</p>
        <p style={body}>Within alvissara, Hidden Common Link Theory provides the basis for hypothesis generation.</p>
        <p style={{ ...body, marginBottom: 0 }}>When correspondence between independent observations exceeds the probability of independent co-occurrence, the system generates a Hidden Common Link hypothesis. The hypothesis identifies a candidate explanation for investigation. It is treated as a starting point, not a conclusion.</p>

      </div>
      <SiteFooter />
    </div>
  )
}
