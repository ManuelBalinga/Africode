import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { industries, getIndustry } from '../questionnaire/industries'
import { buildQuestions } from '../questionnaire/questions'
import { recommend } from '../questionnaire/scoring'
import { buildWhatsAppMessage, whatsappHref, saveToGoogleForm } from '../questionnaire/submit'
import { packages } from '../data/packages'
import { COUNTRIES, FEATURED_COUNTRIES, countryName, currencyForCountry, formatMoney, budgetLabel } from '../lib/currency'
import { usePageMeta } from '../lib/usePageMeta'

export default function Start() {
  const { t, lang } = useI18n()
  usePageMeta(t('seo.start.t'), t('seo.start.d'))
  const [answers, setAnswers] = useState({})
  const [step, setStep] = useState(0)

  const module = answers.industry ? getIndustry(answers.industry).module : null
  const currency = currencyForCountry(answers.country)

  // Build the step list: country → industry → questions (grouped blocks collapse) → result.
  const steps = useMemo(() => {
    const s = [{ kind: 'country' }, { kind: 'industry' }]
    if (module) {
      const flat = buildQuestions(module)
      let i = 0
      while (i < flat.length) {
        const q = flat[i]
        if (!q.group) { s.push({ kind: 'question', q }); i++ }
        else {
          const g = q.group, group = []
          while (i < flat.length && flat[i].group === g) { group.push(flat[i]); i++ }
          s.push({ kind: 'group', group, groupName: g })
        }
      }
      s.push({ kind: 'result' })
    }
    return s
  }, [module])

  const current = steps[Math.min(step, steps.length - 1)]
  const progress = steps.length > 1 ? Math.round((step / (steps.length - 1)) * 100) : 0

  const set = (id, value) => setAnswers((a) => ({ ...a, [id]: value }))
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  function pickCountry(code) { setAnswers((a) => ({ ...a, country: code })); setStep(1) }
  function pickIndustry(key) { setAnswers((a) => ({ ...a, industry: key })); setStep(2) }
  function pickSingle(id, value) { set(id, value); setTimeout(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 150) }
  function toggleMulti(id, value) {
    setAnswers((a) => {
      const arr = Array.isArray(a[id]) ? a[id] : []
      return { ...a, [id]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
    })
  }

  const valid = isValid(current, answers)
  const isSingleQuestion = current.kind === 'question' && current.q.type === 'single'

  return (
    <>
      <section style={{ background: 'var(--hero)', color: '#fff' }}>
        <div className="wrap" style={{ padding: '30px 24px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)' }}>
              {lang === 'fr' ? 'Démarrer un projet' : 'Start a project'}
            </span>
            <span style={{ fontSize: 13, color: 'var(--dark-muted-2)' }}>{progress}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,.12)' }}>
            <div style={{ height: '100%', width: `${progress}%`, borderRadius: 999, background: 'var(--amber)', transition: 'width .3s ease' }} />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap" style={{ maxWidth: 760 }}>
          {current.kind === 'country' && <CountryStep lang={lang} selected={answers.country} onPick={pickCountry} />}

          {current.kind === 'industry' && <IndustryStep lang={lang} selected={answers.industry} onPick={pickIndustry} />}

          {current.kind === 'question' && (
            <QuestionStep q={current.q} lang={lang} answers={answers} currency={currency} onSingle={pickSingle} onToggle={toggleMulti} onText={set} />
          )}

          {current.kind === 'group' && (
            <GroupStep group={current.group} groupName={current.groupName} lang={lang} answers={answers} onSet={set} onToggle={toggleMulti} />
          )}

          {current.kind === 'result' && <ResultStep module={module} answers={answers} lang={lang} currency={currency} />}

          {current.kind !== 'industry' && current.kind !== 'country' && current.kind !== 'result' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 34 }}>
              {step > 0 ? <button className="btn btn-ghost-light" onClick={back}>← {lang === 'fr' ? 'Retour' : 'Back'}</button> : <span />}
              {isSingleQuestion ? <span /> : (
                <button className="btn btn-blue" disabled={!valid} onClick={next}
                  style={{ opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}>
                  {lang === 'fr' ? 'Continuer' : 'Continue'} →
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function StepTitle({ children, help }) {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px,3.4vw,32px)', margin: '0 0 8px' }}>{children}</h1>
      {help ? <p style={{ color: 'var(--muted)', fontSize: 16, margin: '0 0 26px' }}>{help}</p> : <div style={{ height: 26 }} />}
    </>
  )
}

function CountryStep({ lang, selected, onPick }) {
  const featured = FEATURED_COUNTRIES.map((c) => COUNTRIES.find((x) => x.code === c))
  const rest = COUNTRIES.filter((c) => !FEATURED_COUNTRIES.includes(c.code))
  return (
    <>
      <StepTitle help={lang === 'fr' ? 'Nous adaptons la devise et les questions à votre pays.' : 'We’ll adapt the currency and questions to your country.'}>
        {lang === 'fr' ? 'Où se trouve votre entreprise ?' : 'Where is your business based?'}
      </StepTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 18 }}>
        {featured.map((c) => (
          <button key={c.code} onClick={() => onPick(c.code)} style={{
            padding: '18px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: 16,
            background: selected === c.code ? 'var(--blue-tint)' : 'var(--surface)',
            border: selected === c.code ? '2px solid var(--blue)' : '0.5px solid var(--hairline)',
          }}>{c[lang] || c.en}</button>
        ))}
      </div>
      <label style={{ display: 'block', fontSize: 14.5, color: 'var(--muted)', marginBottom: 8 }}>
        {lang === 'fr' ? 'Ou choisissez un autre pays' : 'Or choose another country'}
      </label>
      <select value={selected && !FEATURED_COUNTRIES.includes(selected) ? selected : ''} onChange={(e) => e.target.value && onPick(e.target.value)} style={{ ...inputStyle, appearance: 'auto' }}>
        <option value="">{lang === 'fr' ? '— Sélectionnez —' : '— Select —'}</option>
        {rest.map((c) => <option key={c.code} value={c.code}>{c[lang] || c.en}</option>)}
      </select>
    </>
  )
}

