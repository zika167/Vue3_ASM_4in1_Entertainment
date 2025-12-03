# 🧪 AuthModal API Integration - Test Summary

## 🎯 Overview
AuthModal.vue đã được cập nhật để gọi API thực từ backend thay vì dùng mock data.

---

## 📋 Changes Made

### ✅ Files Tạo Mới:
1. **`src/services/JavaAuthService.js`**
   - Xử lý tất cả authentication API calls
   - Methods: `login()`, `register()`, `logout()`, `changePassword()`, `getCurrentUser()`

2. **`src/services/factories/AuthService.js`**
   - Service factory theo cấu trúc project
   - Tự động select implementation dựa vào `VITE_SERVICE_MODE`

### ✅ Files Sửa:
1. **`src/components/modals/AuthModal.vue`**
   - Import `AuthService` từ factory
   - `handleLogin()`: Gọi `AuthService.login()` thay vì mock
   - `handleRegister()`: Gọi `AuthService.register()` thay vì mock
   - Cập nhật info box message
   - Xóa mock accounts object

---

## 🧪 How to Test

### Option 1: Visual Testing (UI)
1. Mở browser: `http://localhost:5173`
2. Click nút Login/Register
3. Kiểm tra các test cases từ `TEST_AUTH_API.md`

### Option 2: API Testing (Console)
1. Mở DevTools (F12) → Console
2. Copy & paste nội dung từ `BROWSER_CONSOLE_TESTS.js`
3. Gọi functions:
   ```javascript
   // Quick test
   runQuickTests()
   
   // Or individual tests
   testLoginAPI('user001', 'password123')
   testRegisterAPI()
   checkAuthState()
   ```

### Option 3: Network Testing
1. DevTools → Network tab
2. Login hoặc Register
3. Kiểm tra:
   - Request: `POST /api/auth/login` hoặc `/api/auth/register`
   - Headers: `Authorization: Bearer <token>`
   - Response: Status 200, có `data.token`

---

## ✅ Test Checklist

### Backend Prerequisites
- [ ] Java Spring Boot chạy trên `http://localhost:8080`
- [ ] MariaDB connected
- [ ] Database có user test account hoặc có thể register user mới

### Frontend Prerequisites
- [ ] Dev server chạy trên `http://localhost:5173`
- [ ] No console errors
- [ ] `.env` config: `VITE_SERVICE_MODE=java`

### Authentication Tests
- [ ] Login với credentials hợp lệ
- [ ] Login với credentials sai
- [ ] Register user mới
- [ ] Register với email duplicate
- [ ] Validation real-time hoạt động

### Token & State Tests
- [ ] Token lưu vào localStorage
- [ ] User info lưu vào localStorage
- [ ] Token được thêm vào API headers
- [ ] 401 response xử lý đúng (clear auth)
- [ ] Redirect dựa vào user.admin role

---

## 🔄 API Flow Diagram

```
┌─────────────────────────┐
│  AuthModal Component    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  handleLogin()          │
│  handleRegister()       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  AuthService Factory    │
│  (factories/AuthService)│
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  JavaAuthService        │
│  (JavaAuthService.js)   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  apiClient (Axios)      │
│  + interceptors         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Backend API            │
│  /api/auth/login        │
│  /api/auth/register     │
└─────────────────────────┘
```

---

## 📊 Expected Responses

### Login Success (200)
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

### Register Success (201)
```json
{
  "success": true,
  "data": {
    "id": "newuser123",
    "fullname": "New User",
    "email": "newuser@example.com"
  },
  "message": "User created successfully"
}
```

---

## 🐛 Troubleshooting

### Issue 1: "Network Request Failed"
**Possible Causes:**
- Backend không chạy
- API URL sai (check `.env`)
- CORS issue

**Solution:**
```javascript
// Check API URL
import.meta.env.VITE_API_BASE_URL
// Should output: http://localhost:8080/api

// Check backend
curl http://localhost:8080/api/users
```

### Issue 2: "Invalid Token" hoặc "401 Unauthorized"
**Possible Causes:**
- Token expired
- Token format sai
- Backend JWT secret khác

**Solution:**
```javascript
// Clear auth and re-login
localStorage.clear()
// Then login again
```

### Issue 3: Login Thành Công nhưng Không Redirect
**Possible Causes:**
- user.admin field bị null hoặc undefined
- Router có issue

**Solution:**
```javascript
// Check user object
const user = JSON.parse(localStorage.getItem('user'))
console.log(user)
// Ensure admin field is present
```

### Issue 4: Validation Not Working
**Possible Causes:**
- Validation class không import đúng
- Custom error messages

**Solution:**
```javascript
// Test validation
import Validation from '@/utils/validation.js'
Validation.isValidEmail('test@example.com')
```

---

## 📝 Files to Review

1. **`src/services/JavaAuthService.js`** - Auth API service
2. **`src/services/factories/AuthService.js`** - Service factory
3. **`src/components/modals/AuthModal.vue`** - Updated modal component
4. **`src/services/apiClient.js`** - Axios config
5. **`src/utils/validation.js`** - Validation utilities
6. **`.env`** - Environment variables

---

## 🎯 Next Steps After Testing

- [ ] Test AccountPage.vue (change password, update profile)
- [ ] Implement Share Module
- [ ] Implement Comment Module
- [ ] Implement Favorite Module
- [ ] End-to-end testing
- [ ] Production deployment

---

## 📞 Quick Commands

### Terminal (if you can run bash):
```bash
# Test API endpoint directly
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"user001","password":"password123"}'

# Test register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"id":"testuser","fullname":"Test","email":"test@example.com","password":"pass123"}'
```

### Browser Console:
```javascript
// Quick test
runQuickTests()

// Or step by step
testLoginAPI('user001', 'password123')
checkAuthState()
```

---

## ✨ Summary

✅ AuthModal.vue gọi API thực  
✅ Mock data đã bị xóa  
✅ Validation class được sử dụng  
✅ Token lưu vào localStorage  
✅ User redirect dựa vào role  
✅ Error handling hoàn chỉnh  

**Status: Ready for Testing! 🚀**
