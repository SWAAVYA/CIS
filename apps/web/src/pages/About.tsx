import { AlvirassaLogo } from '../components/AlvirassaLogo'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const text = 'var(--text)'
const surface = 'var(--surface)'
const border = 'var(--border)'

const body: React.CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '0.8rem',
  color: muted,
  lineHeight: 1.9,
}

export function About() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <AlvirassaLogo size="2rem" showSubtitle />
        </div>

        <div style={{ background: surface, padding: '2rem', borderRadius: 6, borderLeft: `4px solid ${accent}`, marginBottom: '3rem' }}>
          <p style={{ ...body, fontSize: '0.85rem', color: text, margin: '0 0 1rem 0' }}>Some observations refuse to go away.</p>
          <p style={{ ...body, fontSize: '0.85rem', margin: 0 }}>A witness statement that does not fit the timeline. A disease pattern that appears in places that should have nothing in common. A financial signal that survives every conventional explanation. A recurring discrepancy that keeps returning no matter how many times it is dismissed as coincidence.</p>
        </div>

        <p style={{ ...body, marginBottom: '0.8rem', color: text }}>Most systems are built to explain observations. Few are built to preserve the ones that remain unexplained.</p>
        <p style={{ ...body, marginBottom: '4rem', color: accent, fontStyle: 'italic' }}>alvissara exists for those observations.</p>

        {/* WHAT IT IS */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.3rem', color: accent, fontWeight: 400, marginBottom: '1.5rem', margin: 0 }}>What It Is</h2>
          <div style={{ background: surface, padding: '1.8rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
            <p style={{ ...body, marginBottom: '1rem', color: text }}>alvissara is a structural observation system for residuals that survive known explanations.</p>
            <p style={{ ...body, marginBottom: '1rem' }}>A residual is an observation that remains after the available causes, models, assumptions, and evidence have been exhausted.</p>
            <p style={{ ...body, marginBottom: '1rem' }}>These observations get discarded as noise, error, coincidence, or incomplete information. Sometimes they are. Sometimes they are the first sign of something not yet understood.</p>
            <p style={{ ...body, margin: 0, color: accent, fontStyle: 'italic' }}>alvissara keeps them visible.</p>
          </div>
        </div>

        {/* WHAT IT DOES */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.3rem', color: accent, fontWeight: 400, marginBottom: '1.5rem', margin: 0 }}>What It Does</h2>
          <div style={{ background: surface, padding: '1.8rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
            <p style={{ ...body, marginBottom: '1rem', color: text }}>The system records residuals across independent domains and examines whether they exhibit the same structural behavior.</p>
            <p style={{ ...body, marginBottom: '1rem' }}>Two observations may appear unrelated. One belongs to ecology, another to finance. One emerges from an investigation, another from a scientific study.</p>
            <p style={{ ...body, marginBottom: '1rem', color: text, fontStyle: 'italic' }}>What matters is structure, not subject.</p>
            <p style={{ ...body, marginBottom: '1rem' }}>When residuals display the same pattern of deviation across independent domains, the system measures whether that correspondence is likely to have occurred by chance.</p>
            <p style={{ ...body, marginBottom: '1rem' }}>Where correspondence persists beyond threshold, alvissara generates a hypothesis describing a possible hidden common cause.</p>
            <p style={{ ...body, marginBottom: '1rem', color: text }}>The purpose is identifying where investigation should begin.</p>
            <p style={{ ...body, margin: 0, color: accent, fontStyle: 'italic' }}>Not proving the hypothesis.</p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.3rem', color: accent, fontWeight: 400, marginBottom: '1.5rem', margin: 0 }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <div key={i} style={{ background: surface, padding: '1.2rem', borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.1em', color: accent, margin: '0 0 0.6rem 0', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</p>
                <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOR WHOM */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.3rem', color: accent, fontWeight: 400, marginBottom: '1.5rem', margin: 0 }}>For Whom</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {[
              ['Investigators', 'Building the picture incrementally from structural anomalies rather than starting from a hypothesis.'],
              ['Researchers', 'Working with results that existing models acknowledge but cannot adequately explain.'],
              ['Analysts', 'Examining systems whose behavior emerges across multiple domains.'],
              ['Cold case work', 'Observations that remain unresolved for years. Continuity matters more than speed.'],
              ['Anyone', 'Who collects residuals: observations that have survived the known explanations and still demand investigation.'],
            ].map(([role, desc]) => (
              <div key={role} style={{ background: surface, padding: '1.2rem', borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
                <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.6rem 0', fontWeight: 400 }}>{role}</p>
                <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WHY IT EXISTS */}
        <div style={{ background: surface, padding: '2rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.3rem', color: accent, fontWeight: 400, margin: '0 0 1.5rem 0' }}>Why It Exists</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <p style={{ ...body, margin: 0, fontSize: '0.78rem' }}>Most investigative systems begin with a hypothesis and search for confirming evidence.</p>
            <p style={{ ...body, margin: 0, fontSize: '0.78rem', color: text }}>alvissara begins with the residual.</p>
            <p style={{ ...body, margin: 0, fontSize: '0.78rem' }}>The observation comes first. The explanation comes later.</p>
            <p style={{ ...body, margin: 0, fontSize: '0.78rem' }}>This changes what the system preserves. It keeps unresolved observations available for future correspondence, future evidence, future understanding.</p>
            <p style={{ ...body, margin: '1rem 0 0 0', fontSize: '0.78rem', color: text }}>The archive is the system. It is what survives.</p>
            <p style={{ ...body, margin: '0.6rem 0 0 0', fontSize: '0.78rem', fontStyle: 'italic' }}>Because sometimes the most important observation is the one that survives every explanation you currently possess.</p>
          </div>
        </div>

      </div>
      <SiteFooter />
    </div>
  )
}
