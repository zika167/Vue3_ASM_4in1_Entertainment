# 📚 HƯỚNG DẪN DỰ ÁN 4IN1-VUE CHO TEAM

**Tài liệu này tổng hợp kiến thức về cấu trúc dự án và hướng dẫn kết nối API từ Backend**

## Tài khoản người dùng thường

**Username:** `mockuser`  
**Password:** `123456`  
**Role:** User  
**Quyền:** Xem video, thêm yêu thích, bình luận

---

## Tài khoản Admin

**Username:** `admin`  
**Password:** `admin123`  
**Role:** Admin  
**Quyền:** Quản lý user, video, báo cáo, toàn quyền hệ thống

---

## Lưu ý

- Đây là tài khoản mock để test UI
- Khi kết nối backend API, cần thay thế logic authentication
- Hiện tại chỉ check username/password trong file `AuthModal.vue`
- Sau khi đăng nhập, thông tin user được lưu trong `localStorage`

---

## 📁 CẤU TRÚC DỰ ÁN

```
4in1-vue/
├── src/
│   ├── components/           # Reusable components
│   │   ├── layout/           # Layout components (Navbar, Footer, AdminLayout)
│   │   ├── modals/           # Modal components (AuthModal, ShareVideoModal)
│   │   ├── ui/               # UI components (StatCard, DataTable, SearchBar, PageHeader)
│   │   └── video/            # Video-related components
│   │
│   ├── composables/          # ⭐ Reusable logic (Vue 3 Composition API)
│   │   ├── useCrudOperations.js   # CRUD operations logic
│   │   ├── useModal.js            # Modal management
│   │   └── index.js               # Export barrel
│   │
│   ├── services/             # ⭐ API Services (QUAN TRỌNG!)
│   │   ├── UserService.js         # Service Factory (chọn implementation)
│   │   ├── MockUserService.js     # Mock data cho development
│   │   ├── JavaUserService.js     # Kết nối Java API
│   │   ├── FirebaseUserService.js # Kết nối Firebase
│   │   └── MockVideoService.js    # Mock video data
│   │
│   ├── utils/                # Utility functions
│   │   ├── api.js                 # HTTP client utilities
│   │   ├── validation.js          # Form validation
│   │   └── helpers.js             # Helper functions
│   │
│   ├── views/                # Page components
│   │   ├── HomePage.vue
│   │   ├── FavoritesPage.vue
│   │   ├── VideoDetailPage.vue
│   │   ├── AccountPage.vue
│   │   └── admin/            # Admin pages
│   │       ├── AdminDashboard.vue
│   │       ├── UserManagement.vue
│   │       ├── VideoManagement.vue
│   │       └── ReportsManagement.vue
│   │
│   ├── router/               # Vue Router configuration
│   │   └── index.js               # Routes + Navigation Guards
│   │
│   └── main.js               # App entry point
│
├── .env                      # ⭐ Environment configuration
└── package.json
```

---

## 🔧 CÁCH CHUYỂN TỪ MOCK DATA SANG JAVA API

### Bước 1: Cấu hình Environment (.env)

```env
# Đổi từ mock sang java
VITE_SERVICE_MODE=java

# URL của Java API Backend
VITE_JAVA_API_URL=http://localhost:8080/api
```

**Các mode có sẵn:**
- `mock` - Dùng dữ liệu giả (mặc định, cho development)
- `java` - Kết nối Java Spring Boot API
- `firebase` - Kết nối Firebase

### Bước 2: Restart Dev Server

```bash
# Sau khi đổi .env, cần restart
npm run dev
```

**Kiểm tra console:** Sẽ thấy log:
```
🔧 UserService: Using Java API Backend
```

---

## 📡 SERVICE ARCHITECTURE

### Service Factory Pattern

```
UserService.js (Factory)
    │
    ├── VITE_SERVICE_MODE=mock  → MockUserService.js
    ├── VITE_SERVICE_MODE=java  → JavaUserService.js
    └── VITE_SERVICE_MODE=firebase → FirebaseUserService.js
```

**Lợi ích:**
- ✅ Không cần sửa code khi đổi backend
- ✅ Dễ test với mock data
- ✅ Có thể switch giữa các backends

