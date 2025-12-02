# 📋 PHÂN CÔNG CÔNG VIỆC CHO TEAM 5 NGƯỜI

## 🎯 Tổng Quan Dự Án

Dự án **4IN1 Entertainment** là một nền tảng chia sẻ video với 5 modules chính:
- **User Management** (Quản lý người dùng)
- **Video Management** (Quản lý video)
- **Share Management** (Quản lý chia sẻ)
- **Comment Management** (Quản lý bình luận)
- **Favorite Management** (Quản lý yêu thích)

---

## 📊 TRẠNG THÁI HIỆN TẠI

| Module | Service | Factory | Admin Page | Components | Status |
|--------|---------|---------|------------|------------|--------|
| **User** | ✅ Done | ✅ Done | ✅ Done | ✅ Done | **HOÀN THÀNH** |
| **Video** | ✅ Done | ✅ Done | ✅ Done | ✅ Done | **HOÀN THÀNH** |
| **Share** | ❌ Cần tạo | ❌ Cần tạo | ⚠️ Template | ✅ Done | **DEV 3** |
| **Comment** | ❌ Cần tạo | ❌ Cần tạo | ⚠️ Template | ✅ Done | **DEV 4** |
| **Favorite** | ❌ Cần tạo | ❌ Cần tạo | ⚠️ Template | ✅ Done | **DEV 5** |

---

## ✅ CÁCH IMPORT ĐÚNG

```javascript
// Import từ folder factories
import UserService from '@/services/factories/UserService'
import VideoService from '@/services/factories/VideoService'

// Sử dụng
const users = await UserService.getAllUsers()
const videos = await VideoService.getAllVideos()
```

## ❌ CÁCH IMPORT SAI

```javascript
// KHÔNG import trực tiếp từ Java*Service
import JavaUserService from '@/services/JavaUserService'  // ❌ SAI
```

---

## 📋 Methods có sẵn (từ BaseJavaService)

| Method | Mô tả |
|--------|-------|
| `getAll()` | Lấy tất cả |
| `getById(id)` | Lấy theo ID |
| `create(data)` | Tạo mới |
| `update(id, data)` | Cập nhật |
| `delete(id)` | Xóa |
| `search(params)` | Tìm kiếm |

---

## 👥 PHÂN CÔNG CHI TIẾT

### 🔵 DEV 1: USER MODULE ✅

#### 📁 Files quản lý:

**Services:**
- `src/services/JavaUserService.js` ✅
- `src/services/factories/UserService.js` ✅

**Pages:**
- `src/pages/AccountPage.vue` ✅
- `src/pages/admin/UserManagement.vue` ✅

**Components:**
- `src/components/modals/AuthModal.vue` ✅
- `src/components/modals/ForgotPasswordModal.vue` ✅

**Utils:**
- `src/utils/validation.js` (phần User validation) ✅

**Composables:**
- `src/composables/useCrudOperations.js` (shared - không sở hữu riêng)

#### 🎯 Tasks cần làm:

| # | Task | File | Priority |
|---|------|------|----------|
| 1 | Validate form login/register | `AuthModal.vue` | 🔴 Cao |
| 2 | Chỉnh sửa thông tin user | `AccountPage.vue` | 🔴 Cao |
| 3 | Form đổi mật khẩu | `AccountPage.vue` | 🟡 TB |
| 4 | Thống kê user trên Dashboard | `AdminDashboard.vue` | 🟡 TB |

---

### 🟢 DEV 2: VIDEO MODULE ✅

#### 📁 Files quản lý:

**Services:**
- `src/services/JavaVideoService.js` ✅
- `src/services/factories/VideoService.js` ✅

**Pages:**
- `src/pages/HomePage.vue` ✅
- `src/pages/VideoDetailPage.vue` ✅
- `src/pages/admin/VideoManagement.vue` ✅

**Components:**
- `src/components/video/VideoCard.vue` ✅

**Utils:**
- `src/utils/validation.js` (phần Video validation - cần thêm)

#### 🎯 Tasks cần làm:

| # | Task | File | Priority |
|---|------|------|----------|
| 1 | Tích hợp video player | `VideoDetailPage.vue` | 🔴 Cao |
| 2 | Form upload video (Admin) | `VideoManagement.vue` | 🔴 Cao |
| 3 | Tìm kiếm video | `HomePage.vue` | 🟡 TB |
| 4 | Lọc video theo category | `HomePage.vue` | 🟡 TB |
| 5 | Phân trang danh sách | `HomePage.vue` | 🟡 TB |
| 6 | Cải thiện related videos | `VideoDetailPage.vue` | 🟢 Thấp |
| 7 | Thêm video validation | `utils/validation.js` | 🟡 TB |

---

### 🟡 DEV 3: SHARE MODULE ❌

#### 📁 Files quản lý:

