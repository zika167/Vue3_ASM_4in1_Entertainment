# 🔌 HƯỚNG DẪN KẾT NỐI API VỚI BACKEND

## 🎯 Tổng quan

Dự án sử dụng **Factory Pattern** để kết nối với Backend API. Tất cả API calls đều thông qua các Service files trong folder `factories/`.

---

## 📁 Cấu trúc Services

```
src/services/
├── apiClient.js              # Axios instance (đã config sẵn)
├── BaseJavaService.js        # Base class (đã có sẵn)
├── createServiceFactory.js   # Factory helper (đã có sẵn)
│
├── JavaUserService.js        # User API implementation
├── JavaVideoService.js       # Video API implementation
│
└── factories/                # ← IMPORT TỪ ĐÂY
    ├── UserService.js        # Factory cho User
    └── VideoService.js       # Factory cho Video
```

---

## ⚙️ Bước 1: Cấu hình Backend URL

### File `.env` (trong root project)

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080/api

# Service mode (java/mock/firebase)
VITE_SERVICE_MODE=java
```

**Lưu ý:**
- Thay `http://localhost:8080/api` bằng URL backend thực của bạn
- Nếu backend chạy port khác, thay đổi port tương ứng
- Sau khi sửa `.env`, cần **restart dev server** (Ctrl+C rồi `npm run dev`)

---

## 🔧 Bước 2: Hiểu cách hoạt động

### 2.1. apiClient.js - Axios Instance

File này đã được config sẵn:

```javascript
// src/services/apiClient.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Tự động thêm token vào mọi request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Xử lý response và errors
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Xử lý lỗi tự động
    return Promise.reject(error)
  }
)
```

**Bạn KHÔNG CẦN sửa file này!**

---

### 2.2. BaseJavaService.js - Base Class

Cung cấp method `handleRequest()` để wrap try-catch:

```javascript
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
      return {
        success: false,
        error: error.message || 'Có lỗi xảy ra'
      }
    }
  }
}
```

**Bạn KHÔNG CẦN sửa file này!**

---

## 📝 Bước 3: Sử dụng Service trong Component

### 3.1. Import Service

```javascript
// ✅ ĐÚNG - Import từ factories/
import UserService from '@/services/factories/UserService'
import VideoService from '@/services/factories/VideoService'

// ❌ SAI - Không import trực tiếp từ Java*Service
import JavaUserService from '@/services/JavaUserService'
```

### 3.2. Gọi API trong Component

```vue
<script setup>
import { ref, onMounted } from 'vue'
import UserService from '@/services/factories/UserService'

const users = ref([])
const loading = ref(false)

const loadUsers = async () => {
  loading.value = true
  
  try {
    const result = await UserService.getAllUsers()
    
    if (result.success) {
      users.value = result.data
      window.Toast?.success('Tải dữ liệu thành công')
    } else {
      window.Toast?.error(result.error)
    }
  } catch (error) {
    window.Toast?.error('Có lỗi xảy ra')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>
```

---

## 📡 Bước 4: Các API Methods có sẵn

### UserService

| Method | Mô tả | Params | Return |
|--------|-------|--------|--------|
| `getAllUsers()` | Lấy tất cả users | - | `{ success, data }` |
| `getUserById(id)` | Lấy user theo ID | `id: string` | `{ success, data }` |
| `createUser(data)` | Tạo user mới | `data: object` | `{ success, data }` |
| `updateUser(id, data)` | Cập nhật user | `id, data` | `{ success, data }` |
| `deleteUser(id)` | Xóa user | `id: string` | `{ success }` |
| `searchUsers(keyword)` | Tìm kiếm user | `keyword: string` | `{ success, data }` |

### VideoService

| Method | Mô tả | Params | Return |
|--------|-------|--------|--------|
| `getAllVideos()` | Lấy tất cả videos | - | `{ success, data }` |
| `getVideoById(id)` | Lấy video theo ID | `id: string` | `{ success, data }` |
| `createVideo(data)` | Tạo video mới | `data: object` | `{ success, data }` |
| `updateVideo(id, data)` | Cập nhật video | `id, data` | `{ success, data }` |
| `deleteVideo(id)` | Xóa video | `id: string` | `{ success }` |
| `getStatistics()` | Lấy thống kê | - | `{ success, data }` |

---

## 💡 Ví dụ thực tế

