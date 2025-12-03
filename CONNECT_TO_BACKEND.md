# 🔗 Connect Frontend to Backend - Complete Guide

**Backend:** D:\Java4\ASM_JAVA4\Java4_JPA_ASM (Jakarta Servlet + Hibernate)  
**Frontend:** D:\VueJS\ASM_VUE (Vue 3 + Vite)  
**Status:** Ready to connect!

---

## 📊 Architecture

```
Frontend (Vue 3)                Backend (Jakarta Servlet)
http://localhost:5173    ←→    http://localhost:8080
  AuthModal.vue                  /api/auth/login
  src/services/...              /api/auth/register
  Gọi API                        /api/users
                                 /api/videos
                                 etc.
```

---

## 🚀 Step 1: Setup Backend

### 1.1 Install Java 21
Backend cần **Java 21** (hoặc cao hơn)

```bash
java -version
# Should output: openjdk 21.x.x or similar
```

### 1.2 Setup Database (Docker)

Backend đã cấu hình Docker. Bạn có 2 cách:

#### **Option A: Use Docker** (Recommended)
```bash
# 1. Navigate to backend folder
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM

# 2. Start MariaDB container
docker-compose up -d

# 3. Verify running
docker ps

# Expected: Container "java4_db_asm_container" running on port 3309
```

#### **Option B: Manual MariaDB Setup**
```bash
# 1. Install MariaDB locally
# 2. Create database
mysql -u root -p
> CREATE DATABASE java4_db_asm;
> CREATE USER 'java4'@'localhost' IDENTIFIED BY 'password';
> GRANT ALL PRIVILEGES ON java4_db_asm.* TO 'java4'@'localhost';
> FLUSH PRIVILEGES;

# 3. Import schema
mysql -u root -p java4_db_asm < .docker/initdb.d/schema.sql
```

**Database Connection Details:**
- Host: `localhost`
- Port: `3309` (Docker) or `3306` (Local)
- Database: `java4_db_asm`
- User: `root`
- Password: `team3in1m@idinhSo1` (from docker-compose.yml)

### 1.3 Check Hibernate Config

Backend sử dụng Hibernate. Verify file cấu hình:

```
D:\Java4\ASM_JAVA4\Java4_JPA_ASM\src\main\java\com\fpt\java4_asm\config\HibernateUtil.java
```

Nó phải kết nối đúng database.

### 1.4 Run Backend

**Option 1: IDE (IntelliJ/Eclipse)**
1. Open project: `D:\Java4\ASM_JAVA4\Java4_JPA_ASM`
2. Right-click project → Maven → Update Project
3. Run → Run on Server (Tomcat)
4. Backend should start on http://localhost:8080

**Option 2: Maven**
```bash
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM
mvn clean package
mvn tomcat7:run
```

**Option 3: Docker**
```bash
docker-compose up --build
```

### 1.5 Verify Backend Running

Test endpoint in browser:
```
http://localhost:8080/api/users
```

Expected: ✅ JSON array of users (or empty array)

If error: ❌ Backend not running or database not connected

---

## 🎯 Step 2: Configure Frontend

Frontend code là sẵn sàng. Chỉ cần verify `.env`:

```env
# D:\VueJS\ASM_VUE\.env

VITE_SERVICE_MODE=java
VITE_API_BASE_URL=http://localhost:8080/api
```

✅ Đã đúng! Không cần thay đổi (nếu backend chạy port 8080)

---

## 🧪 Step 3: Test Connection

### 3.1 Test Backend API

```bash
# Terminal
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"user001","password":"password123"}'

# Or in browser, visit:
http://localhost:8080/api/users
```

Expected Response:
```json
{
  "success": true,
  "data": [...],
  "message": "Success"
}
```

### 3.2 Test Frontend

1. Start frontend dev server:
```bash
cd D:\VueJS\ASM_VUE
npm run dev
```

2. Open: `http://localhost:5173`

3. Click Login button

4. Try login:
   - Username: `user001`
   - Password: `password123`

5. Expected: ✅ Success message + Redirect

### 3.3 Test in DevTools

F12 → Console:
```javascript
// Check if token saved
localStorage.getItem('authToken')

// Should show JWT token string (not null)
```

