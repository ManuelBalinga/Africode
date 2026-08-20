// Question bank for the intake questionnaire.
// Flags on options drive the recommendation + custom-project detection
// (see scoring.js). "complex" options push a project toward a Custom quote.

const GOALS = {
  id: 'goals', type: 'multi',
  en: 'What do you want your website to do?', fr: 'Que voulez-vous que votre site fasse ?',
  enHelp: 'Pick everything that applies.', frHelp: 'Choisissez tout ce qui s’applique.',
  options: [
    { value: 'showcase', flags: ['catalogue'], en: 'Show my products or services', fr: 'Présenter mes produits ou services' },
    { value: 'credible', en: 'Look professional and build trust', fr: 'Paraître professionnel et inspirer confiance' },
    { value: 'sell', flags: ['sell'], en: 'Sell online and take payments', fr: 'Vendre en ligne et encaisser des paiements' },
    { value: 'bookings', flags: ['bookings'], en: 'Take bookings or appointments', fr: 'Recevoir des réservations ou rendez-vous' },
    { value: 'leads', flags: ['leads'], en: 'Get more enquiries and customers', fr: 'Obtenir plus de demandes et de clients' },
    { value: 'custom', flags: ['customtool'], en: 'A custom tool or app for my business', fr: 'Un outil ou une application sur mesure' },
  ],
}

const HAVE_NOW = {
  id: 'haveNow', type: 'single',
  en: 'What do you have online right now?', fr: 'Qu’avez-vous en ligne actuellement ?',
  options: [
    { value: 'nothing', en: 'Nothing yet', fr: 'Rien pour l’instant' },
    { value: 'social', en: 'Only social media (Instagram, WhatsApp…)', fr: 'Uniquement les réseaux sociaux (Instagram, WhatsApp…)' },
    { value: 'oldsite', en: 'A website I want replaced or improved', fr: 'Un site que je veux remplacer ou améliorer' },
  ],
}

// Launch timeline — asked of everyone, useful for sales prioritisation.
const TIMELINE = {
  id: 'timeline', type: 'single',
  en: 'When would you like to launch?', fr: 'Quand souhaitez-vous lancer ?',
  options: [
    { value: 'asap', en: 'As soon as possible', fr: 'Dès que possible' },
    { value: '1m', en: 'Within a month', fr: 'Dans un mois' },
    { value: '3m', en: 'In the next few months', fr: 'Dans les prochains mois' },
    { value: 'exploring', en: 'Just exploring for now', fr: 'Je me renseigne pour l’instant' },
  ],
}

// Budget — captured as a sales signal. Neutral wording (no "more is better"),
// realistic bands, and an easy opt-out. Carries NO flags, so it never changes
// the recommended package — the package stays needs-based.
const BUDGET = {
  id: 'budget', type: 'single',
  en: 'What budget do you have in mind for this project?', fr: 'Quel budget avez-vous en tête pour ce projet ?',
  enHelp: 'A rough range is fine — it just helps us tailor the plan. There’s no wrong answer.',
  frHelp: 'Une fourchette approximative suffit — cela nous aide à adapter le plan. Il n’y a pas de mauvaise réponse.',
  options: [
    { value: 'u100', en: 'Under $100', fr: 'Moins de 100 $' },
    { value: '100_300', en: '$100 – $300', fr: '100 – 300 $' },
    { value: '300_700', en: '$300 – $700', fr: '300 – 700 $' },
    { value: '700_1500', en: '$700 – $1,500', fr: '700 – 1 500 $' },
    { value: 'o1500', en: 'More than $1,500', fr: 'Plus de 1 500 $' },
    { value: 'unsure', en: 'Not sure yet — let’s discuss', fr: 'Pas encore sûr(e) — à discuter' },
  ],
}

