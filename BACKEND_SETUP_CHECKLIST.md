# ✅ Backend Setup Checklist

**Project:** Java4_JPA_ASM  
**Location:** `D:\Java4\ASM_JAVA4\Java4_JPA_ASM`  
**Type:** Jakarta Servlet + Hibernate (NOT Spring Boot!)  

---

## 🔧 Prerequisites

- [ ] **Java 21** installed
  ```bash
  java -version
  # Should show: openjdk 21.x.x
  ```

- [ ] **Docker** installed (for MariaDB)
  ```bash
  docker --version
  ```

- [ ] **Maven** installed (for building)
  ```bash
  mvn -version
  ```

---

## 📦 Setup Database

### Option 1: Docker (Recommended)

```bash
# 1. Navigate to backend folder
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM

# 2. Start MariaDB container
docker-compose up -d

# 3. Verify it's running
docker ps
# Look for: java4_db_asm_container

# 4. Check connection
mysql -h 127.0.0.1 -P 3309 -u root -p
# Password: team3in1m@idinhSo1
```

### Option 2: Manual MariaDB

```bash
# 1. Install MariaDB
# 2. Connect and run:
mysql -u root -p
> CREATE DATABASE java4_db_asm;
> CREATE USER 'root'@'localhost' IDENTIFIED BY 'team3in1m@idinhSo1';
> GRANT ALL PRIVILEGES ON java4_db_asm.* TO 'root'@'localhost';
> FLUSH PRIVILEGES;

# 3. Import schema
mysql -u root -p java4_db_asm < .docker/initdb.d/schema.sql
```

---

## 🚀 Build Backend

```bash
# 1. Navigate to folder
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM

# 2. Clean and build
mvn clean package

# Check: Should complete without errors
# Output: BUILD SUCCESS
```

---

## 🏃 Run Backend

### Method 1: IDE (IntelliJ/Eclipse)
```
1. Open project in IDE
2. Right-click project → Run on Server (Tomcat)
3. Wait for startup (2-3 min)
4. Should see: "Tomcat started on port 8080"
```

### Method 2: Maven
```bash
cd D:\Java4\ASM_JAVA4\Java4_JPA_ASM
mvn tomcat7:run
```

### Method 3: Docker
```bash
docker-compose up --build
# This starts both DB and app
```

---

## ✅ Verify Backend Running

### Test 1: Browser
```
Open: http://localhost:8080/api/users
Expected: JSON array (may be empty)
```

### Test 2: Terminal
```bash
curl http://localhost:8080/api/users
# Should return JSON response
```

### Test 3: Login Endpoint
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"user001","password":"password123"}'
```

---

## 🗄️ Database Check

### Verify Database Exists
```bash
mysql -h 127.0.0.1 -P 3309 -u root -p
# Password: team3in1m@idinhSo1

> SHOW DATABASES;
# Should see: java4_db_asm

> USE java4_db_asm;
> SHOW TABLES;
# Should see: User, Video, Comment, etc.
```

### Check Test User
```bash
> SELECT * FROM User;
# If empty, insert:
> INSERT INTO User (id, password, email, fullname, admin) 
  VALUES ('user001', 'password123', 'user@example.com', 'Test User', 0);
```

---

## 🔗 Frontend Configuration

### Update `.env` (if needed)

File: `D:\VueJS\ASM_VUE\.env`

```env
VITE_SERVICE_MODE=java
VITE_API_BASE_URL=http://localhost:8080/api
```

✅ Already correct! No changes needed (if backend on port 8080)

---

## 🧪 Test Connection

### Step 1: Start Frontend
```bash
cd D:\VueJS\ASM_VUE
npm run dev
# Opens: http://localhost:5173
```

### Step 2: Test Login
1. Click "Login" button
2. Enter: `user001` / `password123`
3. Click "Đăng nhập"

### Expected Result
```
✅ Success message appears
✅ Redirect to /admin or /favorites
✅ localStorage has authToken
```

---

## 🐛 Troubleshooting

### Problem: "No response from server"

**Check 1: Backend running?**
```bash
curl http://localhost:8080/api/users
# If error: Backend not started
```

**Check 2: Database connection?**
- Verify Docker container running: `docker ps`
- Or verify local MariaDB running

**Check 3: Port 8080 occupied?**
```bash
netstat -an | grep 8080
# If occupied, use different port
```

### Problem: "User not found" on login

**Check 1: User exists?**
```bash
mysql -h 127.0.0.1 -P 3309 -u root -p java4_db_asm
> SELECT * FROM User WHERE id='user001';
```

**Check 2: Password correct?**
```bash
# Make sure password is stored correctly
# Check if hashed or plaintext
```

### Problem: "CORS error"

**Solution:** Backend has CORS filter configured. Should work automatically.
Check: `src/main/java/com/fpt/java4_asm/filter/CorsFilter.java`

---

## 📊 Full Checklist

### Database
- [ ] MariaDB running (Docker or local)
- [ ] Database `java4_db_asm` exists
- [ ] Tables created (User, Video, etc.)
- [ ] Test user inserted (user001)

### Backend
- [ ] Java 21 installed
- [ ] Project cloned/exists
- [ ] Maven clean package succeeds
- [ ] Backend started on 8080
- [ ] API endpoints respond
- [ ] Test user exists in DB

### Frontend
- [ ] Node.js + npm installed
- [ ] Dependencies installed (npm install)
- [ ] `.env` configured
- [ ] Dev server running on 5173

### Integration
- [ ] Frontend can reach backend (no CORS errors)
- [ ] Login endpoint returns user + token
- [ ] Token saved to localStorage
- [ ] User redirected after login

---

## 🎯 Success Criteria

All of these must be true:

1. ✅ `http://localhost:8080/api/users` returns JSON
2. ✅ `http://localhost:5173` opens frontend
3. ✅ Login form appears
4. ✅ Can enter credentials
5. ✅ Can click "Đăng nhập"
6. ✅ Success message shows
7. ✅ User redirects
8. ✅ F12 → localStorage has token

---

## 📝 Quick Command Reference

```bash
# Database
docker-compose up -d              # Start DB
docker-compose down              # Stop DB
mysql -h 127.0.0.1 -P 3309 -u root -p  # Connect to DB

# Backend
mvn clean package                # Build
mvn tomcat7:run                 # Run locally
# Or use IDE to run on Tomcat

# Frontend
npm install                      # Install dependencies
npm run dev                      # Start dev server
npm run build                    # Build for production

# Test
curl http://localhost:8080/api/users   # Test API
```

---

## ✨ Status

| Component | Status | Action |
|-----------|--------|--------|
| Database | ⏳ Setup | Follow DB section |
| Backend | ⏳ Setup | Follow Build/Run sections |
| Frontend | ✅ Ready | Already configured |
| Integration | ⏳ Pending | Test after both running |

---

**Next: Follow CONNECT_TO_BACKEND.md for detailed setup! 🚀**
