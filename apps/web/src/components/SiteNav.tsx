import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const LANGUAGES = [
  'Afrikaans','Albanian','Amharic','Arabic','Armenian','Assamese','Aymara','Azerbaijani',
  'Bambara','Basque','Belarusian','Bengali','Bhojpuri','Bosnian','Bulgarian','Catalan',
  'Cebuano','Chichewa','Chinese (Simplified)','Chinese (Traditional)','Corsican','Croatian',
  'Czech','Danish','Dhivehi','Dogri','Dutch','English','Esperanto','Estonian','Ewe','Filipino',
  'Finnish','French','Frisian','Galician','Georgian','German','Greek','Guarani','Gujarati',
  'Haitian Creole','Hausa','Hawaiian','Hebrew','Hindi','Hmong','Hungarian','Icelandic','Igbo',
  'Ilocano','Indonesian','Irish','Italian','Japanese','Javanese','Kannada','Kazakh','Khmer',
  'Kinyarwanda','Konkani','Korean','Krio','Kurdish (Kurmanji)','Kurdish (Sorani)','Kyrgyz',
  'Lao','Latin','Latvian','Lingala','Lithuanian','Luganda','Luxembourgish','Macedonian',
  'Maithili','Malagasy','Malay','Malayalam','Maltese','Maori','Marathi','Meitei','Mizo',
  'Mongolian','Myanmar (Burmese)','Nepali','Norwegian','Nyanja','Odia','Oromo','Pashto',
  'Persian','Polish','Portuguese','Punjabi','Quechua','Romanian','Russian','Samoan','Sanskrit',
  'Scots Gaelic','Serbian','Sesotho','Shona','Sindhi','Sinhala','Slovak','Slovenian','Somali',
  'Spanish','Sundanese','Swahili','Swati','Swedish','Tajik','Tamil','Tatar','Telugu','Thai',
  'Tigrinya','Tsonga','Turkish','Turkmen','Twi','Ukrainian','Urdu','Uyghur','Uzbek',
  'Vietnamese','Welsh','Xhosa','Yiddish','Yoruba','Zulu',
]

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)

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
        .nav-links-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 600px) {
          .nav-subtitle { display: none; }
          .nav-links-desktop { display: none; }
          .nav-hamburger { display: flex; }
        }
        .lang-select {
          appearance: none;
          background: transparent;
          border: 1px solid var(--border2);
          color: var(--text-dim);
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          padding: 0.3rem 1.4rem 0.3rem 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          outline: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%234a4a68'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.4rem center;
          background-size: 8px;
        }
        .lang-select:focus { border-color: var(--accent); color: var(--text); }
        .lang-select option { background: #0f0f1a; color: #d0d0e8; }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Main bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: '0.9rem' }}>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '1rem', fontWeight: 400, color: '#c8b87a', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>
              alvissara
            </span>
            <span className="nav-subtitle" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '0.65rem', fontWeight: 300, color: 'rgba(200,184,122,0.4)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
              cognitive intelligence system
            </span>
          </Link>

          <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', flexShrink: 0 }}>
            {/* Desktop links */}
            <div className="nav-links-desktop" style={{ gap: '1.4rem', alignItems: 'center' }}>
              {['about', 'research', 'plans'].map(p => (
                <NavLink key={p} to={`/${p}`} style={({ isActive }) => linkStyle(isActive)}>{p}</NavLink>
              ))}
            </div>

            {/* Language selector - always visible */}
            <select className="lang-select" defaultValue="English">
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            {/* Hamburger - mobile only */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <span style={{ display: 'block', width: 20, height: 1.5, background: menuOpen ? 'var(--accent)' : 'var(--text-dim)', transition: 'all 0.2s', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
              <span style={{ display: 'block', width: 20, height: 1.5, background: menuOpen ? 'var(--accent)' : 'var(--text-dim)', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 20, height: 1.5, background: menuOpen ? 'var(--accent)' : 'var(--text-dim)', transition: 'all 0.2s', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {['about', 'research', 'plans'].map(p => (
              <NavLink
                key={p}
                to={`/${p}`}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                  textDecoration: 'none',
                })}
              >
                {p}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}
