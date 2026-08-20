import { translations } from '../i18n/translations'

// Per-route metadata rendered on the server, so crawlers and link previews
// get a real title and description without running JavaScript. The English
// copy is the canonical source; switching to French updates the tab title
// client-side via usePageMeta.
export function pageMetadata(key, path) {
  const { t, d } = translations.en.seo[key]
  return {
    title: t,
    description: d,
    alternates: { canonical: path },
    openGraph: {
      title: t,
      description: d,
      url: path,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: { title: t, description: d, images: ['/og-image.png'] },
  }
}
