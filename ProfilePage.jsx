import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { updateUser } = useUser()
  const [_, setHasProfile] = useLocalStorage('hasProfile', false)
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    usageGoal: 'personal',
    notifications: true
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.country) {
      newErrors.country = 'Please select your country'
    }
    
    return newErrors
  }

  const handleSubmit = () => {
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      updateUser({
        ...formData,
        createdAt: new Date().toISOString()
      })
      setHasProfile(true)
      navigate('/home')
    } else {
      setErrors(newErrors)
    }
  }

  const goals = [
    { id: 'work', label: 'Work & Business', icon: '💼' },
    { id: 'study', label: 'Study & Learning', icon: '📚' },
    { id: 'personal', label: 'Personal Growth', icon: '🌱' },
    { id: 'creative', label: 'Creative Projects', icon: '🎨' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Complete Your Profile
        </h1>
        <p className="text-white/60">
          Help us personalize your experience
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mb-8"
      >
        <Input
          label="Your Name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <Input
          label="Country"
          placeholder="Select your country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          error={errors.country}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <label className="block text-white/80 text-sm mb-3 ml-1">
          What's your main goal?
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              onClick={() => setFormData({ ...formData, usageGoal: goal.id })}
              className={`p-4 cursor-pointer ${
                formData.usageGoal === goal.id
                  ? 'border-accent-cyan border-2'
                  : ''
              }`}
            >
              <div className="text-3xl mb-2">{goal.icon}</div>
              <p className="text-white text-sm font-medium">{goal.label}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
              formData.notifications ? 'bg-accent-cyan' : 'bg-white/20'
            }`}
            onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                formData.notifications ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-white/80">Enable notifications for daily insights</span>
        </label>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={handleSubmit}
          fullWidth
          size="large"
          variant="primary"
        >
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default ProfilePage