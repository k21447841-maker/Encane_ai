import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

const LanguagePage = () => {
  const navigate = useNavigate()
  const { changeLanguage, availableLanguages } = useLanguage()
  const [selectedLang, setSelectedLang] = useState('en')
  const [_, setHasSelectedLanguage] = useLocalStorage('hasSelectedLanguage', false)

  const handleContinue = () => {
    changeLanguage(selectedLang)
    setHasSelectedLanguage(true)
    navigate('/onboarding')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-accent-cyan to-accent-purple p-[2px] mx-auto mb-6">
          <div className="w-full h-full rounded-3xl bg-[#14142B] flex items-center justify-center">
            <svg className="w-10 h-10 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Choose Your Language
        </h1>
        
        <p className="text-white/60">
          Select your preferred language
        </p>
      </motion.div>

      <div className="w-full max-w-md space-y-3 mb-8">
        {availableLanguages.map((lang, index) => (
          <motion.div
            key={lang.code}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Card
              onClick={() => setSelectedLang(lang.code)}
              className={`p-4 cursor-pointer transition-all ${
                selectedLang === lang.code
                  ? 'border-accent-cyan border-2'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg">{lang.name}</p>
                  <p className="text-white/40 text-sm">{lang.nativeName}</p>
                </div>
                
                {selectedLang === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-accent-cyan flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-md"
      >
        <Button
          onClick={handleContinue}
          fullWidth
          size="large"
          variant="primary"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default LanguagePage