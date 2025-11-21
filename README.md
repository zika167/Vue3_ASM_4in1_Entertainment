# 4IN1 Entertainment - Vue 3 Application

Dự án Vue 3 được migrate từ HTML/CSS/JS thuần sang Vue 3 + Vite + Bootstrap 5.

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- npm >= 8.x

## 🚀 Cài đặt và chạy dự án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 3. Build cho production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## 📦 Thư viện đã cài đặt

- **Vue 3** - Framework chính
- **Vue Router** - Routing
- **Bootstrap 5** - UI Framework (qua npm, không dùng CDN)
- **Bootstrap Icons** - Icon library
- **@popperjs/core** - Dependency của Bootstrap
- **Vite** - Build tool

## 📁 Cấu trúc dự án

```
4in1-vue/
├── public/              # Static assets
├── src/
│   ├── assets/          # CSS, images, fonts
│   │   └── styles/
│   │       └── main.css # Global styles
│   ├── components/      # Vue components
│   │   ├── layout/      # Layout components
│   │   │   ├── TheNavbar.vue
│   │   │   └── TheFooter.vue
│   │   ├── modals/      # Modal components
│   │   │   └── AuthModal.vue
│   │   ├── ui/          # UI components
│   │   │   ├── LoadingOverlay.vue
│   │   │   └── ToastContainer.vue
│   │   └── video/       # Video related components
│   │       └── VideoCard.vue
│   ├── router/          # Vue Router config
│   │   └── index.js
│   ├── utils/           # Utility functions
│   │   ├── api.js       # API calls
│   │   ├── validation.js # Form validation
│   │   └── helpers.js   # Helper functions
│   ├── views/           # Page components
│   │   ├── HomePage.vue
│   │   ├── LoginPage.vue
│   │   ├── FavoritesPage.vue
│   │   ├── VideoDetailPage.vue
│   │   ├── AccountPage.vue
│   │   └── admin/
│   │       └── AdminDashboard.vue
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Giải thích cấu trúc Components

### Layout Components
- **TheNavbar.vue**: Navigation bar với logo, menu, nút đăng nhập/đăng ký
- **TheFooter.vue**: Footer với thông tin liên hệ, social links

### Video Components
- **VideoCard.vue**: Card hiển thị thông tin video (thumbnail, title, channel, views)
  - Props: `video` (object), `clickable` (boolean), `showActions` (boolean)
  - Có thể click để xem chi tiết video
  - Có nút like và share (nếu showActions = true)

### Modal Components
- **AuthModal.vue**: Modal đăng nhập/đăng ký
  - Có 2 tabs: Login và Register
  - Form validation cơ bản
  - Lắng nghe event 'open-auth-modal' để mở modal

### UI Components
- **LoadingOverlay.vue**: Overlay loading toàn màn hình
  - Expose global: `window.Loading.show()` và `window.Loading.hide()`
- **ToastContainer.vue**: Toast notifications
  - Expose global: `window.Toast.success()`, `window.Toast.error()`, etc.

## 🔧 Utilities

### API (src/utils/api.js)
```javascript
import API from '@/utils/api'

// GET request
const data = await API.get('/videos')

// POST request
const result = await API.post('/login', { username, password })
```

### Validation (src/utils/validation.js)
```javascript
import Validation from '@/utils/validation'

// Validate email
const isValid = Validation.isValidEmail('test@example.com')

// Validate password
const result = Validation.isValidPassword('password123')
// Returns: { valid: true/false, message: 'error message' }
```

### Helpers (src/utils/helpers.js)
```javascript
import Helpers from '@/utils/helpers'

// Format number
const formatted = Helpers.formatNumber(1000000) // "1,000,000"

// Get relative time
const time = Helpers.getRelativeTime(new Date()) // "Vừa xong"
```

## 🎨 Styling

- Bootstrap 5 được import global trong `main.js`
- Custom styles trong `src/assets/styles/main.css`
- Component styles sử dụng `<style scoped>` để tránh conflict
- Tất cả class Bootstrap vẫn hoạt động bình thường

## 🔄 Migration từ HTML thuần

### Đã chuyển đổi:
1. ✅ Navigation bar → TheNavbar.vue component
2. ✅ Footer → TheFooter.vue component
3. ✅ Video cards → VideoCard.vue component
4. ✅ Auth modal → AuthModal.vue component
5. ✅ Toast notifications → ToastContainer.vue component
6. ✅ Loading overlay → LoadingOverlay.vue component
7. ✅ Bootstrap CDN → npm packages
8. ✅ Vanilla JS → Vue 3 Composition API

### Chưa implement (TODO):
- [ ] Kết nối API backend
- [ ] Authentication logic
- [ ] State management (Pinia/Vuex nếu cần)
- [ ] Video detail page
- [ ] Favorites page
- [ ] Account settings page
- [ ] Admin dashboard
- [ ] Form validation với backend
- [ ] Video upload functionality

## 🚦 Routes

- `/` - Trang chủ (HomePage)
- `/login` - Trang đăng nhập (placeholder)
- `/favorites` - Video yêu thích (placeholder, requires auth)
- `/video/:id` - Chi tiết video (placeholder)
- `/account` - Cài đặt tài khoản (placeholder, requires auth)
- `/admin` - Admin dashboard (placeholder, requires admin)

## 💡 Cách sử dụng

### Mở Auth Modal từ bất kỳ đâu:
```javascript
// Mở tab login
window.dispatchEvent(new CustomEvent('open-auth-modal', { 
  detail: { tab: 'login' } 
}))

// Mở tab register
window.dispatchEvent(new CustomEvent('open-auth-modal', { 
  detail: { tab: 'register' } 
}))
```

### Hiển thị Toast notification:
```javascript
window.Toast.success('Thành công!')
window.Toast.error('Có lỗi xảy ra!')
window.Toast.warning('Cảnh báo!')
window.Toast.info('Thông tin')
```

### Hiển thị Loading:
```javascript
window.Loading.show('Đang tải...')
// Do something
window.Loading.hide()
```

## 📝 Notes

- Dự án sử dụng Vue 3 Composition API với `<script setup>`
- Bootstrap 5 được cài qua npm, không dùng CDN
- Tất cả components đã được tách riêng biệt và có thể tái sử dụng
- Code đã sẵn sàng để kết nối với backend API
- Responsive design đã được implement

## 🤝 Contributing

Dự án này là assignment Java 4, được migrate sang Vue 3 để học tập và phát triển.

## 📄 License

© 2025 4IN1 - Assignment Java 4. All rights reserved.
