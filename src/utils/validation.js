/**
 * Input Validation Utilities
 * 
 * Tổ chức theo modules:
 * - COMMON: Dùng chung cho tất cả
 * - USER (DEV 1): Validation cho user
 * - VIDEO (DEV 2): Validation cho video
 * - SHARE (DEV 3): Validation cho share
 * - COMMENT (DEV 4): Validation cho comment
 * - FAVORITE (DEV 5): Validation cho favorite
 */

const Validation = {
  // ========================================
  // COMMON - Dùng chung cho tất cả modules
  // ========================================
  // ========================================
  // USER (DEV 1) - Validation cho User module
  // ========================================

  /**
   * Validate email format
   * @param {string} email - Email cần validate
   * @returns {boolean} - true nếu email hợp lệ
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
  },

  // ========================================
  // VIDEO (DEV 2) - Validation cho Video module
  // ========================================

  /**
   * Validate video title
   * Tiêu đề video phải từ 3-200 ký tự
   * @param {string} title - Tiêu đề video
   * @returns {{ valid: boolean, message: string }}
   */
  isValidVideoTitle(title) {
    // Kiểm tra required
    const required = this.isRequired(title, 'Tiêu đề video')
    if (!required.valid) return required

    // Kiểm tra type
    if (typeof title !== 'string') {
      return { valid: false, message: 'Tiêu đề video phải là văn bản' }
    }

    const trimmed = title.trim()

    // Kiểm tra độ dài tối thiểu
    if (trimmed.length < 3) {
      return { valid: false, message: 'Tiêu đề video phải có ít nhất 3 ký tự' }
    }

    // Kiểm tra độ dài tối đa
    if (trimmed.length > 200) {
      return { valid: false, message: 'Tiêu đề video không được quá 200 ký tự' }
    }

    return { valid: true, message: 'Tiêu đề video hợp lệ' }
  },

  /**
   * Validate video URL (YouTube format)
   * Hỗ trợ các format:
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID
   * - https://www.youtube.com/embed/VIDEO_ID
   * @param {string} url - URL video
   * @returns {{ valid: boolean, message: string, videoId?: string }}
   */
  isValidVideoUrl(url) {
    // Kiểm tra required
    const required = this.isRequired(url, 'URL video')
    if (!required.valid) return required

    // Kiểm tra type
    if (typeof url !== 'string') {
      return { valid: false, message: 'URL video phải là văn bản' }
    }

    const trimmed = url.trim()

    // Regex patterns cho các format YouTube URL
    const patterns = [
      // Standard: https://www.youtube.com/watch?v=VIDEO_ID
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
      // Short: https://youtu.be/VIDEO_ID
      /^(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
      // Embed: https://www.youtube.com/embed/VIDEO_ID
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/
    ]

    // Thử match với từng pattern
    for (const pattern of patterns) {
      const match = trimmed.match(pattern)
      if (match) {
        return { 
          valid: true, 
          message: 'URL video hợp lệ',
          videoId: match[1] // Trả về video ID để sử dụng
        }
      }
    }

    return { 
      valid: false, 
      message: 'URL video không hợp lệ. Vui lòng nhập URL YouTube (youtube.com/watch?v=... hoặc youtu.be/...)' 
    }
  },

  /**
   * Validate video description
   * Mô tả video tối đa 1000 ký tự
   * @param {string} description - Mô tả video
   * @returns {{ valid: boolean, message: string }}
   */
  isValidVideoDescription(description) {
    // Description có thể để trống
    if (!description || description.trim() === '') {
      return { valid: true, message: '' }
    }

    // Kiểm tra type
    if (typeof description !== 'string') {
      return { valid: false, message: 'Mô tả video phải là văn bản' }
    }

    // Kiểm tra độ dài tối đa
    if (description.length > 1000) {
      return { valid: false, message: 'Mô tả video không được quá 1000 ký tự' }
    }

    return { valid: true, message: 'Mô tả video hợp lệ' }
  },

  /**
   * Validate video duration format (MM:SS hoặc HH:MM:SS)
   * @param {string} duration - Thời lượng video
   * @returns {{ valid: boolean, message: string }}
   */
  isValidVideoDuration(duration) {
    // Duration có thể để trống
    if (!duration || duration.trim() === '') {
      return { valid: true, message: '' }
    }

    // Regex cho format MM:SS hoặc HH:MM:SS
    const durationRegex = /^(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)$/
    
    if (!durationRegex.test(duration.trim())) {
      return { 
        valid: false, 
        message: 'Thời lượng không hợp lệ. Định dạng: MM:SS hoặc HH:MM:SS' 
      }
    }

    return { valid: true, message: 'Thời lượng hợp lệ' }
  },

  /**
   * Validate thumbnail URL
   * @param {string} url - URL thumbnail
   * @returns {{ valid: boolean, message: string }}
   */
  isValidThumbnailUrl(url) {
    // Thumbnail có thể để trống (sẽ dùng default)
    if (!url || url.trim() === '') {
      return { valid: true, message: '' }
    }

    // Kiểm tra URL format cơ bản
    try {
      new URL(url)
      return { valid: true, message: 'URL thumbnail hợp lệ' }
    } catch {
      return { valid: false, message: 'URL thumbnail không hợp lệ' }
    }
  },

  /**
   * Extract YouTube video ID from URL
   * @param {string} url - YouTube URL
   * @returns {string|null} - Video ID hoặc null nếu không tìm thấy
   */
  extractYouTubeVideoId(url) {
    if (!url) return null

    const result = this.isValidVideoUrl(url)
    return result.valid ? result.videoId : null
  },

  /**
   * Generate YouTube embed URL from video ID
   * @param {string} videoId - YouTube video ID
   * @returns {string} - Embed URL
   */
  getYouTubeEmbedUrl(videoId) {
    if (!videoId) return ''
    return `https://www.youtube.com/embed/${videoId}`
  },

  /**
   * Generate YouTube thumbnail URL from video ID
   * @param {string} videoId - YouTube video ID
   * @param {string} quality - Chất lượng: 'default', 'medium', 'high', 'maxres'
   * @returns {string} - Thumbnail URL
   */
  getYouTubeThumbnailUrl(videoId, quality = 'medium') {
    if (!videoId) return ''
    
    const qualityMap = {
      default: 'default',      // 120x90
      medium: 'mqdefault',     // 320x180
      high: 'hqdefault',       // 480x360
      maxres: 'maxresdefault'  // 1280x720
    }
    
    const qualityKey = qualityMap[quality] || 'mqdefault'
    return `https://i.ytimg.com/vi/${videoId}/${qualityKey}.jpg`
  },

  /**
   * Validate entire video create/update form
   * @param {Object} video - Video data
   * @returns {{ valid: boolean, errors: Object }}
   */
  validateVideoForm(video) {
    const errors = {}

    // Validate title (required)
    if (video.title !== undefined) {
      const titleCheck = this.isValidVideoTitle(video.title)
      if (!titleCheck.valid) errors.title = titleCheck.message
    }

    // Validate video URL (required for create)
    if (video.videoUrl !== undefined) {
      const urlCheck = this.isValidVideoUrl(video.videoUrl)
      if (!urlCheck.valid) errors.videoUrl = urlCheck.message
    }

    // Validate description (optional)
    if (video.description !== undefined) {
      const descCheck = this.isValidVideoDescription(video.description)
      if (!descCheck.valid) errors.description = descCheck.message
    }

    // Validate duration (optional)
    if (video.duration !== undefined) {
      const durationCheck = this.isValidVideoDuration(video.duration)
      if (!durationCheck.valid) errors.duration = durationCheck.message
    }

    // Validate thumbnail (optional)
    if (video.thumbnail !== undefined) {
      const thumbCheck = this.isValidThumbnailUrl(video.thumbnail)
      if (!thumbCheck.valid) errors.thumbnail = thumbCheck.message
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  },

  // ========================================
  // SHARE (DEV 3) - Validation cho Share module
  // ========================================

  /**
   * Validate a single email in email list
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isValidShareEmail(email) {
    if (!email || typeof email !== 'string') return false
    const trimmed = email.trim()
    if (!trimmed) return false
    return this.isValidEmail(trimmed)
  },

  /**
   * Validate email list (separated by semicolon)
   * @param {string} emailList - Emails separated by semicolon (;)
   * @returns {{ valid: boolean, message: string, validEmails?: string[], invalidEmails?: string[] }}
   */
  isValidEmailList(emailList) {
    // Check required
    if (!emailList || typeof emailList !== 'string') {
      return { valid: false, message: 'Danh sách email không được để trống' }
    }

    const trimmed = emailList.trim()
    if (!trimmed) {
      return { valid: false, message: 'Danh sách email không được để trống' }
    }

    // Split by semicolon and filter empty
    const emails = trimmed.split(';').map(e => e.trim()).filter(e => e)

    if (emails.length === 0) {
      return { valid: false, message: 'Vui lòng nhập ít nhất một email' }
    }

    // Validate each email
    const validEmails = []
    const invalidEmails = []

    for (const email of emails) {
      if (this.isValidEmail(email)) {
        validEmails.push(email)
      } else {
        invalidEmails.push(email)
      }
    }

    if (invalidEmails.length > 0) {
      return {
        valid: false,
        message: `Email không hợp lệ: ${invalidEmails.join(', ')}`,
        validEmails,
        invalidEmails
      }
    }

    return {
      valid: true,
      message: 'Danh sách email hợp lệ',
      validEmails,
      invalidEmails: []
    }
  },

  /**
   * Validate share form data
   * @param {Object} shareData - { videoId, emails }
   * @returns {{ valid: boolean, errors: Object }}
   */
  validateShareForm(shareData) {
    const errors = {}

    // Validate videoId (required)
    if (!shareData.videoId || !shareData.videoId.trim()) {
      errors.videoId = 'Video ID không được để trống'
    }

    // Validate emails (required)
    if (shareData.emails !== undefined) {
      const emailCheck = this.isValidEmailList(shareData.emails)
      if (!emailCheck.valid) {
        errors.emails = emailCheck.message
      }
    } else {
      errors.emails = 'Danh sách email không được để trống'
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  },

  /**
   * Format email list for display
   * @param {string} emailList - Emails separated by semicolon
   * @param {number} maxShow - Maximum emails to show before truncating
   * @returns {string}
   */
  formatEmailList(emailList, maxShow = 2) {
    if (!emailList) return '-'
    
    const emails = emailList.split(';').map(e => e.trim()).filter(e => e)
    
    if (emails.length === 0) return '-'
    if (emails.length <= maxShow) return emails.join(', ')
    
    return `${emails.slice(0, maxShow).join(', ')}, +${emails.length - maxShow} khác`
  },

  /**
   * Parse email list string to array
   * @param {string} emailList - Emails separated by semicolon
   * @returns {string[]}
   */
  parseEmailList(emailList) {
    if (!emailList || typeof emailList !== 'string') return []
    return emailList.split(';').map(e => e.trim()).filter(e => e)
  },

  /**
   * Join email array to string
   * @param {string[]} emails - Array of emails
   * @returns {string}
   */
  joinEmailList(emails) {
    if (!Array.isArray(emails)) return ''
    return emails.filter(e => e && e.trim()).join(';')
  },

  // ========================================
  // COMMENT (DEV 4) - Validation cho Comment module
  // ========================================

  /**
   * Validate comment content
   * Nội dung bình luận phải từ 1-500 ký tự
   * Không chứa spam keywords
   * @param {string} content - Nội dung bình luận
   * @returns {{ valid: boolean, message: string }}
   */
  isValidComment(content) {
    // Kiểm tra required
    const required = this.isRequired(content, 'Nội dung bình luận')
    if (!required.valid) return required

    // Kiểm tra type
    if (typeof content !== 'string') {
      return { valid: false, message: 'Nội dung bình luận phải là văn bản' }
    }

    const trimmed = content.trim()

    // Kiểm tra độ dài tối thiểu
    if (trimmed.length < 1) {
      return { valid: false, message: 'Nội dung bình luận không được để trống' }
    }

    // Kiểm tra độ dài tối đa
    if (trimmed.length > 500) {
      return { valid: false, message: 'Nội dung bình luận không được quá 500 ký tự' }
    }

    // Kiểm tra spam keywords
    const spamKeywords = [
      'viagra', 'casino', 'lottery', 'winner', 'click here',
      'buy now', 'limited offer', 'act now', 'free money'
    ]
    
    const lowerContent = trimmed.toLowerCase()
    for (const keyword of spamKeywords) {
      if (lowerContent.includes(keyword)) {
        return { 
          valid: false, 
          message: 'Nội dung bình luận chứa từ khóa không được phép' 
        }
      }
    }

    return { valid: true, message: 'Nội dung bình luận hợp lệ' }
  },

  /**
   * Validate entire comment form
   * @param {Object} comment - Comment data
   * @returns {{ valid: boolean, errors: Object }}
   */
  validateCommentForm(comment) {
    const errors = {}

    // Validate content (required)
    if (comment.content !== undefined) {
      const contentCheck = this.isValidComment(comment.content)
      if (!contentCheck.valid) errors.content = contentCheck.message
    }

    // Validate videoId (required)
    if (!comment.videoId) {
      errors.videoId = 'Video ID không được để trống'
    }

    // Validate userId (required)
    if (!comment.userId) {
      errors.userId = 'User ID không được để trống'
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  },

  // ========================================
  // FAVORITE (DEV 5) - Validation cho Favorite module
  // ========================================
  // Không cần validation đặc biệt
}

export default Validation
