# 🧪 TEST AUTHMODAL - API Integration

## ✅ Pre-requisites
- [ ] Backend Java Spring Boot đang chạy trên `http://localhost:8080`
- [ ] Frontend Vue dev server chạy trên `http://localhost:5173`
- [ ] Database (MariaDB) đã setup và có dữ liệu

## 🔍 Test Steps

### 1. **Test Login với Account Hợp Lệ**

**Setup:**
1. Mở browser → `http://localho st:5173`
2. Click nút Login hoặc biểu tượng user trên navbar
3. AuthModal sẽ hiển thị

**Test Case 1: Login Thành Công**
```
Input:
- Username: user001 (hoặc ID user tồn tại trong DB)
- Password: password123 (password đúng)

Expected:
✅ Loading overlay xuất hiện "Đăng nhập..."
✅ Thông báo success: "Chào mừng [User Full Name]!"
✅ Modal đóng tự động
✅ User được redirect:
   - Nếu admin=true → /admin (AdminDashboard)
   - Nếu admin=false → /favorites (FavoritesPage)
✅ localStorage có:
   - "user": { id, username, fullname, email, admin }
   - "authToken": JWT token từ backend
✅ Navbar cập nhật hiển thị user info
```

**Check Console (F12):**
```javascript
// Mở DevTools → Console
localStorage.getItem('user')        // Hiển thị user object
localStorage.getItem('authToken')   // Hiển thị token
```

---

### 2. **Test Login với Credentials Sai**

**Test Case 2: Wrong Password**
```
Input:
- Username: user001
- Password: wrongpassword

Expected:
❌ Thông báo error: "Tên đăng nhập hoặc mật khẩu không đúng!"
❌ Modal vẫn mở
❌ User KHÔNG được redirect
❌ localStorage vẫn trống
```

**Test Case 3: User Không Tồn Tại**
```
Input:
- Username: nonexistent_user
- Password: anypassword

Expected:
❌ Thông báo error: "Tên đăng nhập hoặc mật khẩu không đúng!"
❌ Modal vẫn mở
```

---

### 3. **Test Register (Tạo Tài Khoản Mới)**

**Test Case 4: Register Thành Công**
```
Click tab "Đăng ký"

Input:
- Username: newuser123
- Full Name: New User
- Email: newuser@example.com
- Password: Password@123
- Confirm Password: Password@123
- ☑️ Agree Terms

Expected:
✅ Loading overlay: "Đăng ký..."
✅ Thông báo success: "Đăng ký thành công! Vui lòng đăng nhập."
✅ Tự động chuyển sang tab "Đăng nhập"
✅ Username được pre-fill: "newuser123"
✅ Form register reset
✅ Backend tạo user mới trong DB
```

**Verify trong Database:**
```sql
SELECT * FROM User WHERE Id = 'newuser123';
-- Kết quả: 1 row với email newuser@example.com
```

**Test Case 5: Register với Email Tồn Tại**
```
Input:
- Username: newuser456
- Email: user001@example.com (email đã tồn tại)
- Password: Password@123
- ...

Expected:
❌ Thông báo error từ backend
❌ Form vẫn mở
```

---

### 4. **Test Validation Real-time**

**Test Case 6: Username Validation**
```
Input:
- Username: ab (quá ngắn, phải tối thiểu 3 ký tự)

Expected:
🔴 Error: "Tên đăng nhập phải có ít nhất 3 ký tự"
🔴 Input có border đỏ
🔴 Button disabled
```

**Test Case 7: Password Validation**
```
Input:
- Password: 12345 (quá ngắn, phải tối thiểu 6 ký tự)

Expected:
🔴 Error: "Mật khẩu phải có ít nhất 6 ký tự"
🔴 Password strength bar hiển thị "Rất yếu" (đỏ)
```

**Test Case 8: Confirm Password Không Khớp**
```
Input:
- Password: Password@123
- Confirm: Password@124 (không khớp)

Expected:
🔴 Error: "Mật khẩu xác nhận không khớp"
🔴 Button disabled
```

---

### 5. **Test Password Strength Indicator (Register)**

```
Input Password: 
- "123456"          → Yếu (chỉ số)
- "Abc123"          → Tốt (hoa, thường, số)
- "Abc@123!xyz"     → Xuất sắc (hoa, thường, số, kí tự đặc biệt)

Expected:
✅ Progress bar tăng độ dài
✅ Màu sắc thay đổi: đỏ → cam → vàng → xanh → xanh đậm
```

