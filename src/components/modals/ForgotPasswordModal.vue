<template>
  <div class="modal fade" id="forgotPasswordModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content forgot-modal-content">
        <div class="modal-header forgot-modal-header">
          <div class="forgot-modal-logo">
            <i class="bi bi-key-fill fs-2"></i>
            <h2 class="modal-title">
              {{ isResetMode ? 'Đặt lại mật khẩu' : 'Quên mật khẩu?' }}
            </h2>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        
        <div class="modal-body forgot-modal-body">
          <!-- Step 1: Enter Email -->
          <div v-if="!isResetMode">
            <p class="text-muted mb-4">
              Nhập email của bạn và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
            </p>
            
            <form @submit.prevent="handleSendCode">
              <div class="mb-3">
                <label for="forgotEmail" class="form-label">
                  <i class="bi bi-envelope me-1"></i>Email
                </label>
                <input 
                  type="email" 
                  class="form-control forgot-input" 
                  id="forgotEmail" 
                  v-model="email"
                  placeholder="email@example.com"
                  required
                >
              </div>
              
              <button type="submit" class="btn forgot-btn-primary w-100" :disabled="submitting">
                <span v-if="submitting">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Đang gửi...
                </span>
                <span v-else>
                  <i class="bi bi-send me-2"></i>Gửi mã xác nhận
                </span>
              </button>
            </form>
          </div>
          
          <!-- Step 2: Reset Password -->
          <div v-else>
            <div class="alert alert-success mb-4">
              <i class="bi bi-check-circle me-2"></i>
              Mã xác nhận đã được gửi đến email: <strong>{{ email }}</strong>
            </div>
            
            <form @submit.prevent="handleResetPassword">
              <div class="mb-3">
                <label for="verifyCode" class="form-label">
                  <i class="bi bi-shield-check me-1"></i>Mã xác nhận
                </label>
                <input 
                  type="text" 
                  class="form-control forgot-input" 
                  id="verifyCode" 
                  v-model="verifyCode"
                  placeholder="Nhập mã 6 số"
                  maxlength="6"
                  required
                >
                <small class="form-text text-muted">
                  Mã demo: <code>123456</code>
                </small>
              </div>
              
              <div class="mb-3">
                <label for="newPassword" class="form-label">
                  <i class="bi bi-lock me-1"></i>Mật khẩu mới
                </label>
                <div class="password-input-wrapper">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control forgot-input" 
                    id="newPassword" 
                    v-model="newPassword"
                    placeholder="Nhập mật khẩu mới"
                    minlength="6"
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
              
              <div class="mb-4">
                <label for="confirmPassword" class="form-label">
                  <i class="bi bi-lock-fill me-1"></i>Xác nhận mật khẩu
                </label>
                <input 
                  type="password" 
                  class="form-control forgot-input" 
                  id="confirmPassword" 
                  v-model="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                >
              </div>
              
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary" @click="backToEmail">
                  <i class="bi bi-arrow-left me-1"></i>Quay lại
                </button>
                <button type="submit" class="btn forgot-btn-primary flex-grow-1" :disabled="submitting">
                  <span v-if="submitting">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Đang xử lý...
                  </span>
                  <span v-else>
                    <i class="bi bi-check-circle me-2"></i>Đặt lại mật khẩu
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import Validation from '@/utils/validation'

const modalRef = ref(null)
const email = ref('')
const verifyCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isResetMode = ref(false)
const submitting = ref(false)
let modalInstance = null

const handleSendCode = async () => {
  if (!Validation.isValidEmail(email.value)) {
    window.Toast?.error('Email không hợp lệ')
    return
  }
  
  submitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  submitting.value = false
  isResetMode.value = true
  window.Toast?.success('Mã xác nhận đã được gửi đến email của bạn!')
}

const handleResetPassword = async () => {
  // Validate verify code
  if (verifyCode.value !== '123456') {
    window.Toast?.error('Mã xác nhận không đúng!')
    return
  }
  
  // Validate password
  const passwordCheck = Validation.isValidPassword(newPassword.value)
  if (!passwordCheck.valid) {
    window.Toast?.error(passwordCheck.message)
    return
  }
  
  // Check password confirmation
  if (newPassword.value !== confirmPassword.value) {
    window.Toast?.error('Mật khẩu xác nhận không khớp!')
    return
  }
  
  submitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  submitting.value = false
  window.Toast?.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.')
  
  // Close modal and reset
  closeModal()
  resetForm()
  
  // Open login modal
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { tab: 'login' } }))
  }, 500)
}

const backToEmail = () => {
  isResetMode.value = false
  verifyCode.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const resetForm = () => {
  email.value = ''
  verifyCode.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  isResetMode.value = false
  showPassword.value = false
}

const closeModal = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
}

const handleOpenForgotPassword = () => {
  resetForm()
  if (modalInstance) {
    modalInstance.show()
  }
}

onMounted(() => {
  if (modalRef.value) {
    const existingModal = Modal.getInstance(modalRef.value)
    modalInstance = existingModal || new Modal(modalRef.value)
    
    window.addEventListener('open-forgot-password', handleOpenForgotPassword)
  }
})

onUnmounted(() => {
  window.removeEventListener('open-forgot-password', handleOpenForgotPassword)
})
</script>

<style scoped>
.forgot-modal-content {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.forgot-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-bottom: none;
}

.forgot-modal-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
}

.forgot-modal-logo .modal-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
}

.forgot-modal-body {
  padding: 2rem;
}

.forgot-input {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.forgot-input:focus {
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

.forgot-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.forgot-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.forgot-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-text {
  font-size: 0.85rem;
  color: #666;
}

.form-text code {
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  color: #667eea;
}

@media (max-width: 576px) {
  .forgot-modal-body {
    padding: 1.5rem;
  }
  
  .forgot-modal-logo .modal-title {
    font-size: 1.1rem;
  }
}
</style>