// Style + branding — one grouped screen, drawn from the fashion intake form.
const DESIGN_BLOCK = [
  {
    id: 'style', type: 'multi', group: 'design',
    en: 'What style are you drawn to?', fr: 'Quel style vous attire ?',
    enHelp: 'Pick any that feel right — optional.', frHelp: 'Choisissez ce qui vous parle — facultatif.',
    options: [
      { value: 'minimal', en: 'Minimalist', fr: 'Minimaliste' },
      { value: 'bold', en: 'Bold', fr: 'Audacieux' },
      { value: 'elegant', en: 'Elegant', fr: 'Élégant' },
      { value: 'colourful', en: 'Colourful', fr: 'Coloré' },
      { value: 'luxury', en: 'Luxury', fr: 'Luxe' },
      { value: 'african', en: 'African-inspired', fr: 'Inspiration africaine' },
      { value: 'modern', en: 'Modern', fr: 'Moderne' },
      { value: 'playful', en: 'Playful / youthful', fr: 'Ludique / jeune' },
    ],
  },
  {
    id: 'haveBrand', type: 'single', group: 'design',
    en: 'Do you have a logo and brand colours?', fr: 'Avez-vous un logo et des couleurs de marque ?',
    options: [
      { value: 'ready', en: 'Yes — logo and colours ready', fr: 'Oui — logo et couleurs prêts' },
      { value: 'logo', en: 'Just a logo', fr: 'Seulement un logo' },
      { value: 'none', en: 'Nothing yet — I may need branding', fr: 'Rien encore — j’aurai peut-être besoin d’une identité' },
    ],
  },
  {
    id: 'references', type: 'text', group: 'design', required: false,
    en: 'Any websites you like? Paste links', fr: 'Des sites que vous aimez ? Collez des liens',
    placeholderEn: 'Optional — a brand or competitor site', placeholderFr: 'Facultatif — un site de marque ou concurrent',
  },
]

const CONTACT_BLOCK = [
  { id: 'businessName', type: 'text', group: 'contact', required: true, en: 'What’s your business name?', fr: 'Quel est le nom de votre entreprise ?', placeholderEn: 'e.g. Nova Luxe', placeholderFr: 'ex. Nova Luxe' },
  { id: 'contactName', type: 'text', group: 'contact', required: true, en: 'Your name', fr: 'Votre nom', placeholderEn: 'Full name', placeholderFr: 'Nom complet' },
  { id: 'phone', type: 'text', group: 'contact', required: true, en: 'WhatsApp / phone number', fr: 'Numéro WhatsApp / téléphone', placeholderEn: '+233 …', placeholderFr: '+237 …' },
  { id: 'email', type: 'text', group: 'contact', required: false, en: 'Email (optional)', fr: 'E-mail (facultatif)', placeholderEn: 'name@email.com', placeholderFr: 'nom@email.com' },
  { id: 'anythingElse', type: 'text', long: true, group: 'contact', required: false, en: 'Anything else we should know? (optional)', fr: 'Autre chose à savoir ? (facultatif)', placeholderEn: 'Tell us anything we didn’t ask about.', placeholderFr: 'Dites-nous ce que nous n’avons pas demandé.' },
]

