export const validation = {
  // User profile validation
  user: {
    name: (name) => {
      if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Name is required' }
      }
      if (name.trim().length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' }
      }
      if (name.trim().length > 50) {
        return { valid: false, message: 'Name must be less than 50 characters' }
      }
      if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
        return { valid: false, message: 'Name contains invalid characters' }
      }
      return { valid: true }
    },

    email: (email) => {
      if (!email) return { valid: true } // Email is optional
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' }
      }
      return { valid: true }
    },

    country: (country) => {
      if (!country || country.trim().length === 0) {
        return { valid: false, message: 'Country is required' }
      }
      return { valid: true }
    },

    goal: (goal) => {
      const validGoals = ['work', 'study', 'personal', 'creative']
      if (!goal || !validGoals.includes(goal)) {
        return { valid: false, message: 'Please select a valid goal' }
      }
      return { valid: true }
    }
  },

  // Input validation
  input: {
    required: (value, fieldName = 'Field') => {
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return { valid: false, message: `${fieldName} is required` }
      }
      return { valid: true }
    },

    minLength: (value, min, fieldName = 'Field') => {
      if (value && value.length < min) {
        return { valid: false, message: `${fieldName} must be at least ${min} characters` }
      }
      return { valid: true }
    },

    maxLength: (value, max, fieldName = 'Field') => {
      if (value && value.length > max) {
        return { valid: false, message: `${fieldName} must be less than ${max} characters` }
      }
      return { valid: true }
    },

    email: (email) => {
      if (!email) return { valid: true }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' }
      }
      return { valid: true }
    },

    url: (url) => {
      if (!url) return { valid: true }
      try {
        new URL(url)
        return { valid: true }
      } catch {
        return { valid: false, message: 'Please enter a valid URL' }
      }
    },

    number: (value, min, max) => {
      const num = Number(value)
      if (isNaN(num)) {
        return { valid: false, message: 'Please enter a valid number' }
      }
      if (min !== undefined && num < min) {
        return { valid: false, message: `Value must be at least ${min}` }
      }
      if (max !== undefined && num > max) {
        return { valid: false, message: `Value must be at most ${max}` }
      }
      return { valid: true }
    }
  },

  // Tool input validation
  tools: {
    writer: (data) => {
      const errors = {}
      
      if (!data.topic?.trim()) {
        errors.topic = 'Topic is required'
      }
      
      const validFormats = ['article', 'blog', 'email', 'caption', 'description']
      if (data.format && !validFormats.includes(data.format)) {
        errors.format = 'Invalid format selected'
      }
      
      const validTones = ['professional', 'casual', 'enthusiastic', 'informative', 'persuasive']
      if (data.tone && !validTones.includes(data.tone)) {
        errors.tone = 'Invalid tone selected'
      }
      
      const validLengths = ['short', 'medium', 'long']
      if (data.length && !validLengths.includes(data.length)) {
        errors.length = 'Invalid length selected'
      }
      
      return {
        valid: Object.keys(errors).length === 0,
        errors
      }
    },

    summarizer: (data) => {
      const errors = {}
      
      if (!data.text?.trim()) {
        errors.text = 'Text to summarize is required'
      } else if (data.text.length > 10000) {
        errors.text = 'Text is too long (max 10,000 characters)'
      }
      
      const validTypes = ['concise', 'detailed', 'bullet', 'executive']
      if (data.type && !validTypes.includes(data.type)) {
        errors.type = 'Invalid summary type'
      }
      
      return {
        valid: Object.keys(errors).length === 0,
        errors
      }
    },

    ideas: (data) => {
      const errors = {}
      
      const validCategories = ['business', 'startup', 'content', 'marketing', 'product', 'creative']
      if (data.category && !validCategories.includes(data.category)) {
        errors.category = 'Invalid category selected'
      }
      
      if (data.count) {
        const countNum = Number(data.count)
        if (isNaN(countNum) || countNum < 1 || countNum > 20) {
          errors.count = 'Number of ideas must be between 1 and 20'
        }
      }
      
      return {
        valid: Object.keys(errors).length === 0,
        errors
      }
    },

    planner: (data) => {
      const errors = {}
      
      if (!data.goal?.trim()) {
        errors.goal = 'Goal is required'
      }
      
      const validTimeframes = ['daily', 'weekly', 'monthly', 'custom']
      if (data.timeframe && !validTimeframes.includes(data.timeframe)) {
        errors.timeframe = 'Invalid timeframe selected'
      }
      
      const validPriorities = ['low', 'medium', 'high', 'urgent']
      if (data.priority && !validPriorities.includes(data.priority)) {
        errors.priority = 'Invalid priority selected'
      }
      
      return {
        valid: Object.keys(errors).length === 0,
        errors
      }
    },

    content: (data) => {
      const errors = {}
      
      if (!data.topic?.trim()) {
        errors.topic = 'Topic is required'
      }
      
      const validTypes = ['social', 'blog', 'email', 'video', 'ad', 'seo']
      if (data.type && !validTypes.includes(data.type)) {
        errors.type = 'Invalid content type selected'
      }
      
      const validTones = ['engaging', 'professional', 'casual', 'humorous', 'inspirational', 'educational']
      if (data.tone && !validTones.includes(data.tone)) {
        errors.tone = 'Invalid tone selected'
      }
      
      return {
        valid: Object.keys(errors).length === 0,
        errors
      }
    },

    insight: (data) => {
      const errors = {}
      
      const validFocus = ['productivity', 'mindfulness', 'creativity', 'motivation', 'learning', 'growth']
      if (data.focus && !validFocus.includes(data.focus)) {
        errors.focus = 'Invalid focus area selected'
      }
      
      return {
        valid: Object.keys(errors).length === 0,
        errors
      }
    }
  },

  // API key validation
  apiKey: (key) => {
    if (!key) {
      return { valid: false, message: 'API key is required' }
    }
    if (key.length < 20) {
      return { valid: false, message: 'API key appears to be invalid' }
    }
    return { valid: true }
  },

  // File validation
  file: (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
      minSize = 0
    } = options

    const errors = []

    if (!file) {
      errors.push('No file selected')
      return { valid: false, errors }
    }

    if (file.size < minSize) {
      errors.push(`File is too small (minimum ${minSize} bytes)`)
    }

    if (file.size > maxSize) {
      errors.push(`File is too large (maximum ${maxSize / 1024 / 1024}MB)`)
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  },

  // Sanitize input
  sanitize: {
    text: (text) => {
      if (!text) return ''
      // Remove HTML tags
      return text.replace(/<[^>]*>/g, '')
                 .replace(/[<>]/g, '')
                 .trim()
    },
    
    email: (email) => {
      if (!email) return ''
      return email.trim().toLowerCase()
    },
    
    filename: (filename) => {
      if (!filename) return ''
      return filename.replace(/[^a-zA-Z0-9._-]/g, '')
    }
  }
}

export default validation