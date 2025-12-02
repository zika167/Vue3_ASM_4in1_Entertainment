# 📦 Services Layer

## 🏗️ Architecture

```
services/
├── apiClient.js              # Axios instance với interceptors
├── BaseJavaService.js        # Base class cho tất cả Java services
├── createServiceFactory.js   # Factory pattern creator
│
├── JavaUserService.js        # ✅ User API implementation (MẪU)
├── JavaVideoService.js       # ✅ Video API implementation (MẪU)
│
└── factories/
    ├── UserService.js        # ✅ Factory → JavaUserService (MẪU)
    └── VideoService.js       # ✅ Factory → JavaVideoService (MẪU)
```

## ⚠️ CẦN TẠO THÊM

| Dev   | Service                | Factory                      | Status      |
|----  -|--------               -|--------                     -|-------     -|
| DEV 3 | JavaShareService.js    | factories/ShareService.js    | ❌ Chưa tạo |
| DEV 4 | JavaCommentService.js  | factories/CommentService.js  | ❌ Chưa tạo |
| DEV 5 | JavaFavoriteService.js | factories/FavoriteService.js | ❌ Chưa tạo |

## 🎯 Cách sử dụng

```javascript
// Import service từ folder factories
import UserService from '@/services/factories/UserService'
import VideoService from '@/services/factories/VideoService'

// Sử dụng
const users = await UserService.getAllUsers()
const videos = await VideoService.getAllVideos()
```

## 🔧 Cấu hình

File `.env`:
```env
VITE_SERVICE_MODE=java
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🚀 HƯỚNG DẪN TẠO SERVICE MỚI

### Bước 1: Tạo JavaXxxService.js

Tham khảo `JavaUserService.js` hoặc `JavaVideoService.js`:

```javascript
// JavaShareService.js
import BaseJavaService from './BaseJavaService'

class JavaShareService extends BaseJavaService {
  constructor() {
    super('/shares')  // Base endpoint
  }
  
  async getAllShares() {
    return this.handleRequest(
      () => this.api.get(this.baseEndpoint),
      'Lấy danh sách chia sẻ'
    )
  }
  
  async deleteShare(id) {
    return this.handleRequest(
      () => this.api.delete(`${this.baseEndpoint}/${id}`),
      'Xóa chia sẻ'
    )
  }
}

export default new JavaShareService()
```

### Bước 2: Tạo Factory trong factories/

```javascript
// factories/ShareService.js
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

## 📚 Xem thêm

- `documents/7_DEV_NEXT_STEPS.md` - Hướng dẫn chi tiết cho từng dev
- `documents/4_BACKEND_API_SPEC.md` - API specification
