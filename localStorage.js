class LocalStorageService {
  constructor() {
    this.prefix = 'ai_hub_'
  }

  // Get full key with prefix
  getKey(key) {
    return this.prefix + key
  }

  // Set item
  set(key, value, expiryInMinutes = null) {
    try {
      const item = {
        value: value,
        timestamp: Date.now()
      }

      if (expiryInMinutes) {
        item.expiry = Date.now() + (expiryInMinutes * 60 * 1000)
      }

      localStorage.setItem(this.getKey(key), JSON.stringify(item))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  }

  // Get item
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.getKey(key))
      
      if (!item) {
        return defaultValue
      }

      const parsed = JSON.parse(item)

      // Check if expired
      if (parsed.expiry && Date.now() > parsed.expiry) {
        this.remove(key)
        return defaultValue
      }

      return parsed.value
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  }

  // Remove item
  remove(key) {
    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  }

  // Clear all app data
  clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  // Check if key exists
  has(key) {
    return localStorage.getItem(this.getKey(key)) !== null
  }

  // Get all keys
  keys() {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''))
      }
    }
    return keys
  }

  // Get item with metadata
  getWithMetadata(key) {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (!item) return null
      
      const parsed = JSON.parse(item)
      return {
        value: parsed.value,
        timestamp: parsed.timestamp,
        expiry: parsed.expiry,
        isExpired: parsed.expiry ? Date.now() > parsed.expiry : false
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }

  // Set multiple items
  setMultiple(items) {
    const results = []
    for (const [key, value] of Object.entries(items)) {
      results.push(this.set(key, value))
    }
    return results.every(r => r === true)
  }

  // Get multiple items
  getMultiple(keys) {
    const result = {}
    for (const key of keys) {
      result[key] = this.get(key)
    }
    return result
  }

  // Remove multiple items
  removeMultiple(keys) {
    const results = []
    for (const key of keys) {
      results.push(this.remove(key))
    }
    return results.every(r => r === true)
  }

  // Get size of stored data
  getSize() {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key)
        total += value.length
      }
    }
    return total // in bytes
  }

  // Check if storage is almost full (over 4MB)
  isAlmostFull() {
    const size = this.getSize()
    const limit = 5 * 1024 * 1024 // 5MB limit
    return size > limit * 0.8 // 80% full
  }

  // Clean expired items
  cleanExpired() {
    let cleaned = 0
    this.keys().forEach(key => {
      const metadata = this.getWithMetadata(key)
      if (metadata?.isExpired) {
        this.remove(key)
        cleaned++
      }
    })
    return cleaned
  }

  // User preferences
  setUserPreferences(preferences) {
    return this.set('user_preferences', preferences)
  }

  getUserPreferences() {
    return this.get('user_preferences', {})
  }

  // Chat history
  saveChatHistory(sessionId, messages) {
    return this.set(`chat_${sessionId}`, messages)
  }

  getChatHistory(sessionId) {
    return this.get(`chat_${sessionId}`, [])
  }

  // User profile
  setUserProfile(profile) {
    return this.set('user_profile', profile)
  }

  getUserProfile() {
    return this.get('user_profile', null)
  }

  // App settings
  setAppSettings(settings) {
    return this.set('app_settings', settings)
  }

  getAppSettings() {
    return this.get('app_settings', {})
  }

  // Last used tools
  setLastUsedTool(toolId) {
    return this.set('last_used_tool', toolId)
  }

  getLastUsedTool() {
    return this.get('last_used_tool', null)
  }

  // Tool history
  addToolHistory(toolId, input, output) {
    const history = this.get('tool_history', [])
    history.unshift({
      toolId,
      input,
      output,
      timestamp: Date.now()
    })
    
    // Keep only last 50 items
    if (history.length > 50) {
      history.pop()
    }
    
    return this.set('tool_history', history)
  }

  getToolHistory(limit = 10) {
    const history = this.get('tool_history', [])
    return history.slice(0, limit)
  }

  // API key (encrypted in production)
  setAPIKey(apiKey) {
    // In production, you'd want to encrypt this
    return this.set('api_key', apiKey)
  }

  getAPIKey() {
    return this.get('api_key', '')
  }
}

export default new LocalStorageService()