### Cách hoạt động

```javascript
// src/services/UserService.js
import MockUserService from './MockUserService'
import JavaUserService from './JavaUserService'
import FirebaseUserService from './FirebaseUserService'

const SERVICE_MODE = import.meta.env.VITE_SERVICE_MODE || 'mock'

function getServiceImplementation() {
  switch (SERVICE_MODE.toLowerCase()) {
    case 'java':
      return JavaUserService
    case 'firebase':
      return FirebaseUserService
    case 'mock':
    default:
      return MockUserService
  }
}

export default getServiceImplementation()
```

---

## 📋 API INTERFACE (Contract)

### Tất cả Service implementations phải có các methods sau:

```javascript
// User Service Interface
{
  getAllUsers()           // GET /api/users
  getUserById(id)         // GET /api/users/:id
  createUser(data)        // POST /api/users
  updateUser(id, data)    // PUT /api/users/:id
  deleteUser(id)          // DELETE /api/users/:id
  toggleUserStatus(id)    // PATCH /api/users/:id/toggle-status
  searchUsers(keyword)    // GET /api/users/search?q=keyword
  getUsersByRole(role)    // GET /api/users/by-role?role=admin
  getStatistics()         // GET /api/users/statistics
}
```

### Response Format (Chuẩn)

```javascript
// Success Response
{
  success: true,
  data: { ... } | [ ... ],
  message: 'Operation successful',
  total: 10  // optional, for lists
}

// Error Response
{
  success: false,
  error: 'Error message here'
}
```

---

## 🔌 JAVA API ENDPOINTS CẦN IMPLEMENT

### User API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/users` | Lấy tất cả users | - | `{ data: User[], total: number }` |
| GET | `/api/users/:id` | Lấy user theo ID | - | `{ data: User }` |
| POST | `/api/users` | Tạo user mới | `User` | `{ data: User, message: string }` |
| PUT | `/api/users/:id` | Cập nhật user | `User` | `{ data: User, message: string }` |
| DELETE | `/api/users/:id` | Xóa user | - | `{ message: string }` |
| PATCH | `/api/users/:id/toggle-status` | Toggle active status | - | `{ data: User, message: string }` |
| GET | `/api/users/search?q=keyword` | Tìm kiếm users | - | `{ data: User[], total: number }` |
| GET | `/api/users/by-role?role=admin` | Lọc theo role | - | `{ data: User[], total: number }` |
| GET | `/api/users/statistics` | Thống kê users | - | `{ data: Statistics }` |


### User Model

```java
// Java Entity
@Entity
public class User {
    private Long id;
    private String username;
    private String fullname;
    private String email;
    private String role;        // "admin" | "user"
    private String avatar;      // URL
    private Boolean isActive;
    private LocalDate createdAt;
    private LocalDateTime lastLogin;
}
```

### Statistics Response

```java
// Statistics DTO
public class UserStatistics {
    private int totalUsers;
    private int activeUsers;
    private int inactiveUsers;
    private int adminUsers;
    private int regularUsers;
}
```

---

## 🎯 CÁCH SỬ DỤNG TRONG COMPONENTS

### Sử dụng useCrudOperations Composable

```vue
<script setup>
import { useCrudOperations } from '@/composables/useCrudOperations'
import UserService from '@/services/UserService'

// Khởi tạo CRUD operations
const {
  items,           // ref<User[]> - danh sách users
  loading,         // ref<boolean> - trạng thái loading
  submitting,      // ref<boolean> - trạng thái submit form
  searchKeyword,   // ref<string> - từ khóa tìm kiếm
  statistics,      // reactive<Statistics> - thống kê
  
  loadItems,       // () => Promise - load danh sách
  loadStatistics,  // () => Promise - load thống kê
  searchItems,     // (keyword) => Promise - tìm kiếm
  createItem,      // (data) => Promise - tạo mới
  updateItem,      // (id, data) => Promise - cập nhật
  deleteItem,      // (id, confirmMsg?) => Promise - xóa
  resetSearch      // () => void - reset tìm kiếm
} = useCrudOperations(UserService, {
  loadMethod: 'getAllUsers',
  createMethod: 'createUser',
  updateMethod: 'updateUser',
  deleteMethod: 'deleteUser',
  searchMethod: 'searchUsers',
  statisticsMethod: 'getStatistics',
  itemName: 'người dùng',
  itemNamePlural: 'người dùng'
})

// Load data khi component mount
loadItems()
loadStatistics()
</script>
```

