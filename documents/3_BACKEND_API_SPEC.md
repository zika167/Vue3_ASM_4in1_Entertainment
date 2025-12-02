# 📡 BACKEND API SPECIFICATION - COMPLETE

**Database:** MariaDB (java4_db_asm)  
**Cập nhật:** 01/12/2025

---

## 🗄️ DATABASE SCHEMA OVERVIEW

```
User (Id, Password, Email, Fullname, Admin, CreatedDate, UpdatedDate)
Video (Id, Title, Poster, Views, Description, Active, UserId, CreatedDate, UpdatedDate)
Favorite (Id, UserId, VideoId, LikeDate)
Share (Id, UserId, VideoId, Emails, ShareDate)
Comment (Id, UserId, VideoId, Content, CreatedDate, UpdatedDate) ✨ NEW
```

---

## 📋 API ENDPOINTS SUMMARY

### 👤 USER API - `/api/users`
- GET    `/api/users` - Get all users
- GET    `/api/users/:id` - Get user by ID
- POST   `/api/users` - Create user
- PUT    `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user
- GET    `/api/users/search?q=keyword` - Search users
- GET    `/api/users/statistics` - Get statistics

### 🎬 VIDEO API - `/api/videos`
- GET    `/api/videos` - Get all videos
- GET    `/api/videos/:id` - Get video by ID
- POST   `/api/videos` - Create video
- PUT    `/api/videos/:id` - Update video
- DELETE `/api/videos/:id` - Delete video
- GET    `/api/videos/search?q=keyword` - Search videos
- GET    `/api/videos/statistics` - Get statistics
- GET    `/api/videos/user/:userId` - Get videos by user

### ❤️ FAVORITE API - `/api/favorites`
- GET    `/api/favorites` - Get user's favorites (Auth required)
- POST   `/api/favorites` - Add to favorites (Auth required)
- DELETE `/api/favorites/:videoId` - Remove from favorites (Auth required)
- GET    `/api/favorites/check/:videoId` - Check if favorited (Auth required)

### 📤 SHARE API - `/api/shares`
- GET    `/api/shares` - Get user's shares (Auth required)
- POST   `/api/shares` - Share video (Auth required)
- GET    `/api/shares/video/:videoId` - Get shares for video
- DELETE `/api/shares/:id` - Delete share (Auth required)

### 💬 COMMENT API - `/api/comments` ✨ NEW
- GET    `/api/comments/video/:videoId` - Get comments for video
- POST   `/api/comments` - Create comment (Auth required)
- PUT    `/api/comments/:id` - Update comment (Auth required)
- DELETE `/api/comments/:id` - Delete comment (Auth required)
- GET    `/api/comments/user/:userId` - Get user's comments

### 🔑 AUTH API - `/api/auth`
- POST   `/api/auth/login` - Login
- POST   `/api/auth/register` - Register
- POST   `/api/auth/logout` - Logout (Auth required)
- GET    `/api/auth/me` - Get current user (Auth required)
- PUT    `/api/auth/change-password` - Change password (Auth required)

---

## 📝 DETAILED API DOCUMENTATION

### 👤 USER API

#### 1. Get All Users
```http
GET /api/users
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user001",
      "fullname": "John Doe",
      "email": "john@example.com",
      "admin": false,
      "createdDate": "2024-01-01T10:00:00",
      "updatedDate": null
    }
  ],
  "total": 1
}
```

#### 2. Create User
```http
POST /api/users
```
**Request Body:**
```json
{
  "id": "user004",
  "password": "password123",
  "email": "newuser@example.com",
  "fullname": "New User",
  "admin": false
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user004",
    "fullname": "New User",
    "email": "newuser@example.com",
    "admin": false,
    "createdDate": "2025-01-20T10:00:00"
  },
  "message": "User created successfully"
}
```

#### 3. Update User
```http
PUT /api/users/:id
```
**Request Body:**
```json
{
  "fullname": "Updated Name",
  "email": "updated@example.com"
}
```

#### 4. Delete User
```http
DELETE /api/users/:id
```
**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 🎬 VIDEO API

#### 1. Get All Videos
```http
GET /api/videos
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "vid001",
      "title": "Introduction to Java",
      "poster": "poster1.jpg",
      "views": 150,
      "description": "Learn Java basics",
      "active": true,
      "userId": "user001",
      "createdDate": "2024-01-01T10:00:00"
    }
  ],
  "total": 1
}
```

#### 2. Create Video
```http
POST /api/videos
```
**Request Body:**
```json
{
  "id": "vid006",
  "title": "New Video Title",
  "poster": "poster6.jpg",
  "description": "Video description",
  "active": true,
  "userId": "user001"
}
```

#### 3. Get Videos by User
```http
GET /api/videos/user/:userId
```

---

### ❤️ FAVORITE API

#### 1. Get User's Favorites
```http
GET /api/favorites
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": "user001",
      "videoId": "vid001",
      "likeDate": "2024-01-15T10:00:00",
      "video": {
        "id": "vid001",
        "title": "Introduction to Java",
        "poster": "poster1.jpg"
      }
    }
  ],
  "total": 1
}
```

#### 2. Add to Favorites
```http
POST /api/favorites
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "videoId": "vid001"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

