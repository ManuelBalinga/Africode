'use client'

import { useEffect, useRef, useState } from 'react'
import { CONTACT, PROMO } from '../config'
import { NICHES, GOALS, FEELS, COLOURS } from '../promo/niches'
import { getStatus, submitIntake, uploadPhoto, compressImage } from '../promo/api'
import { usePageMeta } from '../lib/usePageMeta'

const MAX_PHOTOS = 10
const EMPTY = {
  niche: '', businessName: '', about: '', city: '', offerings: '',
  contactName: '', whatsapp: '', email: '', address: '', hours: '',
  social: '', goal: '', feel: '', colours: [], different: '',
  consent: false, website: '', // `website` is a honeypot — real people leave it blank
}

export default function PromoIntake() {
  usePageMeta('Claim your free website | Africode Studios', 'Tell us about your business and we will build your website.')
  const [f, setF] = useState(EMPTY)
  const [status, setStatus] = useState(null) // null = loading
  const [photos, setPhotos] = useState([])
  const [logo, setLogo] = useState(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)
  const [showMissing, setShowMissing] = useState(false)
  const photoInput = useRef(null)

  useEffect(() => { getStatus().then(setStatus) }, [])

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const toggleColour = (v) => setF((x) => ({
    ...x, colours: x.colours.includes(v) ? x.colours.filter((c) => c !== v) : [...x.colours, v],
  }))

  async function addPhotos(files) {
    const room = MAX_PHOTOS - photos.length
    const picked = Array.from(files).filter((x) => x.type.startsWith('image/')).slice(0, room)
    setBusy('Preparing photos…')
    try {
      const out = []
      for (const file of picked) out.push({ ...(await compressImage(file)), preview: URL.createObjectURL(file) })
      setPhotos((p) => [...p, ...out])
    } catch {
      setError('One of those photos could not be read. Try a different one.')
    }
    setBusy('')
  }

  async function pickLogo(file) {
    if (!file) return
    try { setLogo({ ...(await compressImage(file)), preview: URL.createObjectURL(file) }) }
    catch { setError('That logo file could not be read. Try a PNG or JPG.') }
  }

  const missing = []
  if (!f.niche) missing.push('your business category')
  if (!f.businessName.trim()) missing.push('business name')
  if (!f.about.trim()) missing.push('what you sell or offer')
  if (!f.city.trim()) missing.push('city / area')
  if (!f.offerings.trim()) missing.push('products or services with prices')
  if (photos.length < 3) missing.push('at least 3 photos')
  if (!f.contactName.trim()) missing.push('your name')
  if (!f.whatsapp.trim()) missing.push('WhatsApp number')
  if (!f.goal) missing.push('main goal of the site')
  if (!f.feel) missing.push('the feel you want')
  if (!f.consent) missing.push('the consent box')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (missing.length) { setShowMissing(true); return }
    setBusy('Sending your details…')
    const res = await submitIntake({
      ...f,
      colours: f.colours.join(', '),
      photoCount: photos.length,
      hasLogo: !!logo,
    })
    if (!res.ok) {
      setBusy('')
      setError(res.error === 'niche-taken' ? 'That category has just been taken. Please pick another one.'
        : res.error === 'full' ? 'All the spots have been filled. Message us on WhatsApp and we will put you on the waiting list.'
        : 'Something went wrong sending your details. Check your connection and try again.')
      if (res.error === 'niche-taken' || res.error === 'full') getStatus().then(setStatus)
      return
    }
    const queue = [...(logo ? [['logo', logo]] : []), ...photos.map((p) => ['photo', p])]
    let failed = 0
    for (let i = 0; i < queue.length; i++) {
      setBusy(`Uploading photo ${i + 1} of ${queue.length}…`)
      const r = await uploadPhoto(res.id, queue[i][0], queue[i][1])
      if (!r.ok) failed++
    }
    setBusy('')
    setDone({ id: res.id, failed })
  }

  if (done) return <Shell><Done done={done} name={f.businessName} /></Shell>

  if (status && status.ok && status.used >= status.total) {
    return (
      <Shell>
        <h1 style={h1}>All 10 spots are filled</h1>
        <p style={lead}>Thank you for the interest. Message us on WhatsApp and we will add you to the waiting list.</p>
        <a className="btn btn-wa btn-lg" href={`https://wa.me/${CONTACT.whatsappPrimary}`} target="_blank" rel="noopener">Message us on WhatsApp</a>
      </Shell>
    )
  }

  const taken = status?.ok ? status.taken : []
  const left = status?.ok ? status.total - status.used : null

  return (
    <Shell>
      <h1 style={h1}>Claim your free website</h1>
      <p style={lead}>
        This takes about 5 minutes. Answer what you can. We build the rest.
        {left != null && <strong style={{ color: 'var(--amber)' }}> {left} of {status.total} spots left.</strong>}
      </p>

      {status && !status.ok && (
        <Notice tone="warn">We could not check the spots just now. You can still fill in the form below.</Notice>
      )}

      <form onSubmit={onSubmit} noValidate>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.website}
          onChange={(e) => set('website', e.target.value)}
          style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }} aria-hidden="true" />

        <Section n="1" title="Your business">
          <Field label="What kind of business is it?" required>
            <select value={f.niche} onChange={(e) => set('niche', e.target.value)} style={input}>
              <option value="">Select your category</option>
              {NICHES.map((n) => (
                <option key={n.key} value={n.key} disabled={taken.includes(n.key)}>
                  {n.label}{taken.includes(n.key) ? ' (spot filled)' : ''}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Business name" required>
            <input value={f.businessName} onChange={(e) => set('businessName', e.target.value)} style={input} />
          </Field>
          <Field label="What do you sell or offer?" required help="Two or three sentences is plenty.">
            <textarea rows={3} value={f.about} onChange={(e) => set('about', e.target.value)} style={input} />
          </Field>
          <Field label="City and area you serve" required>
            <input value={f.city} onChange={(e) => set('city', e.target.value)} style={input} placeholder="e.g. Accra, East Legon" />
          </Field>
          <Field label="What makes you different?" help="Optional. Why do customers pick you?">
            <textarea rows={2} value={f.different} onChange={(e) => set('different', e.target.value)} style={input} />
          </Field>
        </Section>

        <Section n="2" title="What you sell, with prices">
          <Field label="List your products or services with prices" required help="Type or paste it. One per line, like: Box braids – GHS 250.">
            <textarea rows={6} value={f.offerings} onChange={(e) => set('offerings', e.target.value)} style={input} />
          </Field>
        </Section>

        <Section n="3" title="Photos">
          <Field label={`Your best photos (3 to ${MAX_PHOTOS})`} required help="Clear, in daylight, of your work or products. We shrink them for you, so phone photos are fine.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(92px,1fr))', gap: 10 }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '0.5px solid var(--hairline)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setPhotos((x) => x.filter((_, j) => j !== i))} aria-label="Remove photo"
                    style={{ position: 'absolute', top: 4, right: 4, width: 26, height: 26, borderRadius: '50%', border: 0, background: 'rgba(0,0,0,.65)', color: '#fff', cursor: 'pointer' }}>×</button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button type="button" onClick={() => photoInput.current?.click()} style={{
                  aspectRatio: '1', borderRadius: 10, border: '1.5px dashed var(--hairline)', background: 'var(--surface)',
                  color: 'var(--muted)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                }}>+ Add photos</button>
              )}
            </div>
            <input ref={photoInput} type="file" accept="image/*" multiple hidden
              onChange={(e) => { addPhotos(e.target.files); e.target.value = '' }} />
          </Field>
          <Field label="Your logo" help="Optional. If you do not have one, we will make a simple one.">
            {logo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.preview} alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 8, background: '#fff' }} />
                <button type="button" className="btn btn-ghost-light btn-sm" onClick={() => setLogo(null)}>Remove</button>
              </div>
            ) : (
              <input type="file" accept="image/*" onChange={(e) => pickLogo(e.target.files[0])} />
            )}
          </Field>
        </Section>

        <Section n="4" title="How people reach you">
          <Field label="Your name" required>
            <input value={f.contactName} onChange={(e) => set('contactName', e.target.value)} style={input} />
          </Field>
          <Field label="WhatsApp number" required help="Customers will message this number from your site. Include the country code.">
            <input type="tel" value={f.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} style={input} placeholder="+233 …" />
          </Field>
          <Field label="Email" help="Optional.">
            <input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} style={input} />
          </Field>
          <Field label="Opening hours" help="Optional.">
            <input value={f.hours} onChange={(e) => set('hours', e.target.value)} style={input} placeholder="e.g. Mon–Sat, 9am–7pm" />
          </Field>
          <Field label="Shop address" help="Optional. Leave blank if you work from home or online.">
            <input value={f.address} onChange={(e) => set('address', e.target.value)} style={input} />
          </Field>
          <Field label="Instagram, Facebook or TikTok link" help="Optional. We can pull extra details from it.">
            <input value={f.social} onChange={(e) => set('social', e.target.value)} style={input} />
          </Field>
        </Section>

        <Section n="5" title="Goal and look">
          <Field label="What should the website mainly do?" required>
            <Chips options={GOALS} value={f.goal} onPick={(v) => set('goal', v)} />
          </Field>
          <Field label="What feel do you want?" required>
            <Chips options={FEELS} value={f.feel} onPick={(v) => set('feel', v)} />
          </Field>
          <Field label="Colours" help="Pick any that you like.">
            <Chips options={COLOURS} value={f.colours} multi onPick={toggleColour} />
          </Field>
        </Section>

        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', margin: '8px 0 24px', fontSize: 15, cursor: 'pointer' }}>
          <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} style={{ marginTop: 4, width: 18, height: 18 }} />
          <span>
            I own these photos and details and have the right to use them. I agree that Africode Studios may show my
            website in its portfolio. I understand that spots are limited and approved by Africode.
          </span>
        </label>

        {showMissing && missing.length > 0 && (
          <Notice tone="warn">Still needed: {missing.join(', ')}.</Notice>
        )}
        {error && <Notice tone="error">{error}</Notice>}

        <button className="btn btn-amber btn-lg" type="submit" disabled={!!busy} style={{ width: '100%', opacity: busy ? 0.7 : 1 }}>
          {busy || 'Claim my free website'}
        </button>
        <p style={{ fontSize: 13, color: 'var(--muted-2)', textAlign: 'center', marginTop: 12 }}>
          We will message you on WhatsApp to confirm your spot.
        </p>
      </form>
    </Shell>
  )
}

