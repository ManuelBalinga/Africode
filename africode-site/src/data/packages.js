// Package definitions — shown on Pricing and used by the questionnaire result.
// Prices indicative (USD). Custom is quoted per project.

export const packages = {
  starter: {
    key: 'starter', priceUSD: 40, accent: 'var(--blue)',
    en: { name: 'Starter', tag: 'A clean one-page presence',
      for: 'Perfect if you just need to look professional and be found online.',
      includes: ['Single-page website', 'Mobile-friendly design', 'Your logo, colours and photos', 'WhatsApp + contact buttons', 'Google-ready (SEO basics)'] },
    fr: { name: 'Starter', tag: 'Une présence claire en une page',
      for: 'Idéal si vous voulez simplement paraître professionnel et être trouvé en ligne.',
      includes: ['Site d’une page', 'Design adapté au mobile', 'Votre logo, couleurs et photos', 'Boutons WhatsApp + contact', 'Prêt pour Google (bases SEO)'] },
  },
  business: {
    key: 'business', priceUSD: 90, accent: 'var(--amber)',
    en: { name: 'Business', tag: 'A full multi-page website',
      for: 'For businesses that need several pages, enquiries and bookings.',
      includes: ['Multiple pages (Home, About, Services…)', 'Contact + enquiry forms', 'Bookings / appointment requests', 'Photo gallery', 'Everything in Starter'] },
    fr: { name: 'Business', tag: 'Un site complet multi-pages',
      for: 'Pour les entreprises qui ont besoin de plusieurs pages, de demandes et de réservations.',
      includes: ['Plusieurs pages (Accueil, À propos, Services…)', 'Formulaires de contact + demande', 'Réservations / prises de rendez-vous', 'Galerie photo', 'Tout ce qui est dans Starter'] },
  },
  store: {
    key: 'store', priceUSD: 120, accent: 'var(--blue-strong)',
    en: { name: 'Online Store', tag: 'Sell online with payments',
      for: 'For selling products online with a cart and secure checkout.',
      includes: ['Product catalogue with a cart', 'Secure checkout', 'Mobile money + card payments', 'Order notifications', 'Everything in Business'] },
    fr: { name: 'Boutique en ligne', tag: 'Vendez en ligne avec paiements',
      for: 'Pour vendre des produits en ligne avec panier et paiement sécurisé.',
      includes: ['Catalogue produits avec panier', 'Paiement sécurisé', 'Mobile money + cartes', 'Notifications de commande', 'Tout ce qui est dans Business'] },
  },
  custom: {
    key: 'custom', priceUSD: null, priceFromUSD: 250, accent: 'var(--charcoal)',
    en: { name: 'Custom Project', tag: 'Built around how you work',
      for: 'For web apps, booking systems, marketplaces and tools that need logins and custom logic. We scope it with you and quote per project.',
      includes: ['Custom web app or platform', 'User accounts and logins', 'Booking / marketplace / dashboards', 'Integrations and automation', 'A dedicated plan and quote'] },
    fr: { name: 'Projet sur mesure', tag: 'Conçu autour de votre façon de travailler',
      for: 'Pour les applications web, systèmes de réservation, places de marché et outils nécessitant connexions et logique sur mesure. Nous cadrons et devisons par projet.',
      includes: ['Application ou plateforme sur mesure', 'Comptes et connexions utilisateurs', 'Réservation / marketplace / tableaux de bord', 'Intégrations et automatisation', 'Un plan et un devis dédiés'] },
  },
}

export const packageOrder = ['starter', 'business', 'store', 'custom']
