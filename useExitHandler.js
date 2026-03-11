import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const useExitHandler = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const backPressCount = useRef(0)
  const backPressTimer = useRef(null)

  const handleBackPress = useCallback((event) => {
    // Prevent default back behavior
    event.preventDefault()

    // If on home page, handle double back to exit
    if (location.pathname === '/home') {
      backPressCount.current += 1

      if (backPressCount.current === 1) {
        // Show toast message
        const toast = document.createElement('div')
        toast.className = 'exit-toast'
        toast.textContent = 'Press back again to exit'
        document.body.appendChild(toast)

        setTimeout(() => {
          toast.remove()
        }, 3000)

        // Reset count after 2 seconds
        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0
        }, 2000)
      } else if (backPressCount.current === 2) {
        // Double back pressed - exit app
        clearTimeout(backPressTimer.current)
        
        // For PWA, close window
        if (window.matchMedia('(display-mode: standalone)').matches) {
          window.close()
        } else {
          // For web, go to previous page or close tab
          if (document.referrer) {
            window.location.href = document.referrer
          } else {
            window.close()
          }
        }
      }
    } else {
      // Navigate back normally
      navigate(-1)
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    // Handle Android back button
    window.history.pushState(null, null, window.location.pathname)
    window.addEventListener('popstate', handleBackPress)

    return () => {
      window.removeEventListener('popstate', handleBackPress)
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current)
      }
    }
  }, [handleBackPress])

  return { handleBackPress }
}