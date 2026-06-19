import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.85rem 2rem',
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
    }}>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.06em' }}>
        © 2026 alvirassa
      </span>
      <Link to="/terms" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--text-dim)', textDecoration: 'none', letterSpacing: '0.06em' }}>
        terms &amp; data
      </Link>
    </footer>
  )
}