function IndustryStep({ lang, selected, onPick }) {
  return (
    <>
      <StepTitle help={lang === 'fr' ? 'Choisissez le plus proche — les questions suivantes s’adaptent.' : 'Pick the closest — the next questions adapt to it.'}>
        {lang === 'fr' ? 'Dans quel secteur êtes-vous ?' : 'What kind of business do you run?'}
      </StepTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
        {industries.map((ind) => {
          const active = selected === ind.key
          return (
            <button key={ind.key} onClick={() => onPick(ind.key)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: '16px',
              borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              background: active ? 'var(--blue-tint)' : 'var(--surface)',
              border: active ? '2px solid var(--blue)' : '0.5px solid var(--hairline)',
            }}>
              <i className={`ti ${ind.icon}`} style={{ fontSize: 24, color: 'var(--blue-strong)' }} aria-hidden="true" />
              <span style={{ fontWeight: 600, fontSize: 15 }}>{ind[lang] || ind.en}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

function OptionButton({ active, isMulti, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 12,
      cursor: 'pointer', textAlign: 'left', width: '100%', fontSize: 16,
      background: active ? 'var(--blue-tint)' : 'var(--surface)',
      border: active ? '2px solid var(--blue)' : '0.5px solid var(--hairline)',
    }}>
      <span style={{
        width: 22, height: 22, flexShrink: 0, borderRadius: isMulti ? 6 : '50%',
        border: active ? '6px solid var(--blue)' : '2px solid var(--hairline)',
        background: active && isMulti ? 'var(--blue)' : 'var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13,
      }}>{active && isMulti ? '✓' : ''}</span>
      <span style={{ fontWeight: 500 }}>{children}</span>
    </button>
  )
}

function QuestionStep({ q, lang, answers, currency, onSingle, onToggle, onText }) {
  const label = q[lang] || q.en
  const help = q[lang === 'fr' ? 'frHelp' : 'enHelp']
  const optionLabel = (o) => (q.id === 'budget' ? budgetLabel(o.value, currency, lang) : (o[lang] || o.en))

  if (q.type === 'text') {
    const ph = q[lang === 'fr' ? 'placeholderFr' : 'placeholderEn'] || ''
    return (
      <>
        <StepTitle help={help}>{label}</StepTitle>
        {q.long
          ? <textarea value={answers[q.id] || ''} onChange={(e) => onText(q.id, e.target.value)} placeholder={ph} rows={5} style={inputStyle} />
          : <input value={answers[q.id] || ''} onChange={(e) => onText(q.id, e.target.value)} placeholder={ph} style={inputStyle} />}
      </>
    )
  }

  const isMulti = q.type === 'multi'
  const selected = answers[q.id]
  return (
    <>
      <StepTitle help={help}>{label}</StepTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {q.options.map((o) => (
          <OptionButton key={o.value} isMulti={isMulti}
            active={isMulti ? Array.isArray(selected) && selected.includes(o.value) : selected === o.value}
            onClick={() => isMulti ? onToggle(q.id, o.value) : onSingle(q.id, o.value)}>
            {optionLabel(o)}
          </OptionButton>
        ))}
      </div>
    </>
  )
}

const GROUP_TITLES = {
  design: { en: 'Style and branding', fr: 'Style et identité', helpEn: 'This helps us design something that feels like you.', helpFr: 'Cela nous aide à concevoir quelque chose qui vous ressemble.' },
  contact: { en: 'Your details', fr: 'Vos coordonnées', helpEn: 'Almost done — how do we reach you?', helpFr: 'Presque fini — comment vous joindre ?' },
}

function GroupStep({ group, groupName, lang, answers, onSet, onToggle }) {
  const meta = GROUP_TITLES[groupName] || { en: '', fr: '' }
  return (
    <>
      <StepTitle help={meta[lang === 'fr' ? 'helpFr' : 'helpEn']}>{meta[lang] || meta.en}</StepTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {group.map((q) => {
          const label = q[lang] || q.en
          const val = answers[q.id]
          return (
            <div key={q.id}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 10 }}>{label}</label>
              {q.type === 'text' && (
                q.long
                  ? <textarea value={val || ''} onChange={(e) => onSet(q.id, e.target.value)} placeholder={q[lang === 'fr' ? 'placeholderFr' : 'placeholderEn'] || ''} rows={3} style={inputStyle} />
                  : <input value={val || ''} onChange={(e) => onSet(q.id, e.target.value)} placeholder={q[lang === 'fr' ? 'placeholderFr' : 'placeholderEn'] || ''} style={inputStyle} />
              )}
              {q.type === 'multi' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {q.options.map((o) => {
                    const active = Array.isArray(val) && val.includes(o.value)
                    return (
                      <button key={o.value} onClick={() => onToggle(q.id, o.value)} style={{
                        padding: '10px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 14.5, fontWeight: 500,
                        background: active ? 'var(--blue)' : 'var(--surface)', color: active ? '#fff' : 'var(--ink)',
                        border: active ? '2px solid var(--blue)' : '0.5px solid var(--hairline)',
                      }}>{o[lang] || o.en}</button>
                    )
                  })}
                </div>
              )}
              {q.type === 'single' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {q.options.map((o) => (
                    <OptionButton key={o.value} isMulti={false} active={val === o.value} onClick={() => onSet(q.id, o.value)}>
                      {o[lang] || o.en}
                    </OptionButton>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function ResultStep({ module, answers, lang, currency }) {
  const { pkg } = useMemo(() => recommend(module, answers), [module, answers])
  const p = packages[pkg]
  const copy = p[lang] || p.en
  const msg = buildWhatsAppMessage(module, answers, pkg, lang)
  const isCustom = pkg === 'custom'

  useEffect(() => { saveToGoogleForm(module, answers, pkg, lang) }, [module, answers, pkg, lang])

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, background: 'var(--blue-tint)', color: 'var(--blue-strong)', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
        <i className="ti ti-sparkles" aria-hidden="true" /> {lang === 'fr' ? 'Notre recommandation' : 'Our recommendation'}
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px,4vw,40px)', margin: '0 0 6px' }}>{copy.name}</h1>
      <p style={{ color: 'var(--muted)', fontSize: 17, margin: '0 0 8px' }}>{copy.tag}</p>
      {!isCustom && p.priceUSD && (
        <p style={{ fontSize: 15, color: 'var(--muted-2)', margin: '0 0 24px' }}>
          {lang === 'fr' ? 'À partir de' : 'From'} <strong style={{ color: 'var(--ink)' }}>{formatMoney(p.priceUSD, currency)}</strong> · {lang === 'fr' ? 'prix confirmé après un échange rapide' : 'exact price confirmed after a quick chat'}
        </p>
      )}
      {isCustom && (
        <p style={{ fontSize: 15, color: 'var(--muted-2)', margin: '0 0 24px', maxWidth: '46ch', marginInline: 'auto' }}>
          {lang === 'fr' ? 'Votre projet est sur mesure — nous le cadrons ensemble et vous envoyons un devis dédié.' : 'Your project is a custom build — we’ll scope it together and send a dedicated quote.'}
        </p>
      )}

      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--hairline)', borderRadius: 16, padding: '26px 28px', textAlign: 'left', maxWidth: 460, margin: '0 auto 28px' }}>
        <p style={{ color: 'var(--muted)', fontSize: 15, margin: '0 0 18px' }}>{copy.for}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
          {copy.includes.map((f) => (
            <li key={f} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 15 }}>
              <i className="ti ti-check" style={{ color: 'var(--blue)', fontSize: 18, marginTop: 2 }} aria-hidden="true" />{f}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460, margin: '0 auto' }}>
        <a href={whatsappHref(msg)} target="_blank" rel="noopener" className="btn btn-wa btn-lg" style={{ width: '100%' }}>
          <i className="ti ti-brand-whatsapp" style={{ fontSize: 20 }} aria-hidden="true" />
          {lang === 'fr' ? 'Envoyer sur WhatsApp' : 'Send my answers on WhatsApp'}
        </a>
        <p style={{ fontSize: 13, color: 'var(--muted-2)', margin: 0 }}>
          {lang === 'fr' ? 'Vos réponses sont aussi enregistrées pour notre équipe.' : 'Your answers are also saved for our team to review.'}
        </p>
        <Link to="/" style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>{lang === 'fr' ? '← Retour à l’accueil' : '← Back to home'}</Link>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '13px 15px', fontSize: 16, fontFamily: 'var(--font-body)',
  border: '0.5px solid var(--hairline)', borderRadius: 10, background: 'var(--surface)', color: 'var(--ink)',
}

function isValid(step, answers) {
  if (!step) return false
  if (step.kind === 'country') return !!answers.country
  if (step.kind === 'industry') return !!answers.industry
  if (step.kind === 'question') {
    const q = step.q, a = answers[q.id]
    if (q.type === 'multi') return Array.isArray(a) && a.length > 0
    if (q.type === 'text') return !q.required || (typeof a === 'string' && a.trim().length > 0)
    return a != null
  }
  if (step.kind === 'group') {
    return step.group.every((q) => !q.required || (typeof answers[q.id] === 'string' && answers[q.id].trim().length > 0))
  }
  return true
}
