import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const dim = 'var(--text-dim)'
const border = 'var(--border)'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, marginBottom: '1rem' }}>
        {title}
      </p>
      <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.2rem' }}>
        {children}
      </div>
    </div>
  )
}

const body: React.CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  fontSize: '0.78rem',
  color: muted,
  lineHeight: 1.85,
}

export function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SiteNav />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: dim, marginBottom: '0.6rem' }}>
          Last updated January 2026
        </p>
        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.6rem', color: accent, fontWeight: 400, marginBottom: '2.5rem', lineHeight: 1.2 }}>
          Terms &amp; Data
        </h1>

        <Section title="What we collect">
          <p style={body}>
            When you create a case, we store the observations you submit. An observation is a structural signal — a text description of something that deviates from what its context predicts. That is the unit of data in alvirassa.
          </p>
          <p style={{ ...body, marginTop: '0.9rem' }}>
            We do not collect your name, email address, or any identifying information. Cases are created without an account. The only identifier associated with your case is the access code the system generates when you create it. There is no login, no profile, and no personal data attached to your work.
          </p>
        </Section>

        <Section title="What we do with it">
          <p style={body}>
            The observations you submit are stored to run your case: scoring them, detecting connections across domains, generating hypotheses. That is the primary use.
          </p>
          <p style={{ ...body, marginTop: '0.9rem' }}>
            We use structural patterns from observations in aggregate to calibrate and improve the scoring system. This means we study the shapes of what people submit — the structural types, the dimensions that score high or low, the patterns that recur across cases — not the content of individual investigations. No case is read by a person. No observation is attributed to an individual.
          </p>
          <p style={{ ...body, marginTop: '0.9rem' }}>
            We do not sell data, share data with third parties, or use observations for advertising of any kind.
          </p>
        </Section>

        <Section title="Your cases">
          <p style={body}>
            Your case belongs to whoever holds the access code. If you lose it, we cannot recover it — there is no account to look it up from. This is intentional: it means your work is not linked to an identity in our system.
          </p>
          <p style={{ ...body, marginTop: '0.9rem' }}>
            You can request deletion of a case and its observations at any time by contacting us with your access code. We will remove the record entirely.
          </p>
        </Section>

        <Section title="Research use">
          <p style={body}>
            alvirassa is built on a theoretical framework — Structural Incongruence Theory, Residual Transfer Theory, and Hidden Common Link Theory — that is itself under development. The aggregated structural patterns we observe across cases inform that research.
          </p>
          <p style={{ ...body, marginTop: '0.9rem' }}>
            Concretely: we study how observations score across dimensions, what types of structural correspondence emerge across domains, and how hypotheses hold or collapse as cases develop. This is research into the method. The content of individual cases is not used.
          </p>
        </Section>

        <Section title="Third parties">
          <p style={body}>
            Observation processing uses the Anthropic API (Claude) for document extraction, scoring, and hypothesis generation. Observation text is sent to Anthropic's API as part of this processing. Anthropic's usage policies apply. We do not use models that train on your data by default — Anthropic's API does not use submitted content for training unless explicitly opted in, which we have not done.
          </p>
          <p style={{ ...body, marginTop: '0.9rem' }}>
            The application is hosted on Vercel. Infrastructure-level data (logs, request metadata) is subject to Vercel's policies.
          </p>
        </Section>

        <Section title="Contact">
          <p style={body}>
            Questions about data, deletion requests, or anything else: <a href="mailto:hello@alvirassa.com" style={{ color: accent, textDecoration: 'none' }}>hello@alvirassa.com</a>
          </p>
        </Section>

      </div>

      <SiteFooter />
    </div>
  )
}
