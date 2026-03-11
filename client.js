import axios from 'axios'

class APIClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add timestamp for cache busting if needed
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now()
          }
        }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response.data
      },
      async (error) => {
        const originalRequest = error.config

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            const refreshToken = localStorage.getItem('refreshToken')
            const response = await this.refreshToken(refreshToken)
            
            localStorage.setItem('authToken', response.token)
            this.client.defaults.headers.common['Authorization'] = `Bearer ${response.token}`
            
            return this.client(originalRequest)
          } catch (refreshError) {
            // Redirect to login
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        // Handle other errors
        return Promise.reject(this.handleError(error))
      }
    )
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Bad request')
        case 403:
          return new Error('Access forbidden')
        case 404:
          return new Error('Resource not found')
        case 500:
          return new Error('Internal server error')
        default:
          return new Error(data.message || 'An error occurred')
      }
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error. Please check your connection.')
    } else {
      // Something else
      return new Error('An unexpected error occurred')
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await this.client.post('/auth/refresh', {
        refreshToken
      })
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // HTTP methods
  async get(url, config = {}) {
    return this.client.get(url, config)
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config)
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config)
  }

  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config)
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config)
  }

  // File upload
  async upload(url, file, onProgress = null) {
    const formData = new FormData()
    formData.append('file', file)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    }

    return this.client.post(url, formData, config)
  }

  // Download file
  async download(url, filename = null) {
    const response = await this.client.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([response])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    return response
  }
}

export default new APIClient()