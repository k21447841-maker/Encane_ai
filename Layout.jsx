import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import BottomNav from './BottomNav'
import { useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
  const location = useLocation()
  const hideNavOn = ['/', '/language', '/onboarding', '/profile']
  const shouldShowNav = !hideNavOn.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B1F] via-[#14142B] to-[#1E1E4A]">
      <Header />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`container mx-auto px-4 py-6 ${
            shouldShowNav ? 'pb-24' : 'pb-6'
          }`}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {shouldShowNav && <BottomNav />}
    </div>
  )
}

export default Layout