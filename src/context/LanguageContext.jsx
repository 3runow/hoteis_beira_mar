import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import translations from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('beiramar_lang') || 'pt'
  )

  // Keep <html lang="..."> in sync so browser knows not to auto-translate
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((code) => {
    setLangState(code)
    localStorage.setItem('beiramar_lang', code)
    document.documentElement.lang = code
  }, [])

  const t = useCallback((section, key) => {
    const section_data = translations[lang]?.[section]
    if (section_data === undefined) return key
    if (key === undefined) return section_data
    return section_data[key] ?? key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
