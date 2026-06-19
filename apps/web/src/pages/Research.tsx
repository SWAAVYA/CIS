import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const border = 'var(--border)'

const body: React.CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '0.8rem',
  color: muted,
  lineHeight: 1.95,
  marginBottom: '1.1rem',
}

function H2({ children }: { children: string }) {
  return (
    <h2 style={{
      fontFamily: 'Instrument Serif, Georgia, serif',
      fontSize: '1.2rem',
      color: accent,
      fontWeight: 400,
      marginTop: '3rem',
      marginBottom: '1rem',
    }}>{children}</h2>
  )
}

function H3({ children }: { children: string }) {
  return (
    <h3 style={{
      fontFamily: 'Instrument Serif, Georgia, serif',
      fontSize: '0.95rem',
      color: 'var(--text)',
      fontWeight: 400,
      marginTop: '1.5rem',
      marginBottom: '0.5rem',
    }}>{children}</h3>
  )
}

function Rule() {
  return <div style={{ borderTop: `1px solid ${border}`, marginBottom: '1.4rem' }} />
}

export function Research() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.6rem', color: accent, fontWeight: 400, marginBottom: '1.5rem' }}>Research</h1>

        <p style={{ ...body, marginBottom: '0.8rem' }}>The observation system is built on three independent theoretical frameworks developed to address a common problem: how to identify important signals before conventional methods recognise them, how to understand large transitions while they are happening, and how to discover connections that remain invisible when domains are studied in isolation.</p>
        <p style={{ ...body, marginBottom: '3rem' }}>Each framework serves a different purpose. Together they provide the foundation for the observation infrastructure.</p>

        <H2>Structural Incongruence Theory</H2>
        <Rule />
        <p style={body}>Most systems look for thresholds being crossed.</p>
        <p style={body}>Structural Incongruence Theory focuses on something earlier: observations that still appear normal on the surface but are already behaving in ways their context does not predict.</p>
        <p style={body}>The theory proposes that important change often begins before conventional indicators register a problem. An observation may remain within expected values while its rate of change, direction, relationships, or overall configuration start to diverge from what the surrounding system should produce.</p>
        <p style={{ ...body, marginBottom: '1.5rem' }}>To identify these conditions, the theory examines four structural dimensions:</p>

        <H3>Rate</H3>
        <p style={{ ...body, marginBottom: '1rem' }}>Something is changing at a speed or frequency inconsistent with the conditions around it.</p>

        <H3>Direction</H3>
        <p style={{ ...body, marginBottom: '1rem' }}>A pattern continues in one direction when variation or reversal would normally be expected.</p>

        <H3>Relationship</H3>
        <p style={{ ...body, marginBottom: '1rem' }}>Variables, sources, or indicators that should move together begin to separate.</p>

        <H3>Configuration</H3>
        <p style={{ ...body, marginBottom: '1.5rem' }}>Multiple dimensions simultaneously move toward the same area of structural tension.</p>

        <p style={body}>The purpose of the theory is not to predict failure. It is to identify observations that deserve attention because their behaviour no longer matches the structure they are assumed to belong to.</p>

        <H2>Recursive Transition Theory</H2>
        <Rule />
        <p style={body}>Recursive Transition Theory examines how systems, institutions, ideas, and explanatory frameworks change over time.</p>
        <p style={body}>The theory proposes that major transitions do not appear suddenly. They emerge through a recognisable process as contradictions accumulate faster than an existing framework can absorb them.</p>
        <p style={body}>As those contradictions grow, explanations that once seemed complete become increasingly strained. Alternative interpretations emerge, compete, and eventually replace the previous frame when they can account for observations the older framework cannot.</p>
        <p style={body}}>The theory maps this process through a sequence of recognition stages, from the earliest appearance of structural tension through to reorganisation and stabilisation.</p>

        <p style={{ ...body, marginBottom: '0.8rem' }}>A central concept is <span style={{ color: 'var(--text)' }}>Attribution Asymmetry</span>: the condition in which one framework can explain an observation that another framework cannot adequately absorb. According to the theory, this asymmetry is often the mechanism through which major intellectual, scientific, organisational, and societal transitions occur.</p>
        <p style={body}>The framework is concerned with understanding where a system sits within a transition, how quickly contradictions are accumulating, and when attention should shift from prediction to preservation.</p>

        <H2>Hidden Common Link Theory</H2>
        <Rule />
        <p style={body}>Some observations appear unrelated because they emerge in completely different domains.</p>
        <p style={body}>Hidden Common Link Theory investigates the possibility that apparently independent observations may be responding to the same underlying structural condition.</p>
        <p style={body}>Rather than looking for direct connections, the theory looks for structural correspondence. Two observations may arise in different organisations, disciplines, industries, or regions while exhibiting the same pattern of tension, the same direction of deviation, or the same timing of emergence.</p>
        <p style={body}>When this occurs across genuinely independent domains, the correspondence may indicate the presence of a shared influence that neither domain can see on its own.</p>
        <p style={body}>The theory provides a framework for identifying these hidden relationships and generating hypotheses about the underlying conditions that could explain them.</p>
        <p style={{ ...body, marginBottom: 0 }}>Its purpose is not to provide conclusions. Its purpose is to identify candidate explanations that warrant investigation because the probability of independent coincidence appears unusually low.</p>

        <H2>Why These Frameworks Exist Together</H2>
        <Rule />
        <p style={body}>Each framework addresses a different part of the same problem.</p>
        <p style={body}>Structural Incongruence Theory identifies observations whose behaviour deserves attention.</p>
        <p style={body}>Recursive Transition Theory explains how contradictions accumulate and how larger transitions emerge from them.</p>
        <p style={body}>Hidden Common Link Theory investigates whether observations from separate domains may be responding to the same underlying structural condition.</p>
        <p style={{ ...body, marginBottom: 0 }}>Together they form the theoretical foundation of the observation system.</p>

      </div>
      <SiteFooter />
    </div>
  )
}
