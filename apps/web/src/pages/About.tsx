import { AlvirassaLogo } from '../components/AlvirassaLogo'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const surface = 'var(--surface)'
const border = 'var(--border)'
const text = 'var(--text)'

const SectionLabel = ({ children }: { children: string }) => (
  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, marginBottom: '1.2rem', marginTop: '3rem' }}>{children}</p>
)

const Divider = () => <div style={{ borderTop: `1px solid ${border}`, marginBottom: '1.5rem' }} />

export function About() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <div style={{ marginBottom: '3rem' }}>
          <AlvirassaLogo size="2rem" showSubtitle />
        </div>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: text, marginBottom: '1rem', lineHeight: 1.8 }}>Some observations refuse to go away. A witness statement that does not fit the timeline. A disease pattern in places that should have nothing in common. A financial signal that survives every conventional explanation. A recurring discrepancy that keeps returning no matter how many times it is dismissed.</p>

        <div style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderLeft: `4px solid ${accent}`, marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, margin: 0, lineHeight: 1.8 }}>Most systems are built to explain observations. Few are built to preserve the ones that remain unexplained. alvissara exists for those observations.</p>
        </div>

        <SectionLabel>What It Is</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { title: 'Definition', text: 'alvissara is a structural observation system for residuals that survive known explanations.' },
            { title: 'Residual', text: 'An observation that remains after the available causes, models, assumptions, and evidence have been exhausted.' },
            { title: 'Purpose', text: 'Keeps residuals visible. Stores them. Compares them across domains. Looks for hidden common causes.' },
          ].map((item) => (
            <div key={item.title} style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.8rem 0', fontWeight: 400 }}>{item.title}</p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.7 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <SectionLabel>How It Works</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {['Submit observation', 'Evaluate across 4 dimensions', 'Enter pool', 'Compare across domains', 'Measure correspondence', 'Generate hypotheses', 'Track contradictions', 'Briefing synthesis'].map((step, i) => (
            <div key={i} style={{ background: surface, padding: '1.2rem', borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: accent, margin: '0 0 0.5rem 0', letterSpacing: '0.1em', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: muted, margin: 0, lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>

        <SectionLabel>For Whom</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            ['Investigators', 'Building the picture from structural anomalies.'],
            ['Researchers', 'Working with results that existing models cannot explain.'],
            ['Analysts', 'Examining systems whose behavior emerges across domains.'],
            ['Cold case work', 'Observations unresolved for years. Continuity matters.'],
            ['Anyone', 'Who collects residuals that have survived all explanations.'],
          ].map(([role, desc]) => (
            <div key={role} style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.8rem 0', fontWeight: 400 }}>{role}</p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>

        <SectionLabel>Why It Exists</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'Different approach', text: 'Most investigative systems begin with a hypothesis and search for confirming evidence. alvissara begins with the residual. The observation comes first.' },
            { title: 'Preserves what matters', text: 'It keeps unresolved observations available for future correspondence, future evidence, future understanding. The archive is the system.' },
          ].map(({title, text: desc}) => (
            <div key={title} style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.8rem 0', fontWeight: 400 }}>{title}</p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>

      </div>
      <SiteFooter />
    </div>
  )
}
