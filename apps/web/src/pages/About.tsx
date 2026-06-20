import { AlvirassaLogo } from '../components/AlvirassaLogo'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const border = 'var(--border)'
const text = 'var(--text)'

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="justify-desktop" style={{
      fontFamily: 'DM Mono, monospace',
      fontSize: '0.65rem',
      letterSpacing: '0.1em',
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

      <style>{`#about-content p { text-align: justify !important; }`}</style>
      <div id="about-content" style={{ maxWidth: 680, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <div style={{ marginBottom: '3rem' }}>
          <AlvirassaLogo size="2rem" showSubtitle />
        </div>

        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: text, lineHeight: 1.9, marginBottom: '0.8rem', } }>Some observations refuse to go away.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '2rem', } }>A witness statement that does not fit the timeline. A disease pattern that appears in places that should have nothing in common. A financial signal that survives every conventional explanation. A recurring discrepancy that keeps returning no matter how many times it is dismissed as coincidence.</p>

        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: text, lineHeight: 1.9, marginBottom: '0.8rem', } }>Most systems are built to explain observations. Few are built to preserve the ones that remain unexplained.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem', } }>alvissara exists for those observations.</p>

        <SectionLabel>What it is</SectionLabel>
        <Divider />
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>alvissara is a structural observation system for residuals that survive known explanations.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>A residual is an observation that remains after the available causes, models, assumptions, and evidence have been exhausted.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>These observations get discarded as noise, error, coincidence, or incomplete information. Sometimes they are. Sometimes they are the first sign of something not yet understood.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem', } }>alvissara keeps them visible.</p>

        <SectionLabel>What it does</SectionLabel>
        <Divider />
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>The system records residuals across independent domains and examines whether they exhibit the same structural behavior.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>Two observations may appear unrelated. One belongs to ecology, another to finance. One emerges from an investigation, another from a scientific study. What matters is structure, not subject.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>When residuals display the same pattern of deviation across independent domains, the system measures whether that correspondence is likely to have occurred by chance. Correspondence thresholds are calibrated empirically against the baseline rate of random structural alignment within each domain.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>Where correspondence exceeds threshold, alvissara generates a hypothesis describing a possible shared structural condition.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem', } }>The purpose is identifying where investigation should begin. Not proving the hypothesis.</p>

        <SectionLabel>How it works</SectionLabel>
        <Divider />
        {[
          'Submit an observation because its behavior does not match what its context predicts.',
          'The system evaluates it across four structural dimensions. Rate, Direction, Relationship, Configuration.',
          'Observations that meet admissibility requirements enter the open pool.',
          'The system compares residuals across domains within the case.',
          'Structural correspondences are measured against the probability of independent co-occurrence.',
          'Where correspondence exceeds threshold, a hypothesis is generated.',
          'Contradictions are preserved, tracked, and incorporated into future analysis.',
          'The Briefing presents the current state. which residuals remain open, which connections are established, which hypotheses are active.',
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: '1.2rem', display: 'flex', gap: '1rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: accent, flexShrink: 0, marginTop: '0.2rem' }}>{String(i + 1).padStart(2, '0')}</span>
            <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, margin: 0, } }>{item}</p>
          </div>
        ))}
        <div style={{ marginBottom: '2rem' }} />

        <SectionLabel>For whom</SectionLabel>
        <Divider />
        {[
          ['Investigators', 'Building the picture incrementally from structural anomalies rather than starting from a hypothesis.'],
          ['Researchers', 'Working with results that existing models acknowledge but cannot adequately explain.'],
          ['Analysts', 'Examining systems whose behavior emerges across multiple domains.'],
          ['Cold case work', 'Observations that remain unresolved for years. Continuity matters more than speed.'],
          ['Anyone', 'Who collects residuals. observations that have survived the known explanations and still demand investigation.'],
        ].map(([role, desc], i) => (
          <div key={i} style={{ marginBottom: i === 4 ? '3rem' : '1.2rem' }}>
            <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.05em', color: text, lineHeight: 1.9, margin: 0, marginBottom: '0.4rem' }}>{role}</p>
            <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, margin: 0, } }>{desc}</p>
          </div>
        ))}

        <SectionLabel>Why it exists</SectionLabel>
        <Divider />
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>Most investigative systems begin with a hypothesis and search for confirming evidence.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>alvissara begins with the residual. The observation comes first. The explanation comes later.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>This changes what the system preserves. It keeps unresolved observations available for future correspondence, future evidence, future understanding.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', } }>The archive is the system. It is what survives.</p>
        <p className="justify-desktop" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, } }>Because sometimes the most important observation is the one that survives every explanation you currently possess.</p>

      </div>
      <SiteFooter />
    </div>
  )
}
