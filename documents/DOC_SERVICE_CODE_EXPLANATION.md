# 📖 GIẢI THÍCH CODE: Service Pattern

## 📁 Cấu trúc hiện tại

```
src/services/
├── factories/              ← IMPORT TỪ ĐÂY
│   ├── UserService.js      ✅
│   └── VideoService.js     ✅
│
├── JavaUserService.js      # Implementation
├── JavaVideoService.js     # Implementation
├── BaseJavaService.js      # Base class
├── apiClient.js            # Axios instance
└── createServiceFactory.js # Factory helper
```

---

## 📁 FILE 1: factories/UserService.js (Factory)

```javascript
import { createServiceFactory, getCurrentServiceMode } from '../createServiceFactory'
import JavaUserService from '../JavaUserService'

const UserService = createServiceFactory('User', {
  java: JavaUserService,
  mock: JavaUserService,
  firebase: null
})

export default UserService
export { getCurrentServiceMode }
```

**Giải thích:**
- Factory tự động chọn implementation dựa trên `VITE_SERVICE_MODE`
- Khi mode = `java` → dùng `JavaUserService`
- Cho phép switch backend mà không sửa code component

---

## 📁 FILE 2: JavaUserService.js (Implementation)

```javascript
import BaseJavaService from './BaseJavaService'

class JavaUserService extends BaseJavaService {
  constructor() {
    super('/users')  // Base endpoint
  }

  async getAllUsers() {
    return this.handleRequest(
      () => this.api.get(this.baseEndpoint),
      'Lấy danh sách users'
    )
  }

  async getUserById(id) {
    return this.handleRequest(
      () => this.api.get(`${this.baseEndpoint}/${id}`),
      'Lấy user'
    )
  }

  async createUser(data) {
    return this.handleRequest(
      () => this.api.post(this.baseEndpoint, data),
      'Tạo user'
    )
  }

  async updateUser(id, data) {
    return this.handleRequest(
      () => this.api.put(`${this.baseEndpoint}/${id}`, data),
      'Cập nhật user'
    )
  }

  async deleteUser(id) {
    return this.handleRequest(
      () => this.api.delete(`${this.baseEndpoint}/${id}`),
      'Xóa user'
    )
  }
}

export default new JavaUserService()
```

**Giải thích:**
- Kế thừa từ `BaseJavaService` để có sẵn `this.api` và `this.handleRequest`
- `super('/users')` đặt base endpoint
- Mỗi method gọi `this.handleRequest()` để xử lý try-catch tự động

---

## 📁 FILE 3: BaseJavaService.js (Base Class)

```javascript
import apiClient from './apiClient'

class BaseJavaService {
  constructor(baseEndpoint) {
    this.baseEndpoint = baseEndpoint
    this.api = apiClient
  }

  async handleRequest(requestFn, actionName) {
    try {
      const response = await requestFn()
      return {
        success: true,
        data: response.data || response,
        message: `${actionName} thành công`
      }
    } catch (error) {
      console.error(`${actionName} failed:`, error)
      return {
        success: false,
        error: error.message || 'Có lỗi xảy ra'
      }
    }
  }
}

export default BaseJavaService
```

**Giải thích:**
- `handleRequest()` wrap try-catch, trả về format chuẩn `{ success, data, error }`
- Tất cả services kế thừa để có code DRY

---

## 📁 FILE 4: apiClient.js (Axios Instance)

```javascript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - thêm token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - xử lý lỗi
apiClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export default apiClient
```

---

## 🎯 LUỒNG HOẠT ĐỘNG

```
Component
    ↓
import UserService from '@/services/factories/UserService'
    ↓
UserService.getAllUsers()
    ↓
JavaUserService.getAllUsers()
    ↓
BaseJavaService.handleRequest()
    ↓
apiClient.get('/users')
    ↓
Axios → HTTP Request → Java Backend
    ↓
Response → { success: true, data: [...] }
    ↓
Component nhận kết quả
```

---

## 💡 SỬ DỤNG TRONG COMPONENT

```vue
<script setup>
import { ref, onMounted } from 'vue'
import UserService from '@/services/factories/UserService'

const users = ref([])
const loading = ref(false)

const loadUsers = async () => {
  loading.value = true
  const result = await UserService.getAllUsers()
  
  if (result.success) {
    users.value = result.data
  } else {
    window.Toast?.error(result.error)
  }
  
  loading.value = false
}

onMounted(loadUsers)
</script>
```

---

## 🔑 KEY CONCEPTS

| Concept | Giải thích |
|---------|------------|
| **Factory Pattern** | Chọn implementation dựa trên config |
| **Base Class** | Code chung cho tất cả services |
| **Axios Instance** | Cấu hình chung (baseURL, interceptors) |
| **Consistent Response** | Luôn trả về `{ success, data, error }` |
