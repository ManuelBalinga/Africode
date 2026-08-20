'use client'

import Link from 'next/link'
import PageHero from '../components/PageHero'
import { useI18n } from '../i18n/I18nContext'
import { usePageMeta } from '../lib/usePageMeta'

const ICONS = ['ti-world', 'ti-shopping-cart', 'ti-code', 'ti-device-mobile', 'ti-server-2', 'ti-trending-up']

export default function Services() {
  const { t } = useI18n()
  usePageMeta(t('seo.services.t'), t('seo.services.d'))
  const items = t('svcpage.items')

  return (
    <>
      <PageHero kicker={t('home.svcKicker')} title={t('home.svcH2')} intro={t('home.svcIntro')} />

      <section className="band">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
            {items.map((it, i) => (
              <div key={it.t} style={{ background: 'var(--surface)', border: '0.5px solid var(--line)', borderRadius: 'var(--radius)', padding: '28px 26px' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16, background: i % 2 ? 'rgba(239,159,39,0.13)' : 'rgba(55,138,221,0.13)',
                  color: i % 2 ? 'var(--amber-strong)' : 'var(--blue-strong)',
                }}>
                  <i className={`ti ${ICONS[i]}`} style={{ fontSize: 25 }} aria-hidden="true" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, margin: '0 0 8px' }}>{it.t}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}>{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-light">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 620 }}>
          <h2 className="sec-h2" style={{ marginBottom: 10 }}>{t('svcpage.ctaH')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, marginBottom: 26 }}>{t('svcpage.ctaP')}</p>
          <Link href="/start" className="btn btn-amber btn-lg">{t('nav.start')}</Link>
        </div>
      </section>
    </>
  )
}