function Done({ done, name }) {
  const msg = `Hi Africode Studios! I just submitted my details for the free website promo${name ? ` (${name})` : ''}. Reference: ${done.id}`
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 44, marginBottom: 10 }} aria-hidden="true">✓</div>
      <h1 style={h1}>Thank you, we have your details</h1>
      <p style={lead}>
        We will message you on WhatsApp shortly to confirm your spot. Your reference is <strong>{done.id}</strong>.
      </p>
      {done.failed > 0 && (
        <Notice tone="warn">{done.failed} photo{done.failed > 1 ? 's' : ''} did not upload. Please send them to us on WhatsApp.</Notice>
      )}
      <a className="btn btn-wa btn-lg" target="_blank" rel="noopener"
        href={`https://wa.me/${CONTACT.whatsappPrimary}?text=${encodeURIComponent(msg)}`}>
        Message us on WhatsApp
      </a>
    </div>
  )
}

function Shell({ children }) {
  return (
    <section className="band">
      <div className="wrap" style={{ maxWidth: 680 }}>{children}</div>
    </section>
  )
}

function Section({ n, title, children }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: '0 0 34px' }}>
      <legend style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 16, padding: 0 }}>
        <span style={{ color: 'var(--amber)', marginRight: 8 }}>{n}</span>{title}
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
    </fieldset>
  )
}

