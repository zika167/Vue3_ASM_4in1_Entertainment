# 4IN1 ENTERTAINMENT - COMPREHENSIVE PROJECT UNDERSTANDING

## 📊 PROJECT OVERVIEW

**4IN1 Entertainment** is a **video-sharing platform** built with:
- **Frontend:** Vue 3 + Vite + Bootstrap 5
- **Backend:** Spring Boot (Java 4)
- **Database:** MariaDB
- **Architecture:** Factory Pattern + Service Layer + Composition API

**Status:** In Development (FESP02007_User branch)
- **User Module:** ✅ COMPLETE
- **Video Module:** ✅ COMPLETE
- **Share Module:** ❌ In Progress (DEV 3)
- **Comment Module:** ❌ In Progress (DEV 4)
- **Favorite Module:** ❌ In Progress (DEV 5)

---

## 🎯 CORE FEATURES

### For Users:
- 📺 Browse and search videos
- ❤️ Add videos to favorites
- 📤 Share videos via email
- 💬 Comment on videos
- 👤 Manage personal profile
- 🔐 Login/Register

### For Admins:
- 👥 Manage users (CRUD)
- 🎬 Manage videos (CRUD)
- 📊 View statistics
- 💬 Moderate comments
- 📤 Track shares
- ❤️ Manage favorites

---

## 📁 PROJECT STRUCTURE

```
4in1-vue/
├── documents/                          # 📚 Documentation (CRITICAL)
│   ├── 1_APPLICATION_FLOW_DIAGRAM.md  # App lifecycle & routing
│   ├── 2_TEAM_WORK_DISTRIBUTION.md    # Task assignment (THIS)
│   ├── 3_BACKEND_API_SPEC.md          # API endpoints
│   ├── DOC_AXIOS_GUIDE.md             # HTTP client guide
│   ├── DOC_COMPOSABLES_EXPLANATION.md # Composition API patterns
│   ├── DOC_SERVICE_CODE_EXPLANATION.md # Service architecture
│   └── database.sql                   # DB schema
│
├── src/
│   ├── pages/                         # Full page components
│   │   ├── HomePage.vue               # Video listing
│   │   ├── VideoDetailPage.vue        # Video player + comments
│   │   ├── FavoritesPage.vue          # User's favorites
│   │   ├── AccountPage.vue            # Profile settings
│   │   └── admin/                     # Admin dashboard
│   │       ├── AdminDashboard.vue
│   │       ├── UserManagement.vue
│   │       ├── VideoManagement.vue
│   │       ├── ShareManagement.vue
│   │       ├── CommentManagement.vue
│   │       └── FavoriteManagement.vue
│   │
│   ├── components/                    # Reusable components
│   │   ├── layout/
│   │   │   ├── TheNavbar.vue          # User navbar
│   │   │   ├── AdminNavbar.vue        # Admin navbar
│   │   │   ├── TheFooter.vue
│   │   │   └── AdminLayout.vue
│   │   │
│   │   ├── modals/
│   │   │   ├── AuthModal.vue          # Login/Register modal
│   │   │   ├── ShareVideoModal.vue    # Share functionality
│   │   │   └── ForgotPasswordModal.vue
│   │   │
│   │   ├── ui/                        # Generic UI components
│   │   │   ├── DataTable.vue          # Reusable table
│   │   │   ├── SearchBar.vue
│   │   │   ├── StatCard.vue
│   │   │   ├── PageHeader.vue
│   │   │   ├── LoadingOverlay.vue
│   │   │   └── ToastContainer.vue
│   │   │
│   │   ├── video/
│   │   │   └── VideoCard.vue          # Video item display
│   │   │
│   │   ├── comment/
│   │   │   ├── CommentSection.vue     # [DEV 4] TODO
│   │   │   ├── CommentForm.vue
│   │   │   └── CommentItem.vue
│   │   │
│   │   ├── share/
│   │   │   └── ShareButton.vue
│   │   │
│   │   └── favorite/
│   │       └── FavoriteButton.vue     # [DEV 5] TODO
│   │
│   ├── composables/                   # Reusable logic (Composition API)
│   │   ├── useCrudOperations.js       # Generic CRUD composable ⭐
│   │   ├── useModal.js                # Modal management
│   │   ├── useShare.js                # [DEV 3] TODO
│   │   ├── useComment.js              # [DEV 4] TODO
│   │   ├── useFavorite.js             # [DEV 5] TODO
│   │   └── index.js
│   │
│   ├── services/                      # Service layer (Factory Pattern) ⭐
│   │   ├── factories/
│   │   │   ├── UserService.js         # Factory (User)
│   │   │   └── VideoService.js        # Factory (Video)
│   │   │   ├── ShareService.js        # [DEV 3] Need to create
│   │   │   ├── CommentService.js      # [DEV 4] Need to create
│   │   │   └── FavoriteService.js     # [DEV 5] Need to create
│   │   │
│   │   ├── JavaUserService.js         # Implementation (User)
│   │   ├── JavaVideoService.js        # Implementation (Video)
│   │   ├── JavaShareService.js        # [DEV 3] Need to create
│   │   ├── JavaCommentService.js      # [DEV 4] Need to create
│   │   ├── JavaFavoriteService.js     # [DEV 5] Need to create
│   │   │
│   │   ├── BaseJavaService.js         # Base class (shared)
│   │   ├── apiClient.js               # Axios instance (shared)
│   │   └── createServiceFactory.js    # Factory helper (shared)
│   │
│   ├── router/
│   │   └── index.js                   # Vue Router configuration
│   │
│   ├── utils/
│   │   ├── validation.js              # Form validation functions
│   │   └── helpers.js                 # Utility functions
│   │
│   ├── assets/
│   │   └── styles/
│   │       └── main.css
│   │
│   ├── App.vue                        # Root component
│   └── main.js                        # Entry point
│
├── .env                               # Environment variables
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

## 🔄 APPLICATION FLOW (LIFECYCLE)

### 1. **Browser Load → App Initialization**

```
index.html loaded
    ↓
