# 🔄 LUỒNG HOẠT ĐỘNG DỰ ÁN 4IN1-VUE

**Tài liệu này giải thích chi tiết luồng hoạt động từ khi start dự án đến khi render DOM và fetch data**

---

## 📋 MỤC LỤC

1. [Khởi động ứng dụng](#1-khởi-động-ứng-dụng)
2. [Render DOM](#2-render-dom)
3. [Component Lifecycle](#3-component-lifecycle)
4. [Data Fetching Flow](#4-data-fetching-flow)
5. [Service Layer Architecture](#5-service-layer-architecture)
6. [Ví dụ cụ thể](#6-ví-dụ-cụ-thể)

---

## 1. 🚀 KHỞI ĐỘNG ỨNG DỤNG

### Bước 1: Browser load `index.html`

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>4in1-vue</title>
  </head>
  <body>
    <div id="app"></div>  <!-- ⬅️ Mount point -->
    <script type="module" src="/src/main.js"></script>  <!-- ⬅️ Entry point -->
  </body>
</html>
```

**Điều gì xảy ra:**
- Browser tải HTML
- Tạo `<div id="app"></div>` (rỗng)
- Load `main.js` (module ES6)

---

### Bước 2: Vite build & load `main.js`

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import CSS
// npm install bootstrap @popperjs/core bootstrap-icons 

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.css'

const app = createApp(App)  // ⬅️ Tạo Vue app instance
app.use(router)             // ⬅️ Register router
app.mount('#app')           // ⬅️ Mount vào DOM
```

**Điều gì xảy ra:**
1. ✅ Import Vue framework
2. ✅ Import root component (`App.vue`)
3. ✅ Import router configuration
4. ✅ Import CSS (Bootstrap, Icons, Custom)
5. ✅ Tạo Vue app instance
6. ✅ Register Vue Router plugin
7. ✅ Mount app vào `<div id="app">`

---

### Bước 3: Vue Router khởi tạo

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/admin', name: 'Admin', component: AdminDashboard },
  // ... more routes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // Check auth, permissions
  next()
})

export default router
```

**Điều gì xảy ra:**
1. ✅ Router đọc URL hiện tại (ví dụ: `/`)
2. ✅ Match với route config
3. ✅ Chạy navigation guard (check auth)
4. ✅ Load component tương ứng (lazy load)

---

## 2. 🎨 RENDER DOM

### Bước 4: Render `App.vue` (Root Component)

```vue
<!-- src/App.vue -->
<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- Conditional rendering -->
    <TheNavbar v-if="!isAdminRoute" />
    
    <main class="flex-grow-1">
      <router-view />  <!-- ⬅️ Component được route vào đây -->
    </main>
    
    <TheFooter />
    
    <!-- Global Modals -->
    <AuthModal />
    <ShareVideoModal />
    <ToastContainer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>
```

**Điều gì xảy ra:**
1. ✅ Vue render `App.vue` template
2. ✅ Check `isAdminRoute` → Hiện/ẩn Navbar
3. ✅ Render `TheNavbar` (nếu không phải admin)
4. ✅ Render `<router-view>` → Chờ router inject component
5. ✅ Render `TheFooter`
6. ✅ Render global modals (ẩn, chờ trigger)

**DOM Structure lúc này:**
```html
<div id="app">
  <nav class="user-navbar">...</nav>  <!-- TheNavbar -->
  <main>
    <!-- router-view sẽ inject component vào đây -->
  </main>
  <footer>...</footer>  <!-- TheFooter -->
  <div class="modal">...</div>  <!-- AuthModal (hidden) -->
  <div class="toast-container">...</div>  <!-- ToastContainer -->
</div>
```

---

### Bước 5: Router inject component vào `<router-view>`

**Ví dụ: User truy cập `/`**

```javascript
// Router match: path='/' → component=HomePage
```

```vue
<!-- src/views/HomePage.vue được inject vào <router-view> -->
<template>
  <div class="container-fluid p-4">
    <PageBanner title="Chào mừng..." />
    
    <div class="video-grid">
      <VideoCard 
        v-for="video in videos" 
        :key="video.id" 
        :video="video"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VideoCard from '../components/video/VideoCard.vue'

const videos = ref([...])  // Mock data
</script>
```

**DOM Structure sau khi inject:**
```html
<div id="app">
  <nav>...</nav>
  <main>
    <div class="container-fluid p-4">  <!-- HomePage -->
      <div class="page-header">...</div>
      <div class="video-grid">
        <article class="video-container">...</article>  <!-- VideoCard -->
        <article class="video-container">...</article>
        <article class="video-container">...</article>
      </div>
    </div>
  </main>
  <footer>...</footer>
</div>
```

---

## 3. 🔄 COMPONENT LIFECYCLE

### Lifecycle của một Page Component

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 1️⃣ SETUP PHASE (Chạy đầu tiên)
console.log('1. Setup phase - Component được tạo')
const videos = ref([])
const loading = ref(false)

// 2️⃣ BEFORE MOUNT
// Vue chuẩn bị render template

// 3️⃣ MOUNTED (Sau khi render xong)
onMounted(async () => {
  console.log('2. Mounted - DOM đã sẵn sàng')
  console.log('3. Bắt đầu fetch data...')
  await loadVideos()
  console.log('4. Data đã load xong, Vue tự động re-render')
})

const loadVideos = async () => {
  loading.value = true
  const result = await VideoService.getAllVideos()
  videos.value = result.data
  loading.value = false
}
</script>
```

**Timeline:**
```
0ms:  Setup phase chạy
      ↓
10ms: Template được compile
      ↓
20ms: Component mount vào DOM (render lần 1 - loading=true)
      ↓
25ms: onMounted() trigger → gọi loadVideos()
      ↓
30ms: API call bắt đầu...
      ↓
500ms: API response về
      ↓
505ms: videos.value được update
      ↓
510ms: Vue detect change → re-render (render lần 2 - hiện videos)
```

---

## 4. 📡 DATA FETCHING FLOW

### Flow 2: Fetch data với Java API

```
┌─────────────────────────────────────────────────────────────┐
│                    USER TRUY CẬP /admin/users               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│     VITE_SERVICE_MODE = java                                │
│     → Return JavaUserService                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│     Component mounted → gọi loadItems()                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│     VoadItems() → UserService.getAllUsers()                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│     JavaUserService.getAllUsers()                           │
│     - Axios call: GET http://localhost:8080/api/users       │
│     - Add Authorization header (nếu có token)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│     Java Backend xử lý request                              │
│     @GetMapping("/api/users")                               │
│     - Query database                                        │
│     - Return JSON: { success: true, data: [...] }           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│     Axios interceptor xử lý response                        │
│     - Check status code                                     │
│     - Parse JSON                                            │
│     - Return data                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      useCrudOperations nhận response                        │
│      - items.value = result.data                            │
│      - loading.value = false                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      Vue detect reactive change → Re-render                 │
│      - DataTable component nhận props mới                   │
│      - Render table với data từ Java API                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 🏗️ SERVICE LAYER ARCHITECTURE

### Service Factory Pattern

```javascript
// src/services/UserService.js (Factory)
import JavaUserService from './JavaUserService'

const SERVICE_MODE = import.meta.env.VITE_SERVICE_MODE || 'mock'

function getServiceImplementation() {
  switch (SERVICE_MODE) {
    case 'java':
      console.log('🔧 Using Java API')
      return JavaUserService
    case 'mock':
    default:
      console.log('🔧 Using Mock Data')
      return MockUserService
  }
}

export default getServiceImplementation()
```

**Cách hoạt động:**
1. ✅ Đọc `VITE_SERVICE_MODE` từ `.env`
2. ✅ Chọn implementation (Mock hoặc Java)
3. ✅ Export service đã chọn
4. ✅ Component import `UserService` → Tự động dùng đúng implementation

---

### Java Service Implementation

```javascript
// src/services/JavaUserService.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_JAVA_API_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - Add token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.message || 'Server error'
    return Promise.reject(new Error(message))
  }
)

class JavaUserService {
  async getAllUsers() {
    try {
      const response = await apiClient.get('/users')
      return {
        success: true,
        data: response.data || response,
        total: response.total || 0
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  // ... other methods
}

export default new JavaUserService()
```

**Đặc điểm:**
- ✅ Gọi HTTP API thật
- ✅ Axios interceptors (auth, error handling)
- ✅ Response format chuẩn hóa
- ✅ Cần backend chạy

---


## 7. 🔍 COMPONENT HIERARCHY

### User Pages

```
App.vue
├── TheNavbar
│   ├── Brand (logo + text)
│   ├── Menu Items (dynamic từ router)
│   └── User Dropdown
│       ├── Account Link
│       └── Logout Button
│
├── <router-view>
│   │
│   ├── HomePage
│   │   ├── PageBanner
│   │   └── VideoGrid
│   │       └── VideoCard (x6)
│   │
│   ├── FavoritesPage
│   │   ├── PageHeader
│   │   ├── SearchBar
│   │   └── VideoGrid
│   │       └── VideoCard (x6)
│   │           └── ActionButtons
│   │
│   ├── VideoDetailPage
│   │   ├── VideoPlayer
│   │   ├── VideoInfo
│   │   ├── ActionButtons
│   │   ├── ChannelInfo
│   │   └── RelatedVideoList
│   │       └── VideoCard (x5)
│   │
│   └── AccountPage
│       ├── InfoCard
│       ├── FormFields (x5)
│       └── DangerZone
│
├── TheFooter
│
└── Global Modals
    ├── AuthModal
    ├── ShareVideoModal
    └── ToastContainer
```

---

### Admin Pages

```
App.vue
├── <router-view>
│   │
│   ├── AdminDashboard (Layout)
│   │   ├── AdminNavbar
│   │   │   ├── Brand
│   │   │   ├── Menu Items (dynamic)
│   │   │   └── User Dropdown
│   │   │
│   │   └── Content
│   │       ├── StatCards (x4)
│   │       ├── QuickTools
│   │       ├── SystemInfo
│   │       └── RecentVideos
│   │
│   ├── UserManagement (Layout)
│   │   ├── AdminNavbar
│   │   └── Content
│   │       ├── PageHeader
│   │       ├── StatCards (x4)
│   │       ├── SearchBar
│   │       ├── DataTable
│   │       └── UserModal
│   │
│   ├── VideoManagement (Layout)
│   │   ├── AdminNavbar
│   │   └── Content
│   │       ├── PageHeader
│   │       ├── SearchBar
│   │       ├── DataTable
│   │       └── VideoModal
│   │
│   └── ReportsManagement (Layout)
│       ├── AdminNavbar
│       └── Content
│           ├── PageHeader
│           ├── StatCards (x4)
│           ├── Charts
│           └── ActivityList
│
└── TheFooter
```

---

## 8. 🎯 KEY TAKEAWAYS

### ✅ Luồng chính:
1. **Browser load HTML** → Load main.js
2. **main.js** → Create Vue app + Router
3. **Router** → Match URL → Load component
4. **Component setup** → Import services, composables
5. **Component mounted** → Fetch data
6. **Service Factory** → Chọn Mock/Java theo .env
7. **Data fetching** → Mock (instant) hoặc Java (HTTP)
8. **Response** → Update reactive state
9. **Vue re-render** → Update DOM
10. **User sees** → Final UI

### ✅ Service Layer:
- **Factory Pattern** → Tự động chọn implementation
- **Mock Service** → Development, không cần backend
- **Java Service** → Production, kết nối API thật
- **Consistent API** → Cùng interface, dễ switch

### ✅ Component Communication:
- **Props** → Parent truyền data xuống Child
- **Emits** → Child bắn events lên Parent
- **Composables** → Share logic giữa components
- **Router** → Navigate giữa pages

---

**Tài liệu này giúp team hiểu rõ luồng hoạt động của dự án!** 🚀
