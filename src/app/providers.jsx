'use client'

import { ThemeProvider } from '../theme/ThemeContext'
import { I18nProvider } from '../i18n/I18nContext'

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  )
}
