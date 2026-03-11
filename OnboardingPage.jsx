import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import OnboardingSlider from '../components/onboarding/OnboardingSlider'
import { useLocalStorage } from '../hooks/useLocalStorage'

const OnboardingPage = () => {
  const navigate = useNavigate()
  const [_, setHasSeenOnboarding] = useLocalStorage('hasSeenOnboarding', false)

  const handleComplete = () => {
    setHasSeenOnboarding(true)
    navigate('/profile')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <OnboardingSlider onComplete={handleComplete} />
    </motion.div>
  )
}

export default OnboardingPage