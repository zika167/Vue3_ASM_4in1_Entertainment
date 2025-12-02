<template>
  <div class="modal fade" id="authModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content auth-modal-content">
        <div class="modal-header auth-modal-header">
          <div class="auth-modal-logo">
            <img 
              src="https://res.cloudinary.com/dlpi2u0ds/image/upload/v1763189405/logojava4-Photoroom_bgg2tz.png" 
              alt="4IN1 Logo"
              class="auth-logo-img"
            >
            <h2 class="modal-title">
              <span class="first-letter">4</span>IN<span class="first-letter">1</span> ENTERTAINMENT
            </h2>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        
        <div class="modal-body auth-modal-body">
          <ul class="nav nav-pills nav-fill mb-4 auth-tabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link auth-tab" 
                :class="{ active: activeTab === 'login' }"
                @click="activeTab = 'login'"
                type="button"
              >
                <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link auth-tab" 
                :class="{ active: activeTab === 'register' }"
                @click="activeTab = 'register'"
                type="button"
              >
                <i class="bi bi-person-plus me-2"></i>Đăng ký
              </button>
            </li>
          </ul>
          
          <div class="tab-content">
            <!-- Login Form -->
            <div v-show="activeTab === 'login'" class="tab-pane fade" :class="{ 'show active': activeTab === 'login' }">
              <div class="auth-info-box mb-3">
                <i class="bi bi-info-circle me-2"></i>
                <div>
                  <strong>Tài khoản demo:</strong><br>
                  Username: <code>mockuser</code> | Password: <code>123456</code><br>
                  Admin: <code>admin</code> | Password: <code>admin123</code>
                </div>
              </div>
              
              <form @submit.prevent="handleLogin" class="auth-form">
                <div class="mb-3">
                  <label for="loginUsername" class="form-label">
                    <i class="bi bi-person me-1"></i>Tên đăng nhập
                  </label>
                  <input 
                    type="text" 
                    class="form-control auth-input"
                    :class="{ 'is-invalid': loginErrors.username }"
                    id="loginUsername" 
                    v-model="loginForm.username"
                    @input="validateLoginUsername"
                    placeholder="Nhập tên đăng nhập"
                  >
                  <div v-if="loginErrors.username" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ loginErrors.username }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="loginPassword" class="form-label">
                    <i class="bi bi-lock me-1"></i>Mật khẩu
                  </label>
                  <div class="password-input-wrapper">
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control auth-input"
                      :class="{ 'is-invalid': loginErrors.password }"
                      id="loginPassword" 
                      v-model="loginForm.password"
                      @input="validateLoginPassword"
                      placeholder="Nhập mật khẩu"
                    >
                    <button 
                      type="button" 
                      class="password-toggle-btn"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="loginErrors.password" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ loginErrors.password }}
                  </div>
                </div>
                <div class="mb-3 d-flex justify-content-between align-items-center">
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="rememberMe"
                      v-model="loginForm.remember"
                    >
                    <label class="form-check-label" for="rememberMe">Ghi nhớ đăng nhập</label>
                  </div>
                  <a href="#" class="auth-link" @click.prevent="openForgotPassword">Quên mật khẩu?</a>
                </div>
                <button 
                  type="submit" 
                  class="text-white btn auth-btn-primary w-100"
                  :disabled="!isLoginValid"
                >
                  <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
                </button>
              </form>
            </div>
            
            <!-- Register Form -->
            <div v-show="activeTab === 'register'" class="tab-pane fade" :class="{ 'show active': activeTab === 'register' }">
              <div class="auth-info-box mb-3">
                <i class="bi bi-info-circle me-2"></i>
                <div>
                  <strong>Đăng ký tài khoản mới:</strong><br>
                  Điền đầy đủ thông tin bên dưới để tạo tài khoản. Sau khi đăng ký thành công, bạn có thể đăng nhập ngay.
                </div>
              </div>
              <form @submit.prevent="handleRegister" class="auth-form">
                <div class="mb-3">
                  <label for="registerUsername" class="form-label">
                    <i class="bi bi-person me-1"></i>Tên đăng nhập
                  </label>
                  <input 
                    type="text" 
                    class="form-control auth-input"
                    :class="{ 'is-invalid': registerErrors.username }"
                    id="registerUsername" 
                    v-model="registerForm.username"
                    placeholder="Chọn tên đăng nhập"
                  >
                  <div v-if="registerErrors.username" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ registerErrors.username }}
                  </div>
                  <small class="form-text text-muted">3-30 ký tự, chỉ chữ cái, số và dấu gạch dưới</small>
                </div>
                <div class="mb-3">
                  <label for="registerFullname" class="form-label">
                    <i class="bi bi-person-badge me-1"></i>Họ và tên
                  </label>
                  <input 
                    type="text" 
                    class="form-control auth-input"
                    :class="{ 'is-invalid': registerErrors.fullname }"
                    id="registerFullname" 
                    v-model="registerForm.fullname"
                    placeholder="Nhập họ và tên"
                  >
                  <div v-if="registerErrors.fullname" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ registerErrors.fullname }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="registerEmail" class="form-label">
                    <i class="bi bi-envelope me-1"></i>Email
                  </label>
                  <input 
                    type="email" 
                    class="form-control auth-input"
                    :class="{ 'is-invalid': registerErrors.email }"
                    id="registerEmail" 
                    v-model="registerForm.email"
                    placeholder="email@example.com"
                  >
                  <div v-if="registerErrors.email" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ registerErrors.email }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="registerPassword" class="form-label">
                    <i class="bi bi-lock me-1"></i>Mật khẩu
                  </label>
                  <div class="password-input-wrapper">
                    <input 
                      :type="showRegisterPassword ? 'text' : 'password'" 
                      class="form-control auth-input"
                      :class="{ 'is-invalid': registerErrors.password }"
                      id="registerPassword" 
                      v-model="registerForm.password"
                      placeholder="Tạo mật khẩu"
                    >
                    <button 
                      type="button" 
                      class="password-toggle-btn"
                      @click="showRegisterPassword = !showRegisterPassword"
                    >
                      <i :class="showRegisterPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="registerErrors.password" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ registerErrors.password }}
                  </div>
                  <div v-if="registerForm.password" class="password-strength-container mt-2">
                    <div class="password-strength-bar">
                      <div 
                        class="strength-level"
                        :style="{
                          width: (passwordStrength.score * 20) + '%',
                          backgroundColor: passwordStrength.color
                        }"
                      ></div>
                    </div>
                    <small class="form-text" :style="{ color: passwordStrength.color }">
                      Độ mạnh: <strong>{{ passwordStrength.label }}</strong>
                    </small>
                  </div>
                  <small class="form-text text-muted d-block">Tối thiểu 6 ký tự, nên dùng chữ hoa, chữ thường, số</small>
                </div>
                <div class="mb-3">
                  <label for="registerConfirmPassword" class="form-label">
                    <i class="bi bi-lock-fill me-1"></i>Xác nhận mật khẩu
                  </label>
                  <input 
                    type="password" 
                    class="form-control auth-input"
                    :class="{ 'is-invalid': registerErrors.confirmPassword }"
                    id="registerConfirmPassword" 
                    v-model="registerForm.confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                  >
                  <div v-if="registerErrors.confirmPassword" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ registerErrors.confirmPassword }}
                  </div>
                </div>
                <div class="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    class="form-check-input"
                    :class="{ 'is-invalid': registerErrors.agreeTerms }"
                    id="agreeTerms"
                    v-model="registerForm.agreeTerms"
                  >
                  <label class="form-check-label" for="agreeTerms">
                    Tôi đồng ý với <a href="#" class="auth-link">Điều khoản sử dụng</a> và <a href="#" class="auth-link">Chính sách bảo mật</a>
                  </label>
                  <div v-if="registerErrors.agreeTerms" class="invalid-feedback d-block">
                    <i class="bi bi-exclamation-circle me-1"></i>{{ registerErrors.agreeTerms }}
                  </div>
                </div>
                <button 
                  type="submit" 
                  class="text-white btn auth-btn-primary w-100"
                  :disabled="!isRegisterValid"
                >
                  <i class="bi bi-person-plus me-2"></i>Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import Validation from '@/utils/validation'

