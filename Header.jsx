import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useUser } from '../../hooks/useUser'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const { user } = useUser()
  const [showMenu, setShowMenu] = useState(false)

  const getTitle = () => {
    switch (location.pathname) {
      case '/home':
        return t('home.title')
      case '/chat':
        return t('chat.title')
      case '/writer':
        return t('writer.title')
      case '/summarizer':
        return t('summarizer.title')
      case '/ideas':
        return t('ideas.title')
      case '/planner':
        return t('planner.title')
      case '/content':
        return t('content.title')
      case '/insight':
        return t('insight.title')
      case '/settings':
        return t('settings.title')
      default:
        return 'AI Automation Hub'
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const shouldShowBack = !['/home', '/', '/language', '/onboarding', '/profile'].includes(location.pathname)

  return (
    <header className="sticky top-0 z-50 glass-card mx-4 mt-4 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {shouldShowBack && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}
          
          <h1 className="text-xl font-bold gradient-text">
            {getTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center relative"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-cyan rounded-full"></span>
          </motion.button>

          {/* Profile Avatar */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple p-[2px]"
          >
            <div className="w-full h-full rounded-2xl bg-[#14142B] flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export default Header