import './globals.css'
import Providers from './providers'
import SiteShell from './site-shell'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://africodestudios.com'

const TITLE = 'Africode Studios — We build it. You grow.'
const DESCRIPTION =
  'Fast, modern websites, online stores and web apps for businesses in Ghana, Cameroon and worldwide. Built and supported in English and French.'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s' },
  description: DESCRIPTION,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Africode Studios',
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description:
      'Websites, online stores and web apps for businesses in Ghana, Cameroon and worldwide.',
    images: ['/og-image.png'],
  },
}

export const viewport = {
  themeColor: '#1A1B1F',
}

// Applies the saved theme before first paint so dark mode never flashes white.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('africode-theme')||'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  )
}
