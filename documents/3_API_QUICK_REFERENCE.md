# 📡 API QUICK REFERENCE

**Tham khảo nhanh các API endpoints**

---

## 🔗 BASE URLs

- **Development:** `http://localhost:8080/api`
- **Production:** `https://your-domain.com/api`

---

## 📋 ALL ENDPOINTS

### 👤 USER
```
GET    /api/users                    - Get all users
GET    /api/users/:id                - Get user by ID
POST   /api/users                    - Create user
PUT    /api/users/:id                - Update user
DELETE /api/users/:id                - Delete user
GET    /api/users/search?q=keyword   - Search users
GET    /api/users/statistics         - Get statistics
```

### 🎬 VIDEO
```
GET    /api/videos                   - Get all videos
GET    /api/videos/:id               - Get video by ID
POST   /api/videos                   - Create video
PUT    /api/videos/:id               - Update video
DELETE /api/videos/:id               - Delete video
GET    /api/videos/search?q=keyword  - Search videos
GET    /api/videos/user/:userId      - Get videos by user
GET    /api/videos/statistics        - Get statistics
```

### ❤️ FAVORITE (Auth Required)
```
GET    /api/favorites                - Get user's favorites
POST   /api/favorites                - Add to favorites
DELETE /api/favorites/:videoId       - Remove from favorites
GET    /api/favorites/check/:videoId - Check if favorited
```

### 📤 SHARE (Auth Required)
```
GET    /api/shares                   - Get user's shares
POST   /api/shares                   - Share video
GET    /api/shares/video/:videoId    - Get shares for video
DELETE /api/shares/:id               - Delete share
```

### 💬 COMMENT ✨ NEW
```
GET    /api/comments/video/:videoId  - Get comments for video
POST   /api/comments                 - Create comment (Auth)
PUT    /api/comments/:id             - Update comment (Auth)
DELETE /api/comments/:id             - Delete comment (Auth)
GET    /api/comments/user/:userId    - Get user's comments
```

### 🔑 AUTH
```
POST   /api/auth/login               - Login
POST   /api/auth/register            - Register
POST   /api/auth/logout              - Logout (Auth)
GET    /api/auth/me                  - Get current user (Auth)
PUT    /api/auth/change-password     - Change password (Auth)
```

---

## 📊 DATABASE TABLES

```
User     (Id, Password, Email, Fullname, Admin, CreatedDate, UpdatedDate)
Video    (Id, Title, Poster, Views, Description, Active, UserId, CreatedDate, UpdatedDate)
Favorite (Id, UserId, VideoId, LikeDate)
Share    (Id, UserId, VideoId, Emails, ShareDate)
Comment  (Id, UserId, VideoId, Content, CreatedDate, UpdatedDate) ✨ NEW
```

---

**📖 Chi tiết đầy đủ:** Xem file `BACKEND_API_SPEC.md`
