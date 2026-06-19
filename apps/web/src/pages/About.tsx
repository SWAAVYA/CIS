import { AlvirassaLogo } from '../components/AlvirassaLogo'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const dim = 'var(--text-dim)'
const surface = 'var(--surface)'
const border = 'var(--border)'
const text = 'var(--text)'

const SectionLabel = ({ children }: { children: string }) => (
  <p style={{
    fontFamily: 'DM Mono, monospace',
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: accent,
    marginBottom: '1.2rem',
    marginTop: '3rem',
  }}>{children}</p>
)

const Divider = () => <div style={{ borderTop: `1px solid ${border}`, marginBottom: '1.5rem' }} />

const body = { fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85 }

export function About() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <div style={{ marginBottom: '3rem' }}>
          <AlvirassaLogo size="2rem" showSubtitle />
        </div>

        <p style={{ ...body, fontSize: '0.85rem', color: text, marginBottom: '1.2rem' }}>Some observations refuse to go away.</p>
        <p style={{ ...body, fontSize: '0.85rem', marginBottom: '3rem' }}>A witness statement that does not fit the timeline. A disease pattern that appears in places that should have nothing in common. A financial signal that survives every conventional explanation. A recurring discrepancy that keeps returning no matter how many times it is dismissed as coincidence.</p>

        <SectionLabel>What It Is</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { title: 'Definition', text: 'alvissara is a structural observation system for residuals that survive known explanations.' },
            { title: 'What is a residual', text: 'An observation that remains after the available causes, models, assumptions, and evidence have been exhausted.' },
            { title: 'What happens to them', text: 'These observations get discarded as noise, error, coincidence, or incomplete information. Sometimes they are. Sometimes they are the first sign.' },
            { title: 'What alvissara does', text: 'Keeps them visible. Stores them. Compares them. Looks for patterns that suggest a hidden common cause.' },
          ].map((item) => (
            <div key={item.title} style={{ background: surface, padding: '1.2rem', borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
              <p style={{ ...body, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, margin: '0 0 0.6rem 0' }}>{item.title}</p>
              <p style={{ ...body, fontSize: '0.78rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <SectionLabel>What It Does</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { title: 'Across domains', text: 'The system records residuals across independent domains and examines whether they exhibit the same structural behavior.' },
            { title: 'Structure matters', text: 'Two observations may appear unrelated. One belongs to ecology, another to finance. What matters is structure, not subject.' },
            { title: 'Measures correspondence', text: 'When residuals display the same pattern of deviation across independent domains, the system measures whether that correspondence is likely by chance.' },
            { title: 'Generates hypotheses', text: 'Where correspondence persists beyond threshold, alvissara generates a hypothesis describing a possible hidden common cause.' },
          ].map((item) => (
            <div key={item.title} style={{ background: surface, padding: '1.2rem', borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
              <p style={{ ...body, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, margin: '0 0 0.6rem 0' }}>{item.title}</p>
              <p style={{ ...body, fontSize: '0.78rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <SectionLabel>How It Works</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {[
            'Submit an observation',
            'System evaluates across 4 dimensions',
            'Observations enter pool',
            'System compares across domains',
            'Measures correspondence',
            'Generates hypotheses',
            'Tracks contradictions',
            'Briefing synthesizes state',
          ].map((step, i) => (
            <div key={i} style={{ background: surface, padding: '1rem', borderRadius: 4, borderTop: `3px solid ${accent}` }}>
              <p style={{ ...body, fontSize: '0.7rem', letterSpacing: '0.08em', color: accent, margin: '0 0 0.4rem 0', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</p>
              <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        <SectionLabel>For Whom</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { role: 'Investigators', desc: 'Building the picture incrementally from structural anomalies.' },
            { role: 'Researchers', desc: 'Working with results that existing models cannot adequately explain.' },
            { role: 'Analysts', desc: 'Examining systems whose behavior emerges across multiple domains.' },
            { role: 'Cold case work', desc: 'Observations that remain unresolved for years. Continuity matters more.' },
            { role: 'Anyone', desc: 'Who collects residuals: observations that have survived the known explanations.' },
          ].map((item) => (
            <div key={item.role} style={{ background: surface, padding: '1.2rem', borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.9rem', color: accent, margin: '0 0 0.6rem 0', fontWeight: 400 }}>{item.role}</p>
              <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <SectionLabel>Why It Exists</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {[
            { title: 'Different approach', text: 'Most investigative systems begin with a hypothesis and search for confirming evidence. alvissara begins with the residual. The observation comes first.' },
            { title: 'Preserves what matters', text: 'This changes what the system preserves. It keeps unresolved observations available for future correspondence, future evidence, future understanding.' },
            { title: 'The archive is the product', text: 'The archive is the system. It is what survives. Because sometimes the most important observation is the one that survives every explanation you currently possess.' },
          ].map((item) => (
            <div key={item.title} style={{ background: surface, padding: '1.5rem', borderRadius: 4, borderTop: `3px solid ${accent}` }}>
              <p style={{ ...body, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, margin: '0 0 0.8rem 0' }}>{item.title}</p>
              <p style={{ ...body, fontSize: '0.78rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

      </div>
      <SiteFooter />
    </div>
  )
}
