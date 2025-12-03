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
  },

  /**
   * Validate fullname for User
   */
  isValidFullname(fullname) {
    const required = this.isRequired(fullname, 'Họ và tên')
    if (!required.valid) return required

    if (typeof fullname !== 'string') {
      return { valid: false, message: 'Họ và tên phải là văn bản' }
    }

    const trimmed = fullname.trim()

    if (trimmed.length < 2) {
      return { valid: false, message: 'Họ và tên phải có ít nhất 2 ký tự' }
    }

    if (trimmed.length > 100) {
      return { valid: false, message: 'Họ và tên không được quá 100 ký tự' }
    }

    return { valid: true, message: 'Họ và tên hợp lệ' }
  },

  /**
   * Validate user ID (format: userXXX, adminXXX, etc)
   */
  isValidUserId(userId) {
    const required = this.isRequired(userId, 'ID người dùng')
    if (!required.valid) return required

    if (typeof userId !== 'string') {
      return { valid: false, message: 'ID người dùng phải là văn bản' }
    }

    const trimmed = userId.trim()

    if (trimmed.length < 3) {
      return { valid: false, message: 'ID người dùng phải có ít nhất 3 ký tự' }
    }

    if (trimmed.length > 50) {
      return { valid: false, message: 'ID người dùng không được quá 50 ký tự' }
    }

    const userIdRegex = /^[a-zA-Z0-9_]+$/
    if (!userIdRegex.test(trimmed)) {
      return { valid: false, message: 'ID người dùng chỉ được chứa chữ cái, số và dấu gạch dưới' }
    }

    return { valid: true, message: 'ID người dùng hợp lệ' }
  },

  /**
   * Validate entire user create/update form
   */
  validateUserForm(user) {
    const errors = {}

    // Validate id (only for create)
    if (user.id !== undefined) {
      const idCheck = this.isValidUserId(user.id)
      if (!idCheck.valid) errors.id = idCheck.message
    }

    // Validate email
    if (user.email !== undefined) {
      if (!this.isValidEmail(user.email)) {
        errors.email = 'Email không hợp lệ'
      }
    }

    // Validate fullname
    if (user.fullname !== undefined || user.fullName !== undefined) {
      const fullname = user.fullname || user.fullName
      const fullnameCheck = this.isValidFullname(fullname)
      if (!fullnameCheck.valid) errors.fullname = fullnameCheck.message
    }

    // Validate password (if provided)
    if (user.password !== undefined) {
      const passwordCheck = this.isValidPassword(user.password)
      if (!passwordCheck.valid) errors.password = passwordCheck.message
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }
}

export default Validation
