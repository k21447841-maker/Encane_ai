import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '../hooks/useAI'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'

const IdeaPage = () => {
  const { generateToolResponse, loading } = useAI()
  const [formData, setFormData] = useState({
    category: 'business',
    context: '',
    count: 5
  })
  const [ideas, setIdeas] = useState(null)
  const [savedIdeas, setSavedIdeas] = useState([])
  const [activeIdea, setActiveIdea] = useState(null)

  const categories = [
    { id: 'business', label: 'Business Ideas', icon: '💼', color: 'from-blue-500 to-cyan-500' },
    { id: 'startup', label: 'Startup Ideas', icon: '🚀', color: 'from-purple-500 to-pink-500' },
    { id: 'content', label: 'Content Ideas', icon: '📝', color: 'from-green-500 to-teal-500' },
    { id: 'marketing', label: 'Marketing Ideas', icon: '📢', color: 'from-orange-500 to-red-500' },
    { id: 'product', label: 'Product Ideas', icon: '🎯', color: 'from-indigo-500 to-purple-500' },
    { id: 'creative', label: 'Creative Ideas', icon: '🎨', color: 'from-pink-500 to-rose-500' }
  ]

  const handleGenerate = async () => {
    try {
      const result = await generateToolResponse('ideas', formData)
      setIdeas(result)
    } catch (error) {
      console.error('Idea generator error:', error)
    }
  }

  const handleSaveIdea = (idea) => {
    setSavedIdeas(prev => [...prev, { ...idea, id: Date.now(), savedAt: new Date().toISOString() }])
  }

  const handleRemoveSaved = (id) => {
    setSavedIdeas(prev => prev.filter(idea => idea.id !== id))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card variant="gradient">
        <h1 className="text-2xl font-bold gradient-text mb-2">Idea Generator</h1>
        <p className="text-white/60">
          Generate creative and innovative ideas for any purpose
        </p>
      </Card>

      {/* Category Selection */}
      <Card>
        <label className="block text-white/80 text-sm mb-3">Select Category</label>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFormData({ ...formData, category: cat.id })}
              className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all ${
                formData.category === cat.id
                  ? 'border-accent-cyan'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className={`font-medium ${
                formData.category === cat.id ? 'text-accent-cyan' : 'text-white'
              }`}>
                {cat.label}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Input Form */}
      <Card>
        <div className="space-y-4">
          <Input
            label="Context / Description (Optional)"
            placeholder="Describe what kind of ideas you need..."
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            multiline
            rows={3}
          />

          <div>
            <label className="block text-white/80 text-sm mb-2">Number of Ideas</label>
            <div className="flex gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setFormData({ ...formData, count: num })}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    formData.count === num
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className={`font-medium ${
                    formData.count === num ? 'text-accent-cyan' : 'text-white'
                  }`}>
                    {num}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            fullWidth
            size="large"
            variant="primary"
          >
            {loading ? <Loader size="small" /> : 'Generate Ideas'}
          </Button>
        </div>
      </Card>

      {/* Generated Ideas */}
      {ideas && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h3 className="font-semibold text-white mb-4">Generated Ideas</h3>
            
            <div className="space-y-4">
              {typeof ideas === 'string' ? (
                <div className="bg-white/5 rounded-xl p-4 whitespace-pre-wrap">
                  {ideas}
                </div>
              ) : (
                <p className="text-white/80">{ideas}</p>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              <Button
                onClick={() => setIdeas(null)}
                variant="ghost"
                size="small"
              >
                Generate More
              </Button>
              <Button
                onClick={() => handleSaveIdea(ideas)}
                variant="ghost"
                size="small"
              >
                Save Ideas
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Saved Ideas */}
      {savedIdeas.length > 0 && (
        <Card>
          <h3 className="font-semibold text-white mb-4">Saved Ideas</h3>
          
          <div className="space-y-3">
            {savedIdeas.map((idea) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/5 rounded-xl p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white/90 text-sm line-clamp-2">
                      {typeof idea === 'string' ? idea.substring(0, 100) + '...' : 'Saved idea'}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      Saved {new Date(idea.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveSaved(idea.id)}
                    className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Inspiration */}
      <Card variant="flat">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">✨</span>
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Need inspiration?</h4>
            <p className="text-white/40 text-sm">
              Try these: "Eco-friendly business ideas", "AI tools for education", 
              "Content ideas for fitness influencers", "Marketing strategies for small businesses"
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default IdeaPage