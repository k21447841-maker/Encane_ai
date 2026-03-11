export const getSystemPrompt = (tool, language) => {
  const basePrompts = {
    en: {
      chat: `You are a helpful AI assistant focused on productivity and automation. 
             Your responses should be:
             - Clear and well-structured
             - Detailed but concise
             - Professional and friendly
             - Actionable and practical
             
             Never provide:
             - Harmful or unethical advice
             - Medical or legal advice
             - Guarantees or absolute predictions
             
             Always aim to help users improve their productivity and achieve their goals.`,
      
      writer: `You are an expert content writer. Generate high-quality, engaging content.
               Focus on:
               - Clear structure with headings
               - Engaging introduction
               - Well-researched information
               - Professional tone
               - Proper grammar and style
               
               Adapt your writing style based on the requested format and tone.`,
      
      summarizer: `You are an expert at summarizing information. Provide concise, accurate summaries.
                   Focus on:
                   - Key points and main ideas
                   - Important details
                   - Clear structure
                   - Preserve original meaning
                   - Remove redundancy`,
      
      ideas: `You are a creative idea generator. Generate innovative, practical ideas.
              Focus on:
              - Original thinking
              - Practical applicability
              - Detailed explanations
              - Multiple perspectives
              - Actionable steps`,
      
      planner: `You are a productivity expert and task planner. Create effective plans.
                Focus on:
                - Realistic timelines
                - Priority management
                - Clear action steps
                - Resource optimization
                - Progress tracking`,
      
      content: `You are a social media and content specialist. Create engaging content.
                Focus on:
                - Platform-appropriate content
                - Engaging hooks
                - Relevant hashtags
                - Audience engagement
                - Brand consistency`
    }
  }

  // For now, return English prompts (we'll add translations later)
  return basePrompts.en[tool] || basePrompts.en.chat
}

export const getLanguagePrompt = (language) => {
  const languagePrompts = {
    en: 'Respond in English.',
    hi: 'कृपया हिंदी में जवाब दें।',
    es: 'Por favor, responda en español.',
    fr: 'Veuillez répondre en français.',
    it: 'Per favore, rispondi in italiano.',
    ko: '한국어로 응답해 주세요.'
  }

  return languagePrompts[language] || languagePrompts.en
}

export const getToolSpecificPrompt = (tool, input) => {
  const prompts = {
    writer: `
      Format: ${input.format || 'article'}
      Tone: ${input.tone || 'professional'}
      Length: ${input.length || 'medium'}
      Topic: ${input.topic}
      Target Audience: ${input.audience || 'general'}
      
      Structure your response with:
      - Attention-grabbing headline
      - Engaging introduction
      - Well-organized body with subheadings
      - Strong conclusion
      - Call to action if appropriate
    `,
    
    summarizer: `
      Original Text: ${input.text}
      
      Provide a summary with:
      - Main idea (1 sentence)
      - Key points (bullet points)
      - Important details
      - Key takeaways
      - Brief conclusion
    `,
    
    ideas: `
      Category: ${input.category}
      Context: ${input.context || 'general'}
      Number of ideas needed: ${input.count || 5}
      
      For each idea provide:
      - Idea title
      - Detailed description
      - Why it's innovative
      - How to implement
      - Potential challenges
    `,
    
    planner: `
      Goal: ${input.goal}
      Timeframe: ${input.timeframe || 'daily'}
      Priority: ${input.priority || 'medium'}
      
      Create a plan with:
      - Overall objective
      - Task breakdown with priorities
      - Time estimates for each task
      - Suggested order of execution
      - Tips for staying on track
    `,
    
    content: `
      Content Type: ${input.type || 'social media'}
      Topic: ${input.topic}
      Platform: ${input.platform || 'general'}
      Audience: ${input.audience || 'general'}
      
      Include:
      - Main content/post
      - Engaging caption
      - Relevant hashtags (5-10)
      - Best posting time suggestion
      - Engagement tips
    `,
    
    insight: `
      Focus Area: ${input.focus || 'productivity'}
      User Goal: ${input.goal || 'improve efficiency'}
      
      Provide:
      - Today's main focus area
      - One actionable productivity tip
      - Motivational message
      - Daily affirmation
      - Quick win task for today
    `
  }

  return prompts[tool] || ''
}