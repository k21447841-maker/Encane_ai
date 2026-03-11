class Analytics {
  constructor() {
    this.events = []
    this.userId = null
    this.sessionId = this.generateSessionId()
    this.enabled = process.env.NODE_ENV === 'production'
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  setUserId(userId) {
    this.userId = userId
  }

  trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    this.events.push(event)

    if (this.enabled) {
      this.sendToServer(event)
    } else {
      console.log('Analytics event:', event)
    }
  }

  trackPageView(pageName, properties = {}) {
    this.trackEvent('page_view', {
      page: pageName,
      path: window.location.pathname,
      ...properties
    })
  }

  trackToolUsage(toolName, input, outputLength) {
    this.trackEvent('tool_usage', {
      tool: toolName,
      inputLength: input?.length || 0,
      outputLength: outputLength || 0,
      timestamp: new Date().toISOString()
    })
  }

  trackError(error, context = '') {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href
    })
  }

  trackUserAction(action, target, properties = {}) {
    this.trackEvent('user_action', {
      action,
      target,
      ...properties
    })
  }

  trackPerformance(metric, value, tags = {}) {
    this.trackEvent('performance', {
      metric,
      value,
      ...tags
    })
  }

  trackApiCall(endpoint, duration, success, error = null) {
    this.trackEvent('api_call', {
      endpoint,
      duration,
      success,
      error: error?.message
    })
  }

  async sendToServer(event) {
    try {
      // In production, send to your analytics endpoint
      // const response = await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // })
      
      // For now, just log
      console.log('Analytics sent:', event)
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  getSessionEvents() {
    return this.events.filter(e => e.sessionId === this.sessionId)
  }

  clearEvents() {
    this.events = []
  }

  // Track user engagement
  trackEngagement(duration) {
    this.trackEvent('engagement', {
      duration,
      sessionId: this.sessionId
    })
  }

  // Track feature usage
  trackFeature(feature, action, details = {}) {
    this.trackEvent('feature', {
      feature,
      action,
      ...details
    })
  }

  // Track conversions
  trackConversion(type, value = null) {
    this.trackEvent('conversion', {
      type,
      value,
      timestamp: new Date().toISOString()
    })
  }

  // Start session timer
  startSessionTimer() {
    this.sessionStartTime = Date.now()
  }

  // End session and track duration
  endSession() {
    if (this.sessionStartTime) {
      const duration = Math.round((Date.now() - this.sessionStartTime) / 1000)
      this.trackEngagement(duration)
    }
  }
}

export default new Analytics()