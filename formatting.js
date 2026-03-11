export const formatting = {
  // Date formatting
  date: {
    full: (date) => {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    short: (date) => {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },

    relative: (date) => {
      const now = new Date()
      const diff = now - new Date(date)
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const months = Math.floor(days / 30)
      const years = Math.floor(months / 12)

      if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
      if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
      return 'Just now'
    },

    time: (date) => {
      const d = new Date(date)
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    iso: (date) => {
      const d = new Date(date)
      return d.toISOString()
    }
  },

  // Number formatting
  number: {
    format: (num, decimals = 0) => {
      return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    },

    compact: (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    },

    percentage: (num, decimals = 0) => {
      return (num * 100).toFixed(decimals) + '%'
    },

    ordinal: (num) => {
      const j = num % 10
      const k = num % 100
      if (j === 1 && k !== 11) {
        return num + 'st'
      }
      if (j === 2 && k !== 12) {
        return num + 'nd'
      }
      if (j === 3 && k !== 13) {
        return num + 'rd'
      }
      return num + 'th'
    }
  },

  // Text formatting
  text: {
    capitalize: (str) => {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    },

    titleCase: (str) => {
      if (!str) return ''
      return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
    },

    truncate: (str, length, suffix = '...') => {
      if (!str) return ''
      if (str.length <= length) return str
      return str.substring(0, length - suffix.length) + suffix
    },

    slugify: (str) => {
      if (!str) return ''
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    },

    stripHtml: (html) => {
      if (!html) return ''
      return html.replace(/<[^>]*>/g, '')
    },

    wordCount: (str) => {
      if (!str) return 0
      return str.trim().split(/\s+/).length
    },

    readingTime: (str, wordsPerMinute = 200) => {
      const words = formatting.text.wordCount(str)
      const minutes = Math.ceil(words / wordsPerMinute)
      return minutes
    }
  },

  // File size formatting
  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Duration formatting
  duration: (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const parts = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

    return parts.join(' ')
  },

  // Currency formatting
  currency: (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  // List formatting
  list: (items, conjunction = 'and') => {
    if (!items || items.length === 0) return ''
    if (items.length === 1) return items[0]
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`
    
    const firstPart = items.slice(0, -1).join(', ')
    return `${firstPart}, ${conjunction} ${items[items.length - 1]}`
  },

  // Phone number formatting
  phone: (number, country = 'US') => {
    const cleaned = ('' + number).replace(/\D/g, '')
    
    if (country === 'US') {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      }
    }
    
    return number
  },

  // JSON formatting
  json: (obj, pretty = true) => {
    if (pretty) {
      return JSON.stringify(obj, null, 2)
    }
    return JSON.stringify(obj)
  },

  // Hash formatting (for truncating long strings)
  hash: (str, startChars = 6, endChars = 4) => {
    if (!str || str.length <= startChars + endChars) return str
    return str.slice(0, startChars) + '...' + str.slice(-endChars)
  }
}

export default formatting