---

### 6. **Test Modal Interactions**

**Test Case 9: Toggle Password Visibility**
```
Input:
- Click eye icon bên password field

Expected:
✅ Password type thay đổi: password → text
✅ Eye icon thay đổi: 👁️ → 👁️‍🗨️
```

**Test Case 10: Switch Between Login/Register**
```
Click tab "Đăng ký" → Điền form → Click tab "Đăng nhập" → Click tab "Đăng ký"

Expected:
✅ Data không bị mất
✅ Errors không bị mất
✅ Transition smooth
```

**Test Case 11: Close Modal**
```
Click button X hoặc click outside modal

Expected:
✅ Modal đóng
✅ Form data được giữ (nếu click X)
❌ Form data reset nếu cần
```

---

### 7. **Test Token & Auth State**

**Test Case 12: Token trong API Request**
```
Steps:
1. Login thành công
2. Mở DevTools → Network tab
3. Làm action cần auth (click Favorites, etc)

Expected:
✅ API requests có header:
   Authorization: Bearer <token>
✅ Backend nhận token và xác thực thành công
```

**Test Case 13: Token Expired (401 Response)**
```
Setup:
1. Login thành công
2. Xóa authToken từ localStorage: localStorage.removeItem('authToken')
3. Làm action cần auth

Expected:
❌ API trả về 401 Unauthorized
❌ Interceptor xóa user data
❌ User được redirect về Home
❌ Auth modal hiển thị
```

---

## 🔧 Debug Checklist

**Console (F12):**
```javascript
// Kiểm tra service mode
import.meta.env.VITE_SERVICE_MODE  // Should be 'java'

// Kiểm tra API URL
import.meta.env.VITE_API_BASE_URL   // Should be 'http://localhost:8080/api'

// Kiểm tra AuthService
import AuthService from '@/services/factories/AuthService'
console.log(AuthService)  // Should show methods

// Manual test API
const result = await AuthService.login('user001', 'password123')
console.log(result)  // { success: true, data: { user, token } }
```

**Network Tab (F12 → Network):**
- Kiểm tra request: `POST /api/auth/login`
- Kiểm tra response status: `200 OK` hoặc `400/401/403`
- Kiểm tra response body: `{ success, data, message }`
- Kiểm tra request headers: có `Authorization: Bearer ...` không

**Application Tab (F12 → Application):**
- Storage → LocalStorage → `http://localhost:5173`
- Kiểm tra keys: `user`, `authToken`

---

## 📋 Test Execution Checklist

### Backend Status
- [ ] Backend Java chạy trên localhost:8080
- [ ] Database connected
- [ ] API endpoints hoạt động

### Frontend Status
- [ ] Dev server chạy trên localhost:5173
- [ ] AuthModal component load đúng
- [ ] No console errors

### Authentication Tests
- [ ] ✅ Test Case 1: Login Thành Công
- [ ] ✅ Test Case 2: Wrong Password
- [ ] ✅ Test Case 3: User Không Tồn Tại
- [ ] ✅ Test Case 4: Register Thành Công
- [ ] ✅ Test Case 5: Register Email Tồn Tại

### Validation Tests
- [ ] ✅ Test Case 6: Username < 3 chars
- [ ] ✅ Test Case 7: Password < 6 chars
- [ ] ✅ Test Case 8: Confirm Password Mismatch
- [ ] ✅ Test Case 9: Toggle Password Visibility

### Advanced Tests
- [ ] ✅ Test Case 10: Switch Tabs
- [ ] ✅ Test Case 11: Close Modal
- [ ] ✅ Test Case 12: Token in Headers
- [ ] ✅ Test Case 13: 401 Response Handling

---

## 📊 Expected API Responses

### Login Success (200 OK)
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

### Login Failed (400/401)
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### Register Success (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "newuser123",
    "fullname": "New User",
    "email": "newuser@example.com",
    "admin": false
  },
  "message": "User created successfully"
}
```

---

## 🚀 Quick Start Test Commands

Nếu bạn có thể chạy từ terminal:

```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"user001","password":"password123"}'

# Test register endpoint
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"id":"testuser","fullname":"Test User","email":"test@example.com","password":"Password@123"}'
```

---

**Hãy chạy các test cases này và report kết quả! 🎯**
