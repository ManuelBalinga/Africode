import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFab from './WhatsAppFab'
import { useTheme } from '../theme/ThemeContext'

export default function Layout() {
  const { pathname } = useLocation()
  const { theme } = useTheme()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

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
        <main><Outlet /></main>
        <Footer />
        <WhatsAppFab />
      </div>
    </>
  )
}
