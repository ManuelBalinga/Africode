'use client'

import Link from 'next/link'
import { useI18n } from '../i18n/I18nContext'
import { usePageMeta } from '../lib/usePageMeta'
import { waLink } from '../lib/whatsapp'
import { projects } from '../data/projects'
import WorkCard from '../components/WorkCard'

export default function Home() {
  const { t } = useI18n()
  usePageMeta(t('seo.home.t'), t('seo.home.d'))

  return (
    <>
      {/* HERO (dark band) */}
      <section style={{ background: 'var(--hero)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div className="wrap" style={{ padding: '76px 24px 66px', position: 'relative', zIndex: 1 }}>
          <p style={{
            color: 'var(--blue)', fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', margin: '0 0 20px',
          }}>{t('home.eyebrow')}</p>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(40px,6.4vw,72px)', maxWidth: '15ch', margin: '0 0 22px', color: '#fff' }}>
            {t('home.h1a')}<span style={{ color: 'var(--blue)' }}>{t('home.h1b')}</span>
          </h1>
          <p style={{ fontSize: 'clamp(17px,2vw,20px)', color: 'var(--dark-muted)', maxWidth: '56ch', margin: '0 0 32px' }}>
            {t('home.lede')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 44 }}>
            <Link href="/start" className="btn btn-amber btn-lg">{t('home.cta1')}</Link>
            <Link href="/work" className="btn btn-ghost-dark btn-lg">{t('home.cta2')}</Link>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 620,
            border: '1px solid var(--dark-line)', borderRadius: 'var(--radius)', overflow: 'hidden',
          }}>
            <Stat n={t('home.stat1n')} l={t('home.stat1l')} color="var(--amber)" />
            <Stat n={t('home.stat2n')} l={t('home.stat2l')} color="var(--blue)" border />
            <Stat n={t('home.stat3n')} l={t('home.stat3l')} color="#fff" />
          </div>

          <div style={{
            marginTop: 26, fontSize: 15, fontWeight: 600, color: 'var(--dark-muted)',
            display: 'flex', flexWrap: 'wrap', gap: '8px 14px', alignItems: 'center',
          }}>
            <span>🌍</span>
            <span style={{ color: 'var(--blue)' }}>{t('common.ghana')}</span><span style={{ color: 'var(--dark-muted-2)' }}>·</span>
            <span style={{ color: 'var(--blue)' }}>{t('common.cameroon')}</span><span style={{ color: 'var(--dark-muted-2)' }}>·</span>
            <span style={{ color: 'var(--amber)' }}>{t('common.worldwide')}</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="band">
        <div className="wrap">
          <p className="kicker">{t('home.svcKicker')}</p>
          <h2 className="sec-h2">{t('home.svcH2')}</h2>
          <p className="sec-intro">{t('home.svcIntro')}</p>
          <div className="grid-3">
            <Card icon="world" tint="var(--blue)" title={t('home.svc1t')} desc={t('home.svc1d')} />
            <Card icon="cart" tint="var(--amber)" title={t('home.svc2t')} desc={t('home.svc2d')} />
            <Card icon="gear" tint="var(--blue)" title={t('home.svc3t')} desc={t('home.svc3d')} />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="band band-light">
        <div className="wrap">
          <p className="kicker kicker-blue">{t('home.procKicker')}</p>
          <h2 className="sec-h2">{t('home.procH2')}</h2>
          <p className="sec-intro">{t('home.procIntro')}</p>
          <div className="grid-3">
            <Step n="1" title={t('home.proc1t')} desc={t('home.proc1d')} />
            <Step n="2" title={t('home.proc2t')} desc={t('home.proc2d')} />
            <Step n="3" title={t('home.proc3t')} desc={t('home.proc3d')} />
          </div>
        </div>
      </section>

      {/* WORK */}
      <section className="band">
        <div className="wrap">
          <p className="kicker">{t('home.workKicker')}</p>
          <h2 className="sec-h2">{t('home.workH2')}</h2>
          <p className="sec-intro">{t('home.workIntro')}</p>
          <div className="grid-2">
            {projects.map((p) => <WorkCard key={p.name} project={p} />)}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="band band-light">
        <div className="wrap">
          <p className="kicker kicker-blue">{t('whyus.kicker')}</p>
          <h2 className="sec-h2">{t('whyus.h2')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 20, marginTop: 26 }}>
            {t('whyus.items').map((it) => (
              <div key={it.t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: 'var(--blue-tint)', color: 'var(--blue-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-check" style={{ fontSize: 22 }} aria-hidden="true" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, margin: '0 0 4px' }}>{it.t}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14.5, margin: 0 }}>{it.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="band">
        <div className="wrap">
          <p className="kicker">{t('testimonials.kicker')}</p>
          <h2 className="sec-h2">{t('testimonials.h2')}</h2>
          <div className="grid-3" style={{ marginTop: 26 }}>
            {t('testimonials.items').map((it, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '0.5px solid var(--line)', borderRadius: 'var(--radius)', padding: '26px 24px', display: 'flex', flexDirection: 'column' }}>
                <i className="ti ti-quote" style={{ fontSize: 30, color: 'var(--amber)', marginBottom: 8 }} aria-hidden="true" />
                <p style={{ color: 'var(--text)', fontSize: 15.5, lineHeight: 1.6, margin: '0 0 18px', flexGrow: 1 }}>{it.quote}</p>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{it.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>{it.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="band band-light">
        <div className="wrap">
          <div style={{
            background: 'linear-gradient(135deg,var(--blue-strong),var(--blue))', borderRadius: 24,
            padding: '48px 44px', display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 28,
          }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: 'clamp(26px,3.4vw,36px)', margin: '0 0 8px' }}>{t('home.ctaH2')}</h2>
              <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 17, maxWidth: '46ch', margin: 0 }}>{t('home.ctaP')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 'min(100%,290px)' }}>
              <Link href="/start" className="btn" style={{ background: '#fff', color: 'var(--charcoal)', width: '100%' }}>{t('home.ctaStart')}</Link>
              <a href={waLink(t('common.whatsappMsg'))} target="_blank" rel="noopener" className="btn" style={{
                background: 'rgba(255,255,255,.14)', color: '#fff', border: '1px solid rgba(255,255,255,.3)', width: '100%',
              }}>💬 {t('common.whatsapp')}</a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        .grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}
        @media (max-width:860px){.grid-3{grid-template-columns:1fr;}.grid-2{grid-template-columns:1fr;}}
      `}</style>
    </>
  )
}

function Stat({ n, l, color, border }) {
  return (
    <div style={{
      padding: '20px 18px', textAlign: 'center',
      borderLeft: border ? '1px solid var(--dark-line)' : 'none',
      borderRight: border ? '1px solid var(--dark-line)' : 'none',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 12.5, color: 'var(--dark-muted-2)', marginTop: 7 }}>{l}</div>
    </div>
  )
}

const icons = {
  world: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" /></>,
  cart: <><path d="M4 5h2l1.6 10.5a1.5 1.5 0 0 0 1.5 1.3h7.4a1.5 1.5 0 0 0 1.5-1.2L20.5 8H7" /><circle cx="10" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /></>,
  gear: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></>,
}

function Card({ icon, tint, title, desc }) {
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--hairline)', borderRadius: 'var(--radius)', padding: '26px 24px' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, background: 'rgba(0,0,0,.03)', border: '0.5px solid var(--hairline)', color: tint,
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[icon]}</svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, margin: '0 0 8px' }}>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: 15, margin: 0 }}>{desc}</p>
    </div>
  )
}

function Step({ n, title, desc }) {
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--hairline)', borderRadius: 'var(--radius)', padding: '26px 24px' }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: 'var(--amber)', color: 'var(--charcoal)',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>{n}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, margin: '0 0 8px' }}>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: 15, margin: 0 }}>{desc}</p>
    </div>
  )
}