---

## 🔍 Troubleshooting

### Issue 1: "No response from server"

**Cause:** Backend not running

**Solution:**
```bash
# 1. Check if backend running
curl http://localhost:8080/api/users

# 2. If error, start backend:
# - In IDE: Run on Server
# - Or: mvn tomcat7:run

# 3. Wait for startup (2-3 minutes)

# 4. Try curl again
```

### Issue 2: "Network connection refused"

**Cause:** Port 8080 occupied or firewall

**Solution:**
```bash
# 1. Check if port 8080 in use
netstat -an | grep 8080

# 2. If occupied, either:
# - Stop that process
# - Configure backend to different port

# 3. Check firewall allows port 8080
```

### Issue 3: Database connection error

**Cause:** MariaDB not running or bad credentials

**Solution:**
```bash
# 1. Check Docker container running
docker ps

# If not, start it:
docker-compose up -d

# 2. Or verify manual MariaDB connection
mysql -h localhost -P 3309 -u root -p

# Enter password: team3in1m@idinhSo1
```

### Issue 4: Login returns error "User not found"

**Cause:** No user data in database

**Solution:**
```bash
# 1. Check database has users
mysql -h localhost -P 3309 -u root -p java4_db_asm
> SELECT * FROM User;

# 2. If empty, insert test user
> INSERT INTO User (id, password, email, fullname, admin) 
  VALUES ('user001', 'password123', 'user001@example.com', 'Test User', false);

# 3. Verify
> SELECT * FROM User WHERE id = 'user001';
```

---

## 📋 Backend Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | New user registration |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/validate` | GET | Validate token |
| `/api/users` | GET/POST | Get/create users |
| `/api/videos` | GET/POST | Get/create videos |
| `/api/favorites` | GET/POST | Favorites |
| `/api/shares` | GET/POST | Shares |
| `/api/comments` | GET/POST | Comments |

---

## 🔐 API Response Format

Backend returns this format for all endpoints:

```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

Or on error:
```json
{
  "success": false,
  "data": null,
  "message": "Error message"
}
```

Frontend's `JavaAuthService.js` already handles this format! ✅

---

## 📊 Full Flow

```
1. User enters credentials in AuthModal.vue
   ↓
2. Click "Đăng nhập"
   ↓
3. AuthService.login(username, password)
   ↓
4. Axios POST to http://localhost:8080/api/auth/login
   ↓
5. Backend AuthAPI processes request
   ↓
6. Database query (Hibernate)
   ↓
7. Return { user, token } or error
   ↓
8. Frontend saves to localStorage
   ↓
9. User redirected to /admin or /favorites
```

---

## ✅ Checklist

- [ ] Backend folder exists at `D:\Java4\ASM_JAVA4\Java4_JPA_ASM`
- [ ] Java 21 installed
- [ ] MariaDB running (Docker or local)
- [ ] Backend started on localhost:8080
- [ ] Test endpoint works: `http://localhost:8080/api/users`
- [ ] Frontend running on localhost:5173
- [ ] `.env` configured correctly
- [ ] Can login with test credentials
- [ ] Token saved in localStorage
- [ ] No console errors

---

## 🚀 Quick Start (5 min)

```bash
# Terminal 1: Start Database
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM
docker-compose up -d

# Terminal 2: Start Backend
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM
mvn tomcat7:run
# or run in IDE

# Terminal 3: Start Frontend
cd D:\VueJS\ASM_VUE
npm run dev

# Browser
http://localhost:5173
Click Login
Enter: user001 / password123
Expected: Success ✅
```

---

## 🎯 Next Steps

After connection works:

1. ✅ Test all login/register flows
2. ✅ Test other API endpoints (users, videos, etc.)
3. ✅ Test admin dashboard
4. ✅ Test error handling
5. ✅ Ready for final testing!

---

## 📞 Questions?

- **Backend won't start?** → Check Java version + database connection
- **Login doesn't work?** → Check database has user001
- **"No response" error?** → Verify backend running on 8080
- **Token not saving?** → Check DevTools console for errors

---

**Status: 🎉 Ready to Connect!**

Follow the steps above and you're good to go! 🚀
