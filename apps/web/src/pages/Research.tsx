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

export function Research() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.8rem', color: accent, fontWeight: 400, marginBottom: '2rem' }}>Research</h1>

        <SectionLabel>The Three Frameworks</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
          {[
            'How to identify important signals before conventional methods recognise them.',
            'How to understand large transitions while they are happening.',
            'How to discover connections that remain invisible when domains are studied in isolation.',
          ].map((item, i) => (
            <div key={i} style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.8 }}>{item}</p>
            </div>
          ))}
        </div>

        <SectionLabel>Structural Incongruence Theory</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: text, marginBottom: '1.5rem', lineHeight: 1.8 }}>Most systems look for thresholds being crossed. This theory focuses on something earlier: observations that still appear normal but are already behaving in ways their context does not predict.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {[
            ['Rate', 'Something is changing at a speed or frequency inconsistent with the conditions around it.'],
            ['Direction', 'A pattern continues in one direction when variation or reversal would normally be expected.'],
            ['Relationship', 'Variables, sources, or indicators that should move together begin to separate.'],
            ['Configuration', 'Multiple dimensions simultaneously move toward the same area of structural tension.'],
          ].map(([label, desc]) => (
            <div key={label} style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.8rem 0', fontWeight: 400 }}>{label}</p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, fontStyle: 'italic', lineHeight: 1.7 }}>Purpose: identify observations that deserve attention because their behaviour no longer matches the structure they are assumed to belong to.</p>
        </div>

        <SectionLabel>Recursive Transition Theory</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {[
            'Major transitions do not appear suddenly. They emerge as contradictions accumulate faster than an existing framework can absorb them.',
            'As contradictions grow, explanations that once seemed complete become strained. Alternative interpretations emerge, compete, and eventually replace the previous frame.',
          ].map((item, i) => (
            <div key={i} style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.7 }}>{item}</p>
            </div>
          ))}
        </div>
        <div style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderLeft: `3px solid ${accent}`, marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.9rem', color: accent, margin: '0 0 0.8rem 0', fontWeight: 400 }}>Attribution Asymmetry</p>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.7 }}>The condition in which one framework can explain an observation that another cannot adequately absorb. This asymmetry is often the mechanism through which major transitions occur.</p>
        </div>
        <div style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, fontStyle: 'italic', lineHeight: 1.7 }}>Purpose: understand where a system sits within a transition, how quickly contradictions are accumulating, and when attention should shift from prediction to preservation.</p>
        </div>

        <SectionLabel>Hidden Common Link Theory</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {[
            'Some observations appear unrelated because they emerge in completely different domains.',
            'Rather than looking for direct connections, the theory looks for structural correspondence across organisations, disciplines, industries, or regions.',
            'When correspondence occurs across genuinely independent domains, it may indicate the presence of a shared influence that neither domain can see.',
          ].map((item, i) => (
            <div key={i} style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.7 }}>{item}</p>
            </div>
          ))}
        </div>
        <div style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: muted, margin: 0, fontStyle: 'italic', lineHeight: 1.7 }}>Purpose: identify candidate explanations that warrant investigation because the probability of independent coincidence appears unusually low.</p>
        </div>

        <SectionLabel>Why These Frameworks Exist Together</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'Structural Incongruence', desc: 'Identifies observations whose behaviour deserves attention.' },
            { title: 'Recursive Transition', desc: 'Explains how contradictions accumulate and larger transitions emerge.' },
            { title: 'Hidden Common Link', desc: 'Investigates whether observations from separate domains share a cause.' },
            { title: 'Together', desc: 'They form the theoretical foundation of the observation system.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{ background: surface, padding: '1.5rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.8rem 0', fontWeight: 400 }}>{title}</p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: title === 'Together' ? text : muted, margin: 0, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>

      </div>
      <SiteFooter />
    </div>
  )
}
