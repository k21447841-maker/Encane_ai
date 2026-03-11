import validation from '../../services/utils/validation'

describe('Validation Utilities', () => {
  describe('User Validation', () => {
    test('validates name correctly', () => {
      expect(validation.user.name('')).toEqual({ valid: false, message: 'Name is required' })
      expect(validation.user.name('A')).toEqual({ valid: false, message: 'Name must be at least 2 characters' })
      expect(validation.user.name('John Doe')).toEqual({ valid: true })
      expect(validation.user.name('J'.repeat(51))).toEqual({ valid: false, message: 'Name must be less than 50 characters' })
      expect(validation.user.name('John@Doe')).toEqual({ valid: false, message: 'Name contains invalid characters' })
    })

    test('validates email correctly', () => {
      expect(validation.user.email('')).toEqual({ valid: true })
      expect(validation.user.email('invalid-email')).toEqual({ valid: false, message: 'Please enter a valid email address' })
      expect(validation.user.email('test@example.com')).toEqual({ valid: true })
    })

    test('validates country correctly', () => {
      expect(validation.user.country('')).toEqual({ valid: false, message: 'Country is required' })
      expect(validation.user.country('USA')).toEqual({ valid: true })
    })

    test('validates goal correctly', () => {
      expect(validation.user.goal('')).toEqual({ valid: false, message: 'Please select a valid goal' })
      expect(validation.user.goal('work')).toEqual({ valid: true })
      expect(validation.user.goal('invalid')).toEqual({ valid: false, message: 'Please select a valid goal' })
    })
  })

  describe('Input Validation', () => {
    test('validates required fields', () => {
      expect(validation.input.required('')).toEqual({ valid: false, message: 'Field is required' })
      expect(validation.input.required('   ')).toEqual({ valid: false, message: 'Field is required' })
      expect(validation.input.required('test')).toEqual({ valid: true })
    })

    test('validates minimum length', () => {
      expect(validation.input.minLength('ab', 3)).toEqual({ valid: false, message: 'Field must be at least 3 characters' })
      expect(validation.input.minLength('abc', 3)).toEqual({ valid: true })
    })

    test('validates maximum length', () => {
      expect(validation.input.maxLength('abcd', 3)).toEqual({ valid: false, message: 'Field must be less than 3 characters' })
      expect(validation.input.maxLength('abc', 3)).toEqual({ valid: true })
    })

    test('validates email format', () => {
      expect(validation.input.email('invalid')).toEqual({ valid: false, message: 'Please enter a valid email address' })
      expect(validation.input.email('test@example.com')).toEqual({ valid: true })
    })

    test('validates URL format', () => {
      expect(validation.input.url('invalid')).toEqual({ valid: false, message: 'Please enter a valid URL' })
      expect(validation.input.url('https://example.com')).toEqual({ valid: true })
    })

    test('validates numbers', () => {
      expect(validation.input.number('abc')).toEqual({ valid: false, message: 'Please enter a valid number' })
      expect(validation.input.number('5')).toEqual({ valid: true })
      expect(validation.input.number('5', 10)).toEqual({ valid: false, message: 'Value must be at least 10' })
      expect(validation.input.number('15', 10, 20)).toEqual({ valid: true })
    })
  })

  describe('Tool Validation', () => {
    test('validates writer input', () => {
      const result = validation.tools.writer({})
      expect(result.valid).toBe(false)
      expect(result.errors.topic).toBeDefined()

      const validResult = validation.tools.writer({
        topic: 'AI Technology',
        format: 'article',
        tone: 'professional',
        length: 'medium'
      })
      expect(validResult.valid).toBe(true)
    })

    test('validates summarizer input', () => {
      const result = validation.tools.summarizer({})
      expect(result.valid).toBe(false)
      expect(result.errors.text).toBeDefined()

      const validResult = validation.tools.summarizer({
        text: 'Sample text',
        type: 'concise'
      })
      expect(validResult.valid).toBe(true)
    })

    test('validates ideas input', () => {
      const result = validation.tools.ideas({ category: 'invalid' })
      expect(result.valid).toBe(false)
      expect(result.errors.category).toBeDefined()

      const validResult = validation.tools.ideas({
        category: 'business',
        count: 5
      })
      expect(validResult.valid).toBe(true)
    })
  })

  describe('File Validation', () => {
    test('validates file size and type', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(mockFile, 'size', { value: 1024 })

      const result = validation.file(mockFile, {
        maxSize: 2048,
        allowedTypes: ['text/plain']
      })
      expect(result.valid).toBe(true)

      const oversizedFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(oversizedFile, 'size', { value: 3072 })

      const oversizedResult = validation.file(oversizedFile, { maxSize: 2048 })
      expect(oversizedResult.valid).toBe(false)
      expect(oversizedResult.errors[0]).toContain('too large')
    })
  })

  describe('Sanitization', () => {
    test('sanitizes text', () => {
      expect(validation.sanitize.text('<script>alert("xss")</script>')).toBe('alert("xss")')
      expect(validation.sanitize.text('  Hello  ')).toBe('Hello')
    })

    test('sanitizes email', () => {
      expect(validation.sanitize.email('Test@Example.COM')).toBe('test@example.com')
    })

    test('sanitizes filename', () => {
      expect(validation.sanitize.filename('test@file!.txt')).toBe('testfile.txt')
    })
  })
})