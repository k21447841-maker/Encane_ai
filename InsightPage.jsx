import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAI } from '../hooks/useAI'
import { useUser } from '../hooks/useUser'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'

const InsightPage = () => {
  const { generateToolResponse, loading } = useAI()
  const { user } = useUser()
  const [insight, setInsight] = useState(null)
  const [focus, setFocus] = useState('productivity')
  const [refreshing, setRefreshing] = useState(false)

  const focusAreas = [
    { id: 'productivity', label: 'Productivity', icon: '⚡', color: 'from-yellow-400 to-orange-400' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: 'from-green-400 to-teal-400' },
    { id: 'creativity', label: 'Creativity', icon: '🎨', color: 'from-purple-400 to-pink-400' },
    { id: 'motivation', label: 'Motivation', icon: '🔥', color: 'from-red-400 to-orange-400' },
    { id: 'learning', label: 'Learning', icon: '📚', color: 'from-blue-400 to-indigo-400' },
    { id: 'growth', label: 'Personal Growth', icon: '🌱', color: 'from-emerald-400 to-green-400' }
  ]

  useEffect(() => {
    loadInsight()
  }, [focus])

  const loadInsight = async () => {
    try {
      const result = await generateToolResponse('insight', {
        focus,
        goal: user?.usageGoal || 'personal'
      })
      setInsight(result)
    } catch (error) {
      console.error('Failed to load insight:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadInsight()
    setRefreshing(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Daily Insight',
        text: insight,
      }).catch(console.error)
    }
  }

  const parseInsight = (text) => {
    if (!text) return null
    
    const sections = text.split('\n\n')
    return {
      focus: sections[0] || '',
      tip: sections[1] || '',
      motivation: sections[2] || '',
      affirmation: sections[3] || ''
    }
  }

  const parsedInsight = insight ? parseInsight(insight) : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card variant="gradient">
        <h1 className="text-2xl font-bold gradient-text mb-2">Daily Insight</h1>
        <p className="text-white/60">
          Personalized guidance for your daily journey
        </p>
      </Card>

      {/* Focus Area Selection */}
      <Card>
        <label className="block text-white/80 text-sm mb-3">Focus Area</label>
        <div className="grid grid-cols-3 gap-2">
          {focusAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => setFocus(area.id)}
              className={`p-3 rounded-xl border-2 transition-all ${
                focus === area.id
                  ? 'border-accent-cyan bg-accent-cyan/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-2xl mb-1">{area.icon}</div>
              <div className={`text-xs ${
                focus === area.id ? 'text-accent-cyan' : 'text-white/60'
              }`}>
                {area.label}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Main Insight Card */}
      {loading || refreshing ? (
        <Card className="py-12">
          <Loader text="Getting your insight..." />
        </Card>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card className="relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent-purple/10 to-accent-cyan/10 rounded-full blur-3xl" />
            
            {/* Date */}
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                  <span className="text-xl">📅</span>
                </div>
                <div>
                  <p className="text-sm text-white/40">Today's Insight</p>
                  <p className="text-white font-medium">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="small"
                className="!p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
            </div>

            {/* Insight Content */}
            <div className="relative z-10 space-y-6">
              {parsedInsight ? (
                <>
                  {/* Focus Area */}
                  <div>
                    <h2 className="text-2xl font-bold gradient-text mb-2">
                      {parsedInsight.focus}
                    </h2>
                  </div>

                  {/* Main Tip */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">💡</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">Today's Tip</h3>
                        <p className="text-white/80">{parsedInsight.tip}</p>
                      </div>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">✨</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">Motivation</h3>
                        <p className="text-white/80 italic">{parsedInsight.motivation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Affirmation */}
                  <div className="text-center p-4">
                    <p className="text-lg text-accent-cyan font-medium">
                      "{parsedInsight.affirmation}"
                    </p>
                  </div>
                </>
              ) : (
                <div className="whitespace-pre-wrap text-white/90">
                  {insight}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex gap-3 mt-6 pt-4 border-t border-white/10">
              <Button
                onClick={handleShare}
                variant="secondary"
                fullWidth
              >
                Share Insight
              </Button>
              <Button
                onClick={() => {/* Save to journal */}}
                variant="secondary"
                fullWidth
              >
                Save to Journal
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className="p-4 text-center cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => setFocus('productivity')}
        >
          <span className="text-3xl mb-2 block">⚡</span>
          <p className="text-white text-sm">Productivity Mode</p>
        </Card>
        
        <Card 
          className="p-4 text-center cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => setFocus('mindfulness')}
        >
          <span className="text-3xl mb-2 block">🧘</span>
          <p className="text-white text-sm">Mindfulness Mode</p>
        </Card>
      </div>

      {/* Journal Entry */}
      <Card variant="flat">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📔</span>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium mb-2">Quick Journal</h4>
            <textarea
              placeholder="Write your thoughts for today..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:border-accent-cyan focus:outline-none"
              rows={3}
            />
            <Button variant="ghost" size="small" className="mt-2">
              Save Entry
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default InsightPage