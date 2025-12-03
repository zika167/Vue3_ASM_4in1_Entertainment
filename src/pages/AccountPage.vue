<template>
  <div class="account-page bg-light py-5">
    <div class="container" style="max-width: 900px;">
      <!-- Page Header -->
      <div class="mb-4">
        <h1 class="h2 mb-1">
          <i class="bi bi-gear-fill me-2"></i>Cài Đặt Tài Khoản
        </h1>
        <p class="text-muted">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <!-- Edit Profile Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-header text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <h5 class="mb-0"><i class="bi bi-person-circle me-2"></i>Thông Tin Cá Nhân</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleEditProfile">
            <!-- Username (readonly) -->
            <div class="mb-3">
              <label for="username" class="form-label">
                <i class="bi bi-person-badge me-1"></i>Tên đăng nhập
              </label>
              <input 
                type="text" 
                class="form-control" 
                id="username" 
                v-model="formData.username"
                readonly
              >
              <div class="form-text">Tên đăng nhập không thể thay đổi</div>
            </div>

            <!-- Fullname -->
            <div class="mb-3">
              <label for="fullname" class="form-label">
                <i class="bi bi-person-fill me-1"></i>Họ và tên
              </label>
              <input 
                type="text" 
                class="form-control"
                :class="{ 'is-invalid': editErrors.fullname }"
                id="fullname" 
                v-model="formData.fullname"
                @input="validateFullname"
              >
              <div v-if="editErrors.fullname" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>{{ editErrors.fullname }}
              </div>
            </div>

            <!-- Email (readonly - same as username) -->
            <div class="mb-3">
              <label for="email" class="form-label">
                <i class="bi bi-envelope-fill me-1"></i>Email
              </label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                v-model="formData.email"
                readonly
              >
              <div class="form-text">Email không thể thay đổi (được sử dụng làm tên đăng nhập)</div>
            </div>

            <!-- Current Password (required to update profile) -->
            <div class="mb-4">
              <label for="currentPassword" class="form-label">
                <i class="bi bi-lock me-1"></i>Mật khẩu hiện tại (bắt buộc để xác nhận)
              </label>
              <div class="password-input-wrapper">
                <input 
                  :type="showProfilePassword ? 'text' : 'password'" 
                  class="form-control"
                  :class="{ 'is-invalid': editErrors.password }"
                  id="currentPassword" 
                  v-model="formData.password"
                  placeholder="Nhập mật khẩu hiện tại"
                >
                <button 
                  type="button" 
                  class="password-toggle-btn"
                  @click="showProfilePassword = !showProfilePassword"
                >
                  <i :class="showProfilePassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="editErrors.password" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>{{ editErrors.password }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2">
              <button 
                type="submit" 
                class="btn text-white"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                :disabled="submitting || !isEditProfileValid"
              >
                <span v-if="submitting">
                  <span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...
                </span>
                <span v-else>
                  <i class="bi bi-check-circle me-1"></i>Lưu thay đổi
                </span>
              </button>
              <button type="button" class="btn btn-secondary" @click="resetEditForm">
                <i class="bi bi-arrow-clockwise me-1"></i>Đặt lại
              </button>
              <router-link to="/" class="btn btn-outline-secondary">
                <i class="bi bi-x-circle me-1"></i>Hủy
              </router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Password Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-header text-white" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <h5 class="mb-0"><i class="bi bi-key-fill me-2"></i>Đổi Mật Khẩu</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleChangePassword">
            <!-- Old Password -->
            <div class="mb-3">
              <label for="oldPassword" class="form-label">
                <i class="bi bi-lock me-1"></i>Mật khẩu hiện tại
              </label>
              <div class="password-input-wrapper">
                <input 
                  :type="showOldPassword ? 'text' : 'password'" 
                  class="form-control"
                  :class="{ 'is-invalid': changePasswordErrors.oldPassword }"
                  id="oldPassword" 
                  v-model="changePasswordForm.oldPassword"
                  @input="validateOldPassword"
                  placeholder="Nhập mật khẩu hiện tại"
                >
                <button 
                  type="button" 
                  class="password-toggle-btn"
                  @click="showOldPassword = !showOldPassword"
                >
                  <i :class="showOldPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="changePasswordErrors.oldPassword" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>{{ changePasswordErrors.oldPassword }}
              </div>
            </div>

            <!-- New Password -->
            <div class="mb-3">
              <label for="newPassword" class="form-label">
                <i class="bi bi-lock-fill me-1"></i>Mật khẩu mới
              </label>
              <div class="password-input-wrapper">
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  class="form-control"
                  :class="{ 'is-invalid': changePasswordErrors.newPassword }"
                  id="newPassword" 
                  v-model="changePasswordForm.newPassword"
                  @input="validateNewPassword"
                  placeholder="Tạo mật khẩu mới"
                >
                <button 
                  type="button" 
                  class="password-toggle-btn"
                  @click="showNewPassword = !showNewPassword"
                >
                  <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="changePasswordErrors.newPassword" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>{{ changePasswordErrors.newPassword }}
              </div>
              <!-- Password Strength -->
              <div v-if="changePasswordForm.newPassword" class="password-strength-container mt-2">
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

            <!-- Confirm Password -->
            <div class="mb-4">
              <label for="confirmNewPassword" class="form-label">
                <i class="bi bi-lock-fill me-1"></i>Xác nhận mật khẩu mới
              </label>
              <div class="password-input-wrapper">
                <input 
                  type="password" 
                  class="form-control"
                  :class="{ 'is-invalid': changePasswordErrors.confirmNewPassword }"
                  id="confirmNewPassword" 
                  v-model="changePasswordForm.confirmNewPassword"
                  @input="validateConfirmNewPassword"
                  placeholder="Nhập lại mật khẩu mới"
                >
              </div>
              <div v-if="changePasswordErrors.confirmNewPassword" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>{{ changePasswordErrors.confirmNewPassword }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2">
              <button 
                type="submit" 
                class="btn text-white"
                style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"
                :disabled="changePasswordSubmitting || !isChangePasswordValid"
              >
                <span v-if="changePasswordSubmitting">
                  <span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...
                </span>
                <span v-else>
                  <i class="bi bi-check-circle me-1"></i>Đổi mật khẩu
                </span>
              </button>
              <button type="button" class="btn btn-secondary" @click="resetChangePasswordForm">
                <i class="bi bi-arrow-clockwise me-1"></i>Đặt lại
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Additional Info Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-header text-white" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Thông Tin Khác</h5>
        </div>
        <div class="card-body">
          <ul class="list-unstyled mb-0">
            <li class="mb-2">
              <strong><i class="bi bi-calendar-check me-2 text-primary"></i>Ngày tham gia:</strong>
              <span class="text-muted">{{ userInfo.createdAt }}</span>
            </li>
            <li class="mb-2">
              <strong><i class="bi bi-heart-fill me-2 text-danger"></i>Video yêu thích:</strong>
              <span class="text-muted">{{ userInfo.favoriteCount }} videos</span>
            </li>
            <li class="mb-2">
              <strong><i class="bi bi-clock-history me-2 text-warning"></i>Đăng nhập lần cuối:</strong>
              <span class="text-muted">{{ userInfo.lastLogin }}</span>
            </li>
            <li>
              <strong><i class="bi bi-shield-check me-2 text-success"></i>Trạng thái tài khoản:</strong>
              <span class="badge bg-success">Đã xác thực</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card shadow-sm border-danger">
        <div class="card-header bg-danger text-white">
          <h5 class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i>Vùng Nguy Hiểm</h5>
        </div>
        <div class="card-body">
          <p class="text-muted mb-3">
            Các hành động sau đây không thể hoàn tác. Vui lòng cẩn thận!
          </p>
          <button class="btn btn-outline-danger" @click="handleDeleteAccount">
            <i class="bi bi-trash me-1"></i>Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Validation from '@/utils/validation'
import UserService from '@/services/factories/UserService'
import AuthService from '@/services/factories/AuthService'

const submitting = ref(false)
const showProfilePassword = ref(false)
const originalFormData = reactive({})

const formData = reactive({
  username: '',
  fullname: '',
  email: '',
  password: ''
})

const editErrors = ref({
  fullname: '',
  password: ''
})

const userInfo = reactive({
  createdAt: '',
  favoriteCount: 0,
  lastLogin: ''
})

// Real-time validation for fullname
const validateFullname = () => {
  if (formData.fullname.trim()) {
    editErrors.value.fullname = ''
  } else {
    editErrors.value.fullname = ''
  }
}



// Real-time validation for password
const validateProfilePassword = () => {
  if (formData.password.trim()) {
    editErrors.value.password = ''
  } else {
    editErrors.value.password = ''
  }
}

// Validate on submit
const validateEditProfileForm = () => {
  // Check fullname
  if (!formData.fullname.trim()) {
    editErrors.value.fullname = 'Vui lòng điền họ và tên'
    return 'fullname'
  }
  editErrors.value.fullname = ''

  // Check password
  if (!formData.password.trim()) {
    editErrors.value.password = 'Vui lòng điền mật khẩu để xác nhận'
    return 'currentPassword'
  }
  editErrors.value.password = ''

  return null
}

// Check if form is valid for button state
const isEditProfileValid = computed(() => {
  return formData.fullname.trim() && 
         formData.password.trim() &&
         !editErrors.value.fullname &&
         !editErrors.value.password &&
         (formData.fullname !== originalFormData.fullname)
})

const handleEditProfile = async () => {
  // Validate form
  const firstErrorField = validateEditProfileForm()
  
  if (firstErrorField) {
    const fieldElement = document.getElementById(firstErrorField)
    if (fieldElement) {
      fieldElement.focus()
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  submitting.value = true
  
  try {
    // Call UserService.updateUser
    const userId = formData.username
    const result = await UserService.updateUser(userId, {
      fullname: formData.fullname,
      email: formData.email,  // Send as-is (readonly, same as username)
      password: formData.password
    })
    
    if (result.success) {
      // Update originalFormData
      originalFormData.fullname = formData.fullname
      originalFormData.email = formData.email
      
      // Update localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.fullname = formData.fullname
      user.email = formData.email
      localStorage.setItem('user', JSON.stringify(user))
      
      window.Toast?.success('Cập nhật thông tin thành công!')
    } else {
      window.Toast?.error(result.error || 'Có lỗi xảy ra!')
    }
  } catch (error) {
    window.Toast?.error(error.message || 'Có lỗi xảy ra!')
  } finally {
    submitting.value = false
  }
}

const resetEditForm = () => {
  // Reset form data back to original
  formData.fullname = originalFormData.fullname || ''
  formData.password = ''
  
  // Clear errors
  editErrors.value.fullname = ''
  editErrors.value.password = ''
  showProfilePassword.value = false
}

// Change Password Form
const changePasswordSubmitting = ref(false)
const showOldPassword = ref(false)
const showNewPassword = ref(false)

const changePasswordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const changePasswordErrors = ref({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// Password strength meter
const passwordStrength = computed(() => {
  const pwd = changePasswordForm.newPassword
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

// Real-time validation for old password
const validateOldPassword = () => {
  if (changePasswordForm.oldPassword.trim()) {
    changePasswordErrors.value.oldPassword = ''
  } else {
    changePasswordErrors.value.oldPassword = ''
  }
}

// Real-time validation for new password
const validateNewPassword = () => {
  if (changePasswordForm.newPassword.trim()) {
    if (changePasswordForm.newPassword === changePasswordForm.oldPassword) {
      changePasswordErrors.value.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ'
    } else {
      const check = Validation.isValidPassword(changePasswordForm.newPassword)
      changePasswordErrors.value.newPassword = check.valid ? '' : check.message
    }
  } else {
    changePasswordErrors.value.newPassword = ''
  }
}

// Real-time validation for confirm password
const validateConfirmNewPassword = () => {
  if (changePasswordForm.confirmNewPassword.trim()) {
    if (changePasswordForm.confirmNewPassword !== changePasswordForm.newPassword) {
      changePasswordErrors.value.confirmNewPassword = 'Mật khẩu xác nhận không khớp'
    } else {
      changePasswordErrors.value.confirmNewPassword = ''
    }
  } else {
    changePasswordErrors.value.confirmNewPassword = ''
  }
}

// Validate on submit
const validateChangePasswordForm = () => {
  // Check old password
  if (!changePasswordForm.oldPassword.trim()) {
    changePasswordErrors.value.oldPassword = 'Vui lòng điền mật khẩu hiện tại'
    return 'oldPassword'
  }
  changePasswordErrors.value.oldPassword = ''

  // Check new password
  if (!changePasswordForm.newPassword.trim()) {
    changePasswordErrors.value.newPassword = 'Vui lòng điền mật khẩu mới'
    return 'newPassword'
  }

  if (changePasswordForm.newPassword === changePasswordForm.oldPassword) {
    changePasswordErrors.value.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ'
    return 'newPassword'
  }

  const check = Validation.isValidPassword(changePasswordForm.newPassword)
  if (!check.valid) {
    changePasswordErrors.value.newPassword = check.message
    return 'newPassword'
  }
  changePasswordErrors.value.newPassword = ''

  // Check confirm password
  if (!changePasswordForm.confirmNewPassword.trim()) {
    changePasswordErrors.value.confirmNewPassword = 'Vui lòng xác nhận mật khẩu mới'
    return 'confirmNewPassword'
  }

  if (changePasswordForm.confirmNewPassword !== changePasswordForm.newPassword) {
    changePasswordErrors.value.confirmNewPassword = 'Mật khẩu xác nhận không khớp'
    return 'confirmNewPassword'
  }
  changePasswordErrors.value.confirmNewPassword = ''

  return null
}

// Check if form is valid for button state
const isChangePasswordValid = computed(() => {
  return changePasswordForm.oldPassword.trim() &&
         changePasswordForm.newPassword.trim() &&
         changePasswordForm.confirmNewPassword.trim() &&
         !changePasswordErrors.value.oldPassword &&
         !changePasswordErrors.value.newPassword &&
         !changePasswordErrors.value.confirmNewPassword
})

const handleChangePassword = async () => {
  // Validate form
  const firstErrorField = validateChangePasswordForm()
  
  if (firstErrorField) {
    const fieldElement = document.getElementById(firstErrorField)
    if (fieldElement) {
      fieldElement.focus()
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  changePasswordSubmitting.value = true

  try {
    // Call AuthService.changePassword
    const userId = formData.username
    const result = await AuthService.changePassword(userId, {
      oldPassword: changePasswordForm.oldPassword,
      newPassword: changePasswordForm.newPassword,
      confirmPassword: changePasswordForm.confirmNewPassword
    })

    if (result.success) {
      window.Toast?.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
      resetChangePasswordForm()
      // Logout sau 2 giây để user đăng nhập lại với mật khẩu mới
      setTimeout(() => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        window.location.href = '/'
      }, 2000)
    } else {
      console.error('Change password error:', result.error)
      window.Toast?.error(result.error || 'Có lỗi xảy ra!')
    }
  } catch (error) {
    window.Toast?.error(error.message || 'Có lỗi xảy ra!')
  } finally {
    changePasswordSubmitting.value = false
  }
}

const resetChangePasswordForm = () => {
  changePasswordForm.oldPassword = ''
  changePasswordForm.newPassword = ''
  changePasswordForm.confirmNewPassword = ''
  changePasswordErrors.value.oldPassword = ''
  changePasswordErrors.value.newPassword = ''
  changePasswordErrors.value.confirmNewPassword = ''
  showOldPassword.value = false
  showNewPassword.value = false
}

const handleDeleteAccount = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
    window.Toast?.warning('Tính năng đang được phát triển')
  }
}

onMounted(() => {
  // Load user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.username) {
    formData.username = user.username
    formData.fullname = user.fullname || ''
    formData.email = user.email || ''
    
    // Store original data for reset
    originalFormData.fullname = formData.fullname
    originalFormData.email = formData.email
    
    // Load user additional info
    userInfo.createdAt = user.createdDate ? new Date(user.createdDate).toLocaleDateString('vi-VN') : 'N/A'
    userInfo.lastLogin = user.lastLogin || 'N/A'
    userInfo.favoriteCount = user.favoriteCount || 0
  }
})
</script>

<style scoped>
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
</style>