### Sử dụng useModal Composable

```vue
<script setup>
import { useModal } from '@/composables/useModal'

const {
  modalRef,        // ref - reference đến modal element
  isEditMode,      // ref<boolean> - đang ở chế độ edit?
  currentItemId,   // ref<number|null> - ID item đang edit
  formData,        // ref<Object> - dữ liệu form
  
  openCreateModal, // () => void - mở modal tạo mới
  openEditModal,   // (item) => void - mở modal edit
  hideModal,       // () => void - đóng modal
  resetForm        // () => void - reset form
} = useModal({
  // Initial form data
  username: '',
  fullname: '',
  email: '',
  role: 'user',
  avatar: 'https://via.placeholder.com/150'
})
</script>

<template>
  <!-- Modal element -->
  <div class="modal fade" ref="modalRef">
    <!-- Modal content -->
  </div>
</template>
```

---

## 🧩 REUSABLE UI COMPONENTS

### 1. StatCard - Thẻ thống kê

```vue
<StatCard
  label="Tổng người dùng"
  :value="statistics.totalUsers"
  icon="bi-people"
  color="primary"
  col-class="col-lg-3"
  :format-number="true"
  :centered="false"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | String | required | Nhãn hiển thị |
| value | Number/String | required | Giá trị |
| icon | String | required | Bootstrap icon class |
| color | String | 'primary' | Bootstrap color |
| colClass | String | 'col-lg-3' | Column class |
| formatNumber | Boolean | false | Format số với dấu phẩy |
| centered | Boolean | false | Layout centered |

### 2. DataTable - Bảng dữ liệu

```vue
<DataTable
  :data="items"
  :columns="tableColumns"
  :loading="loading"
  loading-text="Đang tải..."
  empty-text="Không có dữ liệu"
  empty-icon="bi-inbox"
>
  <!-- Custom cell rendering -->
  <template #cell-avatar="{ value, item }">
    <img :src="value" :alt="item.username" class="rounded-circle" width="40" />
  </template>
  
  <template #cell-role="{ value }">
    <span class="badge" :class="value === 'admin' ? 'bg-danger' : 'bg-primary'">
      {{ value === 'admin' ? 'Admin' : 'User' }}
    </span>
  </template>
  
  <template #cell-actions="{ item }">
    <button @click="editItem(item)">Edit</button>
    <button @click="deleteItem(item.id)">Delete</button>
  </template>
</DataTable>
```

**Column Configuration:**
```javascript
const tableColumns = [
  { key: 'id', label: 'ID' },
  { 
    key: 'avatar', 
    label: 'Avatar',
    headerClass: 'd-none d-md-table-cell',  // Ẩn trên mobile
    cellClass: 'd-none d-md-table-cell'
  },
  { key: 'username', label: 'Tên đăng nhập' },
  { key: 'actions', label: 'Thao tác' }
]
```

### 3. SearchBar - Thanh tìm kiếm

```vue
<SearchBar
  v-model="searchKeyword"
  placeholder="Tìm kiếm..."
  reset-text="Đặt lại"
  @search="handleSearch"
  @reset="resetFilters"
>
  <!-- Optional: Custom filters -->
  <template #filters>
    <div class="col-6 col-md-3">
      <select v-model="filterRole" @change="handleFilter">
        <option value="">Tất cả vai trò</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
    </div>
  </template>
</SearchBar>
```

### 4. PageHeader - Header trang

```vue
<PageHeader
  title="Quản lý người dùng"
  description="Quản lý tài khoản người dùng trong hệ thống"
  icon="bi-people-fill"
>
  <template #actions>
    <button class="btn btn-primary" @click="openCreateModal">
      <i class="bi bi-plus-circle me-2"></i>Thêm mới
    </button>
  </template>