**Services (CẦN TẠO):**
- `src/services/JavaShareService.js` ❌
- `src/services/factories/ShareService.js` ❌

**Pages:**
- `src/pages/admin/ShareManagement.vue` ⚠️ (cần bỏ TODO)

**Components:**
- `src/components/share/ShareButton.vue` ✅
- `src/components/modals/ShareVideoModal.vue` ✅

**Composables:**
- `src/composables/useShare.js` ⚠️ (cần bỏ TODO)

**Utils:**
- `src/utils/validation.js` (phần Share validation - cần thêm)

#### 🎯 Tasks cần làm:

| # | Task | Mô tả |
|---|------|-------|
| 1 | Tạo `JavaShareService.js` | Tham khảo `JavaUserService.js` |
| 2 | Tạo `factories/ShareService.js` | Tham khảo `factories/UserService.js` |
| 3 | Cập nhật `useShare.js` | Import ShareService, bỏ TODO |
| 4 | Cập nhật `ShareManagement.vue` | Kết nối service, bỏ TODO |
| 5 | Thêm share validation | `utils/validation.js` |
| 6 | Test với backend | Kiểm tra CRUD hoạt động |

**API Endpoints:**
```
GET    /api/shares           - Lấy tất cả
POST   /api/shares           - Tạo mới
DELETE /api/shares/:id       - Xóa
GET    /api/shares/video/:id - Theo video
GET    /api/shares/user/:id  - Theo user
```

---

### 🟣 DEV 4: COMMENT MODULE ❌

#### 📁 Files quản lý:

**Services (CẦN TẠO):**
- `src/services/JavaCommentService.js` ❌
- `src/services/factories/CommentService.js` ❌

**Pages:**
- `src/pages/admin/CommentManagement.vue` ⚠️ (cần bỏ TODO)

**Components:**
- `src/components/comment/CommentSection.vue` ⚠️ (cần bỏ TODO)
- `src/components/comment/CommentForm.vue` ✅
- `src/components/comment/CommentItem.vue` ✅

**Composables:**
- `src/composables/useComment.js` ⚠️ (cần bỏ TODO)

**Utils:**
- `src/utils/validation.js` (phần Comment validation - cần thêm)

#### 🎯 Tasks cần làm:

| # | Task | Mô tả |
|---|------|-------|
| 1 | Tạo `JavaCommentService.js` | Tham khảo `JavaUserService.js` |
| 2 | Tạo `factories/CommentService.js` | Tham khảo `factories/UserService.js` |
| 3 | Cập nhật `useComment.js` | Import CommentService, bỏ TODO |
| 4 | Cập nhật `CommentSection.vue` | Kết nối service, bỏ TODO |
| 5 | Cập nhật `CommentManagement.vue` | Kết nối service, bỏ TODO |
| 6 | Thêm comment validation | `utils/validation.js` |
| 7 | Test với backend | Kiểm tra CRUD hoạt động |

**API Endpoints:**
```
GET    /api/comments           - Lấy tất cả
GET    /api/comments/:id       - Theo ID
POST   /api/comments           - Tạo mới
PUT    /api/comments/:id       - Cập nhật
DELETE /api/comments/:id       - Xóa
GET    /api/comments/video/:id - Theo video
```

---

### 🔴 DEV 5: FAVORITE MODULE ❌

#### 📁 Files quản lý:

**Services (CẦN TẠO):**
- `src/services/JavaFavoriteService.js` ❌
- `src/services/factories/FavoriteService.js` ❌

**Pages:**
- `src/pages/FavoritesPage.vue` ⚠️ (cần bỏ TODO)
- `src/pages/VideoDetailPage.vue` ⚠️ (phần toggleFavorite)
- `src/pages/admin/FavoriteManagement.vue` ⚠️ (cần bỏ TODO)

**Components:**
- `src/components/favorite/FavoriteButton.vue` ⚠️ (cần bỏ TODO)

**Composables:**
- `src/composables/useFavorite.js` ⚠️ (cần bỏ TODO)

**Utils:**
- `src/utils/validation.js` (phần Favorite validation - nếu cần)

#### 🎯 Tasks cần làm:

| # | Task | Mô tả |
|---|------|-------|
| 1 | Tạo `JavaFavoriteService.js` | Tham khảo `JavaUserService.js` |
| 2 | Tạo `factories/FavoriteService.js` | Tham khảo `factories/UserService.js` |
| 3 | Cập nhật `useFavorite.js` | Import FavoriteService, bỏ TODO |
| 4 | Cập nhật `FavoriteButton.vue` | Kết nối service, bỏ TODO |
| 5 | Cập nhật `FavoritesPage.vue` | Kết nối service, bỏ TODO |
| 6 | Cập nhật `VideoDetailPage.vue` | Phần toggleFavorite, bỏ TODO |
| 7 | Cập nhật `FavoriteManagement.vue` | Kết nối service, bỏ TODO |
| 8 | Test với backend | Kiểm tra CRUD hoạt động |

