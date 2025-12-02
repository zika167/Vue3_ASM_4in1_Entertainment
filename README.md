# 🎬 4IN1 Entertainment - Video Sharing Platform

**Nền tảng chia sẻ video được xây dựng với Vue 3 + Spring Boot**

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?logo=bootstrap)](https://getbootstrap.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=spring)](https://spring.io/projects/spring-boot)
[![MariaDB](https://img.shields.io/badge/MariaDB-10.x-003545?logo=mariadb)](https://mariadb.org/)

---

## 🎯 TỔNG QUAN

4IN1 Entertainment là nền tảng chia sẻ video cho phép người dùng:
- 📺 Xem và tìm kiếm video
- ❤️ Yêu thích video
- 📤 Chia sẻ video qua email
- 💬 Bình luận và thảo luận
- 👤 Quản lý tài khoản cá nhân
- 🔐 Phân quyền Admin/User

---

## 🚀 CÀI ĐẶT NHANH

```bash
# 1. Clone repository
git clone <repository-url>
cd 4in1-vue

# 2. Cài đặt dependencies
npm install

# 3. Chạy development server
npm run dev
```

Ứng dụng chạy tại: `http://localhost:5173`

### Cấu hình Environment (.env)

```env
# Service Mode: 'mock' hoặc 'java'
VITE_SERVICE_MODE=java

# API Base URL (khi dùng Java backend)
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📁 CẤU TRÚC DỰ ÁN

```
4in1-vue/
├── documents/                    # 📚 Documentation
│   ├── 1_APPLICATION_FLOW_DIAGRAM.md
│   ├── 2_TEAM_WORK_DISTRIBUTION.md
│   ├── 3_API_QUICK_REFERENCE.md
│   ├── 4_BACKEND_API_SPEC.md
│   ├── COMPOSABLES_EXPLANATION.md
│   ├── TEAM_MODULE_DIAGRAM.md
│   └── database.sql
│
├── src/
│   ├── components/              # Vue components
│   │   ├── layout/              # TheNavbar, TheFooter, AdminLayout
│   │   ├── modals/              # AuthModal, ShareVideoModal
│   │   ├── ui/                  # DataTable, StatCard, SearchBar
│   │   └── video/               # VideoCard
│   │
│   ├── composables/             # Composition functions
│   │   ├── useCrudOperations.js
│   │   └── useModal.js
│   │
│   ├── pages/                   # Page components
│   │   ├── HomePage.vue
│   │   ├── FavoritesPage.vue
│   │   ├── VideoDetailPage.vue
│   │   ├── AccountPage.vue
│   │   └── admin/               # Admin pages
│   │
│   ├── services/                # Service Layer (Factory Pattern)
│   │   ├── UserService.js       # Factory
│   │   ├── MockUserService.js
│   │   ├── JavaUserService.js
│   │   ├── VideoService.js
│   │   └── ...
│   │
│   └── utils/                   # Utilities
│
├── .env
├── package.json
└── vite.config.js
```

---

## 🗄️ DATABASE SCHEMA

**Database:** MariaDB (java4_db_asm)

```
User     (Id, Password, Email, Fullname, Admin, CreatedDate, UpdatedDate)
Video    (Id, Title, Poster, Views, Description, Active, UserId, CreatedDate, UpdatedDate)
Favorite (Id, UserId, VideoId, LikeDate)
Share    (Id, UserId, VideoId, Emails, ShareDate)
Comment  (Id, UserId, VideoId, Content, CreatedDate, UpdatedDate) ✨ NEW
```

📄 Chi tiết: `documents/database.sql`

---

## 📡 API ENDPOINTS

### 👤 User API - `/api/users`
```
GET/POST/PUT/DELETE /api/users
GET /api/users/search?q=keyword
GET /api/users/statistics
```

### 🎬 Video API - `/api/videos`
```
GET/POST/PUT/DELETE /api/videos
GET /api/videos/search?q=keyword
GET /api/videos/user/:userId
GET /api/videos/statistics
```

### ❤️ Favorite API - `/api/favorites` (Auth Required)
```
GET/POST/DELETE /api/favorites
GET /api/favorites/check/:videoId
```

### 📤 Share API - `/api/shares` (Auth Required)
```
GET/POST/DELETE /api/shares
GET /api/shares/video/:videoId
```

### 💬 Comment API - `/api/comments` ✨ NEW
```
GET /api/comments/video/:videoId
POST/PUT/DELETE /api/comments (Auth Required)
GET /api/comments/user/:userId
```

### 🔑 Auth API - `/api/auth`
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
PUT /api/auth/change-password
```

📖 Chi tiết: `documents/4_BACKEND_API_SPEC.md`

---

## 👥 TEAM STRUCTURE (5 Developers)

| Dev | Module | Trách nhiệm |
|-----|--------|-------------|
| **1** | User | Authentication, Profile, User Management |
| **2** | Video | Video CRUD, Listing, Detail |
| **3** | Share | Share functionality, Tracking |
| **4** | Comment | Comment system, Moderation |
| **5** | Favorite | Favorite management, Listing |

📊 Chi tiết: `documents/2_TEAM_WORK_DISTRIBUTION.md`

---

## 📚 DOCUMENTATION

| # | Document | Mô tả |
|---|----------|-------|
| 1 | `1_APPLICATION_FLOW_DIAGRAM.md` | Luồng hoạt động app |
| 2 | `2_TEAM_WORK_DISTRIBUTION.md` | Phân công team chi tiết |
| 3 | `3_API_QUICK_REFERENCE.md` | API reference nhanh |
| 4 | `4_BACKEND_API_SPEC.md` | API specification đầy đủ |
| 5 | `COMPOSABLES_EXPLANATION.md` | Giải thích Composables |
| 6 | `AXIOS_GUIDE.md` | Hướng dẫn sử dụng Axios |
| 7 | `TEAM_MODULE_DIAGRAM.md` | Sơ đồ modules |
| 8 | `database.sql` | Database schema |

---

## 🏗️ ARCHITECTURE

### Service Factory Pattern

```javascript
// Tự động switch giữa Mock và Java API
const SERVICE_MODE = import.meta.env.VITE_SERVICE_MODE || 'mock'

// Sử dụng
import UserService from '@/services/UserService'
const result = await UserService.getAllUsers()
```

### Composables Pattern

```javascript
// Tái sử dụng CRUD logic
import { useCrudOperations } from '@/composables'

const { items, loading, loadItems, createItem } = 
  useCrudOperations(UserService, { itemName: 'user' })
```

📖 Chi tiết: `documents/COMPOSABLES_EXPLANATION.md`

### Axios HTTP Client

```javascript
import apiClient from '@/services/api'

// GET
const response = await apiClient.get('/users')

// POST
const result = await apiClient.post('/users', { fullname: 'John' })

// PUT
await apiClient.put('/users/user001', { fullname: 'Updated' })

// DELETE
await apiClient.delete('/users/user001')
```

📖 Chi tiết: `documents/AXIOS_GUIDE.md`

---

## 🚦 ROUTES

| Route | Page | Auth |
|-------|------|------|
| `/` | HomePage | ❌ |
| `/video/:id` | VideoDetailPage | ❌ |
| `/favorites` | FavoritesPage | ✅ |
| `/account` | AccountPage | ✅ |
| `/admin` | AdminDashboard | 🔐 Admin |
| `/admin/users` | UserManagement | 🔐 Admin |
| `/admin/videos` | VideoManagement | 🔐 Admin |
| `/admin/reports` | ReportsManagement | 🔐 Admin |

---

## 💡 QUICK USAGE

### Toast Notifications
```javascript
window.Toast.success('Thành công!')
window.Toast.error('Có lỗi!')
```

### Loading Overlay
```javascript
window.Loading.show('Đang tải...')
window.Loading.hide()
```

### Auth Modal
```javascript
window.dispatchEvent(new CustomEvent('open-auth-modal', { 
  detail: { tab: 'login' } 
}))
```

---

## 🔧 SCRIPTS

```bash
npm run dev      # Development server
npm run build    # Build production
npm run preview  # Preview build
```

---

## 📄 LICENSE

© 2025 4IN1 Entertainment - Assignment Java 4. All rights reserved.

---

**🚀 Happy Coding!**
