export const APP_CONFIG = {
  name: 'AI Automation Hub',
  version: '1.0.0',
  description: 'Smart AI Tools & Productivity Platform',
  
  api: {
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'liquid/lfm-2.5-1.2b-thinking:free',
    visionModel: 'allenai/molmo-2-8b:free',
    timeout: 60000,
    maxRetries: 3
  },
  
  storage: {
    prefix: 'ai_hub_',
    expiry: {
      user: 7 * 24 * 60 * 60 * 1000, // 7 days
      chat: 30 * 24 * 60 * 60 * 1000, // 30 days
      temp: 60 * 60 * 1000 // 1 hour
    }
  },
  
  ui: {
    animation: {
      duration: 0.3,
      ease: 'easeInOut'
    },
    toast: {
      duration: 3000,
      position: 'bottom'
    },
    pagination: {
      pageSize: 10
    }
  },
  
  features: {
    chat: true,
    writer: true,
    summarizer: true,
    ideas: true,
    planner: true,
    content: true,
    insight: true,
    multiLanguage: true,
    pwa: true,
    pushNotifications: false
  },
  
  languages: [
    { code: 'en', name: 'English', nativeName: 'English', rtl: false },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
    { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false },
    { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false }
  ],
  
  tools: [
    {
      id: 'chat',
      name: 'AI Chat',
      icon: '💬',
      path: '/chat',
      color: 'from-accent-cyan to-accent-purple',
      description: 'Chat with AI assistant'
    },
    {
      id: 'writer',
      name: 'AI Writer',
      icon: '✍️',
      path: '/writer',
      color: 'from-purple-500 to-pink-500',
      description: 'Generate articles & content'
    },
    {
      id: 'summarizer',
      name: 'Summarizer',
      icon: '📄',
      path: '/summarizer',
      color: 'from-green-500 to-teal-500',
      description: 'Summarize long texts'
    },
    {
      id: 'ideas',
      name: 'Idea Generator',
      icon: '💡',
      path: '/ideas',
      color: 'from-yellow-500 to-orange-500',
      description: 'Generate creative ideas'
    },
    {
      id: 'planner',
      name: 'Task Planner',
      icon: '📅',
      path: '/planner',
      color: 'from-blue-500 to-indigo-500',
      description: 'Plan your tasks'
    },
    {
      id: 'content',
      name: 'Content Generator',
      icon: '📱',
      path: '/content',
      color: 'from-pink-500 to-rose-500',
      description: 'Create social media content'
    },
    {
      id: 'insight',
      name: 'Daily Insight',
      icon: '✨',
      path: '/insight',
      color: 'from-cyan-500 to-blue-500',
      description: 'Get daily motivation'
    }
  ],
  
  quickActions: [
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
  ],
  
  social: {
    share: {
      title: 'AI Automation Hub',
      text: 'Boost your productivity with AI tools!',
      url: 'https://ai-automation-hub.app'
    }
  },
  
  links: {
    privacy: 'https://ai-automation-hub.app/privacy',
    terms: 'https://ai-automation-hub.app/terms',
    support: 'https://ai-automation-hub.app/support'
  },
  
  limits: {
    maxChatHistory: 50,
    maxSavedIdeas: 20,
    maxPlans: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxInputLength: 10000
  }
}

export const THEMES = {
  dark: {
    background: {
      primary: '#0B0B1F',
      secondary: '#14142B',
      card: 'rgba(20, 20, 43, 0.7)'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0C0',
      tertiary: '#707090'
    },
    gradient: {
      start: '#1E1E4A',
      middle: '#4A1E6A',
      end: '#2E1E5C'
    }
  },
  darker: {
    background: {
      primary: '#050510',
      secondary: '#0A0A1A',
      card: 'rgba(10, 10, 26, 0.7)'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0A0B0',
      tertiary: '#606080'
    },
    gradient: {
      start: '#151530',
      middle: '#351550',
      end: '#201540'
    }
  }
}

export const ACCENTS = {
  default: {
    primary: '#00F0FF',
    secondary: '#8A2BE2',
    glow: 'rgba(0, 240, 255, 0.3)'
  },
  purple: {
    primary: '#B026FF',
    secondary: '#FF36B0',
    glow: 'rgba(176, 38, 255, 0.3)'
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#10B981',
    glow: 'rgba(59, 130, 246, 0.3)'
  }
}