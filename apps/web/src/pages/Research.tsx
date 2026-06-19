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

export function Research() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '2rem', color: accent, fontWeight: 400, marginBottom: '0.5rem', lineHeight: 1.1 }}>Research</h1>
        <p style={{ ...body, fontSize: '0.85rem', color: accent, marginBottom: '3rem', letterSpacing: '0.02em' }}>three theoretical frameworks for structural observation</p>

        <p style={{ ...body, fontSize: '0.85rem', marginBottom: '1rem', color: text }}>The observation system is built on three independent theoretical frameworks. Each addresses a different part of the same problem: how to identify important signals before conventional methods recognise them, how to understand large transitions while they are happening, and how to discover connections that remain invisible when domains are studied in isolation.</p>

        <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: '1.5rem', marginBottom: '4rem', color: muted }}>
          <p style={{ ...body, fontSize: '0.78rem', margin: 0 }}>Together they provide the foundation for the observation infrastructure.</p>
        </div>

        {/* FRAMEWORK 1 */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>01</span>
            <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.4rem', color: text, fontWeight: 400, margin: 0 }}>Structural Incongruence Theory</h2>
          </div>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem' }}>
            <p style={{ ...body, marginBottom: '0.9rem' }}>Most systems look for thresholds being crossed.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>Structural Incongruence Theory focuses on something earlier: observations that still appear normal on the surface but are already behaving in ways their context does not predict.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>The theory proposes that important change often begins before conventional indicators register a problem. An observation may remain within expected values while its rate of change, direction, relationships, or overall configuration start to diverge from what the surrounding system should produce.</p>
            <p style={{ ...body, marginBottom: '2rem', color: text }}>To identify these conditions, the theory examines four structural dimensions:</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              {[
                ['Rate', 'Something is changing at a speed or frequency inconsistent with the conditions around it.'],
                ['Direction', 'A pattern continues in one direction when variation or reversal would normally be expected.'],
                ['Relationship', 'Variables, sources, or indicators that should move together begin to separate.'],
                ['Configuration', 'Multiple dimensions simultaneously move toward the same area of structural tension.'],
              ].map(([label, desc]) => (
                <div key={label} style={{ background: surface, padding: '1rem', borderRadius: 4, borderLeft: `3px solid ${accent}` }}>
                  <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.9rem', color: accent, margin: '0 0 0.5rem 0', fontWeight: 400 }}>{label}</p>
                  <p style={{ ...body, margin: 0, fontSize: '0.75rem' }}>{desc}</p>
                </div>
              ))}
            </div>

            <p style={{ ...body, borderLeft: `2px solid ${accent}`, paddingLeft: '1.2rem', fontStyle: 'italic', color: text }}>The purpose is to identify observations that deserve attention because their behaviour no longer matches the structure they are assumed to belong to.</p>
          </div>
        </div>

        {/* FRAMEWORK 2 */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>02</span>
            <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.4rem', color: text, fontWeight: 400, margin: 0 }}>Recursive Transition Theory</h2>
          </div>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem' }}>
            <p style={{ ...body, marginBottom: '0.9rem' }}>Recursive Transition Theory examines how systems, institutions, ideas, and explanatory frameworks change over time.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>The theory proposes that major transitions do not appear suddenly. They emerge through a recognisable process as contradictions accumulate faster than an existing framework can absorb them.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>As those contradictions grow, explanations that once seemed complete become increasingly strained. Alternative interpretations emerge, compete, and eventually replace the previous frame when they can account for observations the older framework cannot.</p>
            <p style={{ ...body, marginBottom: '1.5rem' }}>The theory maps this process through a sequence of recognition stages, from the earliest appearance of structural tension through to reorganisation and stabilisation.</p>

            <div style={{ background: surface, padding: '1.5rem', borderRadius: 4, borderLeft: `3px solid ${accent}`, marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.95rem', color: accent, margin: '0 0 0.8rem 0', fontWeight: 400 }}>Attribution Asymmetry</p>
              <p style={{ ...body, margin: 0, fontSize: '0.75rem' }}>The condition in which one framework can explain an observation that another framework cannot adequately absorb. According to the theory, this asymmetry is often the mechanism through which major intellectual, scientific, organisational, and societal transitions occur.</p>
            </div>

            <p style={{ ...body, borderLeft: `2px solid ${accent}`, paddingLeft: '1.2rem', fontStyle: 'italic', color: text }}>The framework is concerned with understanding where a system sits within a transition, how quickly contradictions are accumulating, and when attention should shift from prediction to preservation.</p>
          </div>
        </div>

        {/* FRAMEWORK 3 */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>03</span>
            <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.4rem', color: text, fontWeight: 400, margin: 0 }}>Hidden Common Link Theory</h2>
          </div>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem' }}>
            <p style={{ ...body, marginBottom: '0.9rem' }}>Some observations appear unrelated because they emerge in completely different domains.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>Hidden Common Link Theory investigates the possibility that apparently independent observations may be responding to the same underlying structural condition.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>Rather than looking for direct connections, the theory looks for structural correspondence. Two observations may arise in different organisations, disciplines, industries, or regions while exhibiting the same pattern of tension, the same direction of deviation, or the same timing of emergence.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>When this occurs across genuinely independent domains, the correspondence may indicate the presence of a shared influence that neither domain can see on its own.</p>
            <p style={{ ...body, marginBottom: '0.9rem' }}>The theory provides a framework for identifying these hidden relationships and generating hypotheses about the underlying conditions that could explain them.</p>

            <p style={{ ...body, borderLeft: `2px solid ${accent}`, paddingLeft: '1.2rem', fontStyle: 'italic', color: text }}>Its purpose is to identify candidate explanations that warrant investigation because the probability of independent coincidence appears unusually low.</p>
          </div>
        </div>

        {/* CONCLUSION */}
        <div style={{ background: surface, padding: '2rem', borderRadius: 4, borderTop: `2px solid ${accent}` }}>
          <h3 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.2rem', color: accent, fontWeight: 400, marginBottom: '1rem', margin: '0 0 1rem 0' }}>Why These Frameworks Exist Together</h3>
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
