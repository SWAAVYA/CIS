import { AlvirassaLogo } from '../components/AlvirassaLogo'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const border = 'var(--border)'
const surface = 'var(--surface)'
const text = 'var(--text)'

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

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <div style={{ marginBottom: '3.5rem' }}>
          <AlvirassaLogo size="2.2rem" showSubtitle />
        </div>

        <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: '1.5rem', marginBottom: '4rem' }}>
          <p style={{ ...body, fontSize: '0.85rem', color: text, marginBottom: '0.8rem' }}>Some observations refuse to go away.</p>
          <p style={{ ...body, fontSize: '0.85rem', color: muted }}>A witness statement that does not fit the timeline. A disease pattern that appears in places that should have nothing in common. A financial signal that survives every conventional explanation. A recurring discrepancy that keeps returning no matter how many times it is dismissed as coincidence.</p>
        </div>

        <p style={{ ...body, marginBottom: '1rem' }}>Most systems are built to explain observations. Few are built to preserve the ones that remain unexplained.</p>
        <p style={{ ...body, marginBottom: '3rem', borderLeft: `2px solid ${accent}`, paddingLeft: '1.2rem', fontStyle: 'italic' }}>alvissara exists for those observations.</p>

        {/* WHAT IT IS */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.4rem', color: text, fontWeight: 400, marginBottom: '1rem', margin: 0 }}>What It Is</h2>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem' }}>
            <p style={{ ...body, marginBottom: '0.9rem', color: text }}>alvissara is a structural observation system for residuals that survive known explanations.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>A residual is an observation that remains after the available causes, models, assumptions, and evidence have been exhausted.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>These observations get discarded as noise, error, coincidence, or incomplete information. Sometimes they are. Sometimes they are the first sign of something not yet understood.</p>
            <p style={{ ...body, borderLeft: `2px solid ${accent}`, paddingLeft: '1.2rem', fontStyle: 'italic', color: text }}>alvissara keeps them visible.</p>
          </div>
        </div>

        {/* WHAT IT DOES */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.4rem', color: text, fontWeight: 400, marginBottom: '1rem', margin: 0 }}>What It Does</h2>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem' }}>
            <p style={{ ...body, marginBottom: '0.9rem', color: text }}>The system records residuals across independent domains and examines whether they exhibit the same structural behavior.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>Two observations may appear unrelated. One belongs to ecology, another to finance. One emerges from an investigation, another from a scientific study.</p>
            <p style={{ ...body, marginBottom: '0.9rem', color: text, fontStyle: 'italic' }}>What matters is structure, not subject.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>When residuals display the same pattern of deviation across independent domains, the system measures whether that correspondence is likely to have occurred by chance.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>Where correspondence persists beyond threshold, alvissara generates a hypothesis describing a possible hidden common cause.</p>
            <p style={{ ...body, marginBottom: '0.9rem', color: text }}>The purpose is identifying where investigation should begin.</p>
            <p style={{ ...body, borderLeft: `2px solid ${accent}`, paddingLeft: '1.2rem', fontStyle: 'italic', color: text }}>Not proving the hypothesis.</p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.4rem', color: text, fontWeight: 400, marginBottom: '1rem', margin: 0 }}>How It Works</h2>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem' }}>
            <ol style={{ margin: 0, paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                <li key={i} style={{ listStyle: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.08em', color: accent, flexShrink: 0, paddingTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ ...body, fontSize: '0.78rem' }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* FOR WHOM */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.4rem', color: text, fontWeight: 400, marginBottom: '1rem', margin: 0 }}>For Whom</h2>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                ['Investigators', 'Building the picture incrementally from structural anomalies rather than starting from a hypothesis.'],
                ['Researchers', 'Working with results that existing models acknowledge but cannot adequately explain.'],
                ['Analysts', 'Examining systems whose behavior emerges across multiple domains.'],
                ['Cold case work', 'Observations that remain unresolved for years. Continuity matters more than speed.'],
                ['Anyone', 'Who collects residuals: observations that have survived the known explanations and still demand investigation.'],
              ].map(([role, desc]) => (
                <div key={role} style={{ background: surface, padding: '1.2rem', borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
                  <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.6rem 0', fontWeight: 400 }}>{role}</p>
                  <p style={{ ...body, margin: 0, fontSize: '0.75rem' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHY IT EXISTS */}
        <div style={{ background: surface, padding: '2rem', borderRadius: 4, borderTop: `2px solid ${accent}` }}>
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
