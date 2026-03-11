import React, { createContext, useState, useEffect } from 'react'

export const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [translations, setTranslations] = useState({})
  const [availableLanguages] = useState([
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' }
  ])

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`)
        const data = await response.json()
        setTranslations(data)
      } catch (error) {
        console.error('Error loading translations:', error)
        // Fallback to English if translation fails
        if (language !== 'en') {
          const fallbackResponse = await fetch('/locales/en.json')
          const fallbackData = await fallbackResponse.json()
          setTranslations(fallbackData)
        }
      }
    }
    loadTranslations()
  }, [language])

  // Save language preference
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language)
    document.documentElement.lang = language
  }, [language])

  const changeLanguage = (langCode) => {
    setLanguage(langCode)
  }

  const t = (key, params = {}) => {
    let text = translations[key] || key
    
    // Replace parameters in string
    Object.keys(params).forEach(param => {
      text = text.replace(`{{${param}}}`, params[param])
    })
    
    return text
  }

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      t,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  )
}