import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
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

export function Research() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.8rem', color: accent, fontWeight: 400, marginBottom: '0.5rem' }}>Research</h1>
        <p style={{ ...body, fontSize: '0.8rem', marginBottom: '3rem' }}>Three theoretical frameworks for structural observation</p>

        <SectionLabel>Overview</SectionLabel>
        <Divider />
        <p style={{ ...body, fontSize: '0.85rem', color: text, marginBottom: '1rem' }}>The observation system is built on three independent theoretical frameworks. Each addresses a different part of the same problem:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
          {[
            'How to identify important signals before conventional methods recognise them.',
            'How to understand large transitions while they are happening.',
            'How to discover connections that remain invisible when domains are studied in isolation.',
          ].map((item, i) => (
            <div key={i} style={{ background: surface, padding: '1.2rem', borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
              <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{item}</p>
            </div>
          ))}
        </div>

        <SectionLabel>Structural Incongruence Theory</SectionLabel>
        <Divider />
        <p style={{ ...body, fontSize: '0.85rem', color: text, marginBottom: '1.5rem' }}>Most systems look for thresholds being crossed. Structural Incongruence Theory focuses on something earlier: observations that still appear normal but are already behaving in ways their context does not predict.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            ['Rate', 'Something is changing at a speed or frequency inconsistent with the conditions around it.'],
            ['Direction', 'A pattern continues in one direction when variation or reversal would normally be expected.'],
            ['Relationship', 'Variables, sources, or indicators that should move together begin to separate.'],
            ['Configuration', 'Multiple dimensions simultaneously move toward the same area of structural tension.'],
          ].map(([label, desc]) => (
            <div key={label} style={{ background: surface, padding: '1.2rem', borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.9rem', color: accent, margin: '0 0 0.6rem 0', fontWeight: 400 }}>{label}</p>
              <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
        <p style={{ ...body, fontSize: '0.8rem', color: text, marginBottom: '3rem', fontStyle: 'italic' }}>The purpose is to identify observations that deserve attention because their behaviour no longer matches the structure they are assumed to belong to.</p>

        <SectionLabel>Recursive Transition Theory</SectionLabel>
        <Divider />
        <p style={{ ...body, fontSize: '0.85rem', color: text, marginBottom: '1rem' }}>Recursive Transition Theory examines how systems, institutions, ideas, and explanatory frameworks change over time.</p>
        <div style={{ background: surface, padding: '1.5rem', borderRadius: 4, borderLeft: `3px solid ${accent}`, marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.8rem 0', fontWeight: 400 }}>Attribution Asymmetry</p>
          <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>The condition in which one framework can explain an observation that another cannot adequately absorb. This asymmetry is often the mechanism through which major intellectual, scientific, organisational, and societal transitions occur.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            'Major transitions do not appear suddenly. They emerge through a recognisable process as contradictions accumulate faster than an existing framework can absorb them.',
            'As contradictions grow, explanations that once seemed complete become increasingly strained. Alternative interpretations emerge, compete, and eventually replace the previous frame.',
          ].map((item, i) => (
            <div key={i} style={{ background: surface, padding: '1.2rem', borderRadius: 4, borderTop: `3px solid ${accent}` }}>
              <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{item}</p>
            </div>
          ))}
        </div>
        <p style={{ ...body, fontSize: '0.8rem', color: text, fontStyle: 'italic' }}>Concerned with understanding where a system sits within a transition, how quickly contradictions are accumulating, and when attention should shift from prediction to preservation.</p>

        <SectionLabel style={{ marginBottom: '1.2rem', marginTop: '3rem' }}>Hidden Common Link Theory</SectionLabel>
        <Divider />
        <p style={{ ...body, fontSize: '0.85rem', color: text, marginBottom: '1.5rem' }}>Hidden Common Link Theory investigates whether apparently independent observations may be responding to the same underlying structural condition.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            'Some observations appear unrelated because they emerge in completely different domains.',
            'Rather than looking for direct connections, the theory looks for structural correspondence. Two observations may arise in different organisations, disciplines, industries, or regions while exhibiting the same pattern.',
            'When this occurs across genuinely independent domains, the correspondence may indicate the presence of a shared influence that neither domain can see on its own.',
          ].map((item, i) => (
            <div key={i} style={{ background: surface, padding: '1.2rem', borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
              <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{item}</p>
            </div>
          ))}
        </div>
        <p style={{ ...body, fontSize: '0.8rem', color: text, fontStyle: 'italic' }}>Its purpose is to identify candidate explanations that warrant investigation because the probability of independent coincidence appears unusually low.</p>

        <SectionLabel>Why These Frameworks Exist Together</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {[
            { title: 'Structural Incongruence', desc: 'Identifies observations whose behaviour deserves attention.' },
            { title: 'Recursive Transition', desc: 'Explains how contradictions accumulate and larger transitions emerge.' },
            { title: 'Hidden Common Link', desc: 'Investigates whether observations from separate domains share a cause.' },
            { title: 'Together', desc: 'They form the theoretical foundation of the observation system.' },
          ].map((item) => (
            <div key={item.title} style={{ background: surface, padding: '1.5rem', borderRadius: 4, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.9rem', color: accent, margin: '0 0 0.6rem 0', fontWeight: 400 }}>{item.title}</p>
              <p style={{ ...body, fontSize: '0.75rem', margin: 0, color: item.title === 'Together' ? text : muted }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
      <SiteFooter />
    </div>
  )
}
