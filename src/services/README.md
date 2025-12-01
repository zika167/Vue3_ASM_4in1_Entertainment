# 📡 Services Layer

Thư mục này chứa các service classes để giao tiếp với backend APIs.

## 🏗️ Architecture

```
services/
├── UserService.js          # Factory - chọn implementation
├── MockUserService.js      # Mock data cho development
├── JavaUserService.js      # Kết nối Java Spring Boot API
├── FirebaseUserService.js  # Kết nối Firebase
│
├── VideoService.js         # Factory - chọn implementation
├── MockVideoService.js     # Mock data cho development
├── JavaVideoService.js     # Kết nối Java Spring Boot API
│
└── README.md               # Tài liệu này
```

## 🔧 Cách sử dụng

### 1. Import Service

```javascript
// Luôn import từ Service Factory (không import trực tiếp Mock/Java)
import UserService from '@/services/UserService'
import VideoService from '@/services/VideoService'
```

### 2. Gọi API

```javascript
// Get all
const result = await UserService.getAllUsers()
if (result.success) {
  console.log(result.data)
}

// Create
const newUser = await UserService.createUser({
  username: 'newuser',
  email: 'new@example.com'
})

// Update
const updated = await UserService.updateUser(1, { fullname: 'New Name' })

// Delete
const deleted = await UserService.deleteUser(1)

// Search
const searchResult = await UserService.searchUsers('keyword')
```

## ⚙️ Cấu hình Backend

### File `.env`

```env
# Chọn backend mode
VITE_SERVICE_MODE=mock    # mock | java | firebase

# Java API URL
VITE_JAVA_API_URL=http://localhost:8080/api
```

### Các mode có sẵn

| Mode | Description | Khi nào dùng |
|------|-------------|--------------|
| `mock` | Dữ liệu giả, không cần backend | Development, UI testing |
| `java` | Kết nối Java Spring Boot API | Production, Integration testing |
| `firebase` | Kết nối Firebase | Alternative backend |

## 📋 Service Interface

### Tất cả Service implementations phải có các methods sau:

#### UserService

```typescript
interface UserService {
  getAllUsers(): Promise<ApiResponse<User[]>>
  getUserById(id: number): Promise<ApiResponse<User>>
  createUser(data: UserInput): Promise<ApiResponse<User>>
  updateUser(id: number, data: UserInput): Promise<ApiResponse<User>>
  deleteUser(id: number): Promise<ApiResponse<void>>
  toggleUserStatus(id: number): Promise<ApiResponse<User>>
  searchUsers(keyword: string): Promise<ApiResponse<User[]>>
  getUsersByRole(role: string): Promise<ApiResponse<User[]>>
  getStatistics(): Promise<ApiResponse<UserStatistics>>
}
```

#### VideoService

```typescript
interface VideoService {
  getAllVideos(): Promise<ApiResponse<Video[]>>
  getVideoById(id: number): Promise<ApiResponse<Video>>
  createVideo(data: VideoInput): Promise<ApiResponse<Video>>
  updateVideo(id: number, data: VideoInput): Promise<ApiResponse<Video>>
  deleteVideo(id: number): Promise<ApiResponse<void>>
  searchVideos(keyword: string): Promise<ApiResponse<Video[]>>
  getFavoriteVideos(): Promise<ApiResponse<Video[]>>
  toggleFavorite(videoId: number): Promise<ApiResponse<Video>>
  toggleLike(videoId: number): Promise<ApiResponse<Video>>
  getStatistics(): Promise<ApiResponse<VideoStatistics>>
}
```

### Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  total?: number
}
```

## 🔄 Thêm Service mới

### Bước 1: Tạo Mock Service

```javascript
// src/services/MockProductService.js
class MockProductService {
  async getAllProducts() {
    return { success: true, data: mockProducts }
  }
  // ... other methods
}
export default new MockProductService()
```

### Bước 2: Tạo Java Service

```javascript
// src/services/JavaProductService.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_JAVA_API_URL
})

class JavaProductService {
  async getAllProducts() {
    try {
      const response = await apiClient.get('/products')
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  // ... other methods
}
export default new JavaProductService()
```

### Bước 3: Tạo Service Factory

```javascript
// src/services/ProductService.js
import MockProductService from './MockProductService'
import JavaProductService from './JavaProductService'

const SERVICE_MODE = import.meta.env.VITE_SERVICE_MODE || 'mock'

function getServiceImplementation() {
  switch (SERVICE_MODE) {
    case 'java':
      return JavaProductService
    default:
      return MockProductService
  }
}

export default getServiceImplementation()
```

## 🧪 Testing

### Test với Mock Data

```bash
# .env
VITE_SERVICE_MODE=mock
npm run dev
```

### Test với Java API

```bash
# .env
VITE_SERVICE_MODE=java
VITE_JAVA_API_URL=http://localhost:8080/api
npm run dev
```

## 📝 Best Practices

1. **Luôn import từ Factory** - Không import trực tiếp Mock/Java service
2. **Consistent Response Format** - Tất cả methods trả về `{ success, data, error }`
3. **Error Handling** - Luôn wrap trong try-catch
4. **Type Safety** - Document rõ input/output types
5. **Logging** - Log errors để debug

## 🔗 Related Files

- [TEAM_GUIDE.md](../../TEAM_GUIDE.md) - Hướng dẫn tổng quan
- [BACKEND_API_SPEC.md](../../BACKEND_API_SPEC.md) - API specification
- [useCrudOperations.js](../composables/useCrudOperations.js) - CRUD composable
