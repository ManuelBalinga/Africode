'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppFab from '../components/WhatsAppFab'
import { useTheme } from '../theme/ThemeContext'

// Chrome shared by every route: ambient glows (dark mode only), header,
// footer and the floating WhatsApp button.
export default function SiteShell({ children }) {
  const { theme } = useTheme()

  return (
    <>
      {theme === 'dark' && (
        <>
          <div className="glow glow-blue" aria-hidden="true" />
          <div className="glow glow-amber" aria-hidden="true" />
        </>
      )}
      <div className="app-shell">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </div>
    </>
  )
}