</PageHeader>
```

---

## 🛣️ ROUTER & NAVIGATION

### Route Configuration

```javascript
// src/router/index.js
{
  path: '/admin/users',
  name: 'UserManagement',
  component: () => import('../views/admin/UserManagement.vue'),
  meta: { 
    requiresAuth: true,      // Yêu cầu đăng nhập
    requiresAdmin: true,     // Yêu cầu quyền admin
    showInAdminNav: true,    // Hiện trong admin navbar
    label: 'USERS',          // Label hiển thị
    icon: 'bi-people'        // Icon
  }
}
```

### Navigation Guard

```javascript
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  // Check authentication
  if (to.meta.requiresAuth && !user.username) {
    window.Toast?.warning('Vui lòng đăng nhập')
    return next({ name: 'Home' })
  }
  
  // Check admin permission
  if (to.meta.requiresAdmin && user.role !== 'admin') {
    window.Toast?.error('Không có quyền truy cập')
    return next({ name: 'Home' })
  }
  
  next()
})
```

---

## 🔐 AUTHENTICATION

### Login Flow

```javascript
// 1. User đăng nhập thành công
const user = {
  id: 1,
  username: 'admin',
  fullname: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',  // 'admin' hoặc 'user'
  avatar: 'https://...'
}

// 2. Lưu vào localStorage
localStorage.setItem('user', JSON.stringify(user))

// 3. Dispatch event để navbar update
window.dispatchEvent(new Event('auth-changed'))
```

### Logout Flow

```javascript
// 1. Xóa user khỏi localStorage
localStorage.removeItem('user')

// 2. Redirect về home
router.push('/')

// 3. Show toast
window.Toast?.success('Đã đăng xuất')
```

### Check Auth Status

```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}')
const isLoggedIn = !!user.username
const isAdmin = user.role === 'admin'
```

---

## 🎨 TOAST NOTIFICATIONS

```javascript
// Success
window.Toast?.success('Thao tác thành công!')

// Error
window.Toast?.error('Có lỗi xảy ra!')

// Warning
window.Toast?.warning('Cảnh báo!')

// Info
window.Toast?.info('Thông tin!')
```

---

## 📝 CHECKLIST KHI KẾT NỐI API

### Backend Team cần làm:

- [ ] Implement REST API endpoints theo bảng trên
- [ ] Response format theo chuẩn `{ success, data, message, error }`
- [ ] CORS configuration cho frontend URL
- [ ] JWT Authentication (optional)
- [ ] Error handling với message rõ ràng

### Frontend Team cần làm:

- [ ] Đổi `VITE_SERVICE_MODE=java` trong `.env`
- [ ] Cập nhật `VITE_JAVA_API_URL` đúng URL backend
- [ ] Test từng API endpoint
- [ ] Handle các error cases
- [ ] Update JavaUserService nếu API khác format

---

## 🐛 TROUBLESHOOTING

### CORS Error

```
Access to XMLHttpRequest at 'http://localhost:8080/api/users' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Giải pháp (Backend):**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
            .allowedHeaders("*");
    }
}
```

### Network Error

```
Error: Network Error / No response from server
```

**Kiểm tra:**
1. Backend đang chạy?
2. URL đúng chưa?
3. Port đúng chưa?

### 401 Unauthorized

**Kiểm tra:**
1. Token có được gửi trong header?
2. Token còn hạn?
3. User có quyền truy cập?

---

## 🚀 QUICK START

```bash
# 1. Clone và install
cd 4in1-vue
npm install

# 2. Chạy với mock data (development)
npm run dev

# 3. Khi backend ready, đổi .env
VITE_SERVICE_MODE=java
VITE_JAVA_API_URL=http://localhost:8080/api

# 4. Restart dev server
npm run dev

# 5. Build production
npm run build
```

---

## 📞 LIÊN HỆ

Nếu có thắc mắc về:
- **Frontend Architecture:** [Tên FE Lead]
- **Backend API:** [Tên BE Lead]
- **DevOps/Deployment:** [Tên DevOps]

---

**Cập nhật lần cuối:** 01/12/2025  
**Version:** 1.0.0