#### 3. Remove from Favorites
```http
DELETE /api/favorites/:videoId
Authorization: Bearer <token>
```

---

### 📤 SHARE API

#### 1. Share Video
```http
POST /api/shares
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "videoId": "vid001",
  "emails": "friend1@example.com;friend2@example.com"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": "user001",
    "videoId": "vid001",
    "emails": "friend1@example.com;friend2@example.com",
    "shareDate": "2025-01-20T10:00:00"
  },
  "message": "Video shared successfully"
}
```

#### 2. Get User's Shares
```http
GET /api/shares
Authorization: Bearer <token>
```

#### 3. Get Shares for Video
```http
GET /api/shares/video/:videoId
```

---

### 💬 COMMENT API ✨ NEW

#### 1. Get Comments for Video
```http
GET /api/comments/video/:videoId
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": "user001",
      "videoId": "vid001",
      "content": "Great tutorial!",
      "createdDate": "2024-01-15T10:00:00",
      "updatedDate": null,
      "user": {
        "id": "user001",
        "fullname": "John Doe"
      }
    }
  ],
  "total": 1
}
```

#### 2. Create Comment
```http
POST /api/comments
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "videoId": "vid001",
  "content": "Great tutorial! Very helpful."
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "userId": "user001",
    "videoId": "vid001",
    "content": "Great tutorial! Very helpful.",
    "createdDate": "2025-01-20T10:00:00"
  },
  "message": "Comment created successfully"
}
```

#### 3. Update Comment
```http
PUT /api/comments/:id
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "content": "Updated comment text"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "content": "Updated comment text",
    "updatedDate": "2025-01-20T11:00:00"
  },
  "message": "Comment updated successfully"
}
```

#### 4. Delete Comment
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

#### 5. Get User's Comments
```http
GET /api/comments/user/:userId
```

---

### 🔑 AUTH API

#### 1. Login
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "id": "user001",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user001",
      "fullname": "John Doe",
      "email": "john@example.com",
      "admin": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### 2. Register
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "id": "user004",
  "password": "password123",
  "email": "newuser@example.com",
  "fullname": "New User"
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 4. Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## ✅ TESTING CHECKLIST

### User API
- [ ] GET /api/users
- [ ] GET /api/users/:id
- [ ] POST /api/users
- [ ] PUT /api/users/:id
- [ ] DELETE /api/users/:id
- [ ] GET /api/users/search?q=xxx
- [ ] GET /api/users/statistics

### Video API
- [ ] GET /api/videos
- [ ] GET /api/videos/:id
- [ ] POST /api/videos
- [ ] PUT /api/videos/:id
- [ ] DELETE /api/videos/:id
- [ ] GET /api/videos/search?q=xxx
- [ ] GET /api/videos/user/:userId
- [ ] GET /api/videos/statistics

### Favorite API
- [ ] GET /api/favorites
- [ ] POST /api/favorites
- [ ] DELETE /api/favorites/:videoId
- [ ] GET /api/favorites/check/:videoId

### Share API
- [ ] GET /api/shares
- [ ] POST /api/shares
- [ ] GET /api/shares/video/:videoId
- [ ] DELETE /api/shares/:id

### Comment API ✨ NEW
- [ ] GET /api/comments/video/:videoId
- [ ] POST /api/comments
- [ ] PUT /api/comments/:id
- [ ] DELETE /api/comments/:id
- [ ] GET /api/comments/user/:userId

### Auth API
- [ ] POST /api/auth/login
- [ ] POST /api/auth/register
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me
- [ ] PUT /api/auth/change-password

---

**🎉 Document hoàn chỉnh! Sẵn sàng cho Backend implementation!**