function Field({ label, help, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: help ? 2 : 8 }}>
        {label}{required && <span style={{ color: 'var(--amber)' }}> *</span>}
      </label>
      {help && <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 8px' }}>{help}</p>}
      {children}
    </div>
  )
}

function Chips({ options, value, multi, onPick }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {options.map((o) => {
        const active = multi ? value.includes(o.value) : value === o.value
        return (
          <button type="button" key={o.value} onClick={() => onPick(o.value)} aria-pressed={active} style={{
            padding: '10px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 14.5, fontWeight: 500,
            background: active ? 'var(--blue)' : 'var(--surface)', color: active ? '#fff' : 'var(--ink)',
            border: active ? '2px solid var(--blue)' : '0.5px solid var(--hairline)',
          }}>{o.label}</button>
        )
      })}
    </div>
  )
}

function Notice({ tone, children }) {
  const c = tone === 'error' ? '#e5484d' : 'var(--amber)'
  return (
    <p role={tone === 'error' ? 'alert' : undefined} style={{
      margin: '0 0 16px', padding: '12px 14px', borderRadius: 10, fontSize: 14.5,
      border: `1px solid ${c}`, background: 'var(--surface)',
    }}>{children}</p>
  )
}

const h1 = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px,4vw,38px)', margin: '0 0 10px' }
const lead = { color: 'var(--muted)', fontSize: 17, margin: '0 0 28px' }
const input = {
  width: '100%', padding: '13px 15px', fontSize: 16, fontFamily: 'var(--font-body)',
  border: '0.5px solid var(--hairline)', borderRadius: 10, background: 'var(--surface)', color: 'var(--ink)',
}