### Ví dụ 1: Load danh sách users

```javascript
const loadUsers = async () => {
  const result = await UserService.getAllUsers()
  
  if (result.success) {
    console.log('Users:', result.data)
    // result.data = [{ id: 'user001', fullname: 'John', ... }, ...]
  } else {
    console.error('Error:', result.error)
  }
}
```

### Ví dụ 2: Tạo user mới

```javascript
const createUser = async () => {
  const newUser = {
    username: 'newuser',
    fullname: 'New User',
    email: 'new@example.com',
    password: '123456'
  }
  
  const result = await UserService.createUser(newUser)
  
  if (result.success) {
    window.Toast?.success('Tạo user thành công!')
    console.log('Created user:', result.data)
  } else {
    window.Toast?.error(result.error)
  }
}
```

### Ví dụ 3: Cập nhật user

```javascript
const updateUser = async (userId) => {
  const updatedData = {
    fullname: 'Updated Name',
    email: 'updated@example.com'
  }
  
  const result = await UserService.updateUser(userId, updatedData)
  
  if (result.success) {
    window.Toast?.success('Cập nhật thành công!')
  } else {
    window.Toast?.error(result.error)
  }
}
```

### Ví dụ 4: Xóa user

```javascript
const deleteUser = async (userId) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return
  
  const result = await UserService.deleteUser(userId)
  
  if (result.success) {
    window.Toast?.success('Đã xóa user')
    // Reload danh sách
    await loadUsers()
  } else {
    window.Toast?.error(result.error)
  }
}
```

---

## 🔍 Bước 5: Debug khi có lỗi

### 5.1. Kiểm tra Backend có chạy không

```bash
# Test bằng curl hoặc Postman
curl http://localhost:8080/api/users
```

### 5.2. Kiểm tra Console

Mở **DevTools > Console** để xem:
- Request URL có đúng không
- Response trả về gì
- Error message

### 5.3. Kiểm tra Network Tab

Mở **DevTools > Network** để xem:
- Status code (200, 404, 500, ...)
- Request headers (có token không?)
- Response body

### 5.4. Các lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `Network Error` | Backend không chạy | Khởi động backend |
| `404 Not Found` | URL sai | Kiểm tra `.env` và endpoint |
| `401 Unauthorized` | Thiếu token | Đăng nhập lại |
| `500 Internal Server Error` | Lỗi backend | Kiểm tra backend logs |
| `CORS Error` | Backend chưa config CORS | Thêm CORS config ở backend |

---

## 🔐 Bước 6: Authentication

### 6.1. Login và lưu token

```javascript
const handleLogin = async (username, password) => {
  const result = await UserService.login({ username, password })
  
  if (result.success) {
    // Lưu token
    localStorage.setItem('authToken', result.data.token)
    
    // Lưu user info
    localStorage.setItem('user', JSON.stringify(result.data.user))
    
    window.Toast?.success('Đăng nhập thành công!')
  } else {
    window.Toast?.error(result.error)
  }
}
```

### 6.2. Token tự động được thêm vào headers

Nhờ `apiClient` interceptor, mọi request sau khi login sẽ tự động có:

```
Authorization: Bearer <token>
```

### 6.3. Logout

```javascript
const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  router.push('/')
}
```

---

## 🌐 Bước 7: CORS Configuration (Backend)

Nếu gặp lỗi CORS, backend cần config:

### Spring Boot (Java)

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173") // Vite dev server
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## 📚 Tài liệu tham khảo

- `documents/4_BACKEND_API_SPEC.md` - API specification chi tiết
- `documents/3_API_QUICK_REFERENCE.md` - API quick reference
- `documents/5_SERVICE_ARCHITECTURE.md` - Cấu trúc services
- `src/services/README.md` - Hướng dẫn tạo service mới

---

## ✅ Checklist kết nối API

- [ ] Đã cấu hình `VITE_API_BASE_URL` trong `.env`
- [ ] Backend đang chạy và accessible
- [ ] Import service từ `@/services/factories/`
- [ ] Gọi API với `await ServiceName.method()`
- [ ] Kiểm tra `result.success` trước khi dùng `result.data`
- [ ] Xử lý error với `result.error`
- [ ] Hiển thị loading state khi gọi API
- [ ] Hiển thị toast notification cho user

---

**Chúc bạn kết nối API thành công! 🚀**
