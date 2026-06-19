import { Link } from 'react-router-dom'
import { AlvirassaLogo } from '../components/AlvirassaLogo'

const S = {
  heading: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.7rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'var(--accent)',
    marginBottom: '0.75rem',
    marginTop: '2.5rem',
  },
  rule: {
    borderTop: '1px solid var(--border)',
    marginBottom: '1rem',
  },
  subheading: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.9rem',
    color: 'var(--text)',
    marginBottom: '0.5rem',
    marginTop: '1.5rem',
  },
  body: {
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: 1.85,
  },
}

export function Research() {
  return (
    <div className="min-h-screen px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        <div className="mb-8">
          <Link to="/" className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>← back</Link>
        </div>

        <p className="font-serif italic text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          cognitive intelligence system
        </p>
        <AlvirassaLogo className="mb-2" />
        <p className="font-serif italic text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
          theoretical foundations
        </p>

        <div style={S.heading}>Overview</div>
        <div style={S.rule} />
        <p style={S.body}>
          alvirassa is built on three theoretical frameworks developed independently and
          unified into the observation infrastructure. The frameworks formalise what
          experienced analysts do intuitively: hold open what cannot yet be explained,
          compare residuals across independent sources, and wait for structural
          correspondence before committing to a hypothesis.
        </p>
        <p style={{ ...S.body, marginTop: '0.75rem' }}>
          Preprints will be available at this page when submitted. The frameworks are in
          preparation for publication.
        </p>

        {/* SI Theory */}
        <div style={S.heading}>Structural Incongruence Theory</div>
        <div style={S.rule} />
        <p style={S.body}>
          The formal basis for scoring observations. Structural Incongruence (SI) defines
          four dimensions of structural deviation:
        </p>
        <p style={{ ...S.body, marginTop: '0.75rem' }}>
          <span style={{ color: 'var(--text)' }}>Rate</span> — something moves at a level,
          speed, or frequency inconsistent with what the governing frame predicts.
          <br /><br />
          <span style={{ color: 'var(--text)' }}>Direction</span> — a pattern persists in
          one direction across multiple observation periods where reversal is expected.
          <br /><br />
          <span style={{ color: 'var(--text)' }}>Relationship</span> — two sources or
          variables that should track together are diverging, or an official account
          contradicts what records show.
          <br /><br />
          <span style={{ color: 'var(--text)' }}>Configuration</span> — multiple independent
          dimensions simultaneously approach their limits or converge on the same anomaly.
        </p>
        <p style={{ ...S.body, marginTop: '0.75rem' }}>
          An observation is scored across all four dimensions. The weighted composite
          determines whether it is admitted to the open pool.
        </p>

        {/* RTT */}
        <div style={S.heading}>Residual Transfer Theory</div>
        <div style={S.rule} />
        <p style={S.body}>
          RTT models how residuals from one explanatory frame become the entry signal for
          a competing frame. When an existing framework cannot account for an observation,
          the observation does not disappear — it accumulates. RTT identifies the structural
          conditions under which accumulated residuals trigger frame competition, frame
          collapse, and alternative frame adoption.
        </p>
        <p style={{ ...S.body, marginTop: '0.75rem' }}>
          The theory has been formalised across five cases: scientific paradigm transitions
          (Attribution Asymmetry, F-21), alternative frame generation (F-22), competition
          duration under commitment lock-in (F-23), persistence under boundary conditions
          (F-24), and topology analysis of competitive displacement (IBM, DEC, Kodak,
          Nokia). Applied variants address policy domains where structural residuals
          accumulate in public institutions.
        </p>

        {/* HCL */}
        <div style={S.heading}>Hidden Common Link Theory</div>
        <div style={S.rule} />
        <p style={S.body}>
          HCL formalises the hypothesis class generated when two observations from
          independent domains show structural correspondence that exceeds the probability
          of independent co-occurrence. A hidden common link is a variable or structural
          condition simultaneously present in both domains but directly measured in neither.
        </p>
        <p style={{ ...S.body, marginTop: '0.75rem' }}>
          HCL provides the theoretical basis for the Signal Hypothesis Generator: when
          correspondence strength between two admitted observations exceeds the independence
          threshold, the system generates an HCL hypothesis — a candidate explanation that
          could account for both observations simultaneously. The hypothesis is not a
          conclusion. It is a structured prompt to investigate the shared cause.
        </p>

        <div className="mt-10 pt-4 flex gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link to="/" className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>home</Link>
          <span style={{ color: 'var(--border2)' }} className="text-xs">·</span>
          <Link to="/about" className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>about</Link>
        </div>

      </div>
    </div>
  )
}
