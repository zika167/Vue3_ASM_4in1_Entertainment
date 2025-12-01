# 📡 BACKEND API SPECIFICATION

**Tài liệu này mô tả chi tiết các API endpoints cần implement ở Backend**

---

## 🔐 AUTHENTICATION

### Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 👤 USER API

### Base URL: `/api/users`

---

### 1. Get All Users

```http
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "fullname": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "avatar": "https://via.placeholder.com/150",
      "isActive": true,
      "createdAt": "2024-01-01",
      "lastLogin": "2025-01-20T10:30:00"
    }
  ],
  "total": 1
}
```

---

### 2. Get User by ID

```http
GET /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "fullname": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "avatar": "https://via.placeholder.com/150",
    "isActive": true,
    "createdAt": "2024-01-01",
    "lastLogin": "2025-01-20T10:30:00"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 3. Create User

```http
POST /api/users
```

**Request Body:**
```json
{
  "username": "newuser",
  "fullname": "New User",
  "email": "newuser@example.com",
  "role": "user",
  "avatar": "https://via.placeholder.com/150"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "username": "newuser",
    "fullname": "New User",
    "email": "newuser@example.com",
    "role": "user",
    "avatar": "https://via.placeholder.com/150",
    "isActive": true,
    "createdAt": "2025-01-20"
  },
  "message": "User created successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Username already exists"
}
```

---

### 4. Update User

```http
PUT /api/users/:id
```

**Request Body:**
```json
{
  "fullname": "Updated Name",
  "email": "updated@example.com",
  "role": "admin",
  "avatar": "https://new-avatar.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "fullname": "Updated Name",
    "email": "updated@example.com",
    "role": "admin",
    "avatar": "https://new-avatar.com/image.jpg",
    "isActive": true,
    "createdAt": "2024-01-01"
  },
  "message": "User updated successfully"
}
```

---

### 5. Delete User

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

**Error Response (400):**
```json
{
  "success": false,
  "error": "Cannot delete admin user"
}
```

---

### 6. Toggle User Status

```http
PATCH /api/users/:id/toggle-status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "isActive": false
  },
  "message": "User deactivated successfully"
}
```

---

### 7. Search Users

```http
GET /api/users/search?q=keyword
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| q | string | Search keyword (username, fullname, email) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "fullname": "Admin User",
      "email": "admin@example.com"
    }
  ],
  "total": 1
}
```

---

### 8. Get Users by Role

```http
GET /api/users/by-role?role=admin
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| role | string | "admin" or "user" |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  ],
  "total": 1
}
```

---

### 9. Get User Statistics

```http
GET /api/users/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "activeUsers": 85,
    "inactiveUsers": 15,
    "adminUsers": 5,
    "regularUsers": 95
  }
}
```

---

## 🎬 VIDEO API

### Base URL: `/api/videos`

---

### 1. Get All Videos

```http
GET /api/videos
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Hướng dẫn lập trình Java Spring Boot",
      "thumbnail": "https://i.ytimg.com/vi/xxx/mqdefault.jpg",
      "duration": "12:34",
      "channelName": "Code Academy VN",
      "channelAvatar": "https://yt3.googleusercontent.com/xxx",
      "views": "1.2M",
      "uploadTime": "2 ngày trước",
      "description": "Khóa học Java Spring Boot...",
      "likes": 15000,
      "isLiked": false,
      "isFavorite": false
    }
  ],
  "total": 1
}
```

---

### 2. Get Video by ID

```http
GET /api/videos/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Hướng dẫn lập trình Java Spring Boot",
    "thumbnail": "https://i.ytimg.com/vi/xxx/mqdefault.jpg",
    "videoUrl": "https://youtube.com/watch?v=xxx",
    "duration": "12:34",
    "channelName": "Code Academy VN",
    "channelAvatar": "https://yt3.googleusercontent.com/xxx",
    "views": "1.2M",
    "uploadTime": "2 ngày trước",
    "description": "Khóa học Java Spring Boot...",
    "likes": 15000,
    "isLiked": false,
    "isFavorite": false
  }
}
```

---

### 3. Create Video

```http
POST /api/videos
```

**Request Body:**
```json
{
  "title": "New Video Title",
  "thumbnail": "https://i.ytimg.com/vi/xxx/mqdefault.jpg",
  "videoUrl": "https://youtube.com/watch?v=xxx",
  "duration": "10:00",
  "channelName": "My Channel",
  "description": "Video description..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 7,
    "title": "New Video Title",
    "thumbnail": "https://i.ytimg.com/vi/xxx/mqdefault.jpg",
    "duration": "10:00",
    "channelName": "My Channel",
    "views": "0",
    "likes": 0
  },
  "message": "Video created successfully"
}
```

---

### 4. Update Video

```http
PUT /api/videos/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated description"
  },
  "message": "Video updated successfully"
}
```

---

### 5. Delete Video

```http
DELETE /api/videos/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

