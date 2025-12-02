# 📡 HƯỚNG DẪN SỬ DỤNG AXIOS TRONG VUE 3

## 📋 MỤC LỤC

1. [Giới thiệu](#1-giới-thiệu)
2. [Cài đặt](#2-cài-đặt)
3. [Cấu hình cơ bản](#3-cấu-hình-cơ-bản)
4. [Các phương thức HTTP](#4-các-phương-thức-http)
5. [Interceptors](#5-interceptors)
6. [Xử lý lỗi](#6-xử-lý-lỗi)
7. [Ví dụ thực tế trong dự án](#7-ví-dụ-thực-tế-trong-dự-án)

---

## 1. GIỚI THIỆU

**Axios** là một HTTP client phổ biến cho JavaScript, hỗ trợ:
- ✅ Promise-based API
- ✅ Request/Response interceptors
- ✅ Automatic JSON transformation
- ✅ Request cancellation
- ✅ Timeout handling
- ✅ CSRF protection
Lớp   File      Code minh họa
1.    View      UserManagement.vue,"<button @click=""loadUsers"">Lấy DS</button>"
2.    Service   FE,JavaUserService.js,return axios.get('/api/users');
3.    Filter    CorsFilter.java,"resp.setHeader(""Access-Control-Allow-Origin"", 
                ""http://localhost:5173"");"
4.    Servlet   UserServlet.java,String json = gson.toJson(userList); 
                resp.getWriter().write(json);
5.    JPA       UserDAO.java,"return em.find(User.class, id);"

---

## 2. CÀI ĐẶT

```bash
npm install axios
```

**Đã cài trong dự án:** `"axios": "^1.13.2"`

---

## 3. CẤU HÌNH CƠ BẢN

### 3.1 Import và sử dụng trực tiếp

```javascript
import axios from 'axios'

// GET request
const response = await axios.get('http://localhost:8080/api/users')
console.log(response.data)

// POST request
const result = await axios.post('http://localhost:8080/api/users', {
  id: 'user001',
  fullname: 'John Doe',
  email: 'john@example.com'
})
```

### 3.2 Tạo Axios Instance (KHUYẾN NGHỊ)

```javascript
import axios from 'axios'

// Tạo instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,  // 10 giây
  headers: {
    'Content-Type': 'application/json'
  }
})

// Sử dụng
const response = await apiClient.get('/users')  // GET /api/users
const result = await apiClient.post('/users', userData)  // POST /api/users
```

### 3.3 Cấu hình từ Environment Variables

```javascript
// .env file
VITE_API_BASE_URL=http://localhost:8080/api

// JavaScript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})
```

---

## 4. CÁC PHƯƠNG THỨC HTTP

### 4.1 GET - Lấy dữ liệu

```javascript
// GET đơn giản
const response = await apiClient.get('/users')

// GET với params
const response = await apiClient.get('/users', {
  params: {
    page: 1,
    limit: 10,
    search: 'john'
  }
})
// URL: /users?page=1&limit=10&search=john

// GET với path parameter
const userId = 'user001'
const response = await apiClient.get(`/users/${userId}`)
// URL: /users/user001
```

### 4.2 POST - Tạo mới

```javascript
// POST với JSON body
const response = await apiClient.post('/users', {
  id: 'user001',
  fullname: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
})

// POST với form data
const formData = new FormData()
formData.append('file', file)
formData.append('title', 'My Video')

const response = await apiClient.post('/videos/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

### 4.3 PUT - Cập nhật toàn bộ

```javascript
const response = await apiClient.put('/users/user001', {
  fullname: 'John Updated',
  email: 'john.updated@example.com'
})
```

### 4.4 PATCH - Cập nhật một phần

```javascript
const response = await apiClient.patch('/users/user001', {
  fullname: 'John Patched'
})

// Toggle status
const response = await apiClient.patch('/users/user001/toggle-status')
```

### 4.5 DELETE - Xóa

```javascript
const response = await apiClient.delete('/users/user001')

// DELETE với body (ít dùng)
const response = await apiClient.delete('/users', {
  data: { ids: ['user001', 'user002'] }
})
```

---

## 5. INTERCEPTORS

Interceptors cho phép bạn xử lý request/response trước khi chúng được gửi đi hoặc nhận về.

### 5.1 Request Interceptor

```javascript
// Thêm token vào mọi request
apiClient.interceptors.request.use(
  config => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('authToken')
    
    // Nếu có token, thêm vào header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request (debug)
    console.log('📤 Request:', config.method?.toUpperCase(), config.url)
    
    return config
  },
  error => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)
```

### 5.2 Response Interceptor

```javascript
apiClient.interceptors.response.use(
  response => {
    // Log response (debug)
    console.log('📥 Response:', response.status, response.config.url)
    
    // Trả về data trực tiếp (không cần .data)
    return response.data
  },
  error => {
    // Xử lý lỗi theo status code
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('🔒 Unauthorized - Please login')
          localStorage.removeItem('authToken')
          window.location.href = '/login'
          break
          
        case 403:
          console.error('🚫 Forbidden - Access denied')
          break
          
        case 404:
          console.error('🔍 Not Found')
          break
          
        case 500:
          console.error('💥 Server Error')
          break
          
        default:
          console.error('❌ Error:', error.response.data?.message)
      }
      
      return Promise.reject(new Error(error.response.data?.message || 'Server error'))
    }
    
    if (error.request) {
      // Request được gửi nhưng không có response
      console.error('📡 No response from server')
      return Promise.reject(new Error('No response from server'))
    }
    
    // Lỗi khác
    return Promise.reject(error)
  }
)
```

---

## 6. XỬ LÝ LỖI

### 6.1 Try-Catch Pattern

```javascript
async function getUsers() {
  try {
    const response = await apiClient.get('/users')
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Sử dụng
const result = await getUsers()
if (result.success) {
  console.log('Users:', result.data)
} else {
  console.error('Error:', result.error)
}
```

### 6.2 Với Toast Notification

```javascript
async function createUser(userData) {
  try {
    const response = await apiClient.post('/users', userData)
    window.Toast?.success('Tạo user thành công!')
    return { success: true, data: response }
  } catch (error) {
    window.Toast?.error(error.message || 'Có lỗi xảy ra!')
    return { success: false, error: error.message }
  }
}
```

### 6.3 Loading State

```javascript
import { ref } from 'vue'

const loading = ref(false)
const users = ref([])
const error = ref(null)

async function loadUsers() {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiClient.get('/users')
    users.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

---

## 7. VÍ DỤ THỰC TẾ TRONG DỰ ÁN

### 7.1 File: `src/services/api.js` (Cấu hình chung)

```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(new Error(error.response?.data?.message || 'Server error'))
  }
)

export default apiClient
```

### 7.2 File: `src/services/JavaUserService.js` (Service Layer)

```javascript
import apiClient from './api'

class JavaUserService {
  // GET all users
  async getAllUsers() {
    try {
      const response = await apiClient.get('/users')
      return { success: true, data: response.data, total: response.total }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // GET user by ID
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // POST create user
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData)
      return { success: true, data: response.data, message: 'User created!' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // PUT update user
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/users/${id}`, userData)
      return { success: true, data: response.data, message: 'User updated!' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // DELETE user
  async deleteUser(id) {
    try {
      await apiClient.delete(`/users/${id}`)
      return { success: true, message: 'User deleted!' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // GET search users
  async searchUsers(keyword) {
    try {
      const response = await apiClient.get('/users/search', {
        params: { q: keyword }
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default new JavaUserService()
```

### 7.3 Sử dụng trong Vue Component

```vue
<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading">Đang tải...</div>
    
    <!-- Error state -->
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    
    <!-- Data -->
    <div v-else>
      <div v-for="user in users" :key="user.id">
        {{ user.fullname }} - {{ user.email }}
      </div>
    </div>
    
    <!-- Create form -->
    <form @submit.prevent="handleCreate">
      <input v-model="formData.fullname" placeholder="Fullname" />
      <input v-model="formData.email" placeholder="Email" />
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Đang tạo...' : 'Tạo User' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UserService from '@/services/UserService'

const users = ref([])
const loading = ref(false)
const error = ref(null)
const submitting = ref(false)
const formData = ref({
  fullname: '',
  email: ''
})

// Load users on mount
onMounted(async () => {
  loading.value = true
  try {
    const result = await UserService.getAllUsers()
    if (result.success) {
      users.value = result.data
    } else {
      error.value = result.error
    }
  } finally {
    loading.value = false
  }
})

// Create user
async function handleCreate() {
  submitting.value = true
  try {
    const result = await UserService.createUser(formData.value)
    if (result.success) {
      window.Toast?.success(result.message)
      users.value.push(result.data)
      formData.value = { fullname: '', email: '' }
    } else {
      window.Toast?.error(result.error)
    }
  } finally {
    submitting.value = false
  }
}
</script>
```

---

## 8. TIPS & BEST PRACTICES

### ✅ DO (Nên làm)

1. **Luôn dùng try-catch** để xử lý lỗi
2. **Tạo axios instance** thay vì import trực tiếp
3. **Dùng interceptors** để xử lý token và lỗi chung
4. **Hiển thị loading state** khi gọi API
5. **Dùng environment variables** cho base URL
6. **Tách service layer** riêng biệt

### ❌ DON'T (Không nên)

1. **Không hardcode URL** trong component
2. **Không bỏ qua error handling**
3. **Không gọi API trực tiếp trong template**
4. **Không lưu token trong code**

---

## 9. QUICK REFERENCE

```javascript
// GET
await apiClient.get('/users')
await apiClient.get('/users/user001')
await apiClient.get('/users', { params: { page: 1 } })

// POST
await apiClient.post('/users', { fullname: 'John' })

// PUT
await apiClient.put('/users/user001', { fullname: 'John Updated' })

// PATCH
await apiClient.patch('/users/user001/toggle-status')

// DELETE
await apiClient.delete('/users/user001')
```

---

**📖 Tham khảo thêm:** [Axios Documentation](https://axios-http.com/docs/intro)
