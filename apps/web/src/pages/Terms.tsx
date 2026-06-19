import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const dim = 'var(--text-dim)'
const border = 'var(--border)'

const body: React.CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '0.8rem',
  color: muted,
  lineHeight: 1.9,
  marginBottom: '1rem',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.9rem', color: accent, marginBottom: '0.4rem', fontWeight: 400 }}>
        {title}
      </p>
      <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.2rem' }}>
        {children}
      </div>
    </div>
  )
}

function H2({ children }: { children: string }) {
  return (
    <h2 style={{
      fontFamily: 'Instrument Serif, Georgia, serif',
      fontSize: '1.1rem',
      color: accent,
      fontWeight: 400,
      marginTop: '3rem',
      marginBottom: '1.2rem',
    }}>{children}</h2>
  )
}

export function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SiteNav />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: dim, marginBottom: '0.6rem' }}>
          Last updated June 2026
        </p>
        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.6rem', color: accent, fontWeight: 400, marginBottom: '1.5rem', lineHeight: 1.2 }}>
          Terms &amp; Data
        </h1>
        <p style={{ ...body, marginBottom: '3rem' }}>
          These terms govern use of alvissara. By using the service, you accept them.
        </p>

        <H2>Terms and Conditions</H2>

        <Section title="The Service">
          <p style={body}>alvissara is a structural observation system.</p>
          <p style={body}>Users submit observations: descriptions of things whose behaviour deviates structurally from what their context predicts. The system evaluates, stores, and compares observations across domains within a case.</p>
          <p style={body}>The service generates hypotheses based on structural correspondence between observations. These hypotheses are analytical outputs intended to support investigation. They are not conclusions and should not be treated as legal, medical, financial, or professional advice.</p>
          <p style={{ ...body, marginBottom: 0 }}>The service is provided as available. No guarantee is made regarding uninterrupted availability, completeness of analysis, or suitability for a particular investigative purpose.</p>
        </Section>

        <Section title="Your Use">
          <p style={body}>You are responsible for the information submitted to the system.</p>
          <p style={body}>alvissara may not be used to process information you are not authorised to handle, to identify individuals without lawful basis, or for purposes prohibited by applicable law.</p>
          <p style={{ ...body, marginBottom: 0 }}>Each case is controlled through its access code. Responsibility for safeguarding that code rests with the holder. Cases cannot be recovered where access codes are lost.</p>
        </Section>

        <Section title="Intellectual Property">
          <p style={body}>Observations and materials submitted to a case remain the property of the person who submitted them.</p>
          <p style={body}>You grant alvissara the right to store and process those observations for operation of the service and, in aggregated and anonymised form, for improvement of the underlying methodologies.</p>
          <p style={body}>Ownership of submitted observations does not transfer to alvissara.</p>
          <p style={{ ...body, marginBottom: 0 }}>The alvissara platform, methodologies, frameworks, scoring systems, hypothesis generation mechanisms, and associated intellectual property remain protected.</p>
        </Section>

        <Section title="Limitation of Liability">
          <p style={body}>alvissara is a tool for structural observation and investigation.</p>
          <p style={body}>Responsibility for decisions, actions, conclusions, or outcomes derived from use of the service remains with the user.</p>
          <p style={{ ...body, marginBottom: 0 }}>To the maximum extent permitted by law, liability arising from use of the service is limited to the amount paid for use of the service during the three months preceding the claim.</p>
        </Section>

        <Section title="Changes and Continuity">
          <p style={body}>These terms may be updated from time to time.</p>
          <p style={body}>Continued use following publication of revised terms constitutes acceptance of those changes.</p>
          <p style={{ ...body, marginBottom: 0 }}>Should the service be discontinued, a mechanism for exporting case data will remain available for a minimum period of thirty days.</p>
        </Section>

        <H2>Privacy Policy</H2>

        <Section title="What Is Collected">
          <p style={body}>When a case is created, alvissara stores the observations submitted to that case.</p>
          <p style={body}>An observation is a description of a structural signal: something whose behaviour deviates from what its context predicts.</p>
          <p style={body}>No names, email addresses, user accounts, profiles, or personal identifiers are required to create a case.</p>
          <p style={body}>The only identifier associated with a case is the access code generated at creation.</p>
          <p style={{ ...body, marginBottom: 0 }}>Standard infrastructure records, including request timestamps, IP addresses, and error logs, are retained for operational and security purposes for up to thirty days. These records are not linked to case content.</p>
        </Section>

        <Section title="How Information Is Used">
          <p style={body}>Observations are processed for the operation of the case, including scoring, correspondence analysis, contradiction tracking, and hypothesis generation.</p>
          <p style={body}>Structural patterns may also be examined in aggregate to improve the underlying methodologies.</p>
          <p style={body}>This analysis focuses on structural characteristics rather than investigative content. No case is attributed to an individual and no observation is used for advertising, profiling, or commercial targeting.</p>
          <p style={body}>Observation data is not sold.</p>
          <p style={{ ...body, marginBottom: 0 }}>Observation data is not shared with third parties for commercial purposes.</p>
        </Section>

        <Section title="Your Rights">
          <p style={body}>A case and its observations may be deleted by submitting a request together with the relevant access code.</p>
          <p style={body}>Deletion requests are completed within fourteen days.</p>
          <p style={{ ...body, marginBottom: 0 }}>Because cases are not associated with names, email addresses, or accounts, requests can only be processed through possession of the case access code.</p>
        </Section>

        <Section title="Third Parties">
          <p style={body}>Observation processing uses the Anthropic API for extraction, scoring, and hypothesis generation.</p>
          <p style={body}>Observation content submitted for processing is transmitted to Anthropic as part of that process. Anthropic's terms and privacy practices apply to such processing.</p>
          <p style={body}>Infrastructure services are provided through Vercel. Infrastructure-level records are therefore subject to Vercel's applicable policies.</p>
          <p style={{ ...body, marginBottom: 0 }}>No analytics trackers, advertising networks, advertising pixels, or third-party cookies are used.</p>
        </Section>

        <Section title="Research">
          <p style={body}>alvissara is built upon a body of theoretical work that continues to be tested and refined.</p>
          <p style={body}>Aggregated structural patterns contribute to that research. This includes the study of scoring behaviour, correspondence formation, contradiction persistence, and hypothesis performance across cases.</p>
          <p style={{ ...body, marginBottom: 0 }}>The research concerns the method. The content of individual investigations is not used.</p>
        </Section>

      </div>

      <SiteFooter />
    </div>
  )
}
