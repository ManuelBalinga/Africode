import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import { useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'

export default function Header() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggle } = useTheme()

  const links = [
    { to: '/what-we-build', label: t('nav.build') },
    { to: '/work', label: t('nav.work') },
    { to: '/pricing', label: t('nav.pricing') },
    { to: '/about', label: t('nav.about') },
  ]

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--header-bg)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--hairline-soft)',
    }}>
      <div className="wrap hdr">
        <Link to="/" aria-label="Africode Studios home" className="hdr-logo">
          <Logo />
        </Link>

        <nav className="mainnav" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="navlink" style={({ isActive }) => ({
              color: isActive ? 'var(--ink)' : 'var(--muted)',
              borderBottom: isActive ? '2px solid var(--amber)' : '2px solid transparent',
            })}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="hdr-actions">
          <button onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} className="theme-toggle">
            <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} aria-hidden="true" />
          </button>
          <div role="group" aria-label="Language" className="langtoggle">
            {['en', 'fr'].map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{
                background: lang === l ? 'var(--ink)' : 'transparent',
                color: lang === l ? 'var(--offwhite)' : 'var(--muted)',
                border: 0, padding: '6px 11px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5,
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <Link to="/start" className="btn btn-amber btn-sm hdr-cta">{t('nav.quote')}</Link>
        </div>
      </div>

      <style>{`
        .hdr{display:flex;align-items:center;gap:20px;padding:12px 24px;}
        .mainnav{display:flex;gap:26px;margin:0 auto;}
        .navlink{font-size:14.5px;font-weight:500;padding-bottom:3px;white-space:nowrap;}
        .hdr-actions{display:flex;align-items:center;gap:12px;margin-left:auto;}
        .langtoggle{display:flex;border:1px solid var(--hairline);border-radius:999px;overflow:hidden;font-weight:600;}
        .theme-toggle{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;
          border-radius:999px;border:1px solid var(--hairline);background:transparent;color:var(--ink);
          cursor:pointer;font-size:19px;transition:background .15s ease;}
        .theme-toggle:hover{background:var(--surface-2);}
        @media (max-width:820px){
          .hdr{flex-wrap:wrap;gap:10px 14px;padding:11px 18px;}
          .hdr-logo{order:1;}
          .hdr-actions{order:2;margin-left:auto;}
          .mainnav{order:3;width:100%;margin:0;justify-content:center;gap:18px;
            overflow-x:auto;padding:9px 0 2px;border-top:1px solid var(--hairline-soft);
            -webkit-overflow-scrolling:touch;}
        }
        @media (max-width:420px){
          .mainnav{gap:14px;justify-content:flex-start;}
          .navlink{font-size:13.5px;}
        }
      `}</style>
    </header>
  )
}
