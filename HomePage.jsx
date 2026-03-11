import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { useAI } from '../hooks/useAI'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { generateToolResponse } = useAI()
  const [dailyInsight, setDailyInsight] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDailyInsight()
  }, [])

  const loadDailyInsight = async () => {
    setLoading(true)
    try {
      const insight = await generateToolResponse('insight', {
        focus: 'productivity',
        goal: user?.usageGoal || 'personal'
      })
      setDailyInsight(insight)
    } catch (error) {
      console.error('Failed to load insight:', error)
    } finally {
      setLoading(false)
    }
  }

  const tools = [
    {
      id: 'chat',
      title: 'AI Chat',
      description: 'Chat with AI assistant',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'from-accent-cyan to-accent-purple',
      path: '/chat'
    },
    {
      id: 'writer',
      title: 'AI Writer',
      description: 'Generate articles & content',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      path: '/writer'
    },
    {
      id: 'summarizer',
      title: 'Summarizer',
      description: 'Summarize long texts',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
      color: 'from-green-500 to-teal-500',
      path: '/summarizer'
    },
    {
      id: 'ideas',
      title: 'Idea Generator',
      description: 'Generate creative ideas',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'from-yellow-500 to-orange-500',
      path: '/ideas'
    },
    {
      id: 'planner',
      title: 'Task Planner',
      description: 'Plan your tasks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-500',
      path: '/planner'
    },
    {
      id: 'content',
      title: 'Content Generator',
      description: 'Create social media content',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      color: 'from-pink-500 to-rose-500',
      path: '/content'
    }
  ]

  const quickActions = [
    {
      id: 'insight',
      title: 'Daily Insight',
      icon: '✨',
      path: '/insight'
    },
    {
      id: 'chat',
      title: 'Quick Chat',
      icon: '💬',
      path: '/chat'
    },
    {
      id: 'ideas',
      title: 'New Ideas',
      icon: '💡',
      path: '/ideas'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="gradient" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-3xl" />
          
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
          </h2>
          <p className="text-white/60">
            Ready to boost your productivity today?
          </p>
        </Card>
      </motion.div>

      {/* Daily Insight Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card 
          className="cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => navigate('/insight')}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <h3 className="font-semibold text-white">Today's Insight</h3>
            </div>
            <span className="text-xs text-white/40">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded-full animate-pulse" />
              <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse" />
            </div>
          ) : (
            <p className="text-white/80 line-clamp-2">
              {dailyInsight || "Focus on your most important task today. Start with a 25-minute deep work session."}
            </p>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                onClick={() => navigate(action.path)}
                className="p-4 text-center cursor-pointer hover:scale-[1.05] transition-transform"
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="text-white text-sm font-medium">{action.title}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-white mb-3">All Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <Card
                onClick={() => navigate(tool.path)}
                className="p-4 cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} p-[2px] mb-3`}>
                  <div className="w-full h-full rounded-xl bg-[#14142B] flex items-center justify-center text-white">
                    {tool.icon}
                  </div>
                </div>
                
                <h4 className="text-white font-semibold mb-1">{tool.title}</h4>
                <p className="text-white/40 text-xs">{tool.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default HomePage