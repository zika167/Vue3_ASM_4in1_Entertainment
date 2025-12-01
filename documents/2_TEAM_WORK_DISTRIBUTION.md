# 📋 PHÂN CÔNG CÔNG VIỆC CHO TEAM 5 NGƯỜI

## 🎯 Tổng Quan Dự Án

Dự án **4IN1 Entertainment** là một nền tảng chia sẻ video với 5 modules chính:
- **User Management** (Quản lý người dùng)
- **Video Management** (Quản lý video)
- **Share Management** (Quản lý chia sẻ)
- **Comment Management** (Quản lý bình luận - MỚI)
- **Favorite Management** (Quản lý yêu thích)

---

## 👥 PHÂN CÔNG CHI TIẾT

### 🔵 **Developer 1: USER MODULE**
**Trách nhiệm:** Quản lý toàn bộ chức năng liên quan đến người dùng

#### 📁 Files Vue cần làm việc:

**1. Pages (User-facing):**
- ✅ `src/pages/LoginPage.vue` - Trang đăng nhập/đăng ký
- ✅ `src/pages/AccountPage.vue` - Trang quản lý tài khoản cá nhân

**2. Admin Pages:**
- ✅ `src/pages/admin/UserManagement.vue` - Quản lý người dùng (CRUD)
- ✅ `src/pages/admin/AdminDashboard.vue` - Dashboard (phần user statistics)

**3. Components:**
- ✅ `src/components/modals/AuthModal.vue` - Modal đăng nhập/đăng ký
- ✅ `src/components/modals/ForgotPasswordModal.vue` - Modal quên mật khẩu
- ✅ `src/components/layout/TheNavbar.vue` - Navbar (phần user menu)
- ✅ `src/components/layout/AdminNavbar.vue` - Admin navbar (phần user info)

**4. Services:**
- ✅ `src/services/UserService.js` - Factory service
- ✅ `src/services/JavaUserService.js` - Java API implementation

**5. Composables:**
- ✅ `src/composables/useCrudOperations.js` - Shared CRUD logic (phần user)

**6. Utils:**
- ✅ `src/utils/validation.js` - Validation cho user (email, username, password) 
>>> Tạo 1 user-validation.js để quản lý riêng

#### 🎯 Nhiệm vụ chính:
- Authentication & Authorization
- User profile management
- User CRUD operations (Admin)
- Password reset/change
- User validation
- User statistics

---

### 🟢 **Developer 2: VIDEO MODULE**
**Trách nhiệm:** Quản lý toàn bộ chức năng liên quan đến video

#### 📁 Files Vue cần làm việc:

**1. Pages (User-facing):**
- ✅ `src/pages/HomePage.vue` - Trang chủ hiển thị danh sách video
- ✅ `src/pages/VideoDetailPage.vue` - Trang chi tiết video

**2. Admin Pages:**
- ✅ `src/pages/admin/VideoManagement.vue` - Quản lý video (CRUD)
- ✅ `src/pages/admin/AdminDashboard.vue` - Dashboard (phần video statistics)
<!-- - ✅ `src/pages/admin/ReportsManagement.vue` - Báo cáo video -->

**3. Components:**
- ✅ `src/components/video/VideoCard.vue` - Card hiển thị video
<!-- - ✅ `src/components/layout/TheNavbar.vue` - Navbar (phần search video) -->

**4. Services:**
- ✅ `src/services/VideoService.js` - Factory service
- ✅ `src/services/JavaVideoService.js` - Java API implementation

**5. Composables:**
- ✅ `src/composables/useCrudOperations.js` - Shared CRUD logic (phần video)

**6. Utils:**
- Thêm validation nếu cần

#### 🎯 Nhiệm vụ chính:
- Video CRUD operations
- Video listing & filtering
- Video detail display
- Video player integration
- Video statistics
- Video search

---

### 🟡 **Developer 3: SHARE MODULE**
**Trách nhiệm:** Quản lý chức năng chia sẻ video

#### 📁 Files Vue cần làm việc:

