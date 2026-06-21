import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
      padding: '0.85rem 2rem',
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
    }}>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.06em' }}>alvissara © 2026</span>
      <span style={{ color: 'var(--border2)', fontSize: '0.6rem' }}>·</span>
      <Link to="/terms" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text-dim)', textDecoration: 'none', letterSpacing: '0.06em' }}>
        terms &amp; conditions
      </Link>
      <span style={{ color: 'var(--border2)', fontSize: '0.6rem' }}>·</span>
      <Link to="/terms" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text-dim)', textDecoration: 'none', letterSpacing: '0.06em' }}>
        privacy policy
      </Link>
    </footer>
  )
}
