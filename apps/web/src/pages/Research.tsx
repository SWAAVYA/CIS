import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const border = 'var(--border)'
const text = 'var(--text)'

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
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

export function Research() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.6rem', color: accent, fontWeight: 400, marginBottom: '0.6rem' }}>research</h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>The observation system is built on three independent theoretical frameworks developed to address a common problem: how to identify important signals before conventional methods recognise them, how to understand large transitions while they are happening, and how to discover connections that remain invisible when domains are studied in isolation.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem', textAlign: 'justify' }}>Each framework serves a different purpose. Together they provide the foundation for the observation infrastructure.</p>

        <SectionLabel>Structural Incongruence Theory</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Most systems look for thresholds being crossed.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Structural Incongruence Theory focuses on something earlier: observations that still appear normal on the surface but are already behaving in ways their context does not predict.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>The theory proposes that important change often begins before conventional indicators register a problem. An observation may remain within expected values while its rate of change, direction, relationships, or overall configuration start to diverge from what the surrounding system should produce.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '1.2rem', textAlign: 'justify' }}>To identify these conditions, the theory examines four structural dimensions:</p>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.4rem' }}><span style={{ color: text }}>Rate.</span> Something is changing at a speed or frequency inconsistent with the conditions around it.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.4rem' }}><span style={{ color: text }}>Direction.</span> A pattern continues in one direction when variation or reversal would normally be expected.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.4rem' }}><span style={{ color: text }}>Relationship.</span> Variables, sources, or indicators that should move together begin to separate.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem', textAlign: 'justify' }}><span style={{ color: text }}>Configuration.</span> Multiple dimensions simultaneously move toward the same area of structural tension.</p>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem', textAlign: 'justify' }}>The purpose of the theory is not to predict failure. It is to identify observations that deserve attention because their behaviour no longer matches the structure they are assumed to belong to.</p>

        <SectionLabel>Recursive Transition Theory</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Recursive Transition Theory examines how systems, institutions, ideas, and explanatory frameworks change over time.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>The theory proposes that major transitions do not appear suddenly. They emerge through a recognisable process as contradictions accumulate faster than an existing framework can absorb them.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>As those contradictions grow, explanations that once seemed complete become increasingly strained. Alternative interpretations emerge, compete, and eventually replace the previous frame when they can account for observations the older framework cannot.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '1.2rem', textAlign: 'justify' }}>The theory maps this process through a sequence of recognition stages, from the earliest appearance of structural tension through to reorganisation and stabilisation.</p>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}><span style={{ color: text }}>Attribution Asymmetry</span> is a central concept: the condition in which one framework can explain an observation that another framework cannot adequately absorb. According to the theory, this asymmetry is often the mechanism through which major intellectual, scientific, organisational, and societal transitions occur.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem', textAlign: 'justify' }}>The framework is concerned with understanding where a system sits within a transition, how quickly contradictions are accumulating, and when attention should shift from prediction to preservation.</p>

        <SectionLabel>Hidden Common Link Theory</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Some observations appear unrelated because they emerge in completely different domains.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Hidden Common Link Theory investigates the possibility that apparently independent observations may be responding to the same underlying structural condition.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Rather than looking for direct connections, the theory looks for structural correspondence. Two observations may arise in different organisations, disciplines, industries, or regions while exhibiting the same pattern of tension, the same direction of deviation, or the same timing of emergence.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>When this occurs across genuinely independent domains, the correspondence may indicate the presence of a shared influence that neither domain can see on its own.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>The theory provides a framework for identifying these hidden relationships and generating hypotheses about the underlying conditions that could explain them.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '3rem', textAlign: 'justify' }}>Its purpose is not to provide conclusions. Its purpose is to identify candidate explanations that warrant investigation because the probability of independent coincidence appears unusually low.</p>

        <SectionLabel>Why these frameworks exist together</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Each framework addresses a different part of the same problem.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Structural Incongruence Theory identifies observations whose behaviour deserves attention.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Recursive Transition Theory explains how contradictions accumulate and how larger transitions emerge from them.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, marginBottom: '0.8rem', textAlign: 'justify' }}>Hidden Common Link Theory investigates whether observations from separate domains may be responding to the same underlying structural condition.</p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.9, textAlign: 'justify' }}>Together they form the theoretical foundation of the observation system.</p>

      </div>
      <SiteFooter />
    </div>
  )
}