**1. Pages (User-facing):**
- ✅ `src/pages/VideoDetailPage.vue` - Nút chia sẻ video
- ✅ `src/pages/HomePage.vue` - Chia sẻ từ video card
<!-- - 🆕 `src/pages/SharedVideosPage.vue` - Trang danh sách video đã chia sẻ (CẦN TẠO) -->

**2. Admin Pages:**
- 🆕 `src/pages/admin/ShareManagement.vue` - Quản lý chia sẻ (CẦN TẠO)
<!-- - ✅ `src/pages/admin/ReportsManagement.vue` - Thống kê chia sẻ -->

**3. Components:**
- ✅ `src/components/modals/ShareVideoModal.vue` - Modal chia sẻ video
- ✅ `src/components/video/VideoCard.vue` - Nút chia sẻ trên card
- 🆕 `src/components/share/ShareButton.vue` - Component nút chia sẻ (CẦN TẠO)
<!-- - 🆕 `src/components/share/ShareList.vue` - Danh sách chia sẻ (CẦN TẠO) -->

**4. Services:**
- 🆕 `src/services/ShareService.js` - Factory service (CẦN TẠO)
- 🆕 `src/services/JavaShareService.js` - Java API implementation (CẦN TẠO)

**5. Composables:**
- 🆕 `src/composables/useShare.js` - Share logic (CẦN TẠO)

#### 🎯 Nhiệm vụ chính:
- Share video via email/social media
- Share history tracking
- Share statistics
- Share permissions
- Share notifications

---

### 🟣 **Developer 4: COMMENT MODULE** (MỚI)
**Trách nhiệm:** Xây dựng hệ thống bình luận cho video

#### 📁 Files Vue cần làm việc:

**1. Pages (User-facing):**
- ✅ `src/pages/VideoDetailPage.vue` - Section bình luận
<!-- - 🆕 `src/pages/MyCommentsPage.vue` - Trang quản lý bình luận của user (CẦN TẠO) -->

**2. Admin Pages:**
- 🆕 `src/pages/admin/CommentManagement.vue` - Quản lý bình luận (CẦN TẠO)
- ✅ `src/pages/admin/ReportsManagement.vue` - Báo cáo bình luận vi phạm

**3. Components:**
- 🆕 `src/components/comment/CommentSection.vue` - Section bình luận (CẦN TẠO)
- 🆕 `src/components/comment/CommentItem.vue` - Item bình luận (CẦN TẠO)
- 🆕 `src/components/comment/CommentForm.vue` - Form thêm bình luận (CẦN TẠO)
- 🆕 `src/components/comment/CommentReply.vue` - Reply bình luận (CẦN TẠO)

**4. Services:**
- 🆕 `src/services/CommentService.js` - Factory service (CẦN TẠO)
- 🆕 `src/services/JavaCommentService.js` - Java API implementation (CẦN TẠO)

**5. Composables:**
- 🆕 `src/composables/useComment.js` - Comment logic (CẦN TẠO)

**6. Utils:**
- 🆕 `src/utils/commentValidation.js` - Validation cho comment (CẦN TẠO)

#### 🎯 Nhiệm vụ chính:
- Comment CRUD operations
- Reply to comments
- Like/dislike comments
- Comment moderation
- Comment notifications
- Spam detection

---

### 🔴 **Developer 5: FAVORITE MODULE**
**Trách nhiệm:** Quản lý chức năng yêu thích video

#### 📁 Files Vue cần làm việc:

**1. Pages (User-facing):**
- ✅ `src/pages/FavoritesPage.vue` - Trang danh sách video yêu thích
- ✅ `src/pages/VideoDetailPage.vue` - Nút yêu thích
- ✅ `src/pages/HomePage.vue` - Nút yêu thích trên video card

**2. Admin Pages:**
- 🆕 `src/pages/admin/FavoriteManagement.vue` - Quản lý yêu thích (CẦN TẠO)
- ✅ `src/pages/admin/ReportsManagement.vue` - Thống kê yêu thích

