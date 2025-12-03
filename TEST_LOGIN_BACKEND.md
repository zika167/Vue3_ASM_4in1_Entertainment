# 🧪 Test Login with Real Backend

**Status:** Frontend ✅ Fixed - Now matches Backend  
**Next:** Setup and test with real backend

---

## ✅ What Was Fixed

Frontend now sends correct data to Backend:

```
Before: { "id": "user001", "password": "..." } ❌
After:  { "email": "user@example.com", "password": "..." } ✅
```

---

## 🚀 Quick Test Steps

### Step 1: Prepare Backend

```bash
# Make sure backend is running
http://localhost:8080/api/users

# Should return JSON (not error)
```

### Step 2: Check Test User in Database

```bash
# Connect to database
mysql -h 127.0.0.1 -P 3309 -u root -p java4_db_asm
# Password: team3in1m@idinhSo1

# Check if user exists
SELECT id, email, password, fullname FROM User WHERE id='user001';

# If empty, INSERT TEST USER
INSERT INTO User (id, email, password, fullname, admin, createdDate, updatedDate) 
VALUES ('user001', 'user001@example.com', 'password123', 'Test User', 0, NOW(), NOW());
```

### Step 3: Test Login from Frontend

```
1. Start Frontend:
   npm run dev
   
2. Open: http://localhost:5173

3. Click Login button

4. Enter:
   Email: user001@example.com
   Password: password123

5. Click "Đăng nhập"

Expected:
✅ "Chào mừng Test User!" message
✅ Redirect to dashboard
✅ No errors
```

### Step 4: Verify in Browser Console (F12)

```javascript
// Check if token saved
localStorage.getItem('authToken')
// Should return: UUID string (not empty)

// Check user info
JSON.parse(localStorage.getItem('user'))
// Should return: { id, email, fullname, admin, createdDate }
```

---

## 🔍 If Login Fails

### Error: "Email hoặc mật khẩu không đúng"

**Check:**
1. User exists in database with exact email
2. Password matches exactly
3. Backend running on port 8080

```bash
# Verify user in DB
SELECT * FROM User WHERE email='user001@example.com';

# Or insert new test user
INSERT INTO User (id, email, password, fullname, admin, createdDate, updatedDate) 
VALUES ('testuser', 'test@example.com', 'test123', 'Test', 0, NOW(), NOW());
```

### Error: "No response from server"

**Check:**
1. Backend running: `http://localhost:8080/api/users`
2. Database connected
3. Correct port 8080

---

## 📊 Request/Response Flow

### Frontend Sends
```json
POST http://localhost:8080/api/auth/login
{
  "email": "user001@example.com",
  "password": "password123"
}
```

### Backend Returns
```json
{
  "success": true,
  "data": {
    "id": "user001",
    "email": "user001@example.com",
    "fullname": "Test User",
    "admin": false,
    "token": "a1b2c3d4-e5f6-g7h8-i9j0k1l2m3n4",
    "createdDate": "2025-01-20T10:00:00"
  },
  "message": "Đăng nhập thành công"
}
```

### Frontend Stores
```javascript
localStorage.user = {
  id: "user001",
  email: "user001@example.com",
  fullname: "Test User",
  admin: false,
  createdDate: "2025-01-20T10:00:00"
}

localStorage.authToken = "a1b2c3d4-e5f6-g7h8-i9j0k1l2m3n4"
```

---

## ✅ Checklist Before Testing

- [ ] Backend running on `http://localhost:8080`
- [ ] Database `java4_db_asm` exists
- [ ] Test user in database:
  - ID: `user001`
  - Email: `user001@example.com`
  - Password: `password123`
  - Fullname: `Test User`
- [ ] Frontend updated (email instead of username)
- [ ] Frontend dev server running on `http://localhost:5173`

---

## 🎯 Success Indicators

✅ Login form has "Email" field (not "Username")  
✅ Can enter email and password  
✅ "Đăng nhập" button works  
✅ Success message shows after login  
✅ Redirect to dashboard happens  
✅ localStorage has `authToken`  
✅ No console errors (F12)  
✅ Network tab shows 200 response from backend  

---

## 🚀 Ready to Test!

All frontend fixes complete. Now just:

1. Ensure backend + database running
2. Add test user with email
3. Test login flow
4. Verify token and redirect

**Let's go! 🎉**
