import { generateAIResponse, generateToolResponse } from '../../services/api/aiService'
import { generateCompletion } from '../../services/api/openrouter'

// Mock the openrouter module
jest.mock('../../services/api/openrouter', () => ({
  generateCompletion: jest.fn(),
  generateStreamingCompletion: jest.fn()
}))

describe('AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateAIResponse', () => {
    test('successfully generates response', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'This is a test response'
            }
          }
        ]
      }

      generateCompletion.mockResolvedValue(mockResponse)

      const response = await generateAIResponse('Test message', {
        language: 'en',
        tool: 'chat'
      })

      expect(response).toBe('This is a test response')
      expect(generateCompletion).toHaveBeenCalledTimes(1)
    })

    test('handles API errors gracefully', async () => {
      generateCompletion.mockRejectedValue(new Error('API Error'))

      const response = await generateAIResponse('Test message')

      expect(response).toContain('Service temporarily unavailable')
    })

    test('includes system prompt in request', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Response' } }]
      }

      generateCompletion.mockResolvedValue(mockResponse)

      await generateAIResponse('Test message', { tool: 'writer' })

      const callArgs = generateCompletion.mock.calls[0][0]
      expect(callArgs.messages[0].role).toBe('system')
      expect(callArgs.messages[0].content).toContain('expert writer')
    })

    test('handles streaming response', async () => {
      const onChunk = jest.fn()
      const mockStreamingResponse = {
        choices: [{ delta: { content: 'chunk' } }]
      }

      // Mock streaming implementation
      require('../../services/api/openrouter').generateStreamingCompletion
        .mockImplementation(({ onChunk }) => {
          onChunk('chunk1')
          onChunk('chunk2')
          return Promise.resolve()
        })

      const response = await generateAIResponse('Test', {
        stream: true,
        onChunk
      })

      expect(onChunk).toHaveBeenCalledTimes(2)
    })
  })

  describe('generateToolResponse', () => {
    test('generates writer response', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Generated article' } }]
      }

      generateCompletion.mockResolvedValue(mockResponse)

      const response = await generateToolResponse('writer', {
        topic: 'AI technology',
        tone: 'professional',
        format: 'article'
      })

      expect(response).toBe('Generated article')
    })

    test('generates summarizer response', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Summary text' } }]
      }

      generateCompletion.mockResolvedValue(mockResponse)

      const response = await generateToolResponse('summarizer', {
        text: 'Long text to summarize...'
      })

      expect(response).toBe('Summary text')
    })

    test('generates ideas response', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'List of ideas' } }]
      }

      generateCompletion.mockResolvedValue(mockResponse)

      const response = await generateToolResponse('ideas', {
        category: 'business',
        count: 5
      })

      expect(response).toBe('List of ideas')
    })

    test('handles unknown tool gracefully', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Helpful response' } }]
      }

      generateCompletion.mockResolvedValue(mockResponse)

      const response = await generateToolResponse('unknown', {
        message: 'Test'
      })

      expect(response).toBe('Helpful response')
    })
  })
})