**3. Components:**
- ✅ `src/components/video/VideoCard.vue` - Nút yêu thích trên card
- 🆕 `src/components/favorite/FavoriteButton.vue` - Component nút yêu thích (CẦN TẠO)
<!-- - 🆕 `src/components/favorite/FavoriteList.vue` - Danh sách yêu thích (CẦN TẠO) -->

**4. Services:**
- 🆕 `src/services/FavoriteService.js` - Factory service (CẦN TẠO)
- 🆕 `src/services/JavaFavoriteService.js` - Java API implementation (CẦN TẠO)

**5. Composables:**
- 🆕 `src/composables/useFavorite.js` - Favorite logic (CẦN TẠO)

#### 🎯 Nhiệm vụ chính:
- Add/remove favorites
- Favorite listing
- Favorite statistics
- Favorite sorting/filtering
- Favorite notifications

---

## 🔄 SHARED COMPONENTS (TẤT CẢ DEVELOPERS SỬ DỤNG)

### UI Components (Không ai sở hữu riêng):
- ✅ `src/components/ui/DataTable.vue`
- ✅ `src/components/ui/LoadingOverlay.vue`
- ✅ `src/components/ui/PageHeader.vue`
- ✅ `src/components/ui/SearchBar.vue`
- ✅ `src/components/ui/StatCard.vue`
- ✅ `src/components/ui/ToastContainer.vue`

### Layout Components:
- ✅ `src/components/layout/TheFooter.vue`
- ✅ `src/components/layout/AdminLayout.vue`

### Composables:
- ✅ `src/composables/useCrudOperations.js` - Shared CRUD logic
- ✅ `src/composables/useModal.js` - Modal management

---

## 📊 BẢNG TỔNG HỢP PHÂN CÔNG

| Developer | Module | Pages | Components | Services | Độ ưu tiên |
|-----------|--------|-------|------------|----------|------------|
| Dev 1 | User | 4 | 4 | 4 | ⭐⭐⭐⭐⭐ (Cao nhất) |
| Dev 2 | Video | 5 | 2 | 3 | ⭐⭐⭐⭐⭐ (Cao nhất) |
| Dev 3 | Share | 3 | 4 | 3 | ⭐⭐⭐ (Trung bình) |
| Dev 4 | Comment | 3 | 4 | 3 | ⭐⭐⭐⭐ (Cao) |
| Dev 5 | Favorite | 4 | 3 | 3 | ⭐⭐⭐ (Trung bình) |

---

## 🔗 DEPENDENCIES GIỮA CÁC MODULES

```
User Module (Dev 1)
    ↓
    ├─→ Video Module (Dev 2)
    ├─→ Share Module (Dev 3)
    ├─→ Comment Module (Dev 4)
    └─→ Favorite Module (Dev 5)

Video Module (Dev 2)
    ↓
    ├─→ Share Module (Dev 3)
    ├─→ Comment Module (Dev 4)
    └─→ Favorite Module (Dev 5)
```

**Giải thích:**
- **User Module** phải hoàn thành TRƯỚC vì tất cả modules khác cần authentication
- **Video Module** phải hoàn thành SAU User nhưng TRƯỚC các modules còn lại
- **Share, Comment, Favorite** có thể phát triển SONG SONG sau khi có User + Video

---

## 📅 TIMELINE ĐỀ XUẤT

### Phase 1: Foundation (Tuần 1-2)
- ✅ **Dev 1**: Hoàn thành User Module (Authentication, Profile)
- ✅ **Dev 2**: Hoàn thành Video Module (CRUD, Listing)
- 🔄 **Dev 3, 4, 5**: Thiết kế database schema cho modules của mình

### Phase 2: Core Features (Tuần 3-4)
- ✅ **Dev 1**: User Management (Admin)
- ✅ **Dev 2**: Video Management (Admin)
- 🚀 **Dev 3**: Share Module (User-facing)
- 🚀 **Dev 4**: Comment Module (User-facing)
- 🚀 **Dev 5**: Favorite Module (User-facing)