**API Endpoints:**
```
GET    /api/favorites           - Lấy tất cả
POST   /api/favorites           - Thêm
DELETE /api/favorites/:id       - Xóa
GET    /api/favorites/user/:id  - Theo user
POST   /api/favorites/toggle    - Toggle
```

---

## 🔄 SHARED FILES (TẤT CẢ DEVS SỬ DỤNG - KHÔNG SỞ HỮU RIÊNG)

### UI Components:
- `src/components/ui/DataTable.vue`
- `src/components/ui/LoadingOverlay.vue`
- `src/components/ui/PageHeader.vue`
- `src/components/ui/SearchBar.vue`
- `src/components/ui/StatCard.vue`
- `src/components/ui/ToastContainer.vue`

### Layout:
- `src/components/layout/TheFooter.vue`
- `src/components/layout/AdminLayout.vue`
- `src/components/layout/TheNavbar.vue`
- `src/components/layout/AdminNavbar.vue`

### Composables:
- `src/composables/useCrudOperations.js`
- `src/composables/useModal.js`

### Base Services:
- `src/services/apiClient.js`
- `src/services/BaseJavaService.js`
- `src/services/createServiceFactory.js`

### Utils:
- `src/utils/helpers.js` (debounce, formatDate, copyToClipboard, etc.)
- `src/utils/validation.js` (shared - mỗi dev thêm validation cho module của mình)

### Router:
- `src/router/index.js` (shared - cẩn thận khi sửa)

---

## 📝 QUY TẮC LÀM VIỆC VỚI SHARED FILES

### ⚠️ Validation.js - Cách tổ chức:

```javascript
// src/utils/validation.js
const Validation = {
  // ========== COMMON (Tất cả dùng) ==========
  isRequired(value, fieldName) { ... },
  sanitizeHTML(str) { ... },
  
  // ========== USER (DEV 1) ==========
  isValidEmail(email) { ... },
  isValidPassword(password) { ... },
  isValidUsername(username) { ... },
  
  // ========== VIDEO (DEV 2) ==========
  isValidVideoTitle(title) { ... },
  isValidVideoUrl(url) { ... },
  
  // ========== SHARE (DEV 3) ==========
  isValidEmailList(emails) { ... },
  
  // ========== COMMENT (DEV 4) ==========
  isValidComment(content) { ... },
  
  // ========== FAVORITE (DEV 5) ==========
  // Không cần validation đặc biệt
}
```

**Quy tắc:**
- Mỗi dev chỉ thêm methods vào section của mình
- Không sửa methods của dev khác
- Thông báo team trước khi sửa COMMON section

---

## 🚀 HƯỚNG DẪN TẠO SERVICE

### Bước 1: Tạo JavaXxxService.js
```javascript
import BaseJavaService from './BaseJavaService'

class JavaShareService extends BaseJavaService {
  constructor() {
    super('/shares')
  }

  async getAllShares() {
    return this.handleRequest(
      () => this.api.get(this.baseEndpoint),
      'Lấy danh sách'
    )
  }

  async createShare(data) {
    return this.handleRequest(
      () => this.api.post(this.baseEndpoint, data),
      'Tạo mới'
    )
  }

  async deleteShare(id) {
    return this.handleRequest(
      () => this.api.delete(`${this.baseEndpoint}/${id}`),
      'Xóa'
    )
  }
}

export default new JavaShareService()
```

### Bước 2: Tạo Factory
```javascript
import { createServiceFactory, getCurrentServiceMode } from '../createServiceFactory'
import JavaShareService from '../JavaShareService'

const ShareService = createServiceFactory('Share', {
  java: JavaShareService,
  mock: JavaShareService,
  firebase: null
})

export default ShareService
export { getCurrentServiceMode }
```

### Bước 3: Import và sử dụng
```javascript
import ShareService from '@/services/factories/ShareService'
const result = await ShareService.getAllShares()
```

---

## 🔍 TÌM TODO TRONG CODE

Search trong VS Code:
- `[DEV 3]` → Share
- `[DEV 4]` → Comment
- `[DEV 5]` → Favorite

---

## 📚 TÀI LIỆU THAM KHẢO

- `documents/4_BACKEND_API_SPEC.md` - API specification
- `documents/3_API_QUICK_REFERENCE.md` - API quick reference
- `documents/5_SERVICE_ARCHITECTURE.md` - Cấu trúc services
- `src/services/README.md` - Hướng dẫn services
- `src/services/JavaUserService.js` - Mẫu service
- `src/services/JavaVideoService.js` - Mẫu service

---

**Chúc team làm việc hiệu quả! 🚀**
