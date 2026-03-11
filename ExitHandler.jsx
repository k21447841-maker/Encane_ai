import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const ExitHandler = ({ children }) => {
  const location = useLocation()
  const backPressCount = useRef(0)
  const backPressTimer = useRef(null)

  useEffect(() => {
    const handleBackPress = (event) => {
      // Prevent default back behavior
      event.preventDefault()

      // Only handle double back on home page
      if (location.pathname === '/home') {
        backPressCount.current += 1

        if (backPressCount.current === 1) {
          // Show toast message
          showExitToast()

          // Reset count after 2 seconds
          backPressTimer.current = setTimeout(() => {
            backPressCount.current = 0
          }, 2000)

          // Push a dummy state to handle the back press
          window.history.pushState(null, '', window.location.pathname)
        } else if (backPressCount.current === 2) {
          // Double back pressed - exit app
          clearTimeout(backPressTimer.current)
          handleExit()
        }
      } else {
        // Navigate back normally
        window.history.back()
      }
    }

    // Handle Android back button
    window.history.pushState(null, '', window.location.pathname)
    window.addEventListener('popstate', handleBackPress)

    return () => {
      window.removeEventListener('popstate', handleBackPress)
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current)
      }
    }
  }, [location.pathname])

  const showExitToast = () => {
    // Remove existing toast if any
    const existingToast = document.querySelector('.exit-toast')
    if (existingToast) {
      existingToast.remove()
    }

    // Create toast element
    const toast = document.createElement('div')
    toast.className = 'exit-toast fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in'
    toast.textContent = 'Press back again to exit'
    
    // Add styles
    toast.style.backdropFilter = 'blur(8px)'
    toast.style.border = '1px solid rgba(0, 240, 255, 0.2)'
    toast.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)'
    
    document.body.appendChild(toast)

    // Remove toast after 2 seconds
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove()
        }
      }, 300)
    }, 2000)
  }

  const handleExit = () => {
    // For PWA, try to close window
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // In PWA mode, we can try to close the window
      window.close()
      
      // If close fails, show message
      setTimeout(() => {
        alert('Press the Home button to exit the app')
      }, 100)
    } else {
      // For web, check if we came from another site
      if (document.referrer) {
        window.location.href = document.referrer
      } else {
        // Try to close tab (may not work in all browsers)
        window.close()
        
        // If close fails, show message
        setTimeout(() => {
          alert('You can now close this tab')
        }, 100)
      }
    }
  }

  // Add keyframe animation for fade out
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translate(-50%, 0);
        }
        to {
          opacity: 0;
          transform: translate(-50%, 20px);
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}

export default ExitHandler