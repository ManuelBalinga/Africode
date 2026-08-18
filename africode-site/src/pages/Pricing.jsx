import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { useI18n } from '../i18n/I18nContext'
import { packages, packageOrder } from '../data/packages'
import { formatMoney, detectCurrency, CURRENCY_ORDER, CURRENCIES } from '../lib/currency'
import { waLink } from '../lib/whatsapp'
import { usePageMeta } from '../lib/usePageMeta'

function initialCurrency() {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem('africode-currency')
    if (saved && CURRENCIES[saved]) return saved
  }
  return detectCurrency()
}

export default function Pricing() {
  const { t, lang } = useI18n()
  usePageMeta(t('seo.pricing.t'), t('seo.pricing.d'))
  const [currency, setCurrency] = useState(initialCurrency)

  function changeCurrency(c) {
    setCurrency(c)
    window.localStorage.setItem('africode-currency', c)
  }

  return (
    <>
      <PageHero kicker={t('pricing.kicker')} title={t('pricing.h1')} intro={t('pricing.intro')} />

      <section className="band">
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 30 }}>
            <label htmlFor="cur" style={{ fontSize: 14.5, color: 'var(--text-muted)' }}>{t('pricing.currencyLabel')}</label>
            <select id="cur" value={currency} onChange={(e) => changeCurrency(e.target.value)} style={{
              padding: '9px 13px', fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 600,
              border: '0.5px solid var(--line)', borderRadius: 10, background: 'var(--surface)', color: 'var(--text)',
            }}>
              {CURRENCY_ORDER.map((c) => <option key={c} value={c}>{c} ({CURRENCIES[c].symbol})</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
            {packageOrder.map((key) => {
              const p = packages[key]
              const copy = p[lang] || p.en
              const featured = key === 'business'
              const isCustom = key === 'custom'
              return (
                <div key={key} style={{
                  background: 'var(--surface)', borderRadius: 16, padding: '28px 26px',
                  border: featured ? '2px solid var(--blue)' : '0.5px solid var(--line)',
                  display: 'flex', flexDirection: 'column', position: 'relative',
                }}>
                  {featured && (
                    <span style={{
                      position: 'absolute', top: -12, left: 26, background: 'var(--blue)', color: '#fff',
                      fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999,
                    }}>{t('pricing.mostPopular')}</span>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, margin: '0 0 4px' }}>{copy.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14.5, margin: '0 0 16px' }}>{copy.tag}</p>

                  <div style={{ marginBottom: 16 }}>
                    {isCustom ? (
                      <>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('pricing.customFrom')} </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30 }}>{formatMoney(p.priceFromUSD, currency)}</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('pricing.from')} </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34 }}>{formatMoney(p.priceUSD, currency)}</span>
                      </>
                    )}
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: 14.5, margin: '0 0 16px' }}>
                    {isCustom ? t('pricing.customNote') : copy.for}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 10, flexGrow: 1 }}>
                    {copy.includes.map((f) => (
                      <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5 }}>
                        <i className="ti ti-check" style={{ color: 'var(--blue)', fontSize: 17, marginTop: 2, flexShrink: 0 }} aria-hidden="true" />{f}
                      </li>
                    ))}
                  </ul>

                  {isCustom ? (
                    <a href={waLink(t('common.whatsappMsg'))} target="_blank" rel="noopener" className="btn btn-ghost-light" style={{ width: '100%' }}>{t('pricing.talk')}</a>
                  ) : (
                    <Link to="/start" className={featured ? 'btn btn-blue' : 'btn btn-ghost-light'} style={{ width: '100%' }}>{t('pricing.choose')}</Link>
                  )}
                </div>
              )
            })}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 22, maxWidth: '70ch' }}>{t('pricing.note')}</p>
        </div>
      </section>

      <FAQ />
    </>
  )
}

function FAQ() {
  const { t } = useI18n()
  const items = t('pricing.faq')
  const [open, setOpen] = useState(0)
  return (
    <section className="band band-light">
      <div className="wrap" style={{ maxWidth: 780 }}>
        <h2 className="sec-h2" style={{ marginBottom: 28 }}>{t('pricing.faqH')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ background: 'var(--surface)', border: '0.5px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
                  padding: '18px 20px', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
                  fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-body)',
                }}>
                  {it.q}
                  <i className={`ti ti-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: 20, color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
                </button>
                {isOpen && <p style={{ padding: '0 20px 20px', margin: 0, color: 'var(--text-muted)', fontSize: 15.5, lineHeight: 1.65 }}>{it.a}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
