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
            <div v-show="activeTab === 'login'" class="tab-pane fade show active">
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
                    id="loginUsername" 
                    v-model="loginForm.username"
                    placeholder="Nhập tên đăng nhập"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="loginPassword" class="form-label">
                    <i class="bi bi-lock me-1"></i>Mật khẩu
                  </label>
                  <div class="password-input-wrapper">
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control auth-input" 
                      id="loginPassword" 
                      v-model="loginForm.password"
                      placeholder="Nhập mật khẩu"
                      required
                    >
                    <button 
                      type="button" 
                      class="password-toggle-btn"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
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
                  <a href="#" class="auth-link">Quên mật khẩu?</a>
                </div>
                <button type="submit" class="btn auth-btn-primary w-100">
                  <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
                </button>
              </form>
            </div>
            
            <!-- Register Form -->
            <div v-show="activeTab === 'register'" class="tab-pane fade">
              <form @submit.prevent="handleRegister" class="auth-form">
                <div class="mb-3">
                  <label for="registerUsername" class="form-label">
                    <i class="bi bi-person me-1"></i>Tên đăng nhập
                  </label>
                  <input 
                    type="text" 
                    class="form-control auth-input" 
                    id="registerUsername" 
                    v-model="registerForm.username"
                    placeholder="Chọn tên đăng nhập"
                    pattern="[a-zA-Z0-9_]{3,20}"
                    title="3-20 ký tự, chỉ chữ cái, số và dấu gạch dưới"
                    required
                  >
                  <small class="form-text text-muted">3-20 ký tự, chỉ chữ cái, số và dấu gạch dưới</small>
                </div>
                <div class="mb-3">
                  <label for="registerFullname" class="form-label">
                    <i class="bi bi-person-badge me-1"></i>Họ và tên
                  </label>
                  <input 
                    type="text" 
                    class="form-control auth-input" 
                    id="registerFullname" 
                    v-model="registerForm.fullname"
                    placeholder="Nhập họ và tên"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="registerEmail" class="form-label">
                    <i class="bi bi-envelope me-1"></i>Email
                  </label>
                  <input 
                    type="email" 
                    class="form-control auth-input" 
                    id="registerEmail" 
                    v-model="registerForm.email"
                    placeholder="email@example.com"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="registerPassword" class="form-label">
                    <i class="bi bi-lock me-1"></i>Mật khẩu
                  </label>
                  <div class="password-input-wrapper">
                    <input 
                      :type="showRegisterPassword ? 'text' : 'password'" 
                      class="form-control auth-input" 
                      id="registerPassword" 
                      v-model="registerForm.password"
                      placeholder="Tạo mật khẩu"
                      minlength="6"
                      required
                    >
                    <button 
                      type="button" 
                      class="password-toggle-btn"
                      @click="showRegisterPassword = !showRegisterPassword"
                    >
                      <i :class="showRegisterPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <small class="form-text text-muted">Tối thiểu 6 ký tự</small>
                </div>
                <div class="mb-3">
                  <label for="registerConfirmPassword" class="form-label">
                    <i class="bi bi-lock-fill me-1"></i>Xác nhận mật khẩu
                  </label>
                  <input 
                    type="password" 
                    class="form-control auth-input" 
                    id="registerConfirmPassword" 
                    v-model="registerForm.confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    required
                  >
                </div>
                <div class="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    id="agreeTerms"
                    v-model="registerForm.agreeTerms"
                    required
                  >
                  <label class="form-check-label" for="agreeTerms">
                    Tôi đồng ý với <a href="#" class="auth-link">Điều khoản sử dụng</a> và <a href="#" class="auth-link">Chính sách bảo mật</a>
                  </label>
                </div>
                <button type="submit" class="btn auth-btn-primary w-100">
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
import { ref, onMounted } from 'vue'
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

// Mock accounts
const mockAccounts = {
  'mockuser': { password: '123456', role: 'user', fullname: 'Mock User' },
  'admin': { password: 'admin123', role: 'admin', fullname: 'Admin User' }
}

const handleLogin = async () => {
  const { username, password } = loginForm.value
  
  // Validate
  const usernameCheck = Validation.isValidUsername(username)
  if (!usernameCheck.valid) {
    window.Toast.error(usernameCheck.message)
    return
  }
  
  const passwordCheck = Validation.isValidPassword(password)
  if (!passwordCheck.valid) {
    window.Toast.error(passwordCheck.message)
    return
  }
  
  window.Loading.show('Đang đăng nhập...')
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Check mock accounts
  if (mockAccounts[username] && mockAccounts[username].password === password) {
    window.Loading.hide()
    window.Toast.success(`Chào mừng ${mockAccounts[username].fullname}!`)
    closeModal()
    
    // TODO: Save to localStorage/store
    localStorage.setItem('user', JSON.stringify({
      username,
      fullname: mockAccounts[username].fullname,
      role: mockAccounts[username].role
    }))
    
    // Redirect based on role
    setTimeout(() => {
      if (mockAccounts[username].role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/favorites')
      }
    }, 500)
  } else {
    window.Loading.hide()
    window.Toast.error('Tên đăng nhập hoặc mật khẩu không đúng!')
  }
}

const handleRegister = async () => {
  const { username, fullname, email, password, confirmPassword, agreeTerms } = registerForm.value
  
  // Validate username
  const usernameCheck = Validation.isValidUsername(username)
  if (!usernameCheck.valid) {
    window.Toast.error(usernameCheck.message)
    return
  }
  
  // Validate email
  if (!Validation.isValidEmail(email)) {
    window.Toast.error('Email không hợp lệ')
    return
  }
  
  // Validate password
  const passwordCheck = Validation.isValidPassword(password)
  if (!passwordCheck.valid) {
    window.Toast.error(passwordCheck.message)
    return
  }
  
  // Check password confirmation
  if (password !== confirmPassword) {
    window.Toast.error('Mật khẩu xác nhận không khớp')
    return
  }
  
  // Check terms agreement
  if (!agreeTerms) {
    window.Toast.error('Vui lòng đồng ý với điều khoản sử dụng')
    return
  }
  
  window.Loading.show('Đang đăng ký...')
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  window.Loading.hide()
  window.Toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
  
  // Switch to login tab
  activeTab.value = 'login'
  
  // Reset form
  registerForm.value = {
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  }
}

const closeModal = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
}

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value)
    
    // Listen for custom event to open modal
    window.addEventListener('open-auth-modal', (event) => {
      activeTab.value = event.detail.tab || 'login'
      modalInstance.show()
    })
  }
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

.form-text {
  font-size: 0.85rem;
  color: #666;
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