const router = useRouter()
const modalRef = ref(null)
const activeTab = ref('login')
const showPassword = ref(false)
const showRegisterPassword = ref(false)
let modalInstance = null

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const registerForm = ref({
  username: '',
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// Form errors tracking
const loginErrors = ref({
  username: '',
  password: ''
})

const registerErrors = ref({
  username: '',
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

// Mock accounts
const mockAccounts = {
  'mockuser': { password: '123456', role: 'user', fullname: 'Mock User' },
  'admin': { password: 'admin123', role: 'admin', fullname: 'Admin User' }
}

// Computed properties for password strength
const passwordStrength = computed(() => {
  const pwd = registerForm.value.password
  if (!pwd) return { score: 0, label: '', color: '' }
  
  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[!@#$%^&*]/.test(pwd)) score++
  
  const levels = [
    { score: 0, label: 'Rất yếu', color: '#dc3545' },
    { score: 1, label: 'Yếu', color: '#fd7e14' },
    { score: 2, label: 'Trung bình', color: '#ffc107' },
    { score: 3, label: 'Tốt', color: '#28a745' },
    { score: 4, label: 'Rất tốt', color: '#20c997' },
    { score: 5, label: 'Xuất sắc', color: '#0d6efd' }
  ]
  
  return levels[score] || levels[0]
})

// Real-time validation for login (show error only if format invalid, not if empty)
const validateLoginUsername = () => {
  const { username } = loginForm.value
  if (username.trim()) {
    const check = Validation.isValidUsername(username)
    loginErrors.value.username = check.valid ? '' : check.message
  } else {
    loginErrors.value.username = ''
  }
}

const validateLoginPassword = () => {
  const { password } = loginForm.value
  if (password) {
    const check = Validation.isValidPassword(password)
    loginErrors.value.password = check.valid ? '' : check.message
  } else {
    loginErrors.value.password = ''
  }
}

// Validate on submit (check if empty + format)
const validateLoginForm = () => {
  const { username, password } = loginForm.value
  
  // Check if empty
  if (!username.trim()) {
    loginErrors.value.username = 'Vui lòng điền tên đăng nhập'
    return 'loginUsername'
  }
  
  if (!password) {
    loginErrors.value.password = 'Vui lòng điền mật khẩu'
    return 'loginPassword'
  }
  
  // Check format
  const usernameCheck = Validation.isValidUsername(username)
  if (!usernameCheck.valid) {
    loginErrors.value.username = usernameCheck.message
    return 'loginUsername'
  }
  
  const passwordCheck = Validation.isValidPassword(password)
  if (!passwordCheck.valid) {
    loginErrors.value.password = passwordCheck.message
    return 'loginPassword'
  }
  
  return null
}

// Register validation (on submit only)
const validateRegisterForm = () => {
  const { username, fullname, email, password, confirmPassword, agreeTerms } = registerForm.value
  
  // Validate username
  if (!username.trim()) {
    registerErrors.value.username = 'Vui lòng điền tên đăng nhập'
  } else {
    const check = Validation.isValidUsername(username)
    registerErrors.value.username = check.valid ? '' : check.message
  }
  
  // Validate fullname
  if (!fullname.trim()) {
    registerErrors.value.fullname = 'Vui lòng điền họ và tên'
  } else {
    registerErrors.value.fullname = ''
  }
  
  // Validate email
  if (!email.trim()) {
    registerErrors.value.email = 'Vui lòng điền email'
  } else if (!Validation.isValidEmail(email)) {
    registerErrors.value.email = 'Email không hợp lệ'
  } else {
    registerErrors.value.email = ''
  }
  
  // Validate password
  if (!password) {
    registerErrors.value.password = 'Vui lòng điền mật khẩu'
  } else {
    const check = Validation.isValidPassword(password)
    registerErrors.value.password = check.valid ? '' : check.message
  }
  
  // Validate confirm password
  if (!confirmPassword) {
    registerErrors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
  } else if (password !== confirmPassword) {
    registerErrors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
  } else {
    registerErrors.value.confirmPassword = ''
  }
  
  // Validate terms
  if (!agreeTerms) {
    registerErrors.value.agreeTerms = 'Vui lòng đồng ý với điều khoản sử dụng'
  } else {
    registerErrors.value.agreeTerms = ''
  }
  
  // Return first invalid field ref for focus
  if (registerErrors.value.username) return 'registerUsername'
  if (registerErrors.value.fullname) return 'registerFullname'
  if (registerErrors.value.email) return 'registerEmail'
  if (registerErrors.value.password) return 'registerPassword'
  if (registerErrors.value.confirmPassword) return 'registerConfirmPassword'
  if (registerErrors.value.agreeTerms) return 'agreeTerms'
  return null
}

// Check if login form is valid (for button disabled state)
const isLoginValid = computed(() => {
  return loginForm.value.username.trim() && loginForm.value.password
})

// Check if register form is valid (for button disabled state)
const isRegisterValid = computed(() => {
  const { username, fullname, email, password, confirmPassword, agreeTerms } = registerForm.value
  return username.trim() &&
         fullname.trim() &&
         email.trim() &&
         password &&
         confirmPassword &&
         agreeTerms
})

const handleLogin = async () => {
  // Validate all fields
  const firstErrorField = validateLoginForm()
  
  if (firstErrorField) {
    // Focus to first error field
    const fieldElement = document.getElementById(firstErrorField)
    if (fieldElement) {
      fieldElement.focus()
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }
  
  const { username, password } = loginForm.value
  
  window.Loading?.show('Đang đăng nhập...')
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Check mock accounts
  if (mockAccounts[username] && mockAccounts[username].password === password) {
    window.Loading?.hide()
    window.Toast?.success(`Chào mừng ${mockAccounts[username].fullname}!`)
    closeModal()
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify({
      username,
      fullname: mockAccounts[username].fullname,
      role: mockAccounts[username].role
    }))
    
    // Save token
    localStorage.setItem('authToken', `mock_token_${username}`)
    
    // Dispatch auth changed event
    window.dispatchEvent(new CustomEvent('auth-changed'))
    
    // Redirect based on role
    setTimeout(() => {
      if (mockAccounts[username].role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/favorites')
      }
    }, 500)
  } else {
    window.Loading?.hide()
    window.Toast?.error('Tên đăng nhập hoặc mật khẩu không đúng!')
  }
}

const handleRegister = async () => {
  // Validate all fields
  const firstErrorField = validateRegisterForm()
  
  if (firstErrorField) {
    // Focus to first error field
    const fieldElement = document.getElementById(firstErrorField)
    if (fieldElement) {
      fieldElement.focus()
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }
  
  const { username, fullname, email, password } = registerForm.value
  
  window.Loading?.show('Đang đăng ký...')
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  window.Loading?.hide()
  window.Toast?.success('Đăng ký thành công! Vui lòng đăng nhập.')
  
  // Switch to login tab
  activeTab.value = 'login'
  
  // Pre-fill username in login form
  loginForm.value.username = username
  loginForm.value.password = ''
  loginForm.value.remember = false
  
  // Reset form
  registerForm.value = {
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  }
  
  // Reset errors
  registerErrors.value = {
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: ''
  }
}

const closeModal = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
}

const openForgotPassword = () => {
  closeModal()
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('open-forgot-password'))
  }, 300)
}

// Handler function for event listener
const handleOpenAuthModal = (event) => {
  activeTab.value = event.detail.tab || 'login'
  if (modalInstance) {
    modalInstance.show()
  }
}

onMounted(() => {
  if (modalRef.value) {
    // Check if modal already exists to prevent duplicates
    const existingModal = Modal.getInstance(modalRef.value)
    modalInstance = existingModal || new Modal(modalRef.value)
    
    // Add event listener
    window.addEventListener('open-auth-modal', handleOpenAuthModal)
  }
})

onUnmounted(() => {
  // Cleanup event listener
  window.removeEventListener('open-auth-modal', handleOpenAuthModal)
})
</script>

<style scoped>
.auth-modal-content {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.auth-modal-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffc107;
  padding: 1.5rem;
  border-bottom: none;
}

.auth-modal-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
}

.auth-logo-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
}

.auth-modal-logo .modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0;
}

.first-letter {
  font-size: 1.5em;
  font-weight: 800;
}

.auth-modal-body {
  padding: 2rem;
}

.auth-tabs .nav-link {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #666;
}

.auth-tabs .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.auth-tabs .nav-link:hover:not(.active) {
  background: #f0f0f0;
}

.auth-info-box {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  border-left: 4px solid #ffc107;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.auth-info-box code {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.auth-form .form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.auth-input {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.auth-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.password-input-wrapper {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.password-toggle-btn:hover {
  color: #333;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.auth-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.auth-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.auth-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-text {
  font-size: 0.85rem;
  color: #666;
}

.invalid-feedback {
  color: #dc3545 !important;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.is-invalid:focus {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.password-strength-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.password-strength-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.strength-level {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
  min-width: 20%;
}

@media (max-width: 576px) {
  .auth-modal-body {
    padding: 1.5rem;
  }
  
  .auth-modal-logo .modal-title {
    font-size: 1rem;
  }
  
  .auth-logo-img {
    width: 40px;
    height: 40px;
  }
}
</style>