main.js executed
    ↓
Vue app created + Router initialized
    ↓
App.vue rendered
    ↓
<router-view> matched with current route
    ↓
Component (HomePage, AdminDashboard, etc.) rendered
```

### 2. **Component Lifecycle (Mounted)**

```
Component Setup Phase
    ↓
Reactive state initialized (ref, computed)
    ↓
Component mounted to DOM
    ↓
onMounted() hook triggered
    ↓
Call loadItems() from useCrudOperations
    ↓
Service.getAllXxx() called
    ↓
Axios request to backend
    ↓
Response received
    ↓
State updated (items.value = result.data)
    ↓
Vue detects change → Re-render
    ↓
User sees data
```

### 3. **Service Factory Pattern**

```
Component imports UserService
    ↓
Factory checks VITE_SERVICE_MODE env var
    ↓
If mode = 'java':
    Use JavaUserService (real API)
If mode = 'mock':
    Use MockUserService (fake data)
    ↓
Service method called (e.g., getAllUsers())
    ↓
BaseJavaService.handleRequest() wraps try-catch
    ↓
Axios sends HTTP request
    ↓
Returns { success: true/false, data: [...], error: ... }
    ↓
Component receives response
```

---

## 🗄️ DATABASE SCHEMA

### Tables:

```sql
User (5 fields)
├── id: VARCHAR (Primary Key)
├── password: VARCHAR
├── email: VARCHAR
├── fullname: VARCHAR
├── admin: BOOLEAN
├── createdDate: TIMESTAMP
└── updatedDate: TIMESTAMP

Video (7 fields)
├── id: VARCHAR (Primary Key)
├── title: VARCHAR
├── poster: VARCHAR (URL)
├── views: INT
├── description: TEXT
├── active: BOOLEAN
├── userId: VARCHAR (FK → User.id)
├── createdDate: TIMESTAMP
└── updatedDate: TIMESTAMP

Favorite (3 fields)
├── id: INT (Primary Key)
├── userId: VARCHAR (FK → User.id)
├── videoId: VARCHAR (FK → Video.id)
└── likeDate: TIMESTAMP

Share (4 fields)
├── id: INT (Primary Key)
├── userId: VARCHAR (FK → User.id)
├── videoId: VARCHAR (FK → Video.id)
├── emails: VARCHAR (semicolon-separated)
└── shareDate: TIMESTAMP

Comment (5 fields) ✨ NEW
├── id: INT (Primary Key)
├── userId: VARCHAR (FK → User.id)
├── videoId: VARCHAR (FK → Video.id)
├── content: TEXT
├── createdDate: TIMESTAMP
└── updatedDate: TIMESTAMP
```

---

## 📡 API ENDPOINTS SUMMARY

### Base URL: `http://localhost:8080/api`

| Method | Endpoint | Module | Auth | Status |
|--------|----------|--------|------|--------|
| GET | `/users` | User | ❌ | ✅ Ready |
| POST | `/users` | User | ❌ | ✅ Ready |
| PUT | `/users/:id` | User | ✅ | ✅ Ready |
| DELETE | `/users/:id` | User | ✅ | ✅ Ready |
| GET | `/videos` | Video | ❌ | ✅ Ready |
| POST | `/videos` | Video | ✅ | ✅ Ready |
| PUT | `/videos/:id` | Video | ✅ | ✅ Ready |
| DELETE | `/videos/:id` | Video | ✅ | ✅ Ready |
| GET | `/favorites` | Favorite | ✅ | ❌ WIP |
| POST | `/favorites` | Favorite | ✅ | ❌ WIP |
| DELETE | `/favorites/:id` | Favorite | ✅ | ❌ WIP |
| GET | `/shares` | Share | ✅ | ❌ WIP |
| POST | `/shares` | Share | ✅ | ❌ WIP |
| DELETE | `/shares/:id` | Share | ✅ | ❌ WIP |
| GET | `/comments/video/:id` | Comment | ❌ | ❌ WIP |
| POST | `/comments` | Comment | ✅ | ❌ WIP |
| PUT | `/comments/:id` | Comment | ✅ | ❌ WIP |
| DELETE | `/comments/:id` | Comment | ✅ | ❌ WIP |

---

## 🏗️ ARCHITECTURE PATTERNS

### 1. **Factory Pattern** (Service Layer)

**Problem:** Need to switch between Mock and Java services easily

**Solution:** Factory creates correct implementation based on environment

```javascript
// factories/UserService.js (Factory)
const UserService = createServiceFactory('User', {
  java: JavaUserService,
  mock: MockUserService
})

// Components always import from factory
import UserService from '@/services/factories/UserService'
const result = await UserService.getAllUsers()
// Automatically gets correct implementation!
```

**Benefits:**
- ✅ Switch backend without changing components
- ✅ Development with mock data (fast)
- ✅ Production with real API (reliable)
- ✅ Single source of truth

### 2. **Composition Functions** (Reusable Logic)

**Problem:** Same CRUD logic repeats in every admin page (80 lines each!)

**Solution:** Extract into composables

```javascript
// useCrudOperations.js (Composable)
export function useCrudOperations(service, options) {
  const items = ref([])
  const loading = ref(false)
  // ... 80 lines of logic
  return { items, loading, loadItems, createItem, updateItem, deleteItem }
}

// pages/admin/UserManagement.vue (Component)
const { items, loading, loadItems } = 
  useCrudOperations(UserService, { itemName: 'user' })
// Component becomes 180 lines instead of 250 lines!
```

**Benefits:**
- ✅ 50% code reduction across 5 management pages
- ✅ Bug fix in one place affects all
- ✅ Easy to test in isolation
- ✅ DRY principle

### 3. **Base Service Class** (DRY)

**Problem:** Error handling, response format repeat in every service

**Solution:** Extend from base class

```javascript
// BaseJavaService.js
class BaseJavaService {
  async handleRequest(requestFn, actionName) {
    try {
      const response = await requestFn()
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// JavaUserService.js
class JavaUserService extends BaseJavaService {
  async getAllUsers() {
    // One line! Error handling is built-in
    return this.handleRequest(
      () => this.api.get('/users'),
      'Lấy danh sách users'
    )
  }
}
```

**Benefits:**
- ✅ Consistent response format across all services
- ✅ No repeated try-catch blocks
- ✅ Easy to add common logic (logging, metrics)

### 4. **Axios Interceptors** (Global Request/Response Handling)

**Problem:** Add auth token to every request, handle 401 errors globally

**Solution:** Axios interceptors

```javascript
// apiClient.js
apiClient.interceptors.request.use(config => {
  // Add token to every request automatically
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Handle 401 globally
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

**Benefits:**
- ✅ Token added to all requests automatically
- ✅ Logout user on expired token globally
- ✅ No need to handle auth in every component

---

## 🔑 KEY TECHNOLOGIES

| Technology | Purpose | Version |
|-----------|---------|---------|
| Vue.js | Frontend framework | 3.5.24 |
| Vite | Build tool (fast) | 7.2.4 |
| Vue Router | Client-side routing | 4.6.3 |
| Bootstrap | CSS framework | 5.3.8 |
| Axios | HTTP client | 1.13.2 |
| Bootstrap Icons | Icon library | 1.13.1 |

### Environment Variables (.env):

```env
VITE_SERVICE_MODE=java              # 'java' or 'mock'
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Login Flow:

```
1. User enters credentials in AuthModal
2. POST /api/auth/login
3. Backend returns { user, token }
4. Frontend saves token in localStorage
5. Save user object in localStorage
6. Token automatically added to all requests via interceptor
```

### Route Protection:

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (to.meta.requiresAuth && !user.username) {
    // Redirect to home if not logged in
    return next({ name: 'Home' })
  }
  
  next()
})
```

### Admin Protection:

```javascript
// Currently commented out - can be enabled
if (to.meta.requiresAdmin && user.admin !== true) {
  return next({ name: 'Home' })
}
```

---

## 🔄 ROUTING MAP

| Route | Component | Auth | Role | Purpose |
|-------|-----------|------|------|---------|
| `/` | HomePage | ❌ | Public | Browse videos |
| `/video/:id` | VideoDetailPage | ❌ | Public | Watch video + comments |
| `/favorites` | FavoritesPage | ✅ | User | View favorite videos |
| `/account` | AccountPage | ✅ | User | Edit profile |
| `/admin` | AdminDashboard | ✅ | Admin | Dashboard overview |
| `/admin/users` | UserManagement | ✅ | Admin | Manage users |
| `/admin/videos` | VideoManagement | ✅ | Admin | Manage videos |
| `/admin/shares` | ShareManagement | ✅ | Admin | Manage shares |
| `/admin/comments` | CommentManagement | ✅ | Admin | Moderate comments |
| `/admin/favorites` | FavoriteManagement | ✅ | Admin | View all favorites |

---

## 📊 COMPOSABLES REFERENCE

### **useCrudOperations.js** - Generic CRUD Operations

```javascript
const {
  items,           // Array of items
  loading,         // Loading state
  submitting,      // Form submission state
  searchKeyword,   // Current search term
  statistics,      // Aggregated stats
  loadItems,       // Load all items
  createItem,      // Create new item
  updateItem,      // Update existing item
  deleteItem,      // Delete item
  searchItems,     // Search items
  loadStatistics,  // Load stats
  resetSearch      // Clear search
} = useCrudOperations(service, options)
```

**Used By:** All 5 admin management pages

### **useModal.js** - Modal State Management

```javascript
const {
  modalRef,        // DOM ref to modal element
  isEditMode,      // Toggle create/edit mode
  currentItemId,   // ID of item being edited
  formData,        // Form values (reactive)
  openCreateModal, // Open for creating new
  openEditModal,   // Open for editing
  hideModal,       // Close modal
  resetForm        // Clear form values
} = useModal(initialFormData)
```

**Used By:** All management page modals

### **useShare.js** - Share Functionality [DEV 3]

**Status:** ❌ TODO

### **useComment.js** - Comment Management [DEV 4]

**Status:** ❌ TODO

### **useFavorite.js** - Favorite Management [DEV 5]

**Status:** ❌ TODO

---

## 💬 GLOBAL UI HELPERS

### Toast Notifications

```javascript
// Success
window.Toast?.success('Created successfully!')

// Error
window.Toast?.error('Something went wrong!')

// Warning
window.Toast?.warning('Please fill all fields')

