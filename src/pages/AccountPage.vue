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

            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="form-label">
                <i class="bi bi-envelope-fill me-1"></i>Email
              </label>
              <input 
                type="email" 
                class="form-control"
                :class="{ 'is-invalid': editErrors.email }"
                id="email" 
                v-model="formData.email"
                @input="validateEmail"
              >
              <div v-if="editErrors.email" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>{{ editErrors.email }}
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

const submitting = ref(false)
const originalFormData = reactive({})

const formData = reactive({
  username: '',
  fullname: '',
  email: ''
})

const editErrors = ref({
  fullname: '',
  email: ''
})

const userInfo = reactive({
  createdAt: '01/01/2024',
  favoriteCount: 6,
  lastLogin: '26/11/2025 10:30 AM'
})

// Real-time validation for fullname
const validateFullname = () => {
  if (formData.fullname.trim()) {
    editErrors.value.fullname = ''
  } else {
    editErrors.value.fullname = ''
  }
}

// Real-time validation for email
const validateEmail = () => {
  if (formData.email.trim()) {
    if (!Validation.isValidEmail(formData.email)) {
      editErrors.value.email = 'Email không hợp lệ'
    } else {
      editErrors.value.email = ''
    }
  } else {
    editErrors.value.email = ''
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

  // Check email
  if (!formData.email.trim()) {
    editErrors.value.email = 'Vui lòng điền email'
    return 'email'
  }
  
  if (!Validation.isValidEmail(formData.email)) {
    editErrors.value.email = 'Email không hợp lệ'
    return 'email'
  }
  editErrors.value.email = ''

  return null
}

// Check if form is valid for button state
const isEditProfileValid = computed(() => {
  return formData.fullname.trim() && 
         formData.email.trim() &&
         !editErrors.value.fullname &&
         !editErrors.value.email &&
         (formData.fullname !== originalFormData.fullname || 
          formData.email !== originalFormData.email)
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
    // TODO: Call UserService.updateUser(formData)
    // const result = await UserService.updateUser(formData.username, {
    //   fullname: formData.fullname,
    //   email: formData.email
    // })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update originalFormData
    originalFormData.fullname = formData.fullname
    originalFormData.email = formData.email
    
    // Update localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    user.fullname = formData.fullname
    user.email = formData.email
    localStorage.setItem('user', JSON.stringify(user))
    
    window.Toast?.success('Cập nhật thông tin thành công!')
  } catch (error) {
    window.Toast?.error(error.message || 'Có lỗi xảy ra!')
  } finally {
    submitting.value = false
  }
}

const resetEditForm = () => {
  // Reset form data back to original
  formData.fullname = originalFormData.fullname || ''
  formData.email = originalFormData.email || ''
  
  // Clear errors
  editErrors.value.fullname = ''
  editErrors.value.email = ''
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
</style>
