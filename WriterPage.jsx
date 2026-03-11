import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAI } from '../hooks/useAI'
import { useLanguage } from '../hooks/useLanguage'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'

const WriterPage = () => {
  const { generateToolResponse, loading } = useAI()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    topic: '',
    format: 'article',
    tone: 'professional',
    length: 'medium',
    audience: 'general',
    requirements: ''
  })
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const formats = [
    { id: 'article', label: 'Article', icon: '📄' },
    { id: 'blog', label: 'Blog Post', icon: '📝' },
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'caption', label: 'Social Caption', icon: '📱' },
    { id: 'description', label: 'Product Description', icon: '🏷️' }
  ]

  const tones = [
    { id: 'professional', label: 'Professional', icon: '👔' },
    { id: 'casual', label: 'Casual', icon: '😊' },
    { id: 'enthusiastic', label: 'Enthusiastic', icon: '🎉' },
    { id: 'informative', label: 'Informative', icon: '📚' },
    { id: 'persuasive', label: 'Persuasive', icon: '🎯' }
  ]

  const lengths = [
    { id: 'short', label: 'Short', icon: '🔹' },
    { id: 'medium', label: 'Medium', icon: '🔸' },
    { id: 'long', label: 'Long', icon: '🔺' }
  ]

  const handleGenerate = async () => {
    if (!formData.topic.trim()) return

    try {
      const result = await generateToolResponse('writer', formData)
      setOutput(result)
    } catch (error) {
      console.error('Writer error:', error)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setOutput('')
    setFormData({
      topic: '',
      format: 'article',
      tone: 'professional',
      length: 'medium',
      audience: 'general',
      requirements: ''
    })
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
        <h1 className="text-2xl font-bold gradient-text mb-2">AI Writer</h1>
        <p className="text-white/60">
          Generate high-quality content for any purpose
        </p>
      </Card>

      {/* Input Form */}
      <Card>
        <div className="space-y-4">
          <Input
            label="Topic / Subject"
            placeholder="What do you want to write about?"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            required
          />

          <div>
            <label className="block text-white/80 text-sm mb-2">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setFormData({ ...formData, format: format.id })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.format === format.id
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{format.icon}</div>
                  <div className={`text-xs ${
                    formData.format === format.id ? 'text-accent-cyan' : 'text-white/60'
                  }`}>
                    {format.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">Tone</label>
            <div className="grid grid-cols-3 gap-2">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setFormData({ ...formData, tone: tone.id })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.tone === tone.id
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{tone.icon}</div>
                  <div className={`text-xs ${
                    formData.tone === tone.id ? 'text-accent-cyan' : 'text-white/60'
                  }`}>
                    {tone.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">Length</label>
            <div className="grid grid-cols-3 gap-2">
              {lengths.map((length) => (
                <button
                  key={length.id}
                  onClick={() => setFormData({ ...formData, length: length.id })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.length === length.id
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{length.icon}</div>
                  <div className={`text-xs ${
                    formData.length === length.id ? 'text-accent-cyan' : 'text-white/60'
                  }`}>
                    {length.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Target Audience (Optional)"
            placeholder="Who is this for? (e.g., professionals, students, beginners)"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
          />

          <Input
            label="Additional Requirements (Optional)"
            placeholder="Any specific requirements or keywords?"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            multiline
            rows={2}
          />

          <Button
            onClick={handleGenerate}
            disabled={!formData.topic.trim() || loading}
            fullWidth
            size="large"
            variant="primary"
          >
            {loading ? <Loader size="small" /> : 'Generate Content'}
          </Button>
        </div>
      </Card>

      {/* Output */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Generated Content</h3>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="small"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="ghost"
                  size="small"
                >
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="bg-white/5 rounded-xl p-4 whitespace-pre-wrap">
                {output}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

export default WriterPage