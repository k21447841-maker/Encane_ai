import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '../hooks/useAI'
import { useLanguage } from '../hooks/useLanguage'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'

const ChatPage = () => {
  const { sendMessage, loading, chatHistory } = useAI()
  const { t } = useLanguage()
  const [message, setMessage] = useState('')
  const [streamingMessage, setStreamingMessage] = useState('')
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, streamingMessage])

  const handleSend = async () => {
    if (!message.trim() || loading) return

    const userMessage = message
    setMessage('')
    setStreamingMessage('')

    try {
      await sendMessage(userMessage, {
        stream: true,
        onChunk: (chunk) => {
          setStreamingMessage(prev => prev + chunk)
        }
      })
      setStreamingMessage('')
    } catch (error) {
      console.error('Chat error:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    'Help me plan my day',
    'Generate content ideas',
    'Summarize this article',
    'Write a blog post',
    'Productivity tips',
    'Goal setting advice'
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-180px)]"
    >
      {/* Chat Header */}
      <Card variant="flat" className="mb-4 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple p-[2px]">
            <div className="w-full h-full rounded-2xl bg-[#14142B] flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text">AI Assistant</h2>
            <p className="text-white/40 text-sm">Ask me anything about productivity & automation</p>
          </div>
        </div>
      </Card>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
      >
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Start a Conversation</h3>
            <p className="text-white/40 max-w-xs">
              Ask me anything about productivity, writing, planning, or ideas
            </p>
          </div>
        ) : (
          <>
            {chatHistory.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple p-[1px] mr-2 flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-[#14142B] flex items-center justify-center">
                      <span className="text-xs">AI</span>
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-3xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white rounded-tr-none'
                      : 'bg-white/10 text-white rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-[10px] text-white/40 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple ml-2 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-white">You</span>
                  </div>
                )}
              </motion.div>
            ))}

            {streamingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple p-[1px] mr-2 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-[#14142B] flex items-center justify-center">
                    <span className="text-xs">AI</span>
                  </div>
                </div>
                
                <div className="max-w-[80%] rounded-3xl p-4 bg-white/10 text-white rounded-tl-none">
                  <p className="whitespace-pre-wrap">{streamingMessage}</p>
                  <span className="inline-block w-2 h-4 ml-1 bg-accent-cyan animate-pulse" />
                </div>
              </motion.div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {chatHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <p className="text-white/60 text-sm mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => setMessage(suggestion)}
                className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm hover:bg-white/20 transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <Card variant="flat" className="p-3">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            multiline
            rows={1}
            className="flex-1"
            disabled={loading}
          />
          
          <Button
            onClick={handleSend}
            disabled={!message.trim() || loading}
            variant="primary"
            className="!px-4 !py-0"
          >
            {loading ? (
              <Loader size="small" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default ChatPage