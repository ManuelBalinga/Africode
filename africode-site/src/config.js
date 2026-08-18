// Central config — edit these values, nothing else needs to change.

export const CONTACT = {
  email: 'africodestudios@gmail.com',
  // Primary WhatsApp number the questionnaire and buttons hand off to (Ghana).
  whatsappPrimary: '233550456626',
  whatsappGhana: '233550456626',
  whatsappCameroon: '237692092192',
  whatsappGhanaDisplay: '+233 55 045 6626',
  whatsappCameroonDisplay: '+237 692 092 192',
}

// Packages shown on the Pricing page and recommended by the questionnaire.
// Prices are indicative (USD); the questionnaire recommends a package rather
// than quoting a hard number while pricing is being reviewed.
export const PACKAGES = {
  starter: { key: 'starter', priceUSD: 40 },
  business: { key: 'business', priceUSD: 90 },
  store: { key: 'store', priceUSD: 120 },
  custom: { key: 'custom', priceUSD: null }, // quoted per project
}

// Google Form sink — the questionnaire POSTs answers here so they land in a
// Sheet in your Drive (analytics + Excel). Leave FORM_ACTION empty and the app
// still works: it just skips the save and only does the WhatsApp handoff.
// Setup: create one Google Form, then paste its formResponse URL and the
// entry IDs (from the pre-filled-link trick) below. See SETUP-GOOGLE-FORM.md.
export const LEAD_FORM = {
  FORM_ACTION: '', // e.g. https://docs.google.com/forms/d/e/XXXX/formResponse
  ENTRY: {
    // questionnaireField: 'entry.123456789'
    businessName: '',
    industry: '',
    country: '',
    contactName: '',
    phone: '',
    email: '',
    budget: '',
    recommendedPackage: '',
    answersSummary: '',
  },
}
