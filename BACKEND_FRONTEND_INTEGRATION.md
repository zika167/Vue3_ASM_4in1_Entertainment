# 🔗 Backend ↔ Frontend Integration Guide

**Date:** 2025-12-03  
**Frontend:** Vue 3 (D:\VueJS\ASM_VUE)  
**Backend:** Jakarta Servlet + Hibernate (D:\Java4\ASM_JAVA4\Java4_JPA_ASM)  
**Status:** Ready to connect!

---

## 📚 Overview

Bạn có **2 projects riêng biệt**:

```
Frontend (Vue.js)                    Backend (Java)
├── AuthModal.vue                    ├── AuthAPI.java
├── src/services/                    ├── UserAPI.java
│   ├── JavaAuthService.js           ├── VideoAPI.java
│   └── factories/AuthService.js     ├── Controllers...
└── .env                             ├── Entities
                                     ├── Services
                                     └── Database
```

Chúng giao tiếp qua **HTTP API** (REST):

```
Frontend                            Backend
  ↓                                   ↑↓
[AuthModal.vue]                   [AuthAPI.java]
  ↓                                   ↑↓
[AuthService.login()]             [@WebServlet("/api/auth/*")]
  ↓                                   ↑↓
[Axios POST]                      [doPost() method]
  ↓                                   ↑↓
http://localhost:8080/api/auth/login  [DB query]
  ↓                                   ↑↓
{user, token} response ←←←← [return JSON]
```

---

## 🎯 What You Need to Do

### **Step 1: Setup Backend** (15-30 min)

See: `BACKEND_SETUP_CHECKLIST.md`

**Includes:**
- [ ] Start MariaDB (Docker or manual)
- [ ] Build backend with Maven
- [ ] Run backend on localhost:8080
- [ ] Verify API responds

### **Step 2: Setup Frontend** (Already done!)

**Already configured:**
- ✅ `src/services/JavaAuthService.js` created
- ✅ `AuthService factory` created
- ✅ `AuthModal.vue` updated to use real API
- ✅ `.env` configured to use localhost:8080

### **Step 3: Test Integration** (5-10 min)

**Manual Test:**
1. Start frontend: `npm run dev`
2. Click Login
3. Enter credentials
4. Verify success

---

## 📋 Complete Setup Flow

```
┌─────────────────────────────────────────────────────┐
│  1. SETUP DATABASE (MariaDB)                        │
│  cd backend folder                                  │
│  docker-compose up -d                              │
│  OR manual setup                                    │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│  2. BUILD BACKEND (Maven)                           │
│  cd backend folder                                  │
│  mvn clean package                                  │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│  3. RUN BACKEND (Tomcat)                            │
│  mvn tomcat7:run                                    │
│  OR run in IDE                                      │
│  PORT: localhost:8080                              │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│  4. VERIFY BACKEND                                  │
│  http://localhost:8080/api/users                    │
│  Should see: JSON response ✅                        │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│  5. START FRONTEND                                  │
│  cd frontend folder                                │
│  npm run dev                                        │
│  PORT: localhost:5173                              │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│  6. TEST LOGIN                                      │
│  Click Login → Enter credentials → Submit           │
│  Expected: Success message ✅                        │
└─────────────────────────────────────────────────────┘
```

---

## 🔌 Connection Points

### Frontend → Backend Mapping

| Frontend | Backend |
|----------|---------|
| `AuthModal.vue` | `/api/auth/login` (POST) |
| `AuthModal.vue` | `/api/auth/register` (POST) |
| `AccountPage.vue` | `/api/auth/logout` (POST) |
| `AdminDashboard.vue` | `/api/users` (GET) |
| `UserManagement.vue` | `/api/users/*` (GET/POST/PUT/DELETE) |
| `VideoManagement.vue` | `/api/videos/*` (GET/POST/PUT/DELETE) |

### API Response Format

**All endpoints return:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

**Frontend already handles this format! ✅** (See: `src/services/JavaAuthService.js`)

---

## 🧪 Testing Points

### Test 1: Backend Alone
```bash
# Test API directly (no frontend)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"user001","password":"password123"}'

# Should return: { success: true, data: {user, token} }
```

### Test 2: Database Connection
```bash
# Check if user exists
mysql -h 127.0.0.1 -P 3309 -u root -p java4_db_asm
> SELECT * FROM User WHERE id='user001';

# If empty, insert:
> INSERT INTO User VALUES ('user001', 'password123', 'user@example.com', 'Test', false, NOW(), NULL);
```

### Test 3: Frontend + Backend Integration
```bash
# 1. Frontend running: npm run dev
# 2. Backend running: mvn tomcat7:run
# 3. Open: http://localhost:5173
# 4. Click Login
# 5. Enter: user001 / password123
# 6. Should succeed ✅
```