### Phase 3: Admin & Polish (Tuần 5-6)
- 🚀 **Dev 3**: Share Management (Admin)
- 🚀 **Dev 4**: Comment Management (Admin)
- 🚀 **Dev 5**: Favorite Management (Admin)
- 🔄 **Tất cả**: Testing & Bug fixes

### Phase 4: Integration & Testing (Tuần 7-8)
- 🔄 **Tất cả**: Integration testing
- 🔄 **Tất cả**: Performance optimization
- 🔄 **Tất cả**: Documentation

---

## 🛠️ QUY TẮC LÀM VIỆC

### 1. **Naming Convention**
```javascript
// Services
UserService.js, VideoService.js, ShareService.js, CommentService.js, FavoriteService.js

// Pages
UserManagement.vue, VideoManagement.vue, ShareManagement.vue, etc.

// Components
UserCard.vue, VideoCard.vue, ShareButton.vue, CommentItem.vue, etc.
```

### 2. **Service Pattern (Factory)**
Tất cả developers PHẢI tuân theo Factory pattern:

```javascript
// YourService.js
import JavaYourService from './JavaYourService'

const SERVICE_MODE = import.meta.env.VITE_SERVICE_MODE || 'mock'

function getServiceImplementation() {
  switch (SERVICE_MODE.toLowerCase()) {
    case 'java':
      return JavaYourService
    case 'mock':
    default:
      return MockYourService
  }
}

export default getServiceImplementation()
```

### 3. **Component Structure**
```vue
<template>
  <!-- UI here -->
</template>

<script setup>
// Imports
// Composables
// State
// Methods
// Lifecycle hooks
</script>

<style scoped>
/* Styles here */
</style>
```

### 4. **Git Workflow**
```bash
# Branch naming
feature/user-authentication
feature/video-crud
feature/share-modal
feature/comment-system
feature/favorite-list

# Commit message
feat(user): add login functionality
fix(video): resolve video loading issue
docs(share): update share API documentation
```

---

## 🚨 LƯU Ý QUAN TRỌNG

### ⚠️ Tránh Conflict:
1. **Không sửa shared components** mà không thông báo team
2. **Không sửa composables** của người khác
3. **Luôn pull code mới** trước khi bắt đầu làm việc
4. **Test kỹ** trước khi merge vào main branch

### ✅ Best Practices:
1. **Sử dụng Factory pattern** cho tất cả services
2. **Sử dụng Composables** để tái sử dụng logic
3. **Validate input** ở cả client và server
4. **Handle errors** gracefully với Toast notifications
5. **Responsive design** cho tất cả pages
6. **Accessibility** (a11y) cho tất cả components

---

## 📞 COMMUNICATION

### Daily Standup:
- Mỗi developer báo cáo:
  - Đã làm gì hôm qua?
  - Sẽ làm gì hôm nay?
  - Có vấn đề gì cần hỗ trợ?

### Code Review:
- Mỗi PR cần ít nhất 1 reviewer
- Reviewer nên là developer của module liên quan

### Documentation:
- Mỗi developer cập nhật README.md của module mình
- Document API endpoints trong BACKEND_API_SPEC.md

---

## 🎓 TÀI LIỆU THAM KHẢO

- ✅ `APPLICATION_FLOW_DIAGRAM.md` - Luồng hoạt động của app
- ✅ `SERVICE_VS_DAO_EXPLANATION.md` - Giải thích Service pattern
- ✅ `BACKEND_API_SPEC.md` - API specification
- ✅ `TEAM_GUIDE.md` - Hướng dẫn cho team
- ✅ `DRY_REFACTOR_PHASE2.md` - DRY principles

---

## ✨ KẾT LUẬN

Với phân công này:
- ✅ Mỗi developer có **trách nhiệm rõ ràng**
- ✅ **Không overlap** giữa các modules
- ✅ **Dependencies** được quản lý tốt
- ✅ **Timeline** hợp lý và khả thi
- ✅ **Communication** được đảm bảo

**Chúc team làm việc hiệu quả! 🚀**
