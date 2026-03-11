import React from 'react'
import { useNavigate } from 'react-router-dom'
import SplashScreen from '../components/splash/SplashScreen'
import { useLocalStorage } from '../hooks/useLocalStorage'

const SplashPage = () => {
  const navigate = useNavigate()
  const [hasSeenOnboarding] = useLocalStorage('hasSeenOnboarding', false)
  const [hasSelectedLanguage] = useLocalStorage('hasSelectedLanguage', false)
  const [hasProfile] = useLocalStorage('hasProfile', false)

  const handleComplete = () => {
    if (!hasSelectedLanguage) {
      navigate('/language')
    } else if (!hasSeenOnboarding) {
      navigate('/onboarding')
    } else if (!hasProfile) {
      navigate('/profile')
    } else {
      navigate('/home')
    }
  }

  return <SplashScreen onComplete={handleComplete} />
}

export default SplashPage