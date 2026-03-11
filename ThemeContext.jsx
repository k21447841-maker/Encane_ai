import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const [accentColor, setAccentColor] = useState('default')

  const themes = {
    dark: {
      background: {
        primary: '#0B0B1F',
        secondary: '#14142B',
        card: 'rgba(20, 20, 43, 0.7)'
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0C0',
        tertiary: '#707090'
      },
      gradient: {
        start: '#1E1E4A',
        middle: '#4A1E6A',
        end: '#2E1E5C'
      }
    },
    darker: {
      background: {
        primary: '#050510',
        secondary: '#0A0A1A',
        card: 'rgba(10, 10, 26, 0.7)'
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#A0A0B0',
        tertiary: '#606080'
      },
      gradient: {
        start: '#151530',
        middle: '#351550',
        end: '#201540'
      }
    }
  }

  const accents = {
    default: {
      primary: '#00F0FF',
      secondary: '#8A2BE2',
      glow: 'rgba(0, 240, 255, 0.3)'
    },
    purple: {
      primary: '#B026FF',
      secondary: '#FF36B0',
      glow: 'rgba(176, 38, 255, 0.3)'
    },
    blue: {
      primary: '#3B82F6',
      secondary: '#10B981',
      glow: 'rgba(59, 130, 246, 0.3)'
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedAccent = localStorage.getItem('accentColor')
    
    if (savedTheme) setTheme(savedTheme)
    if (savedAccent) setAccentColor(savedAccent)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    applyTheme(theme, accentColor)
  }, [theme, accentColor])

  const applyTheme = (themeName, accentName) => {
    const selectedTheme = themes[themeName]
    const selectedAccent = accents[accentName]
    
    if (!selectedTheme || !selectedAccent) return

    // Apply CSS variables
    const root = document.documentElement
    Object.entries(selectedTheme.background).forEach(([key, value]) => {
      root.style.setProperty(`--bg-${key}`, value)
    })
    Object.entries(selectedTheme.text).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value)
    })
    Object.entries(selectedAccent).forEach(([key, value]) => {
      root.style.setProperty(`--accent-${key}`, value)
    })
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'darker' : 'dark')
  }

  const changeAccent = (accentName) => {
    setAccentColor(accentName)
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      accentColor,
      toggleTheme,
      changeAccent,
      themes,
      accents
    }}>
      {children}
    </ThemeContext.Provider>
  )
}