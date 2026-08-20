'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useI18n } from '../i18n/I18nContext'
import { CONTACT } from '../config'

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: 'var(--hero)', color: '#fff', padding: '52px 0 40px' }}>
      <div className="wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 36 }}>
          <div style={{ maxWidth: 320 }}>
            <Logo light />
            <p style={{ color: 'var(--dark-muted)', fontSize: 15, marginTop: 14 }}>{t('footer.tag')}</p>
          </div>
          <div>
            <h4 style={footHead}>{t('footer.explore')}</h4>
            <FootLink to="/what-we-build">{t('nav.build')}</FootLink>
            <FootLink to="/work">{t('nav.work')}</FootLink>
            <FootLink to="/pricing">{t('nav.pricing')}</FootLink>
            <FootLink to="/about">{t('nav.about')}</FootLink>
            <FootLink to="/start">{t('nav.start')}</FootLink>
          </div>
          <div>
            <h4 style={footHead}>{t('footer.contact')}</h4>
            <a href={`mailto:${CONTACT.email}`} style={footA}>{CONTACT.email}</a>
            <a href={`https://wa.me/${CONTACT.whatsappGhana}`} target="_blank" rel="noopener" style={footA}>WhatsApp · {CONTACT.whatsappGhanaDisplay}</a>
            <a href={`https://wa.me/${CONTACT.whatsappCameroon}`} target="_blank" rel="noopener" style={footA}>WhatsApp · {CONTACT.whatsappCameroonDisplay}</a>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid var(--dark-line)', paddingTop: 22, display: 'flex',
          flexWrap: 'wrap', justifyContent: 'space-between', gap: 12,
          color: 'var(--dark-muted-2)', fontSize: 13.5,
        }}>
          <span>© {year} Africode Studios. {t('footer.rights')}</span>
          <span>🌍 {t('footer.based')}</span>
        </div>
      </div>
    </footer>
  )
}

const footHead = {
  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark-muted-2)', margin: '0 0 14px',
}
const footA = { display: 'block', color: 'var(--dark-muted)', fontSize: 15, marginBottom: 10 }

function FootLink({ to, children }) {
  return <Link href={to} style={footA}>{children}</Link>
}
