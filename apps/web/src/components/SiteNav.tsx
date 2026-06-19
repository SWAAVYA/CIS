import { Link, NavLink } from 'react-router-dom'

export function SiteNav() {
  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'DM Mono, monospace',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    color: active ? 'var(--accent)' : 'var(--text-dim)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  })

  return (
    <>
      <style>{`
        .nav-subtitle { display: inline; }
        @media (max-width: 600px) { .nav-subtitle { display: none; } }
      `}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.5rem',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: '0.9rem' }}>
          <span style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '1rem',
            fontWeight: 400,
            color: '#c8b87a',
            letterSpacing: '0.14em',
            whiteSpace: 'nowrap',
          }}>
            alvissara
          </span>
          <span className="nav-subtitle" style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '0.65rem',
            fontWeight: 300,
            color: 'rgba(200,184,122,0.4)',
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}>
            cognitive intelligence system
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '1.4rem', flexShrink: 0 }}>
          {['about', 'research', 'plans'].map(p => (
            <NavLink key={p} to={`/${p}`} style={({ isActive }) => linkStyle(isActive)}>
              {p}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
