import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'bottom'
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const types = {
    success: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400'
    },
    error: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400'
    },
    warning: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400'
    },
    info: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-accent-cyan/20',
      border: 'border-accent-cyan/30',
      text: 'text-accent-cyan'
    }
  }

  const positions = {
    top: 'top-4',
    bottom: 'bottom-4',
    center: 'top-1/2 -translate-y-1/2'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          className={`fixed left-1/2 transform -translate-x-1/2 z-50 ${positions[position]}`}
        >
          <div className={`
            flex items-center gap-3 px-4 py-3 rounded-2xl
            backdrop-blur-md border ${types[type].border} ${types[type].bg}
            shadow-lg
          `}>
            <div className={types[type].text}>
              {types[type].icon}
            </div>
            <p className={`text-sm font-medium ${types[type].text}`}>
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast