# 🐛 BUGS VÀ ĐIỂM CẦN CẢI THIỆN

## 🔴 BUGS NGHIÊM TRỌNG

### 1. **Không có State Management**
**Vấn đề:** 
- `isLoggedIn` trong TheNavbar.vue luôn là `false`
- Sau khi đăng nhập trong AuthModal, navbar không cập nhật
- Không có cách nào để share state giữa các components

**Giải pháp:**
```bash
npm install pinia
```
Tạo auth store để quản lý trạng thái đăng nhập

---

### 2. **Navigation Guard không hoạt động**
**Vấn đề:**
- Router guard chỉ có `next()` mà không check authentication
- User có thể truy cập `/favorites`, `/account`, `/admin` mà không cần đăng nhập

**File:** `src/router/index.js`

**Giải pháp:**
```javascript
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  if (to.meta.requiresAuth && !user) {
    next('/')
    window.Toast?.error('Vui lòng đăng nhập để tiếp tục')
    return
  }
  
  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next('/')
    window.Toast?.error('Bạn không có quyền truy cập')
    return
  }
  
  next()
})
```

---

### 3. **Logout không xóa localStorage**
**Vấn đề:**
- `handleLogout()` trong TheNavbar chỉ set `isLoggedIn = false`
- Không xóa user data trong localStorage
- Refresh page vẫn còn data cũ

**File:** `src/components/layout/TheNavbar.vue`

**Giải pháp:**
```javascript
const handleLogout = () => {
  localStorage.removeItem('user')
  isLoggedIn.value = false
  window.Toast?.success('Đã đăng xuất')
  router.push('/')
}
```

---

### 4. **Không check localStorage khi mount**
**Vấn đề:**
- Sau khi đăng nhập và refresh page, navbar vẫn hiển thị "Đăng nhập"
- Không restore trạng thái từ localStorage

**File:** `src/components/layout/TheNavbar.vue`

**Giải pháp:**
```javascript
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)
const currentUser = ref(null)

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (user) {
    isLoggedIn.value = true
    currentUser.value = user
  }
})
```

---

## 🟡 BUGS TRUNG BÌNH

### 5. **Toast và Loading không có fallback**
**Vấn đề:**
- Nếu ToastContainer/LoadingOverlay chưa mount, `window.Toast` và `window.Loading` là undefined
- Gây lỗi khi gọi trước khi components ready

**Giải pháp:**
Thêm optional chaining:
```javascript
window.Toast?.success('Message')
window.Loading?.show('Loading...')
```

---

### 6. **VideoCard click không hoạt động đúng**
**Vấn đề:**
- Click vào video card sẽ navigate đến `/video/:id`
- Nhưng VideoDetailPage chỉ là placeholder, không hiển thị gì

**File:** `src/views/VideoDetailPage.vue`

**Cần implement:** Video player, thông tin video, comments

---

### 7. **Không có error handling cho API calls**
**Vấn đề:**
- `API.request()` throw error nhưng không có global error handler
- User không biết khi nào API fail

**File:** `src/utils/api.js`

**Giải pháp:**
```javascript
try {
  const response = await fetch(url, config)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  return await response.json()
} catch (error) {
  console.error('API Error:', error)
  window.Toast?.error(error.message || 'Lỗi kết nối server')
  throw error
}
```

---

### 8. **Missing Font Awesome**
**Vấn đề:**
- Code HTML gốc dùng Font Awesome
- Vue app chỉ import Bootstrap Icons
- Một số icon có thể không hiển thị

**Giải pháp:**
```bash
npm install @fortawesome/fontawesome-free
```
```javascript
// main.js
import '@fortawesome/fontawesome-free/css/all.min.css'
```

---

## 🟢 CẢI THIỆN UX/UI

### 9. **Không có loading state khi navigate**
**Cải thiện:** Thêm loading indicator khi chuyển trang

**Giải pháp:**
```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  window.Loading?.show('Đang tải...')
  next()
})

router.afterEach(() => {
  window.Loading?.hide()
})
```

---

### 10. **Không có 404 page**
**Vấn đề:** Navigate đến route không tồn tại → blank page

**Giải pháp:**
```javascript
// router/index.js
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('../views/NotFoundPage.vue')
}
```

---

### 11. **Không có confirmation khi logout**
**Cải thiện:** Hỏi user trước khi logout

**Giải pháp:**
```javascript
const handleLogout = () => {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    localStorage.removeItem('user')
    isLoggedIn.value = false
    window.Toast?.success('Đã đăng xuất')
    router.push('/')
  }
}
```

---

### 12. **Password không có strength indicator**
**Cải thiện:** Hiển thị độ mạnh mật khẩu khi đăng ký

---

### 13. **Form không có loading state**
**Vấn đề:** Submit form nhưng button không disable
- User có thể click nhiều lần

**Giải pháp:**
```vue
<button type="submit" :disabled="isSubmitting">
  <span v-if="isSubmitting">
    <i class="spinner-border spinner-border-sm"></i> Đang xử lý...
  </span>
  <span v-else>Đăng nhập</span>
</button>
```

---

## 🔵 CẢI THIỆN PERFORMANCE

### 14. **Không có image lazy loading**
**Vấn đề:** Tất cả images load cùng lúc

**Giải pháp:** Đã có `loading="lazy"` trong VideoCard ✅

---

### 15. **Không có code splitting**
**Cải thiện:** Đã dùng dynamic import cho routes ✅

---

### 16. **Không có caching**
**Cải thiện:** Implement service worker hoặc cache API responses

---

## 🟣 CẢI THIỆN CODE QUALITY

### 17. **Hardcoded mock accounts**
**Vấn đề:** Mock accounts trong AuthModal.vue
- Nên tách ra file riêng hoặc config

**Giải pháp:**
```javascript
// src/config/mockData.js
export const mockAccounts = {
  'mockuser': { password: '123456', role: 'user', fullname: 'Mock User' },
  'admin': { password: 'admin123', role: 'admin', fullname: 'Admin User' }
}
```

---

### 18. **Không có TypeScript**
**Cải thiện:** Migrate sang TypeScript để type safety

---

### 19. **Không có unit tests**
**Cải thiện:** Thêm Vitest và test các components

---

### 20. **Không có ESLint/Prettier**
**Cải thiện:** Setup code formatting và linting

```bash
npm install -D eslint prettier eslint-plugin-vue
```

---

## 📋 CHECKLIST ƯU TIÊN

### Ưu tiên cao (Phải fix ngay)
- [ ] Implement Pinia store cho auth state
- [ ] Fix navigation guard
- [ ] Fix logout xóa localStorage
- [ ] Check localStorage khi mount navbar
- [ ] Add optional chaining cho Toast/Loading

### Ưu tiên trung bình
- [ ] Implement VideoDetailPage
- [ ] Add error handling cho API
- [ ] Add Font Awesome
- [ ] Add 404 page
- [ ] Add loading state khi navigate

### Ưu tiên thấp (Nice to have)
- [ ] Add confirmation khi logout
- [ ] Add password strength indicator
- [ ] Add form loading state
- [ ] Tách mock data ra file riêng
- [ ] Add TypeScript
- [ ] Add unit tests
- [ ] Setup ESLint/Prettier

---

## 🚀 HƯỚNG DẪN FIX NHANH

### Bước 1: Install Pinia
```bash
cd 4in1-vue
npm install pinia
```

### Bước 2: Tạo auth store
```javascript
// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    login(userData) {
      this.user = userData
      this.isLoggedIn = true
      localStorage.setItem('user', JSON.stringify(userData))
    },
    
    logout() {
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('user')
    },
    
    checkAuth() {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      if (user) {
        this.user = user
        this.isLoggedIn = true
      }
    }
  }
})
```

### Bước 3: Setup Pinia trong main.js
```javascript
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
```

### Bước 4: Sử dụng trong components
```javascript
// TheNavbar.vue
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
```

---

## 📊 TỔNG KẾT

**Tổng số vấn đề:** 20  
**Bugs nghiêm trọng:** 4  
**Bugs trung bình:** 4  
**Cải thiện UX/UI:** 5  
**Cải thiện Performance:** 3  
**Cải thiện Code Quality:** 4  

**Thời gian ước tính fix:**
- Bugs nghiêm trọng: 2-3 giờ
- Bugs trung bình: 3-4 giờ
- Cải thiện: 5-8 giờ
- **Tổng:** 10-15 giờ

---

**Dự án hiện tại:** Chạy được, UI đẹp, nhưng cần fix auth state management để hoàn thiện!
