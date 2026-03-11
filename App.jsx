import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Pages
import SplashPage from './pages/SplashPage'
import LanguagePage from './pages/LanguagePage'
import OnboardingPage from './pages/OnboardingPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import WriterPage from './pages/WriterPage'
import SummarizerPage from './pages/SummarizerPage'
import IdeaPage from './pages/IdeaPage'
import PlannerPage from './pages/PlannerPage'
import ContentPage from './pages/ContentPage'
import InsightPage from './pages/InsightPage'
import SettingsPage from './pages/SettingsPage'

// Components
import ExitHandler from './components/exit/ExitHandler'
import Layout from './components/layout/Layout'

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage'
import { useLanguage } from './hooks/useLanguage'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('hasSeenOnboarding', false)
  const [hasSelectedLanguage, setHasSelectedLanguage] = useLocalStorage('hasSelectedLanguage', false)
  const [hasProfile, setHasProfile] = useLocalStorage('hasProfile', false)
  const { language } = useLanguage()

  useEffect(() => {
    // Simulate splash screen timeout
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <SplashPage />
  }

  return (
    <Router>
      <ExitHandler>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Onboarding Flow */}
              <Route 
                path="/" 
                element={
                  !hasSelectedLanguage ? <Navigate to="/language" /> :
                  !hasSeenOnboarding ? <Navigate to="/onboarding" /> :
                  !hasProfile ? <Navigate to="/profile" /> :
                  <Navigate to="/home" />
                } 
              />
              
              <Route path="/language" element={<LanguagePage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Main App Routes */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/writer" element={<WriterPage />} />
              <Route path="/summarizer" element={<SummarizerPage />} />
              <Route path="/ideas" element={<IdeaPage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/insight" element={<InsightPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </ExitHandler>
    </Router>
  )
}

export default App