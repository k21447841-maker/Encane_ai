import { generateCompletion, generateStreamingCompletion } from './openrouter'
import { getSystemPrompt } from '../utils/promptTemplates'

export const generateAIResponse = async (
  message,
  {
    language = 'en',
    tool = 'chat',
    context = {},
    chatHistory = [],
    stream = false,
    onChunk = null
  } = {}
) => {
  try {
    // Get system prompt based on tool and language
    const systemPrompt = getSystemPrompt(tool, language)
    
    // Format chat history
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...formattedHistory,
      {
        role: 'user',
        content: message
      }
    ]

    // Add context if provided
    if (Object.keys(context).length > 0) {
      messages[0].content += `\n\nContext Information:\n${JSON.stringify(context, null, 2)}`
    }

    // Generate response
    if (stream && onChunk) {
      let fullResponse = ''
      await generateStreamingCompletion({
        messages,
        onChunk: (chunk) => {
          fullResponse += chunk
          onChunk(chunk)
        }
      })
      return fullResponse
    } else {
      const response = await generateCompletion({
        messages,
        temperature: 0.7,
        maxTokens: 2000
      })

      return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.'
    }
  } catch (error) {
    console.error('AI Service Error:', error)
    
    // Return user-friendly error message
    if (error.message.includes('API key')) {
      return '⚠️ API configuration issue. Please check your OpenRouter API key in the .env file.'
    } else if (error.message.includes('Network')) {
      return '⚠️ Network error. Please check your internet connection and try again.'
    } else {
      return '⚠️ Service temporarily unavailable. Please try again in a few moments.'
    }
  }
}

export const generateToolResponse = async (tool, input, options = {}) => {
  const toolPrompts = {
    writer: (input) => `Generate ${input.tone || 'professional'} ${input.format || 'content'} about: ${input.topic}. Length: ${input.length || 'medium'}. Additional requirements: ${input.requirements || 'None'}`,
    
    summarizer: (input) => `Summarize the following text concisely while preserving key information. Provide main points and key takeaways:\n\n${input.text}`,
    
    ideas: (input) => `Generate creative and practical ideas for: ${input.category}. Context: ${input.context || 'general'}. Number of ideas: ${input.count || 5}. Provide detailed explanations for each idea.`,
    
    planner: (input) => `Create a detailed ${input.timeframe || 'daily'} task plan for: ${input.goal}. Priority level: ${input.priority || 'medium'}. Include: tasks breakdown, time estimates, and priority order.`,
    
    content: (input) => `Generate engaging ${input.type || 'social media'} content for: ${input.topic}. Target audience: ${input.audience || 'general'}. Include: main content, hashtags, and posting suggestions.`,
    
    insight: (input) => `Provide daily productivity insights based on: ${input.focus || 'general productivity'}. User's goal: ${input.goal || 'improve productivity'}. Include: focus area, actionable tip, motivation, and daily affirmation.`
  }

  const prompt = toolPrompts[tool]?.(input) || input.message || 'Generate helpful response'
  
  return generateAIResponse(prompt, {
    tool,
    language: input.language || 'en',
    ...options
  })
}