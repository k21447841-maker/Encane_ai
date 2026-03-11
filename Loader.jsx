import React from 'react'
import { motion } from 'framer-motion'

const Loader = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  text = '',
  ...props
}) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  const colors = {
    primary: 'border-accent-cyan',
    secondary: 'border-accent-purple',
    white: 'border-white'
  }

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B1F]/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            variants={spinnerVariants}
            animate="animate"
            className={`${sizes.large} border-4 border-t-transparent rounded-full ${colors[color]}`}
          />
          {text && (
            <motion.p
              variants={pulseVariants}
              animate="animate"
              className="text-white/80 text-lg"
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3" {...props}>
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={`${sizes[size]} border-4 border-t-transparent rounded-full ${colors[color]}`}
      />
      {text && (
        <motion.p
          variants={pulseVariants}
          animate="animate"
          className="text-white/60 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export default Loader