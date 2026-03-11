import axios from 'axios'

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'liquid/lfm-2.5-1.2b-thinking:free'
const VISION_MODEL = import.meta.env.VITE_OPENROUTER_VISION_MODEL || 'allenai/molmo-2-8b:free'

const openrouterClient = axios.create({
  baseURL: OPENROUTER_BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'AI Automation Hub'
  }
})

// Request interceptor to add API key
openrouterClient.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not found. Please check your .env file.')
  }
  
  config.headers.Authorization = `Bearer ${apiKey}`
  return config
})

// Response interceptor for error handling
openrouterClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          throw new Error('Invalid API key. Please check your OpenRouter API key.')
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.')
        case 503:
          throw new Error('Service temporarily unavailable. Please try again.')
        default:
          throw new Error(data.error?.message || 'Failed to communicate with AI service')
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error. Please check your internet connection.')
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred.')
    }
  }
)

export const generateCompletion = async ({
  messages,
  model = DEFAULT_MODEL,
  temperature = 0.7,
  maxTokens = 1000,
  stream = false
}) => {
  try {
    const response = await openrouterClient.post('/chat/completions', {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream
    })
    
    return response.data
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    throw error
  }
}

export const generateStreamingCompletion = async ({
  messages,
  model = DEFAULT_MODEL,
  temperature = 0.7,
  maxTokens = 1000,
  onChunk
}) => {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Automation Hub'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content || ''
            if (content) {
              onChunk(content)
            }
          } catch (e) {
            console.error('Error parsing streaming response:', e)
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming Error:', error)
    throw error
  }
}

export const analyzeImage = async (imageBase64, prompt) => {
  try {
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: imageBase64
            }
          }
        ]
      }
    ]

    const response = await generateCompletion({
      messages,
      model: VISION_MODEL,
      maxTokens: 500
    })

    return response.choices[0]?.message?.content || 'Unable to analyze image'
  } catch (error) {
    console.error('Image Analysis Error:', error)
    throw error
  }
}

export default openrouterClient