const MODULE_QUESTIONS = {
  product: [
    {
      id: 'buyMethod', type: 'single',
      en: 'How should customers buy from you?', fr: 'Comment les clients doivent-ils acheter ?',
      options: [
        { value: 'catalogue', flags: ['catalogue'], en: 'Just browse a catalogue, then contact me', fr: 'Parcourir un catalogue, puis me contacter' },
        { value: 'whatsapp', flags: ['catalogue'], en: 'Order through WhatsApp', fr: 'Commander via WhatsApp' },
        { value: 'cart', flags: ['sell', 'cart'], en: 'Add to cart and check out on the site', fr: 'Ajouter au panier et payer sur le site' },
        { value: 'notsure', en: 'I’m not sure — advise me', fr: 'Je ne sais pas — conseillez-moi' },
      ],
    },
    {
      id: 'payments', type: 'single',
      en: 'Do you want to take payments online?', fr: 'Voulez-vous encaisser des paiements en ligne ?',
      options: [
        { value: 'momo', flags: ['sell'], en: 'Yes — mobile money', fr: 'Oui — mobile money' },
        { value: 'card_momo', flags: ['sell'], en: 'Yes — cards and mobile money', fr: 'Oui — cartes et mobile money' },
        { value: 'no', en: 'No — pay on delivery / in person', fr: 'Non — paiement à la livraison / en personne' },
        { value: 'notsure', en: 'Not sure yet', fr: 'Pas encore sûr(e)' },
      ],
    },
    {
      id: 'accounts', type: 'single',
      en: 'Should customers create accounts to log in?', fr: 'Les clients doivent-ils créer un compte ?',
      options: [
        { value: 'yes', flags: ['login'], complex: true, en: 'Yes — accounts and login', fr: 'Oui — comptes et connexion' },
        { value: 'no', en: 'No', fr: 'Non' },
        { value: 'notsure', en: 'Not sure', fr: 'Pas sûr(e)' },
      ],
    },
    {
      id: 'variants', type: 'single',
      en: 'Do your products come in different sizes or colours?', fr: 'Vos produits existent-ils en différentes tailles ou couleurs ?',
      options: [
        { value: 'yes', en: 'Yes', fr: 'Oui' },
        { value: 'no', en: 'No', fr: 'Non' },
        { value: 'notsure', en: 'Not sure', fr: 'Pas sûr(e)' },
      ],
    },
    {
      id: 'photos', type: 'single',
      en: 'Do you already have photos of your products?', fr: 'Avez-vous déjà des photos de vos produits ?',
      options: [
        { value: 'pro', en: 'Yes — professional photos', fr: 'Oui — photos professionnelles' },
        { value: 'phone', en: 'Yes — phone photos', fr: 'Oui — photos au téléphone' },
        { value: 'some', en: 'Some of them', fr: 'Certains' },
        { value: 'none', en: 'Not yet', fr: 'Pas encore' },
      ],
    },
  ],
  food: [
    {
      id: 'ordering', type: 'single',
      en: 'How should customers order food?', fr: 'Comment les clients doivent-ils commander ?',
      options: [
        { value: 'menu', flags: ['catalogue'], en: 'Just show the menu, they call / WhatsApp', fr: 'Afficher le menu, ils appellent / WhatsApp' },
        { value: 'online', flags: ['sell', 'cart', 'orders'], en: 'Order online with payment', fr: 'Commander en ligne avec paiement' },
        { value: 'notsure', en: 'Not sure — advise me', fr: 'Je ne sais pas — conseillez-moi' },
      ],
    },
    {
      id: 'reservations', type: 'single',
      en: 'Do you take table reservations or bookings?', fr: 'Prenez-vous des réservations ?',
      options: [
        { value: 'yes', flags: ['bookings'], en: 'Yes', fr: 'Oui' },
        { value: 'no', en: 'No', fr: 'Non' },
      ],
    },
    {
      id: 'delivery', type: 'single',
      en: 'Do you deliver?', fr: 'Faites-vous de la livraison ?',
      options: [
        { value: 'tracking', flags: ['sell', 'tracking'], complex: true, en: 'Yes — with live order tracking', fr: 'Oui — avec suivi de commande en direct' },
        { value: 'simple', flags: ['orders'], en: 'Yes — simple delivery', fr: 'Oui — livraison simple' },
        { value: 'no', en: 'No — pickup / dine-in only', fr: 'Non — à emporter / sur place uniquement' },
      ],
    },
    {
      id: 'photos', type: 'single',
      en: 'Do you have photos of your dishes?', fr: 'Avez-vous des photos de vos plats ?',
      options: [
        { value: 'pro', en: 'Yes — professional photos', fr: 'Oui — photos professionnelles' },
        { value: 'phone', en: 'Yes — phone photos', fr: 'Oui — photos au téléphone' },
        { value: 'none', en: 'Not yet', fr: 'Pas encore' },
      ],
    },
  ],
  services: [
    {
      id: 'booking', type: 'single',
      en: 'Do customers book appointments or time slots?', fr: 'Les clients réservent-ils des créneaux ?',
      options: [
        { value: 'system', flags: ['bookings', 'booking'], complex: true, en: 'Yes — a real booking system with a calendar', fr: 'Oui — un vrai système de réservation avec calendrier' },
        { value: 'request', flags: ['bookings'], en: 'They just request a time, I confirm', fr: 'Ils demandent un horaire, je confirme' },
        { value: 'no', en: 'No bookings needed', fr: 'Pas de réservation nécessaire' },
      ],
    },
    {
      id: 'quotes', type: 'single',
      en: 'Do you give quotes or estimates?', fr: 'Fournissez-vous des devis ?',
      options: [
        { value: 'yes', flags: ['leads'], en: 'Yes — customers request a quote', fr: 'Oui — les clients demandent un devis' },
        { value: 'no', en: 'No — fixed services / prices', fr: 'Non — services / prix fixes' },
      ],
    },
    {
      id: 'accounts', type: 'single',
      en: 'Do customers need to log in to an account?', fr: 'Les clients doivent-ils se connecter à un compte ?',
      options: [
        { value: 'yes', flags: ['login'], complex: true, en: 'Yes — a client portal / login', fr: 'Oui — un espace client / connexion' },
        { value: 'no', en: 'No', fr: 'Non' },
        { value: 'notsure', en: 'Not sure', fr: 'Pas sûr(e)' },
      ],
    },
    {
      id: 'portfolio', type: 'single',
      en: 'Do you want to show past work or a gallery?', fr: 'Voulez-vous présenter vos réalisations ou une galerie ?',
      options: [
        { value: 'yes', flags: ['catalogue'], en: 'Yes', fr: 'Oui' },
        { value: 'no', en: 'No', fr: 'Non' },
        { value: 'notsure', en: 'Not sure', fr: 'Pas sûr(e)' },
      ],
    },
  ],
  custom: [
    {
      id: 'describe', type: 'text', long: true, required: true,
      en: 'Describe the tool or app you have in mind.', fr: 'Décrivez l’outil ou l’application envisagée.',
      enHelp: 'What should it do? Who uses it?', frHelp: 'Que doit-il faire ? Qui l’utilise ?',
      placeholderEn: 'e.g. a platform where drivers register and customers book rides…',
      placeholderFr: 'ex. une plateforme où les chauffeurs s’inscrivent et les clients réservent…',
    },
    {
      id: 'users', type: 'single',
      en: 'Will different types of users log in (e.g. customers and staff)?', fr: 'Différents utilisateurs se connecteront-ils (clients, personnel…) ?',
      options: [
        { value: 'yes', flags: ['login', 'multirole'], complex: true, en: 'Yes', fr: 'Oui' },
        { value: 'no', en: 'No — one type of user', fr: 'Non — un seul type d’utilisateur' },
        { value: 'notsure', en: 'Not sure', fr: 'Pas sûr(e)' },
      ],
    },
  ],
  general: [
    {
      id: 'describe', type: 'text', long: true, required: true,
      en: 'Tell us a bit more about what you need.', fr: 'Parlez-nous un peu plus de vos besoins.',
      placeholderEn: 'What should the website help you do?',
      placeholderFr: 'En quoi le site doit-il vous aider ?',
    },
  ],
}

// Build the ordered question list for a given industry module.
// Shared → module-specific → timeline → style/branding → contact.
export function buildQuestions(module) {
  const mod = MODULE_QUESTIONS[module] || MODULE_QUESTIONS.general
  return [HAVE_NOW, GOALS, ...mod, TIMELINE, BUDGET, ...DESIGN_BLOCK, ...CONTACT_BLOCK]
}
