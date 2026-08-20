import { CONTACT, LEAD_FORM } from '../config'
import { getIndustry } from './industries'
import { buildQuestions } from './questions'
import { packages } from '../data/packages'
import { countryName } from '../lib/currency'

// Human-readable summary of the answers, used in the WhatsApp message and
// saved to the Google Sheet.
export function buildSummary(module, answers, lang = 'en') {
  const questions = buildQuestions(module)
  const lines = []
  for (const q of questions) {
    const a = answers[q.id]
    if (a == null || a === '' || (Array.isArray(a) && a.length === 0)) continue
    const label = q[lang] || q.en
    let value
    if (q.options) {
      const values = Array.isArray(a) ? a : [a]
      value = values.map((v) => {
        const opt = q.options.find((o) => o.value === v)
        return opt ? (opt[lang] || opt.en) : v
      }).join(', ')
    } else {
      value = a
    }
    lines.push(`• ${label}\n   ${value}`)
  }
  return lines.join('\n')
}

// The message that opens in WhatsApp, ready for the client to send to the team.
export function buildWhatsAppMessage(module, answers, pkgKey, lang = 'en') {
  const ind = getIndustry(answers.industry)
  const indName = ind ? (ind[lang] || ind.en) : answers.industry
  const pkgName = packages[pkgKey]?.[lang]?.name || pkgKey
  const head = lang === 'fr'
    ? `Bonjour Africode Studios ! Voici les détails de mon projet :`
    : `Hi Africode Studios! Here are my project details:`
  const recLine = lang === 'fr' ? `Recommandation : ${pkgName}` : `Suggested package: ${pkgName}`
  const industryLine = lang === 'fr' ? `Secteur : ${indName}` : `Industry: ${indName}`
  const countryLine = answers.country
    ? (lang === 'fr' ? `Pays : ${countryName(answers.country, 'fr')}\n` : `Country: ${countryName(answers.country, 'en')}\n`)
    : ''
  return `${head}\n\n${countryLine}${industryLine}\n${recLine}\n\n${buildSummary(module, answers, lang)}`
}

// Fire-and-forget save to the linked Google Form → Sheet. No-op until the
// form is configured in config.js. Uses no-cors so it works from the browser.
export function saveToGoogleForm(module, answers, pkgKey, lang = 'en') {
  const { FORM_ACTION, ENTRY } = LEAD_FORM
  if (!FORM_ACTION) return Promise.resolve(false)
  const ind = getIndustry(answers.industry)
  const data = {
    businessName: answers.businessName || '',
    industry: ind ? ind.en : answers.industry || '',
    country: countryName(answers.country, 'en'),
    contactName: answers.contactName || '',
    phone: answers.phone || '',
    email: answers.email || '',
    budget: labelOf(module, 'budget', answers.budget, 'en'),
    recommendedPackage: packages[pkgKey]?.en?.name || pkgKey,
    answersSummary: buildSummary(module, answers, 'en'),
  }
  const body = new FormData()
  let mapped = false
  for (const [field, entryId] of Object.entries(ENTRY)) {
    if (entryId && data[field] != null) { body.append(entryId, data[field]); mapped = true }
  }
  if (!mapped) return Promise.resolve(false)
  return fetch(FORM_ACTION, { method: 'POST', mode: 'no-cors', body })
    .then(() => true)
    .catch(() => false)
}

// Map an option value back to its readable label for one question.
function labelOf(module, id, value, lang = 'en') {
  if (!value) return ''
  const q = buildQuestions(module).find((q) => q.id === id)
  const opt = q?.options?.find((o) => o.value === value)
  return opt ? (opt[lang] || opt.en) : value
}

export function whatsappHref(message) {
  return `https://wa.me/${CONTACT.whatsappPrimary}?text=${encodeURIComponent(message)}`
}