### 6. Search Videos

```http
GET /api/videos/search?q=keyword
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Java Tutorial",
      "channelName": "Code Academy"
    }
  ],
  "total": 1
}
```

---

### 7. Get Favorite Videos (User-specific)

```http
GET /api/videos/favorites
```

**Headers:** Requires Authentication

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Favorite Video",
      "isFavorite": true
    }
  ],
  "total": 1
}
```

---

### 8. Toggle Favorite

```http
POST /api/videos/:id/favorite
```

**Headers:** Requires Authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "isFavorite": true
  },
  "message": "Đã thêm vào yêu thích"
}
```

---

### 9. Toggle Like

```http
POST /api/videos/:id/like
```

**Headers:** Requires Authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "isLiked": true,
    "likes": 15001
  }
}
```

---

### 10. Get Video Statistics

```http
GET /api/videos/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVideos": 100,
    "totalViews": "12.5M",
    "totalLikes": 150000,
    "favoriteCount": 50
  }
}
```

---

## 🔑 AUTH API

### Base URL: `/api/auth`

---

### 1. Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "fullname": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "avatar": "https://via.placeholder.com/150"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

### 2. Register

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "newuser",
  "fullname": "New User",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 6,
      "username": "newuser",
      "fullname": "New User",
      "email": "newuser@example.com",
      "role": "user"
    }
  },
  "message": "Registration successful"
}
```

---

### 3. Logout

```http
POST /api/auth/logout
```

**Headers:** Requires Authentication

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 4. Get Current User

```http
GET /api/auth/me
```

**Headers:** Requires Authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "fullname": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "avatar": "https://via.placeholder.com/150"
  }
}
```

---

### 5. Change Password

```http
PUT /api/auth/change-password
```

**Headers:** Requires Authentication

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 📊 DATA MODELS

### User Model

```typescript
interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  isActive: boolean;
  createdAt: string;      // ISO date string
  lastLogin?: string;     // ISO datetime string
}
```

### Video Model

```typescript
interface Video {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl?: string;
  duration: string;       // "12:34" format
  channelName: string;
  channelAvatar: string;
  views: string;          // "1.2M" format
  uploadTime: string;     // "2 ngày trước" format
  description: string;
  likes: number;
  isLiked: boolean;       // User-specific
  isFavorite: boolean;    // User-specific
}
```

### Statistics Models

```typescript
interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  regularUsers: number;
}

interface VideoStatistics {
  totalVideos: number;
  totalViews: string;
  totalLikes: number;
  favoriteCount: number;
}
```

---

## ⚙️ SPRING BOOT IMPLEMENTATION EXAMPLE

### Controller Example

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(
            ApiResponse.success(users, users.size())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(user -> ResponseEntity.ok(ApiResponse.success(user)))
            .orElse(ResponseEntity.status(404)
                .body(ApiResponse.error("User not found")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User user) {
        try {
            User created = userService.create(user);
            return ResponseEntity.status(201)
                .body(ApiResponse.success(created, "User created successfully"));
        } catch (DuplicateException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ... other endpoints
}
```

### ApiResponse Class

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String error;
    private Integer total;

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(data);
        return response;
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> response = success(data);
        response.setMessage(message);
        return response;
    }

    public static <T> ApiResponse<T> success(List<T> data, int total) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData((T) data);
        response.setTotal(total);
        return response;
    }

    public static <T> ApiResponse<T> error(String error) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setError(error);
        return response;
    }
}
```

### CORS Configuration

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

---

## ✅ TESTING CHECKLIST

### User API
- [ ] GET /api/users - List all users
- [ ] GET /api/users/:id - Get single user
- [ ] POST /api/users - Create user
- [ ] PUT /api/users/:id - Update user
- [ ] DELETE /api/users/:id - Delete user
- [ ] PATCH /api/users/:id/toggle-status - Toggle status
- [ ] GET /api/users/search?q=xxx - Search users
- [ ] GET /api/users/by-role?role=admin - Filter by role
- [ ] GET /api/users/statistics - Get statistics

### Video API
- [ ] GET /api/videos - List all videos
- [ ] GET /api/videos/:id - Get single video
- [ ] POST /api/videos - Create video
- [ ] PUT /api/videos/:id - Update video
- [ ] DELETE /api/videos/:id - Delete video
- [ ] GET /api/videos/search?q=xxx - Search videos
- [ ] GET /api/videos/favorites - Get favorites
- [ ] POST /api/videos/:id/favorite - Toggle favorite
- [ ] POST /api/videos/:id/like - Toggle like
- [ ] GET /api/videos/statistics - Get statistics

### Auth API
- [ ] POST /api/auth/login - Login
- [ ] POST /api/auth/register - Register
- [ ] POST /api/auth/logout - Logout
- [ ] GET /api/auth/me - Get current user
- [ ] PUT /api/auth/change-password - Change password

---

**Cập nhật lần cuối:** 01/12/2025
