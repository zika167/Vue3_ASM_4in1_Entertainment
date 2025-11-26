# 🏭 Services Layer - Factory Pattern

## 📋 Tổng quan

Services layer implement **Factory Pattern** để dễ dàng switch giữa các backend khác nhau:
- **MockUserService**: Dữ liệu giả để test UI
- **JavaUserService**: Kết nối Java API với Axios
- **FirebaseUserService**: Kết nối Firebase (placeholder)
- **UserService**: Factory để chọn service

## 🎯 Cách sử dụng

### 1. Cấu hình Service Mode

Trong file `.env`:

```env
# Chọn 1 trong 3 modes:
VITE_SERVICE_MODE=mock      # Development - dùng mock data
VITE_SERVICE_MODE=java      # Production - dùng Java API
VITE_SERVICE_MODE=firebase  # Alternative - dùng Firebase
```

### 2. Import và sử dụng trong Component

```vue
<script setup>
import { ref, onMounted } from 'vue'
import UserService from '@/services/UserService'

const users = ref([])
const loading = ref(false)

const loadUsers = async () => {
  loading.value = true
  try {
    const result = await UserService.getAllUsers()
    if (result.success) {
      users.value = result.data
    } else {
      console.error(result.error)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>
```

## 📚 API Methods

Tất cả services đều implement các methods sau:

### getAllUsers()
```javascript
const result = await UserService.getAllUsers()
// Returns: { success: true, data: [...], total: 5 }
```

### getUserById(id)
```javascript
const result = await UserService.getUserById(1)
// Returns: { success: true, data: {...} }
```

### createUser(userData)
```javascript
const result = await UserService.createUser({
  username: 'newuser',
  email: 'new@example.com',
  fullname: 'New User',
  role: 'user'
})
// Returns: { success: true, data: {...}, message: '...' }
```

### updateUser(id, userData)
```javascript
const result = await UserService.updateUser(1, {
  fullname: 'Updated Name'
})
// Returns: { success: true, data: {...}, message: '...' }
```

### deleteUser(id)
```javascript
const result = await UserService.deleteUser(1)
// Returns: { success: true, message: '...' }
```

### toggleUserStatus(id)
```javascript
const result = await UserService.toggleUserStatus(1)
// Returns: { success: true, data: {...}, message: '...' }
```

### searchUsers(keyword)
```javascript
const result = await UserService.searchUsers('john')
// Returns: { success: true, data: [...], total: 2 }
```

### getUsersByRole(role)
```javascript
const result = await UserService.getUsersByRole('admin')
// Returns: { success: true, data: [...], total: 1 }
```

### getStatistics()
```javascript
const result = await UserService.getStatistics()
// Returns: { 
//   success: true, 
//   data: {
//     totalUsers: 5,
//     activeUsers: 4,
//     inactiveUsers: 1,
//     adminUsers: 1,
//     regularUsers: 4
//   }
// }
```

## 🔧 Response Format

Tất cả methods đều trả về format chuẩn:

### Success Response
```javascript
{
  success: true,
  data: {...} | [...],
  total: 10,           // Optional - cho list
  message: '...'       // Optional - cho create/update/delete
}
```

### Error Response
```javascript
{
  success: false,
  error: 'Error message here'
}
```

## 🎨 Mock Data

MockUserService có sẵn 5 users:

1. **mockuser** - Regular user
2. **admin** - Admin user
3. **john_doe** - Regular user (active)
4. **jane_smith** - Regular user (inactive)
5. **bob_wilson** - Regular user (active)

## 🔌 Kết nối Java API

### 1. Cấu hình

```env
VITE_SERVICE_MODE=java
VITE_JAVA_API_URL=http://localhost:8080/api
```

### 2. API Endpoints (Backend cần implement)

```
GET    /api/users                    - Get all users
GET    /api/users/:id                - Get user by ID
POST   /api/users                    - Create user
PUT    /api/users/:id                - Update user
DELETE /api/users/:id                - Delete user
PATCH  /api/users/:id/toggle-status  - Toggle status
GET    /api/users/search?q=keyword   - Search users
GET    /api/users/by-role?role=admin - Get by role
GET    /api/users/statistics         - Get statistics
```

### 3. Authentication

JavaUserService tự động thêm token vào header:

```javascript
// Token được lấy từ localStorage
Authorization: Bearer <token>
```

## 🔥 Kết nối Firebase

### 1. Cài đặt Firebase SDK

```bash
npm install firebase
```

### 2. Cấu hình

```env
VITE_SERVICE_MODE=firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Uncomment code trong FirebaseUserService.js

Hiện tại FirebaseUserService chỉ là placeholder. Cần:
1. Uncomment import statements
2. Uncomment Firebase initialization
3. Uncomment method implementations

## 🧪 Testing

### Test với Mock Data

```bash
# .env
VITE_SERVICE_MODE=mock

# Run dev server
npm run dev
```

### Test với Java API

```bash
# .env
VITE_SERVICE_MODE=java
VITE_JAVA_API_URL=http://localhost:8080/api

# Start Java backend first
# Then run dev server
npm run dev
```

## 🎯 Best Practices

### 1. Error Handling

```javascript
const loadUsers = async () => {
  try {
    const result = await UserService.getAllUsers()
    
    if (result.success) {
      users.value = result.data
    } else {
      // Handle error
      window.Toast?.error(result.error)
    }
  } catch (error) {
    // Handle exception
    window.Toast?.error('Unexpected error occurred')
    console.error(error)
  }
}
```

### 2. Loading State

```javascript
const loading = ref(false)

const loadUsers = async () => {
  loading.value = true
  try {
    const result = await UserService.getAllUsers()
    // ...
  } finally {
    loading.value = false
  }
}
```

### 3. Validation trước khi gọi API

```javascript
import Validation from '@/utils/validation'

const createUser = async (userData) => {
  // Validate email
  if (!Validation.isValidEmail(userData.email)) {
    window.Toast?.error('Email không hợp lệ')
    return
  }
  
  // Validate username
  const usernameCheck = Validation.isValidUsername(userData.username)
  if (!usernameCheck.valid) {
    window.Toast?.error(usernameCheck.message)
    return
  }
  
  // Call API
  const result = await UserService.createUser(userData)
  // ...
}
```

## 📊 Architecture Diagram

```
Component (Vue)
    ↓
UserService (Factory)
    ↓
    ├─→ MockUserService (Mock Data)
    ├─→ JavaUserService (Axios → Java API)
    └─→ FirebaseUserService (Firebase SDK)
```

## 🔄 Migration Path

### Phase 1: Development (Current)
- Use MockUserService
- Test UI without backend

### Phase 2: Integration
- Switch to JavaUserService
- Connect to Java API
- Test with real data

### Phase 3: Production
- Deploy Java API
- Update .env for production
- Monitor and optimize

## 🐛 Troubleshooting

### Service not working?

```javascript
import { checkServiceHealth } from '@/services/UserService'

const health = await checkServiceHealth()
console.log(health)
// { mode: 'mock', isReady: true, message: 'Service is ready' }
```

### Wrong service mode?

```javascript
import { getCurrentServiceMode } from '@/services/UserService'

console.log('Current mode:', getCurrentServiceMode())
```

---

**Status:** ✅ Services layer hoàn thành và sẵn sàng sử dụng!
