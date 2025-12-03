# 🔌 HƯỚNG DẪN KẾT NỐI API VỚI BACKEND JAVA JAKARTA JPA

## 🎯 Tổng quan

Dự án Frontend Vue.js kết nối với **Backend Java Jakarta JPA** (Jakarta EE + JPA + MariaDB).

- **Backend:** Java Jakarta EE với JPA (Java Persistence API)
- **Database:** MariaDB (java4_db_asm)
- **Frontend:** Vue 3 + Vite
- **Pattern:** Factory Pattern cho Service layer
- **Authentication:** JWT Bearer Token

Tất cả API calls đều thông qua các Service files trong folder `factories/`.

---

## 📁 Cấu trúc Services (Frontend)

```
src/services/
├── apiClient.js              # Axios instance (đã config sẵn)
├── BaseJavaService.js        # Base class (đã có sẵn)
├── createServiceFactory.js   # Factory helper (đã có sẵn)
│
├── JavaUserService.js        # User API implementation
├── JavaVideoService.js       # Video API implementation
├── JavaFavoriteService.js    # Favorite API implementation
├── JavaShareService.js       # Share API implementation
├── JavaCommentService.js     # Comment API implementation
│
└── factories/                # ← IMPORT TỪ ĐÂY
    ├── UserService.js        # Factory cho User
    ├── VideoService.js       # Factory cho Video
    ├── FavoriteService.js    # Factory cho Favorite
    ├── ShareService.js       # Factory cho Share
    └── CommentService.js     # Factory cho Comment
```

## 📦 Backend Dependencies (pom.xml)

Backend Jakarta JPA cần các dependencies sau:

```xml
<dependencies>
    <!-- Jakarta EE API -->
    <dependency>
        <groupId>jakarta.platform</groupId>
        <artifactId>jakarta.jakartaee-api</artifactId>
        <version>10.0.0</version>
        <scope>provided</scope>
    </dependency>
    
    <!-- Hibernate JPA Implementation -->
    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>6.2.0.Final</version>
    </dependency>
    
    <!-- MariaDB Driver -->
    <dependency>
        <groupId>org.mariadb.jdbc</groupId>
        <artifactId>mariadb-java-client</artifactId>
        <version>3.1.4</version>
    </dependency>
    
    <!-- JWT for Authentication -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JSON Processing -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.15.2</version>
    </dependency>
</dependencies>
```

---

## ⚙️ Bước 1: Cấu hình Backend URL

### File `.env` (trong root project Frontend)

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080/api

# Service mode (java/mock/firebase)
VITE_SERVICE_MODE=java
```

**Lưu ý:**
- Thay `http://localhost:8080/api` bằng URL backend thực của bạn
- Nếu backend chạy port khác (ví dụ: 8081, 9090), thay đổi port tương ứng
- Sau khi sửa `.env`, cần **restart dev server** (Ctrl+C rồi `npm run dev`)

### Backend Jakarta JPA Configuration

Backend cần config `persistence.xml` để kết nối MariaDB:

```xml
<!-- src/main/resources/META-INF/persistence.xml -->
<persistence xmlns="https://jakarta.ee/xml/ns/persistence" version="3.0">
    <persistence-unit name="java4_db_asm">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        
        <!-- JPA Entities -->
        <class>com.yourpackage.entity.User</class>
        <class>com.yourpackage.entity.Video</class>
        <class>com.yourpackage.entity.Favorite</class>
        <class>com.yourpackage.entity.Share</class>
        <class>com.yourpackage.entity.Comment</class>
        
        <properties>
            <!-- MariaDB Connection -->
            <property name="jakarta.persistence.jdbc.driver" value="org.mariadb.jdbc.Driver"/>
            <property name="jakarta.persistence.jdbc.url" value="jdbc:mariadb://localhost:3306/java4_db_asm"/>
            <property name="jakarta.persistence.jdbc.user" value="root"/>
            <property name="jakarta.persistence.jdbc.password" value="your_password"/>
            
            <!-- Hibernate Settings -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.MariaDBDialect"/>
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/>
        </properties>
    </persistence-unit>
</persistence>
```

### MariaDB Database: java4_db_asm

Đảm bảo database đã được tạo và có các bảng:
- User
- Video
- Favorite
- Share
- Comment

Xem file `documents/database.sql` để có schema đầy đủ.

---

## 🔧 Bước 2: Hiểu cách hoạt động

### 2.1. apiClient.js - Axios Instance

File này đã được config sẵn:

```javascript
// src/services/apiClient.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Tự động thêm token vào mọi request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Xử lý response và errors
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Xử lý lỗi tự động
    return Promise.reject(error)
  }
)
```

**Bạn KHÔNG CẦN sửa file này!**

---

### 2.2. BaseJavaService.js - Base Class

Cung cấp các CRUD methods cơ bản tương thích với **Jakarta JPA backend**:

```javascript
class BaseJavaService {
  constructor(baseEndpoint) {
    this.endpoint = baseEndpoint
    this.api = apiClient
  }

  // GET /api/users hoặc /api/videos
  async getAll() {
    try {
      const response = await this.api.get(this.endpoint)
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // GET /api/users/:id
  async getById(id) {
    try {
      const response = await this.api.get(`${this.endpoint}/${id}`)
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // POST /api/users
  async create(data, successMessage = 'Created successfully') {
    try {
      const response = await this.api.post(this.endpoint, data)
      return {
        success: true,
        data: response.data || response,
        message: successMessage
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // PUT /api/users/:id
  async update(id, data, successMessage = 'Updated successfully') {
    try {
      const response = await this.api.put(`${this.endpoint}/${id}`, data)
      return {
        success: true,
        data: response.data || response,
        message: successMessage
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // DELETE /api/users/:id
  async delete(id, successMessage = 'Deleted successfully') {
    try {
      await this.api.delete(`${this.endpoint}/${id}`)
      return { success: true, message: successMessage }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // GET /api/users/search?q=keyword
  async search(keyword) {
    try {
      const response = await this.api.get(`${this.endpoint}/search`, {
        params: { q: keyword }
      })
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // GET /api/users/statistics
  async getStatistics() {
    try {
      const response = await this.api.get(`${this.endpoint}/statistics`)
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
```

**Lưu ý:** BaseJavaService đã implement đầy đủ CRUD operations tương thích với Jakarta JPA REST endpoints.

**Bạn KHÔNG CẦN sửa file này!**

---

## 📝 Bước 3: Sử dụng Service trong Component

### 3.1. Import Service

```javascript
// ✅ ĐÚNG - Import từ factories/
import UserService from '@/services/factories/UserService'
import VideoService from '@/services/factories/VideoService'

// ❌ SAI - Không import trực tiếp từ Java*Service
import JavaUserService from '@/services/JavaUserService'
```

### 3.2. Gọi API trong Component

```vue
<script setup>
import { ref, onMounted } from 'vue'
import UserService from '@/services/factories/UserService'

const users = ref([])
const loading = ref(false)

const loadUsers = async () => {
  loading.value = true
  
  try {
    const result = await UserService.getAllUsers()
    
    if (result.success) {
      users.value = result.data
      window.Toast?.success('Tải dữ liệu thành công')
    } else {
      window.Toast?.error(result.error)
    }
  } catch (error) {
    window.Toast?.error('Có lỗi xảy ra')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>
```

---

## 📡 Bước 4: Các API Methods có sẵn

### UserService

| Method | Mô tả | Params | Return |
|--------|-------|--------|--------|
| `getAllUsers()` | Lấy tất cả users | - | `{ success, data }` |
| `getUserById(id)` | Lấy user theo ID | `id: string` | `{ success, data }` |
| `createUser(data)` | Tạo user mới | `data: object` | `{ success, data }` |
| `updateUser(id, data)` | Cập nhật user | `id, data` | `{ success, data }` |
| `deleteUser(id)` | Xóa user | `id: string` | `{ success }` |
| `searchUsers(keyword)` | Tìm kiếm user | `keyword: string` | `{ success, data }` |

### VideoService

| Method | Mô tả | Params | Return |
|--------|-------|--------|--------|
| `getAllVideos()` | Lấy tất cả videos | - | `{ success, data }` |
| `getVideoById(id)` | Lấy video theo ID | `id: string` | `{ success, data }` |
| `createVideo(data)` | Tạo video mới | `data: object` | `{ success, data }` |
| `updateVideo(id, data)` | Cập nhật video | `id, data` | `{ success, data }` |
| `deleteVideo(id)` | Xóa video | `id: string` | `{ success }` |
| `getStatistics()` | Lấy thống kê | - | `{ success, data }` |