// Info
window.Toast?.info('This is an info message')
```

### Loading Overlay

```javascript
window.Loading?.show('Processing...')
// ... do something
window.Loading?.hide()
```

### Auth Modal

```javascript
window.dispatchEvent(new CustomEvent('open-auth-modal', {
  detail: { tab: 'login' }  // or 'register'
}))
```

---

## 🎯 DEVELOPMENT WORKFLOW

### Starting Dev Server:

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (port 5173)
```

### Building for Production:

```bash
npm run build        # Create dist/ folder
npm run preview      # Preview production build
```

### Important Environment:

- **Frontend URL:** `http://localhost:5173`
- **Backend URL:** `http://localhost:8080/api`
- **Database:** MariaDB (java4_db_asm)

---

## 👥 TEAM ASSIGNMENT

| Developer | Module | Files | Status |
|-----------|--------|-------|--------|
| DEV 1 | User | UserService, AuthModal, AccountPage | ✅ DONE |
| DEV 2 | Video | VideoService, VideoCard, HomePage | ✅ DONE |
| DEV 3 | Share | ShareService, ShareModal, ShareManagement | ❌ WIP |
| DEV 4 | Comment | CommentService, CommentSection, CommentManagement | ❌ WIP |
| DEV 5 | Favorite | FavoriteService, FavoriteButton, FavoritesPage | ❌ WIP |

**Each DEV needs to:**
1. Create `Java[Module]Service.js`
2. Create `factories/[Module]Service.js`
3. Create or update `use[Module].js` composable
4. Implement components
5. Test with backend

---

## 📚 DOCUMENTATION FILES

| # | File | Topics Covered |
|---|------|----------------|
| 1 | `1_APPLICATION_FLOW_DIAGRAM.md` | App lifecycle, routing, component hierarchy |
| 2 | `2_TEAM_WORK_DISTRIBUTION.md` | Task assignment, file ownership, TODO items |
| 3 | `3_BACKEND_API_SPEC.md` | All API endpoints with request/response examples |
| 4 | `DOC_AXIOS_GUIDE.md` | HTTP client setup, interceptors, error handling |
| 5 | `DOC_COMPOSABLES_EXPLANATION.md` | What composables are, patterns, best practices |
| 6 | `DOC_SERVICE_CODE_EXPLANATION.md` | Service architecture deep-dive |

---

## ✅ QUICK CHECKLIST FOR NEW DEVELOPERS

### Before Starting:
- [ ] Read `2_TEAM_WORK_DISTRIBUTION.md` (YOUR TASKS)
- [ ] Read `1_APPLICATION_FLOW_DIAGRAM.md` (HOW THINGS WORK)
- [ ] Read `3_BACKEND_API_SPEC.md` (API DOCS)
- [ ] Read `DOC_SERVICE_CODE_EXPLANATION.md` (ARCHITECTURE)

### Development Process:
- [ ] Create Java[Module]Service.js (copy from JavaUserService.js)
- [ ] Create factories/[Module]Service.js (copy from factories/UserService.js)
- [ ] Update use[Module].js composable
- [ ] Implement components (use useCrudOperations + useModal)
- [ ] Test with backend running
- [ ] Create git commit with meaningful message

### Testing:
- [ ] Load and display items ✅
- [ ] Create new item ✅
- [ ] Update existing item ✅
- [ ] Delete item ✅
- [ ] Search functionality ✅
- [ ] Error handling ✅

---

## 🚀 NEXT STEPS

### Immediate:
1. **Finish User Module** (DEV 1) - Final testing
2. **Finish Video Module** (DEV 2) - Final testing
3. **Start Share Module** (DEV 3) - Follow template
4. **Start Comment Module** (DEV 4) - Follow template
5. **Start Favorite Module** (DEV 5) - Follow template

### Integration:
1. Test all services with backend
2. Test auth flow end-to-end
3. Test admin dashboard
4. Performance optimization
5. Deployment preparation

---

## 🔗 USEFUL LINKS

- **Vue 3 Docs:** https://vuejs.org/
- **Vue Router:** https://router.vuejs.org/
- **Axios:** https://axios-http.com/
- **Bootstrap:** https://getbootstrap.com/
- **Vite:** https://vitejs.dev/

---

**This document should give you a complete understanding of the project architecture, patterns, and workflow. Happy coding! 🚀**
