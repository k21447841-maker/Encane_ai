import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAI } from '../hooks/useAI'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'

const ContentPage = () => {
  const { generateToolResponse, loading } = useAI()
  const [formData, setFormData] = useState({
    type: 'social',
    topic: '',
    platform: 'instagram',
    audience: 'general',
    tone: 'engaging',
    includeHashtags: true
  })
  const [content, setContent] = useState(null)
  const [copied, setCopied] = useState(false)

  const contentTypes = [
    { id: 'social', label: 'Social Media', icon: '📱', platforms: ['instagram', 'twitter', 'facebook', 'linkedin', 'tiktok'] },
    { id: 'blog', label: 'Blog Post', icon: '📝', platforms: ['wordpress', 'medium', 'personal'] },
    { id: 'email', label: 'Email', icon: '✉️', platforms: ['newsletter', 'marketing', 'cold'] },
    { id: 'video', label: 'Video Script', icon: '🎥', platforms: ['youtube', 'tiktok', 'reels'] },
    { id: 'ad', label: 'Ad Copy', icon: '📢', platforms: ['facebook', 'google', 'instagram'] },
    { id: 'seo', label: 'SEO Content', icon: '🔍', platforms: ['blog', 'website', 'article'] }
  ]

  const platforms = {
    instagram: { icon: '📸', color: 'from-pink-500 to-purple-500' },
    twitter: { icon: '🐦', color: 'from-blue-400 to-cyan-400' },
    facebook: { icon: '👥', color: 'from-blue-600 to-indigo-600' },
    linkedin: { icon: '💼', color: 'from-blue-700 to-blue-500' },
    youtube: { icon: '▶️', color: 'from-red-500 to-red-600' },
    tiktok: { icon: '🎵', color: 'from-black to-gray-800' }
  }

  const tones = [
    { id: 'engaging', label: 'Engaging', icon: '🎯' },
    { id: 'professional', label: 'Professional', icon: '👔' },
    { id: 'casual', label: 'Casual', icon: '😊' },
    { id: 'humorous', label: 'Humorous', icon: '😂' },
    { id: 'inspirational', label: 'Inspirational', icon: '✨' },
    { id: 'educational', label: 'Educational', icon: '📚' }
  ]

  const handleGenerate = async () => {
    if (!formData.topic.trim()) return

    try {
      const result = await generateToolResponse('content', formData)
      setContent(result)
    } catch (error) {
      console.error('Content generator error:', error)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Generated Content',
        text: content,
      }).catch(console.error)
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
        <h1 className="text-2xl font-bold gradient-text mb-2">Content Generator</h1>
        <p className="text-white/60">
          Create engaging content for social media, blogs, and more
        </p>
      </Card>

      {/* Content Type Selection */}
      <Card>
        <label className="block text-white/80 text-sm mb-3">Content Type</label>
        <div className="grid grid-cols-3 gap-2">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFormData({ ...formData, type: type.id, platform: type.platforms[0] })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.type === type.id
                  ? 'border-accent-cyan bg-accent-cyan/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className={`text-xs font-medium ${
                formData.type === type.id ? 'text-accent-cyan' : 'text-white/60'
              }`}>
                {type.label}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Platform Selection */}
      {formData.type && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <label className="block text-white/80 text-sm mb-3">Platform</label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.find(t => t.id === formData.type)?.platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setFormData({ ...formData, platform })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                    formData.platform === platform
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl">{platforms[platform]?.icon || '📱'}</span>
                  <span className="text-sm capitalize">{platform}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main Form */}
      <Card>
        <div className="space-y-4">
          <Input
            label="Topic / Subject"
            placeholder="What's your content about?"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            required
          />

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

          <Input
            label="Target Audience"
            placeholder="Who is this content for?"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                formData.includeHashtags ? 'bg-accent-cyan' : 'bg-white/20'
              }`}
              onClick={() => setFormData({ ...formData, includeHashtags: !formData.includeHashtags })}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  formData.includeHashtags ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="text-white/80">Include relevant hashtags</span>
          </label>

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

      {/* Generated Content */}
      {content && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Your Content</h3>
                <p className="text-xs text-white/40">
                  Ready to post on {formData.platform}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="small"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="ghost"
                  size="small"
                >
                  Share
                </Button>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="whitespace-pre-wrap text-white/90">
                {content}
              </div>
            </div>

            {/* Preview Card */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2">Preview</p>
              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple" />
                  <div>
                    <p className="text-sm font-medium text-white">Your Brand</p>
                    <p className="text-xs text-white/40">Just now</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm line-clamp-3">
                  {content.split('\n')[0]}
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
            <h4 className="text-white font-medium mb-1">Content Tips</h4>
            <ul className="text-white/40 text-sm space-y-1">
              <li>• Use attention-grabbing hooks in the first line</li>
              <li>• Add emojis for better engagement on social media</li>
              <li>• Include a clear call-to-action (CTA)</li>
              <li>• Optimize post timing for your audience</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ContentPage