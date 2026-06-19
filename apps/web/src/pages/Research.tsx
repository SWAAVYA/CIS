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

export function Research() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.8rem', color: accent, fontWeight: 400, marginBottom: '0.5rem', lineHeight: 1.1 }}>Research</h1>
        <p style={{ ...body, fontSize: '0.8rem', color: muted, marginBottom: '3rem', letterSpacing: '0.02em' }}>three theoretical frameworks for structural observation</p>

        <div style={{ background: surface, padding: '1.8rem', borderRadius: 6, borderLeft: `4px solid ${accent}`, marginBottom: '4rem' }}>
          <p style={{ ...body, fontSize: '0.8rem', color: text, margin: '0 0 0.8rem 0' }}>The observation system is built on three independent theoretical frameworks. Each addresses a different part of the same problem: how to identify important signals before conventional methods recognise them, how to understand large transitions while they are happening, and how to discover connections that remain invisible when domains are studied in isolation.</p>
          <p style={{ ...body, fontSize: '0.8rem', margin: 0 }}>Together they provide the foundation for the observation infrastructure.</p>
        </div>

        {/* FRAMEWORKS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '3rem' }}>
          {[
            {
              num: '01',
              title: 'Structural Incongruence Theory',
              intro: 'Most systems look for thresholds being crossed.',
              content: 'Structural Incongruence Theory focuses on something earlier: observations that still appear normal on the surface but are already behaving in ways their context does not predict.',
              detail: 'The theory proposes that important change often begins before conventional indicators register a problem. An observation may remain within expected values while its rate of change, direction, relationships, or overall configuration start to diverge from what the surrounding system should produce.',
              dimensions: [
                ['Rate', 'Something is changing at a speed or frequency inconsistent with the conditions around it.'],
                ['Direction', 'A pattern continues in one direction when variation or reversal would normally be expected.'],
                ['Relationship', 'Variables, sources, or indicators that should move together begin to separate.'],
                ['Configuration', 'Multiple dimensions simultaneously move toward the same area of structural tension.'],
              ],
              conclusion: 'The purpose is to identify observations that deserve attention because their behaviour no longer matches the structure they are assumed to belong to.',
            },
            {
              num: '02',
              title: 'Recursive Transition Theory',
              intro: 'Recursive Transition Theory examines how systems, institutions, ideas, and explanatory frameworks change over time.',
              content: 'The theory proposes that major transitions do not appear suddenly. They emerge through a recognisable process as contradictions accumulate faster than an existing framework can absorb them.',
              detail: 'As those contradictions grow, explanations that once seemed complete become increasingly strained. Alternative interpretations emerge, compete, and eventually replace the previous frame when they can account for observations the older framework cannot.',
              highlight: 'Attribution Asymmetry: the condition in which one framework can explain an observation that another framework cannot adequately absorb. According to the theory, this asymmetry is often the mechanism through which major intellectual, scientific, organisational, and societal transitions occur.',
              conclusion: 'The framework is concerned with understanding where a system sits within a transition, how quickly contradictions are accumulating, and when attention should shift from prediction to preservation.',
            },
            {
              num: '03',
              title: 'Hidden Common Link Theory',
              intro: 'Some observations appear unrelated because they emerge in completely different domains.',
              content: 'Hidden Common Link Theory investigates the possibility that apparently independent observations may be responding to the same underlying structural condition.',
              detail: 'Rather than looking for direct connections, the theory looks for structural correspondence. Two observations may arise in different organisations, disciplines, industries, or regions while exhibiting the same pattern of tension, the same direction of deviation, or the same timing of emergence.',
              detail2: 'When this occurs across genuinely independent domains, the correspondence may indicate the presence of a shared influence that neither domain can see on its own.',
              conclusion: 'Its purpose is to identify candidate explanations that warrant investigation because the probability of independent coincidence appears unusually low.',
            },
          ].map((fw, idx) => (
            <div key={idx} style={{ background: surface, padding: '2rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, margin: '0 0 0.5rem 0' }}>{fw.num}</p>
              <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.2rem', color: text, fontWeight: 400, margin: '0 0 1rem 0' }}>{fw.title}</h2>
              <p style={{ ...body, marginBottom: '0.8rem', color: text }}>{fw.intro}</p>
              <p style={{ ...body, marginBottom: '0.8rem' }}>{fw.content}</p>
              <p style={{ ...body, marginBottom: fw.dimensions || fw.highlight ? '1.2rem' : '1rem' }}>{fw.detail}</p>
              {fw.detail2 && <p style={{ ...body, marginBottom: '1rem' }}>{fw.detail2}</p>}
              {fw.dimensions && (
                <div style={{ background: 'rgba(200,184,122,0.05)', padding: '1.2rem', borderRadius: 4, marginBottom: '1rem', borderLeft: `2px solid ${accent}` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    {fw.dimensions.map(([label, desc]) => (
                      <div key={label}>
                        <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.85rem', color: accent, margin: '0 0 0.4rem 0', fontWeight: 400 }}>{label}</p>
                        <p style={{ ...body, fontSize: '0.7rem', margin: 0 }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {fw.highlight && (
                <div style={{ background: 'rgba(200,184,122,0.05)', padding: '1rem', borderRadius: 4, marginBottom: '1rem', borderLeft: `2px solid ${accent}` }}>
                  <p style={{ ...body, fontSize: '0.75rem', margin: 0 }}>{fw.highlight}</p>
                </div>
              )}
              <p style={{ ...body, margin: 0, color: accent, fontStyle: 'italic', fontSize: '0.75rem' }}>{fw.conclusion}</p>
            </div>
          ))}
        </div>

        {/* CONCLUSION */}
        <div style={{ background: surface, padding: '2rem', borderRadius: 6, borderTop: `3px solid ${accent}` }}>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.2rem', color: accent, fontWeight: 400, margin: '0 0 1.5rem 0' }}>Why These Frameworks Exist Together</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p style={{ ...body, margin: 0, fontSize: '0.78rem' }}>Each framework addresses a different part of the same problem.</p>
            <p style={{ ...body, margin: 0, fontSize: '0.78rem' }}><span style={{ color: accent }}>Structural Incongruence Theory</span> identifies observations whose behaviour deserves attention.</p>
            <p style={{ ...body, margin: 0, fontSize: '0.78rem' }}><span style={{ color: accent }}>Recursive Transition Theory</span> explains how contradictions accumulate and how larger transitions emerge from them.</p>
            <p style={{ ...body, margin: 0, fontSize: '0.78rem' }}><span style={{ color: accent }}>Hidden Common Link Theory</span> investigates whether observations from separate domains may be responding to the same underlying structural condition.</p>
            <p style={{ ...body, margin: '1rem 0 0 0', fontSize: '0.78rem', color: text }}>Together they form the theoretical foundation of the observation system.</p>
          </div>
        </div>

      </div>
      <SiteFooter />
    </div>
  )
}
