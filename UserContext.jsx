import React, { createContext, useState, useEffect } from 'react'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const updateUser = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearUser = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  const hasCompletedOnboarding = () => {
    return user?.hasCompletedOnboarding || false
  }

  const hasSelectedLanguage = () => {
    return user?.language || false
  }

  const getUserPreferences = () => {
    return user?.preferences || {
      notifications: true,
      theme: 'dark',
      language: 'en'
    }
  }

  const updatePreferences = (preferences) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev?.preferences, ...preferences }
    }))
    
    const updatedUser = {
      ...user,
      preferences: { ...user?.preferences, ...preferences }
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      updateUser,
      clearUser,
      hasCompletedOnboarding,
      hasSelectedLanguage,
      getUserPreferences,
      updatePreferences
    }}>
      {children}
    </UserContext.Provider>
  )
}