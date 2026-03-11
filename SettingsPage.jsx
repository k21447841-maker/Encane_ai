import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user, clearUser, updatePreferences } = useUser()
  const { language, changeLanguage, availableLanguages } = useLanguage()
  const { theme, toggleTheme, changeAccent, accentColor, accents } = useTheme()
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true)

  const menuSections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'language',
          icon: '🌐',
          label: 'Language',
          value: availableLanguages.find(l => l.code === language)?.name || 'English',
          action: () => {/* Open language modal */}
        },
        {
          id: 'theme',
          icon: theme === 'dark' ? '🌙' : '☀️',
          label: 'Dark Mode',
          type: 'toggle',
          value: theme === 'dark',
          action: toggleTheme
        },
        {
          id: 'notifications',
          icon: '🔔',
          label: 'Notifications',
          type: 'toggle',
          value: notifications,
          action: () => {
            setNotifications(!notifications)
            updatePreferences({ notifications: !notifications })
          }
        }
      ]
    },
    {
      title: 'Accent Color',
      items: [
        {
          id: 'accent',
          type: 'colors',
          colors: Object.keys(accents).map(key => ({
            id: key,
            color: accents[key].primary,
            active: accentColor === key
          }))
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'share',
          icon: '📱',
          label: 'Share App',
          action: handleShare
        },
        {
          id: 'rate',
          icon: '⭐',
          label: 'Rate App',
          action: handleRate
        },
        {
          id: 'privacy',
          icon: '🔒',
          label: 'Privacy Policy',
          action: () => window.open('#', '_blank')
        },
        {
          id: 'terms',
          icon: '📜',
          label: 'Terms of Service',
          action: () => window.open('#', '_blank')
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          id: 'logout',
          icon: '🚪',
          label: 'Logout',
          danger: true,
          action: handleLogout
        }
      ]
    }
  ]

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'AI Automation Hub',
        text: 'Boost your productivity with AI tools!',
        url: window.location.origin,
      }).catch(console.error)
    }
  }

  function handleRate() {
    // Open store listing
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // PWA - open store page
      window.open('https://play.google.com/store/apps', '_blank')
    }
  }

  function handleLogout() {
    clearUser()
    navigate('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-8"
    >
      {/* Profile Header */}
      <Card variant="gradient" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full blur-2xl" />
        
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-accent-cyan to-accent-purple p-[3px]">
            <div className="w-full h-full rounded-3xl bg-[#14142B] flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
            <p className="text-white/60 text-sm">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/80">
                {user?.usageGoal || 'Personal'}
              </span>
              <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/80">
                {user?.country || 'Not set'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings Sections */}
      {menuSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: sectionIndex * 0.1 + 0.2 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
            
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 + 0.3 }}
                >
                  {item.type === 'colors' ? (
                    <div className="flex gap-3">
                      {item.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => changeAccent(color.id)}
                          className="flex-1"
                        >
                          <div 
                            className={`h-12 rounded-xl transition-all ${
                              color.active 
                                ? 'ring-2 ring-white scale-105' 
                                : 'opacity-70'
                            }`}
                            style={{ backgroundColor: color.color }}
                          />
                        </button>
                      ))}
                    </div>
                  ) : item.type === 'toggle' ? (
                    <button
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-white">{item.label}</span>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                          item.value ? 'bg-accent-cyan' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                            item.value ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={item.action}
                      className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors ${
                        item.danger ? 'text-red-400' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className={item.danger ? 'text-red-400' : 'text-white'}>
                          {item.label}
                        </span>
                      </div>
                      {item.value && (
                        <span className="text-white/40 text-sm">{item.value}</span>
                      )}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      {/* App Info */}
      <Card variant="flat" className="text-center">
        <p className="text-white/40 text-sm">AI Automation Hub v1.0.0</p>
        <p className="text-white/20 text-xs mt-1">© 2024 All rights reserved</p>
      </Card>
    </motion.div>
  )
}

export default SettingsPage