### Test 4: DevTools Console
```javascript
// F12 → Console
localStorage.getItem('authToken')  // Should have JWT token
localStorage.getItem('user')       // Should have user object
```

---

## 🛠️ Configuration Files

### Frontend `.env`
```env
# D:\VueJS\ASM_VUE\.env
VITE_SERVICE_MODE=java
VITE_API_BASE_URL=http://localhost:8080/api
```

✅ **Already correct! No changes needed.**

### Backend `HibernateUtil.java`
```java
// D:\Java4\ASM_JAVA4\Java4_JPA_ASM\src\main\java\com\fpt\java4_asm\config\HibernateUtil.java
// Should be configured for: jdbc:mariadb://localhost:3309/java4_db_asm
```

**Check:** If backend can't connect to DB, verify this file!

---

## 🐛 Common Issues & Solutions

### Issue 1: "No response from server"
- ❌ Backend not running
- ✅ Solution: Start backend with `mvn tomcat7:run`

### Issue 2: "Connection refused"
- ❌ Port 8080 occupied or not listening
- ✅ Solution: Check if backend started, verify port

### Issue 3: "User not found" on login
- ❌ Database empty or wrong credentials
- ✅ Solution: Insert test user in DB

### Issue 4: CORS error
- ❌ Cross-origin request blocked
- ✅ Solution: Backend has CORS filter, should work automatically

### Issue 5: "Database connection failed"
- ❌ MariaDB not running
- ✅ Solution: Start Docker container or MariaDB service

---

## 📊 Project Structure Summary

```
D:\Java4\ASM_JAVA4\Java4_JPA_ASM/
├── src/main/java/com/fpt/java4_asm/
│   ├── controllers/api/
│   │   ├── AuthAPI.java            ← POST /api/auth/login
│   │   ├── UserAPI.java            ← GET/POST /api/users
│   │   ├── VideoAPI.java           ← GET/POST /api/videos
│   │   └── ...
│   ├── services/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   └── ...
│   ├── models/entities/
│   │   ├── User.java
│   │   ├── Video.java
│   │   └── ...
│   ├── repositories/
│   │   ├── UserRepo.java
│   │   ├── VideoRepo.java
│   │   └── ...
│   └── config/
│       └── HibernateUtil.java      ← DB config
├── pom.xml                          ← Maven dependencies
├── docker-compose.yml               ← MariaDB setup
└── .docker/
    └── initdb.d/
        └── schema.sql               ← DB schema

D:\VueJS\ASM_VUE/
├── src/
│   ├── services/
│   │   ├── JavaAuthService.js       ← ✅ Created
│   │   └── factories/
│   │       └── AuthService.js       ← ✅ Created
│   ├── components/modals/
│   │   └── AuthModal.vue            ← ✅ Modified (uses API)
│   └── ...
├── .env                             ← ✅ Configured
└── ...
```

---

## ✅ Pre-Launch Checklist

### Database
- [ ] MariaDB running
- [ ] Database `java4_db_asm` created
- [ ] Tables exist
- [ ] Test user inserted (user001)

### Backend
- [ ] Java 21 installed
- [ ] Maven installed
- [ ] Backend built successfully
- [ ] Backend running on port 8080
- [ ] Can access: http://localhost:8080/api/users

### Frontend
- [ ] Node.js + npm installed
- [ ] Dependencies installed
- [ ] `.env` correct
- [ ] Dev server ready to start on 5173

### Integration
- [ ] No network blocks between frontend/backend
- [ ] CORS should work (backend has filter)
- [ ] Both can communicate

---

## 🚀 Launch Sequence

```bash
# Terminal 1: Database (if using Docker)
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM
docker-compose up -d

# Terminal 2: Backend
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM
mvn tomcat7:run
# Wait for: "Tomcat started on port 8080"

# Terminal 3: Frontend
cd D:\VueJS\ASM_VUE
npm run dev
# Wait for: "VITE v7.2.4 ready in..."

# Browser
http://localhost:5173
```

---

## 📞 Next Steps

After integration works:

1. ✅ Test all auth flows (login, register)
2. ✅ Test other API endpoints (users, videos)
3. ✅ Test admin pages
4. ✅ Test error handling
5. ✅ Final verification

---

## 🎉 Success Indicators

You'll know it works when:

✅ Backend API returns data  
✅ Frontend can login with real credentials  
✅ Token saved to localStorage  
✅ User redirects after login  
✅ No console errors  
✅ Network requests show 200 status  
✅ All fields validated properly  

---

**Status: 🎯 Ready to Launch!**

**Next Action:** Follow `BACKEND_SETUP_CHECKLIST.md` to setup backend, then test! 🚀
