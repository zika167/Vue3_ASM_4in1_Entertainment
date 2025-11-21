/**
 * Input Validation Utilities
 */

const Validation = {
  /**
   * Validate email format
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  },

  /**
   * Validate password strength
   */
  isValidPassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: 'Mật khẩu không được để trống' }
    }

    if (password.length < 6) {
      return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
    }

    if (password.length > 50) {
      return { valid: false, message: 'Mật khẩu không được quá 50 ký tự' }
    }

    return { valid: true, message: 'Mật khẩu hợp lệ' }
  },

  /**
   * Validate username
   */
  isValidUsername(username) {
    if (!username || typeof username !== 'string') {
      return { valid: false, message: 'Tên đăng nhập không được để trống' }
    }

    const trimmed = username.trim()

    if (trimmed.length < 3) {
      return { valid: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
    }

    if (trimmed.length > 30) {
      return { valid: false, message: 'Tên đăng nhập không được quá 30 ký tự' }
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(trimmed)) {
      return { valid: false, message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới' }
    }

    return { valid: true, message: 'Tên đăng nhập hợp lệ' }
  },

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(str) {
    if (!str || typeof str !== 'string') return ''
    
    const temp = document.createElement('div')
    temp.textContent = str
    return temp.innerHTML
  },

  /**
   * Validate required field
   */
  isRequired(value, fieldName = 'Trường này') {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { valid: false, message: `${fieldName} không được để trống` }
    }
    return { valid: true, message: '' }
  }
}

export default Validation