---

## 💡 Ví dụ thực tế

### Ví dụ 1: Load danh sách users

```javascript
const loadUsers = async () => {
  const result = await UserService.getAllUsers()
  
  if (result.success) {
    console.log('Users:', result.data)
    // result.data = [{ id: 'user001', fullname: 'John', ... }, ...]
  } else {
    console.error('Error:', result.error)
  }
}
```

### Ví dụ 2: Tạo user mới

```javascript
const createUser = async () => {
  const newUser = {
    username: 'newuser',
    fullname: 'New User',
    email: 'new@example.com',
    password: '123456'
  }
  
  const result = await UserService.createUser(newUser)
  
  if (result.success) {
    window.Toast?.success('Tạo user thành công!')
    console.log('Created user:', result.data)
  } else {
    window.Toast?.error(result.error)
  }
}
```

### Ví dụ 3: Cập nhật user

```javascript
const updateUser = async (userId) => {
  const updatedData = {
    fullname: 'Updated Name',
    email: 'updated@example.com'
  }
  
  const result = await UserService.updateUser(userId, updatedData)
  
  if (result.success) {
    window.Toast?.success('Cập nhật thành công!')
  } else {
    window.Toast?.error(result.error)
  }
}
```

### Ví dụ 4: Xóa user

```javascript
const deleteUser = async (userId) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return
  
  const result = await UserService.deleteUser(userId)
  
  if (result.success) {
    window.Toast?.success('Đã xóa user')
    // Reload danh sách
    await loadUsers()
  } else {
    window.Toast?.error(result.error)
  }
}
```

---

## 🔍 Bước 5: Debug khi có lỗi

### 5.1. Kiểm tra Backend có chạy không

```bash
# Test bằng curl hoặc Postman
curl http://localhost:8080/api/users
```

### 5.2. Kiểm tra Console

Mở **DevTools > Console** để xem:
- Request URL có đúng không
- Response trả về gì
- Error message

### 5.3. Kiểm tra Network Tab

Mở **DevTools > Network** để xem:
- Status code (200, 404, 500, ...)
- Request headers (có token không?)
- Response body

### 5.4. Các lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `Network Error` | Backend không chạy | Khởi động backend server (Tomcat/GlassFish) |
| `404 Not Found` | URL sai hoặc endpoint chưa deploy | Kiểm tra `.env` và backend deployment |
| `401 Unauthorized` | Thiếu token hoặc token hết hạn | Đăng nhập lại |
| `500 Internal Server Error` | Lỗi backend (JPA, SQL, logic) | Kiểm tra backend logs và database |
| `CORS Error` | Backend chưa config CORS filter | Thêm CorsFilter (xem Bước 7) |
| `Connection refused` | Backend port sai hoặc chưa start | Kiểm tra backend đang chạy port nào |
| `JPA EntityNotFoundException` | Entity không tồn tại trong DB | Kiểm tra database có data không |
| `MariaDB connection failed` | Database chưa chạy hoặc sai config | Kiểm tra MariaDB service và persistence.xml |

### 5.5. Kiểm tra Backend Jakarta đang chạy

```bash
# Kiểm tra port 8080 có đang được sử dụng không
lsof -i :8080

# Hoặc dùng curl test endpoint
curl http://localhost:8080/api/users

# Kiểm tra MariaDB
mysql -u root -p -e "SHOW DATABASES;"
```

---

## 🔐 Bước 6: Authentication

### 6.1. Login và lưu token

```javascript
const handleLogin = async (username, password) => {
  const result = await UserService.login({ username, password })
  
  if (result.success) {
    // Lưu token
    localStorage.setItem('authToken', result.data.token)
    
    // Lưu user info
    localStorage.setItem('user', JSON.stringify(result.data.user))
    
    window.Toast?.success('Đăng nhập thành công!')
  } else {
    window.Toast?.error(result.error)
  }
}
```

### 6.2. Token tự động được thêm vào headers

Nhờ `apiClient` interceptor, mọi request sau khi login sẽ tự động có:

```
Authorization: Bearer <token>
```

