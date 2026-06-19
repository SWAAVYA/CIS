import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlvirassaLogo } from '../components/AlvirassaLogo'

const accent   = 'var(--accent)'
const muted    = 'var(--text-muted)'
const dim      = 'var(--text-dim)'
const surface  = 'var(--surface)'
const surface2 = 'var(--surface2)'
const border   = 'var(--border)'
const border2  = 'var(--border2)'
const text     = 'var(--text)'
const green    = 'var(--green)'
const red      = 'var(--red)'

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: 'DM Mono, monospace',
      fontSize: '0.65rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
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

const plans = [
  {
    name: 'Free',
    price: null,
    note: 'No account required',
    features: [
      'Up to 3 active cases',
      '20 observations per case',
      'Cold case library — download',
      'Manual observation entry',
    ],
    cta: 'Start free',
    href: '/',
    highlight: false,
  },
  {
    name: 'Individual',
    price: 'Coming soon',
    note: 'For independent analysts',
    features: [
      'Unlimited cases and observations',
      'Document and data extraction',
      'Full hypothesis tracking',
      'Briefing generation',
      'Analytics — after calibration',
      'Case data export',
    ],
    cta: 'Get notified',
    href: '#contact',
    highlight: true,
  },
  {
    name: 'Team',
    price: 'Coming soon',
    note: 'For collaborative investigations',
    features: [
      'Everything in Individual',
      'Up to 5 seats',
      'Shared cases across team',
      'Shared access codes',
      'Team analytics',
    ],
    cta: 'Get notified',
    href: '#contact',
    highlight: false,
  },
]

export function About() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email.trim() || !form.message.trim()) return
    setStatus('sending')
    try {
      // Opens the user's mail client with prefilled content as a fallback.
      // Replace this with a Formspree / backend endpoint when ready.
      const subject = encodeURIComponent(`alvirassa — message from ${form.name || form.email}`)
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
      window.location.href = `mailto:hello@alvirassa.com?subject=${subject}&body=${body}`
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: surface,
    color: text,
    border: `1px solid ${border2}`,
    borderRadius: 4,
    padding: '0.6rem 0.75rem',
    fontFamily: 'DM Mono, monospace',
    fontSize: '0.8rem',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${border}`, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <AlvirassaLogo size="1.3rem" />
        </Link>
        <Link to="/research" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none', letterSpacing: '0.1em' }}>
          research
        </Link>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '4rem 2rem 6rem' }}>

        {/* Hero */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: '0.85rem', color: muted, marginBottom: '0.5rem' }}>
            cognitive intelligence system
          </p>
          <AlvirassaLogo size="2.6rem" />
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: muted, lineHeight: 1.8, marginTop: '1.5rem', maxWidth: 480 }}>
            A structural observation system for investigators who work at the edge of their frameworks.
          </p>
        </div>

        {/* What it is */}
        <SectionLabel>What it is</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85 }}>
          alvirassa collects observations that deviate structurally from what their
          context predicts. These are not surprising facts. They are structural
          residuals — things that remain unexplained once every known cause has
          been accounted for.
        </p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85, marginTop: '0.9rem' }}>
          The system stores residuals across independent domains and asks one question:
          does this observation correspond structurally with another from a completely
          separate field? When the answer is yes, and the probability of independent
          co-occurrence is low, a hypothesis is generated. The hypothesis is not a
          conclusion. It is a structured prompt to investigate the shared cause.
        </p>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: muted, lineHeight: 1.85, marginTop: '0.9rem' }}>
          Nothing is discarded. Unexplained observations wait. The system is
          built for the cases where you do not yet know what you are looking for.
        </p>

        {/* Different from AI */}
        <SectionLabel>Different from AI</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2.5rem' }}>
          {[
            ['AI summarises what you give it.', 'alvirassa preserves what your framework cannot explain.'],
            ['AI generates answers.', 'alvirassa accumulates residuals.'],
            ['AI produces hypotheses on demand.', 'alvirassa waits for cross-domain structural correspondence before generating one.'],
            ['AI works on documents.', 'alvirassa works on the edges of documents.'],
            ['AI answers questions.', 'alvirassa holds open the ones that do not yet have one.'],
          ].map(([left, right], i) => (
            <>
              <span key={`l${i}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.76rem', color: dim, lineHeight: 1.75 }}>{left}</span>
              <span key={`r${i}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.76rem', color: muted, lineHeight: 1.75 }}>{right}</span>
            </>
          ))}
        </div>

        {/* Who uses it */}
        <SectionLabel>Who uses it</SectionLabel>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            ['Investigators', 'who do not yet know what they are investigating — building the picture one anomaly at a time.'],
            ['Researchers', 'who notice observations at the edge of their data that their methodology does not account for.'],
            ['Analysts', 'working across domains where patterns from unrelated fields may share a structural cause.'],
            ['Cold case specialists', 'building structured records of accumulated anomalies that have no current explanation.'],
            ['Anyone', 'who collects residuals — observations that survive the known explanations and still demand an answer.'],
          ].map(([role, desc]) => (
            <div key={role} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.85rem', color: accent, minWidth: 140, flexShrink: 0 }}>{role}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: muted, lineHeight: 1.7 }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <SectionLabel>Plans</SectionLabel>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              background: plan.highlight ? surface2 : surface,
              border: `1px solid ${plan.highlight ? border2 : border}`,
              borderRadius: 6,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}>
              <div>
                <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1rem', color: plan.highlight ? accent : text, marginBottom: '0.25rem' }}>
                  {plan.name}
                </p>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: dim, letterSpacing: '0.05em' }}>
                  {plan.note}
                </p>
              </div>

              {plan.price && (
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: muted, letterSpacing: '0.05em' }}>
                  {plan.price}
                </p>
              )}

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: muted, lineHeight: 1.5, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>·</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  textAlign: 'center',
                  background: plan.highlight ? accent : 'transparent',
                  color: plan.highlight ? 'var(--bg)' : muted,
                  border: plan.highlight ? 'none' : `1px solid ${border2}`,
                  borderRadius: 3,
                  display: 'block',
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Contact */}
        <SectionLabel>Contact</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: muted, lineHeight: 1.75, marginBottom: '1.5rem' }}>
          Questions, support, early access, or research enquiries — write below.
        </p>

        <div id="contact">
          {status === 'sent' ? (
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: green }}>
              Message sent. We'll be in touch.
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: dim, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Name</label>
                  <input value={form.name} onChange={set('name')} placeholder="Your name" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: dim, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Email <span style={{ color: accent }}>*</span></label>
                  <input type="email" required value={form.email} onChange={set('email')} placeholder="your@email.com" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: dim, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Message <span style={{ color: accent }}>*</span></label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="What are you working on?"
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>
              {status === 'error' && (
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: red }}>Something went wrong. Try again.</p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  alignSelf: 'flex-start',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '0.6rem 1.4rem',
                  background: accent,
                  color: 'var(--bg)',
                  border: 'none',
                  borderRadius: 3,
                  cursor: status === 'sending' ? 'wait' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                }}
              >
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </div>

        <div style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: `1px solid ${border}`, display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none' }}>home</Link>
          <Link to="/research" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none' }}>research</Link>
        </div>

      </div>
    </div>
  )
}
