import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  onClick,
  variant = 'default',
  padding = 'medium',
  glow = false,
  className = '',
  animate = true,
  ...props
}) => {
  const variants = {
    default: 'glass-card',
    flat: 'bg-white/5 backdrop-blur-none',
    gradient: 'bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 border border-white/10',
    elevated: 'glass-card shadow-2xl'
  }

  const paddings = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  }

  const CardWrapper = animate ? motion.div : 'div'

  return (
    <CardWrapper
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${paddings[padding]}
        ${glow ? 'glow' : ''}
        rounded-3xl
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={animate && onClick ? { scale: 1.02 } : {}}
      whileTap={animate && onClick ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </CardWrapper>
  )
}

export default Card