### 6.3. Logout

```javascript
const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  router.push('/')
}
```

### 6.4. JWT Authentication trong Jakarta Backend

Backend cần implement JWT filter:

```java
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;

@WebFilter("/api/*")
public class JwtAuthFilter implements Filter {
    
    private static final String SECRET_KEY = "your-secret-key-here";
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        
        // Skip auth for login/register endpoints
        String path = req.getRequestURI();
        if (path.contains("/auth/login") || path.contains("/auth/register")) {
            chain.doFilter(request, response);
            return;
        }
        
        // Get token from Authorization header
        String authHeader = req.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            res.setStatus(401);
            res.getWriter().write("{\"success\":false,\"error\":\"Unauthorized\"}");
            return;
        }
        
        String token = authHeader.substring(7);
        
        try {
            // Validate JWT token
            Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
            
            // Set user info in request attribute
            req.setAttribute("userId", claims.getSubject());
            
            chain.doFilter(request, response);
        } catch (Exception e) {
            res.setStatus(401);
            res.getWriter().write("{\"success\":false,\"error\":\"Invalid token\"}");
        }
    }
}
```

---

## 🌐 Bước 7: CORS Configuration (Backend Java Jakarta)

Nếu gặp lỗi CORS, backend Jakarta cần config:

### Jakarta EE - CorsFilter (Servlet Filter)

```java
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        
        // Allow Vite dev server
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "3600");
        
        // Handle preflight OPTIONS request
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        chain.doFilter(request, response);
    }
}
```

### Hoặc dùng web.xml

```xml
<filter>
    <filter-name>CorsFilter</filter-name>
    <filter-class>com.yourpackage.CorsFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>CorsFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

---

## � Bước 8ệ: Backend Jakarta JPA Structure

### JPA Entity Example (User.java)

```java
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "User")
public class User {
    @Id
    @Column(name = "Id", length = 20)
    private String id;
    
    @Column(name = "Password", nullable = false)
    private String password;
    
    @Column(name = "Email", unique = true)
    private String email;
    
    @Column(name = "Fullname")
    private String fullname;
    
    @Column(name = "Admin")
    private Boolean admin = false;
    
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;
    
    @Column(name = "UpdatedDate")
    private LocalDateTime updatedDate;
    
    // Getters and Setters
}
```

### REST Controller Example (UserController.java)

```java
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {
    
    @Inject
    private UserService userService;
    
    @GET
    public Response getAllUsers() {
        List<User> users = userService.findAll();
        return Response.ok(Map.of(
            "success", true,
            "data", users,
            "total", users.size()
        )).build();
    }
    
    @GET
    @Path("/{id}")
    public Response getUserById(@PathParam("id") String id) {
        User user = userService.findById(id);
        if (user == null) {
            return Response.status(404).entity(Map.of(
                "success", false,
                "error", "User not found"
            )).build();
        }
        return Response.ok(Map.of(
            "success", true,
            "data", user
        )).build();
    }
    
    @POST
    public Response createUser(User user) {
        User created = userService.create(user);
        return Response.status(201).entity(Map.of(
            "success", true,
            "data", created,
            "message", "User created successfully"
        )).build();
    }
}
```

### Response Format từ Backend

Backend Jakarta JPA nên trả về format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "total": 10
}
```

Hoặc khi có lỗi:

```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 📚 Tài liệu tham khảo

- `documents/3_BACKEND_API_SPEC.md` - API specification chi tiết
- `documents/5_SERVICE_ARCHITECTURE.md` - Cấu trúc services
- `documents/database.sql` - Database schema MariaDB
- Jakarta EE Documentation: https://jakarta.ee/
- JPA Specification: https://jakarta.ee/specifications/persistence/

---

## ✅ Checklist kết nối API

- [ ] Đã cấu hình `VITE_API_BASE_URL` trong `.env`
- [ ] Backend đang chạy và accessible
- [ ] Import service từ `@/services/factories/`
- [ ] Gọi API với `await ServiceName.method()`
- [ ] Kiểm tra `result.success` trước khi dùng `result.data`
- [ ] Xử lý error với `result.error`
- [ ] Hiển thị loading state khi gọi API
- [ ] Hiển thị toast notification cho user

---

**Chúc bạn kết nối API thành công! 🚀**
