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

      <!-- User Info Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-header text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <h5 class="mb-0"><i class="bi bi-person-circle me-2"></i>Thông Tin Tài Khoản</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
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
                id="fullname" 
                v-model="formData.fullname"
                required
              >
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label for="email" class="form-label">
                <i class="bi bi-envelope-fill me-1"></i>Email
              </label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                v-model="formData.email"
                required
              >
            </div>

            <!-- Password -->
            <div class="mb-3">
              <label for="password" class="form-label">
                <i class="bi bi-lock-fill me-1"></i>Mật khẩu mới
              </label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                v-model="formData.password"
                placeholder="Để trống nếu không muốn đổi"
              >
              <div class="form-text">Chỉ nhập nếu bạn muốn thay đổi mật khẩu</div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-4">
              <label for="confirmPassword" class="form-label">
                <i class="bi bi-lock-fill me-1"></i>Xác nhận mật khẩu
              </label>
              <input 
                type="password" 
                class="form-control" 
                id="confirmPassword" 
                v-model="formData.confirmPassword"
                placeholder="Nhập lại mật khẩu mới"
              >
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2">
              <button 
                type="submit" 
                class="btn text-white"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                :disabled="submitting"
              >
                <span v-if="submitting">
                  <span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...
                </span>
                <span v-else>
                  <i class="bi bi-check-circle me-1"></i>Lưu thay đổi
                </span>
              </button>
              <button type="reset" class="btn btn-secondary" @click="resetForm">
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
import { ref, reactive, onMounted } from 'vue'

const submitting = ref(false)

const formData = reactive({
  username: 'mockuser',
  fullname: 'Mock User',
  email: 'mock.user@example.com',
  password: '',
  confirmPassword: ''
})

const userInfo = reactive({
  createdAt: '01/01/2024',
  favoriteCount: 6,
  lastLogin: '26/11/2025 10:30 AM'
})

const handleSubmit = async () => {
  // Validate password
  if (formData.password && formData.password !== formData.confirmPassword) {
    window.Toast?.error('Mật khẩu xác nhận không khớp!')
    return
  }

  submitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  submitting.value = false
  window.Toast?.success('Cập nhật thông tin thành công!')
}

const resetForm = () => {
  formData.fullname = 'Mock User'
  formData.email = 'mock.user@example.com'
  formData.password = ''
  formData.confirmPassword = ''
}

const handleDeleteAccount = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
    window.Toast?.warning('Tính năng đang được phát triển')
  }
}

onMounted(() => {
  // Load user data from localStorage or API
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.username) {
    formData.username = user.username
    formData.fullname = user.fullname || 'Mock User'
  }
})
</script>
