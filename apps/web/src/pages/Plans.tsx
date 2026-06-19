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
      'Cold case library — download',
      'Manual observation entry',
      'Basic scoring and correlation',
    ],
    cta: 'Start',
    href: '/',
    highlight: false,
  },
  {
    name: 'Individual',
    price: 'Early 2025',
    note: 'For independent analysts',
    features: [
      'Unlimited cases and observations',
      'Document and data extraction',
      'Full hypothesis tracking',
      'Briefing synthesis and export',
      'Analytics — gated by calibration',
      'Case archive and versioning',
      'Email support',
    ],
    cta: 'Get notified',
    href: '#contact',
    highlight: true,
  },
  {
    name: 'Team',
    price: 'Early 2025',
    note: 'For collaborative investigations',
    features: [
      'Everything in Individual',
      'Up to 5 team seats',
      'Shared cases and access codes',
      'Shared analytics and reporting',
      'Team activity log',
      'Priority support',
    ],
    cta: 'Get notified',
    href: '#contact',
    highlight: false,
  },
]

export function Plans() {
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
          <AlvirassaLogo size="1.4rem" />
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/about" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none', letterSpacing: '0.1em' }}>about</Link>
          <Link to="/research" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none', letterSpacing: '0.1em' }}>research</Link>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2rem 6rem' }}>

        {/* Hero */}
        <div style={{ marginBottom: '3.5rem' }}>
          <AlvirassaLogo size="2.8rem" />
          <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.82rem', color: muted, marginTop: '1rem', letterSpacing: '0.05em' }}>
            cognitive intelligence system
          </p>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: muted, lineHeight: 1.8, marginTop: '1.5rem' }}>
            Choose the plan that fits your investigation. All features are built for serious analytical work.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              background: plan.highlight ? surface2 : surface,
              border: `1px solid ${plan.highlight ? border2 : border}`,
              borderRadius: 6,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
            }}>
              <div>
                <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.05rem', color: plan.highlight ? accent : text, marginBottom: '0.4rem', fontWeight: 400 }}>
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

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.73rem', color: muted, lineHeight: 1.6, display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
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
                  padding: '0.6rem 0',
                  textAlign: 'center',
                  background: plan.highlight ? accent : 'transparent',
                  color: plan.highlight ? 'var(--bg)' : muted,
                  border: plan.highlight ? 'none' : `1px solid ${border2}`,
                  borderRadius: 3,
                  display: 'block',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Questions */}
        <SectionLabel>Questions</SectionLabel>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            ['What counts as a case?', 'A case is a set of related observations across domains. One case per investigation or topic.'],
            ['Can I export my work?', 'Yes. Individual and Team plans support full case export in multiple formats.'],
            ['Is there a free trial of paid plans?', 'Contact us to arrange early access.'],
            ['Do you offer discounts for academic work?', 'Contact us with details about your research.'],
            ['When will subscription plans launch?', 'Early 2025. We are finalizing infrastructure and running calibration tests.'],
          ].map(([q, a]) => (
            <div key={q}>
              <p style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.9rem', color: text, marginBottom: '0.5rem' }}>{q}</p>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: muted, lineHeight: 1.75 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <SectionLabel>Get in touch</SectionLabel>
        <Divider />
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: muted, lineHeight: 1.75, marginBottom: '1.5rem' }}>
          Questions about plans, early access, custom use cases, research partnerships, or support.
        </p>

        <div id="contact">
          {status === 'sent' ? (
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: green }}>
              Message sent. We will be in touch.
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
          <Link to="/about" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none' }}>about</Link>
          <Link to="/research" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: dim, textDecoration: 'none' }}>research</Link>
        </div>

      </div>
    </div>
  )
}
