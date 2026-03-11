class ErrorHandler {
  static handle(error, context = '') {
    console.error(`Error in ${context}:`, error)

    // Network errors
    if (!navigator.onLine) {
      return {
        message: 'No internet connection. Please check your network.',
        type: 'network',
        retry: true
      }
    }

    // API errors
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 400:
          return {
            message: 'Invalid request. Please check your input.',
            type: 'validation'
          }
        case 401:
          return {
            message: 'Authentication failed. Please check your API key.',
            type: 'auth'
          }
        case 403:
          return {
            message: 'Access denied. You don\'t have permission.',
            type: 'permission'
          }
        case 404:
          return {
            message: 'Resource not found.',
            type: 'not_found'
          }
        case 429:
          return {
            message: 'Too many requests. Please try again later.',
            type: 'rate_limit',
            retry: true
          }
        case 500:
        case 502:
        case 503:
          return {
            message: 'Server error. Please try again later.',
            type: 'server',
            retry: true
          }
        default:
          return {
            message: error.response.data?.message || 'An unexpected error occurred.',
            type: 'unknown'
          }
      }
    }

    // Request errors
    if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        type: 'network',
        retry: true
      }
    }

    // Other errors
    return {
      message: error.message || 'An unexpected error occurred.',
      type: 'unknown'
    }
  }

  static isRetryable(error) {
    const handled = this.handle(error)
    return handled.retry === true
  }

  static getUserFriendlyMessage(error) {
    const handled = this.handle(error)
    return handled.message
  }

  static logError(error, context = '', userId = null) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      userId,
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to your error tracking service (Sentry, LogRocket, etc.)
      console.log('Error logged:', errorLog)
    } else {
      console.error('Development error:', errorLog)
    }
  }

  static async withRetry(fn, maxRetries = 3, delay = 1000) {
    let lastError
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (!this.isRetryable(error) || i === maxRetries - 1) {
          throw error
        }
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, delay * Math.pow(2, i))
        )
      }
    }
    
    throw lastError
  }
}

export default ErrorHandler