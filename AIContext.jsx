import React, { createContext, useState, useCallback } from 'react'
import { generateAIResponse } from '../services/api/aiService'

export const AIContext = createContext()

export const AIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [currentSession, setCurrentSession] = useState(null)

  const sendMessage = useCallback(async (message, context = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      // Add user message to chat history
      const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      }
      
      setChatHistory(prev => [...prev, userMessage])

      // Generate AI response
      const response = await generateAIResponse(message, {
        ...context,
        chatHistory: chatHistory.slice(-10) // Last 10 messages for context
      })

      // Add AI response to chat history
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }

      setChatHistory(prev => [...prev, aiMessage])
      
      return response
    } catch (err) {
      setError(err.message || 'Failed to generate response')
      throw err
    } finally {
      setLoading(false)
    }
  }, [chatHistory])

  const clearChat = useCallback(() => {
    setChatHistory([])
    setCurrentSession(null)
  }, [])

  const generateToolResponse = useCallback(async (tool, input, context = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const systemPrompt = getToolPrompt(tool, input)
      const response = await generateAIResponse(input, {
        ...context,
        systemPrompt,
        tool
      })
      
      return response
    } catch (err) {
      setError(err.message || `Failed to generate ${tool} response`)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getToolPrompt = (tool, input) => {
    const prompts = {
      writer: `You are an expert writer. Generate high-quality ${input.tone || 'professional'} content about: ${input.topic}. Length: ${input.length || 'medium'}. Format: ${input.format || 'article'}.`,
      
      summarizer: `Summarize the following text concisely while preserving key information. Provide a clear, structured summary with main points. Text: ${input.text}`,
      
      ideas: `Generate creative and practical ideas for: ${input.category}. Context: ${input.context || 'general'}. Provide detailed, actionable ideas with explanations.`,
      
      planner: `Create a detailed task plan for: ${input.goal}. Timeframe: ${input.timeframe || 'daily'}. Provide step-by-step tasks with priorities and estimated time.`,
      
      content: `Generate engaging content for: ${input.type}. Topic: ${input.topic}. Target audience: ${input.audience || 'general'}. Include relevant hashtags and suggestions.`,
      
      insight: `Provide daily productivity insights and motivation. User's goal: ${input.goal || 'general productivity'}. Include: focus area, tip, and motivation.`
    }
    
    return prompts[tool] || 'You are a helpful AI assistant. Provide clear, detailed, and helpful responses.'
  }

  return (
    <AIContext.Provider value={{
      loading,
      error,
      chatHistory,
      currentSession,
      sendMessage,
      clearChat,
      generateToolResponse,
      setCurrentSession
    }}>
      {children}
    </AIContext.Provider>
  )
}