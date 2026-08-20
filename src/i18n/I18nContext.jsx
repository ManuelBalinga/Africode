'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { translations } from './translations'

const I18nContext = createContext(null)

function getInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem('africode-lang')
  if (saved === 'en' || saved === 'fr') return saved
  const nav = (window.navigator.language || 'en').toLowerCase()
  return nav.startsWith('fr') ? 'fr' : 'en'
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    window.localStorage.setItem('africode-lang', lang)
  }, [lang])

  // t('home.h1a') -> looks up nested key in the current language.
  const t = useCallback(
    (path) => {
      const parts = path.split('.')
      let node = translations[lang]
      for (const p of parts) {
        node = node?.[p]
        if (node == null) break
      }
      return node == null ? path : node
    },
    [lang]
  )

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
