import React from 'react'
import { motion } from 'framer-motion'

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white hover:opacity-90',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    outline: 'border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10',
    ghost: 'text-white/80 hover:text-white hover:bg-white/10',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
  }

  const sizes = {
    small: 'px-4 py-2 text-sm rounded-xl',
    medium: 'px-6 py-3 text-base rounded-2xl',
    large: 'px-8 py-4 text-lg rounded-2xl'
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        font-semibold
        flex items-center justify-center
        gap-2
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="text-xl">{icon}</span>
      )}
      
      <span>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="text-xl">{icon}</span>
      )}
    </motion.button>
  )
}

export default Button