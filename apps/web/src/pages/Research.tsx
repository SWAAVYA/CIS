import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

const accent = 'var(--accent)'
const muted = 'var(--text-muted)'
const text = 'var(--text)'
const border = 'var(--border)'

const S = {
  heading: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '0.62rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: accent,
    marginBottom: '0.9rem',
    marginTop: '2.8rem',
  },
  rule: { borderTop: `1px solid ${border}`, marginBottom: '1.2rem' },
  body: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '0.78rem',
    color: muted,
    lineHeight: 1.85,
  },
}

export function Research() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '8rem 2rem 6rem' }}>

        <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.6rem', color: accent, fontWeight: 400, marginBottom: '0.6rem' }}>
          Research
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: muted, lineHeight: 1.8, marginBottom: '3rem' }}>
          Three theoretical frameworks developed independently and unified into the observation infrastructure.
          Preprints in preparation for submission.
        </p>

        <div style={S.heading}>Structural Incongruence Theory</div>
        <div style={S.rule} />
        <p style={S.body}>
          The formal basis for scoring observations. SI defines four dimensions of structural deviation:
        </p>
        <div style={{ marginTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {[
            ['Rate', 'Something moves at a level, speed, or frequency inconsistent with what the governing frame predicts.'],
            ['Direction', 'A pattern persists in one direction across multiple observation periods where reversal is expected.'],
            ['Relationship', 'Two sources or variables that should track together are diverging, or an official account contradicts what records show.'],
            ['Configuration', 'Multiple independent dimensions simultaneously approach their limits or converge on the same anomaly.'],
          ].map(([dim, desc]) => (
            <div key={dim} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '0.85rem', color: text, minWidth: 110, flexShrink: 0 }}>{dim}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.77rem', color: muted, lineHeight: 1.75 }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ ...S.body, marginTop: '0.9rem' }}>
          Observations are scored across all four dimensions. The weighted composite determines admission to the open pool.
        </p>

        <div style={S.heading}>Residual Transfer Theory</div>
        <div style={S.rule} />
        <p style={S.body}>
          RTT models how residuals from one explanatory frame become the entry signal for a competing frame. When a framework cannot account for an observation, the observation accumulates. RTT identifies the structural conditions under which accumulated residuals trigger frame competition, collapse, and alternative frame adoption.
        </p>
        <p style={{ ...S.body, marginTop: '0.9rem' }}>
          The theory is formalised across five cases: scientific paradigm transitions (Attribution Asymmetry, F-21), alternative frame generation (F-22), competition duration under commitment lock-in (F-23), persistence under boundary conditions (F-24), and topology analysis of competitive displacement across IBM, DEC, Kodak, and Nokia. Applied variants address policy domains where structural residuals accumulate in public institutions.
        </p>

        <div style={S.heading}>Hidden Common Link Theory</div>
        <div style={S.rule} />
        <p style={S.body}>
          HCL formalises the hypothesis class generated when two observations from independent domains show structural correspondence that exceeds the probability of independent co-occurrence. A hidden common link is a variable or structural condition simultaneously present in both domains but directly measured in neither.
        </p>
        <p style={{ ...S.body, marginTop: '0.9rem' }}>
          HCL is the theoretical basis for the Signal Hypothesis Generator. When correspondence strength between two admitted observations exceeds the independence threshold, the system generates an HCL hypothesis: a candidate explanation that could account for both observations simultaneously. The hypothesis is a structured prompt to investigate the shared cause, not a conclusion.
        </p>

      </div>

      <SiteFooter />
    </div>
  )
}
