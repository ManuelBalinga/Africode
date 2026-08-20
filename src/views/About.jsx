'use client'

import Link from 'next/link'
import PageHero from '../components/PageHero'
import { useI18n } from '../i18n/I18nContext'
import { usePageMeta } from '../lib/usePageMeta'

export default function About() {
  const { t } = useI18n()
  usePageMeta(t('seo.about.t'), t('seo.about.d'))
  const values = [
    { icon: 'ti-receipt', t: t('about.v1t'), d: t('about.v1d') },
    { icon: 'ti-key', t: t('about.v2t'), d: t('about.v2d') },
    { icon: 'ti-device-mobile', t: t('about.v3t'), d: t('about.v3d') },
    { icon: 'ti-language', t: t('about.v4t'), d: t('about.v4d') },
  ]
  return (
    <>
      <PageHero kicker={t('about.kicker')} title={t('about.h1')} intro={t('about.lede')} />

      <section className="band">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <h2 className="sec-h2" style={{ marginBottom: 18 }}>{t('about.storyH')}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 17, marginBottom: 16 }}>{t('about.story1')}</p>
          <p style={{ color: 'var(--muted)', fontSize: 17 }}>{t('about.story2')}</p>
        </div>
      </section>

      <section className="band band-light">
        <div className="wrap">
          <h2 className="sec-h2" style={{ marginBottom: 32 }}>{t('about.valuesH')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18 }}>
            {values.map((v) => (
              <div key={v.t} style={{ background: 'var(--surface)', border: '0.5px solid var(--hairline)', borderRadius: 'var(--radius)', padding: '24px 22px' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, background: 'var(--blue-tint)', color: 'var(--blue-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                }}><i className={`ti ${v.icon}`} style={{ fontSize: 24 }} aria-hidden="true" /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, margin: '0 0 6px' }}>{v.t}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 15, margin: 0 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 620 }}>
          <h2 className="sec-h2" style={{ marginBottom: 10 }}>{t('about.ctaH')}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 17, marginBottom: 26 }}>{t('about.ctaP')}</p>
          <Link href="/start" className="btn btn-amber btn-lg">{t('nav.start')}</Link>
        </div>
      </section>
    </>
  )
}
