import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAI } from '../hooks/useAI'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'

const PlannerPage = () => {
  const { generateToolResponse, loading } = useAI()
  const [formData, setFormData] = useState({
    goal: '',
    timeframe: 'daily',
    priority: 'medium',
    tasks: '',
    deadline: ''
  })
  const [plan, setPlan] = useState(null)
  const [activeTab, setActiveTab] = useState('create')

  const timeframes = [
    { id: 'daily', label: 'Daily', icon: '📅' },
    { id: 'weekly', label: 'Weekly', icon: '📆' },
    { id: 'monthly', label: 'Monthly', icon: '🗓️' },
    { id: 'custom', label: 'Custom', icon: '⏰' }
  ]

  const priorities = [
    { id: 'low', label: 'Low', color: 'text-green-400', bg: 'bg-green-400/20' },
    { id: 'medium', label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
    { id: 'high', label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/20' },
    { id: 'urgent', label: 'Urgent', color: 'text-red-400', bg: 'bg-red-400/20' }
  ]

  const handleGenerate = async () => {
    if (!formData.goal.trim()) return

    try {
      const result = await generateToolResponse('planner', formData)
      setPlan(result)
    } catch (error) {
      console.error('Planner error:', error)
    }
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
        <h1 className="text-2xl font-bold gradient-text mb-2">Task Planner</h1>
        <p className="text-white/60">
          Create intelligent task plans and achieve your goals
        </p>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
        {['create', 'active', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-accent-cyan text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'create' && (
        <>
          {/* Input Form */}
          <Card>
            <div className="space-y-4">
              <Input
                label="Your Goal"
                placeholder="What do you want to achieve?"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                required
              />

              <div>
                <label className="block text-white/80 text-sm mb-2">Timeframe</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeframes.map((tf) => (
                    <button
                      key={tf.id}
                      onClick={() => setFormData({ ...formData, timeframe: tf.id })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.timeframe === tf.id
                          ? 'border-accent-cyan bg-accent-cyan/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-1">{tf.icon}</div>
                      <div className={`text-xs ${
                        formData.timeframe === tf.id ? 'text-accent-cyan' : 'text-white/60'
                      }`}>
                        {tf.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.timeframe === 'custom' && (
                <Input
                  type="date"
                  label="Deadline"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              )}

              <div>
                <label className="block text-white/80 text-sm mb-2">Priority Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setFormData({ ...formData, priority: p.id })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.priority === p.id
                          ? 'border-accent-cyan'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`text-xs font-medium ${p.color}`}>
                        {p.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Current Tasks (Optional)"
                placeholder="List any existing tasks or constraints..."
                value={formData.tasks}
                onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
                multiline
                rows={3}
              />

              <Button
                onClick={handleGenerate}
                disabled={!formData.goal.trim() || loading}
                fullWidth
                size="large"
                variant="primary"
              >
                {loading ? <Loader size="small" /> : 'Create Plan'}
              </Button>
            </div>
          </Card>

          {/* Generated Plan */}
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Your Action Plan</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="small">
                      Save
                    </Button>
                    <Button variant="ghost" size="small">
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="whitespace-pre-wrap text-white/90">
                    {plan}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {activeTab === 'active' && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-2">No Active Plans</h3>
            <p className="text-white/40 text-sm">
              Create a new plan to get started
            </p>
          </div>
        </Card>
      )}

      {activeTab === 'completed' && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-2">No Completed Plans</h3>
            <p className="text-white/40 text-sm">
              Your completed plans will appear here
            </p>
          </div>
        </Card>
      )}
    </motion.div>
  )
}

export default PlannerPage