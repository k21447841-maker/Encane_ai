import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAI } from '../hooks/useAI'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'

const SummarizerPage = () => {
  const { generateToolResponse, loading } = useAI()
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryType, setSummaryType] = useState('concise')
  const [copied, setCopied] = useState(false)

  const summaryTypes = [
    { id: 'concise', label: 'Concise', icon: '📌', description: 'Key points only' },
    { id: 'detailed', label: 'Detailed', icon: '📚', description: 'Comprehensive summary' },
    { id: 'bullet', label: 'Bullet Points', icon: '•', description: 'List format' },
    { id: 'executive', label: 'Executive', icon: '📊', description: 'Executive summary' }
  ]

  const handleSummarize = async () => {
    if (!inputText.trim()) return

    try {
      const result = await generateToolResponse('summarizer', {
        text: inputText,
        type: summaryType
      })
      setSummary(result)
    } catch (error) {
      console.error('Summarizer error:', error)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInputText('')
    setSummary('')
  }

  const examples = [
    'Paste a long article, blog post, or document here...',
    'Summarize this meeting notes: Team discussed Q4 goals...',
    'TL;DR of this research paper about AI productivity...'
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card variant="gradient">
        <h1 className="text-2xl font-bold gradient-text mb-2">AI Summarizer</h1>
        <p className="text-white/60">
          Instantly summarize long texts, articles, and documents
        </p>
      </Card>

      {/* Input Section */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Summary Type</label>
            <div className="grid grid-cols-2 gap-2">
              {summaryTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSummaryType(type.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    summaryType === type.id
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className={`font-medium text-sm ${
                    summaryType === type.id ? 'text-accent-cyan' : 'text-white'
                  }`}>
                    {type.label}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Text to Summarize"
            placeholder={examples[0]}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            multiline
            rows={8}
            required
          />

          {/* Examples */}
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setInputText(example)}
                className="px-3 py-1.5 rounded-full bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors"
              >
                Example {index + 1}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSummarize}
              disabled={!inputText.trim() || loading}
              variant="primary"
              fullWidth
              size="large"
            >
              {loading ? <Loader size="small" /> : 'Summarize'}
            </Button>
            
            {inputText && (
              <Button
                onClick={handleClear}
                variant="secondary"
                size="large"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Summary Output */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Summary</h3>
                <p className="text-xs text-white/40">
                  {summaryType.charAt(0).toUpperCase() + summaryType.slice(1)} format
                </p>
              </div>
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="small"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </Button>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                  {summary}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
              <div>
                <span className="text-xs text-white/40">Original</span>
                <p className="text-sm text-white font-medium">
                  {inputText.split(/\s+/).length} words
                </p>
              </div>
              <div>
                <span className="text-xs text-white/40">Summary</span>
                <p className="text-sm text-white font-medium">
                  {summary.split(/\s+/).length} words
                </p>
              </div>
              <div>
                <span className="text-xs text-white/40">Reduction</span>
                <p className="text-sm text-accent-cyan font-medium">
                  {Math.round((1 - summary.split(/\s+/).length / inputText.split(/\s+/).length) * 100)}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tips */}
      <Card variant="flat">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Tips for better summaries</h4>
            <ul className="text-white/40 text-sm space-y-1">
              <li>• Paste the full text for best results</li>
              <li>• Choose the summary type based on your needs</li>
              <li>• For articles, include the title and source</li>
              <li>• Use bullet points format for quick scanning</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default SummarizerPage