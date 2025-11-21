/**
 * Helper Utilities
 */

const Helpers = {
  /**
   * Debounce function
   */
  debounce(func, wait = 300) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  /**
   * Format number with commas
   */
  formatNumber(num) {
    if (typeof num !== 'number') return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  /**
   * Format date to readable string
   */
  formatDate(date) {
    try {
      const d = new Date(date)
      if (isNaN(d.getTime())) return 'Invalid date'
      
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      
      return `${day}/${month}/${year}`
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid date'
    }
  },

  /**
   * Get relative time string
   */
  getRelativeTime(date) {
    try {
      const now = new Date()
      const past = new Date(date)
      const diffMs = now - past
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHour / 24)
      const diffWeek = Math.floor(diffDay / 7)
      const diffMonth = Math.floor(diffDay / 30)
      const diffYear = Math.floor(diffDay / 365)

      if (diffSec < 60) return 'Vừa xong'
      if (diffMin < 60) return `${diffMin} phút trước`
      if (diffHour < 24) return `${diffHour} giờ trước`
      if (diffDay < 7) return `${diffDay} ngày trước`
      if (diffWeek < 4) return `${diffWeek} tuần trước`
      if (diffMonth < 12) return `${diffMonth} tháng trước`
      return `${diffYear} năm trước`
    } catch (error) {
      console.error('Relative time error:', error)
      return ''
    }
  },

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        return success
      }
    } catch (error) {
      console.error('Copy to clipboard error:', error)
      return false
    }
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export default Helpers
