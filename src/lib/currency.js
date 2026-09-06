// Currency + country handling. Rates are approximate (per 1 USD) and easy to
// edit here. Used to show budgets and prices in the visitor's local currency.
//
// RATES LAST CHECKED: 6 September 2026 (mid-market).
// Re-check every few months — a stale rate quietly changes your prices. GHS in
// particular drifted from 15 to ~11.75, which had been overstating Ghana prices
// by roughly 30%. XAF and XOF are pegged to the euro (655.957 per 1 EUR), so
// derive them from the EUR rate rather than quoting them separately.

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, pos: 'before' },
  GHS: { symbol: 'GH₵', rate: 11.75, pos: 'before' },
  XAF: { symbol: 'FCFA', rate: 564.6, pos: 'after' },
  XOF: { symbol: 'CFA', rate: 564.6, pos: 'after' },
  NGN: { symbol: '₦', rate: 1365, pos: 'before' },
  KES: { symbol: 'KSh', rate: 129.4, pos: 'before' },
  ZAR: { symbol: 'R', rate: 15.97, pos: 'before' },
  EUR: { symbol: '€', rate: 0.861, pos: 'before' },
  GBP: { symbol: '£', rate: 0.744, pos: 'before' },
  CAD: { symbol: 'C$', rate: 1.40, pos: 'before' },
}

// Countries offered at the start of the questionnaire, each mapped to a currency.
export const COUNTRIES = [
  { code: 'GH', cur: 'GHS', en: 'Ghana', fr: 'Ghana' },
  { code: 'CM', cur: 'XAF', en: 'Cameroon', fr: 'Cameroun' },
  { code: 'NG', cur: 'NGN', en: 'Nigeria', fr: 'Nigéria' },
  { code: 'CI', cur: 'XOF', en: 'Côte d’Ivoire', fr: 'Côte d’Ivoire' },
  { code: 'SN', cur: 'XOF', en: 'Senegal', fr: 'Sénégal' },
  { code: 'KE', cur: 'KES', en: 'Kenya', fr: 'Kenya' },
  { code: 'ZA', cur: 'ZAR', en: 'South Africa', fr: 'Afrique du Sud' },
  { code: 'FR', cur: 'EUR', en: 'France', fr: 'France' },
  { code: 'GB', cur: 'GBP', en: 'United Kingdom', fr: 'Royaume-Uni' },
  { code: 'US', cur: 'USD', en: 'United States', fr: 'États-Unis' },
  { code: 'CA', cur: 'CAD', en: 'Canada', fr: 'Canada' },
  { code: 'OTHER', cur: 'USD', en: 'Another country', fr: 'Un autre pays' },
]

// Featured as quick-pick buttons; the rest live in a dropdown.
export const FEATURED_COUNTRIES = ['GH', 'CM', 'NG']

export function countryName(code, lang = 'en') {
  const c = COUNTRIES.find((x) => x.code === code)
  return c ? (c[lang] || c.en) : code || ''
}

export function currencyForCountry(code) {
  const c = COUNTRIES.find((x) => x.code === code)
  return c ? c.cur : 'USD'
}

function roundNice(n) {
  if (n < 50) return Math.round(n / 5) * 5
  if (n < 500) return Math.round(n / 10) * 10
  if (n < 5000) return Math.round(n / 50) * 50
  if (n < 50000) return Math.round(n / 500) * 500
  return Math.round(n / 1000) * 1000
}

// `lang` matters: French uses a space as the thousands separator, so an
// en-US "22,500 FCFA" reads as twenty-two point five to a French speaker.
export function formatMoney(usd, curCode = 'USD', lang = 'en') {
  const c = CURRENCIES[curCode] || CURRENCIES.USD
  const amt = roundNice(usd * c.rate).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')
  return c.pos === 'after' ? `${amt} ${c.symbol}` : `${c.symbol}${amt}`
}

const BUDGET_THRESHOLDS = {
  u100: { max: 100 },
  '100_300': { min: 100, max: 300 },
  '300_700': { min: 300, max: 700 },
  '700_1500': { min: 700, max: 1500 },
  o1500: { min: 1500 },
}

// Auto-detect the visitor's country from their timezone — no network call and
// no location permission needed. Falls back to null (→ USD) when unknown.
const TZ_TO_COUNTRY = {
  'Africa/Accra': 'GH', 'Africa/Douala': 'CM', 'Africa/Lagos': 'NG',
  'Africa/Abidjan': 'CI', 'Africa/Dakar': 'SN', 'Africa/Nairobi': 'KE',
  'Africa/Johannesburg': 'ZA', 'Europe/Paris': 'FR', 'Europe/London': 'GB',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Montreal': 'CA',
}

export function detectCurrency() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const country = TZ_TO_COUNTRY[tz]
    if (country) return currencyForCountry(country)
    if (tz && tz.startsWith('America/')) return 'USD'
  } catch { /* ignore */ }
  return 'USD'
}

// Currencies offered in the pricing-page switcher, in display order.
export const CURRENCY_ORDER = ['USD', 'GHS', 'XAF', 'XOF', 'NGN', 'KES', 'ZAR', 'EUR', 'GBP', 'CAD']

// Localised label for a budget band, e.g. "GH₵4,500 – GH₵10,500".
export function budgetLabel(value, curCode = 'USD', lang = 'en') {
  if (value === 'unsure') return lang === 'fr' ? 'Pas encore sûr(e) — à discuter' : 'Not sure yet — let’s discuss'
  const b = BUDGET_THRESHOLDS[value]
  if (!b) return value
  const lo = b.min != null ? formatMoney(b.min, curCode, lang) : null
  const hi = b.max != null ? formatMoney(b.max, curCode, lang) : null
  if (lo && hi) return `${lo} – ${hi}`
  if (hi) return (lang === 'fr' ? 'Moins de ' : 'Under ') + hi
  return (lang === 'fr' ? 'Plus de ' : 'More than ') + lo
}
