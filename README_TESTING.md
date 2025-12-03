# 🧪 AuthModal API Integration - Testing Guide

**Status:** ✅ Implementation Complete - Ready for Testing

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICK_TEST_GUIDE.md** | 🚀 Start here - 5 min quick test |
| **TEST_AUTH_API.md** | 🔍 Detailed test cases with expected results |
| **TEST_SUMMARY.md** | 📊 Overview of changes and test checklist |
| **CHANGES_SUMMARY.md** | 📝 Technical details of modifications |
| **ARCHITECTURE_DIAGRAM.txt** | 📐 Visual architecture and data flows |
| **BROWSER_CONSOLE_TESTS.js** | 🖥️ Automated tests to run in DevTools |

---

## 🚀 Quick Start (30 seconds)

### 1. Verify Backend is Running
```
http://localhost:8080/api/users
Should show JSON list of users
```

### 2. Open Frontend
```
http://localhost:5173
```

### 3. Test Login
```
Click Login → Enter: user001 / password123 → Click Đăng nhập

Expected: Success message + Redirect
```

### 4. Verify in Console (F12)
```javascript
localStorage.getItem('authToken')  // Should show JWT token
localStorage.getItem('user')       // Should show user object
```

✅ **If all above works, integration is successful!**

---

## 🔍 What Was Changed

### ✅ New Files Created
1. `src/services/JavaAuthService.js` - Auth API service (login, register, logout, changePassword)
2. `src/services/factories/AuthService.js` - Service factory
3. Test documentation files

### ✅ Files Modified
1. `src/components/modals/AuthModal.vue`
   - Removed: Mock accounts object
   - Changed: handleLogin() → calls AuthService.login()
   - Changed: handleRegister() → calls AuthService.register()
   - Updated: Info box message (removed demo account info)

### ✅ Removed
- Mock account credentials
- Fake API simulation (`await new Promise(...)`)

---

## 📋 Test Checklist

### Pre-requisites
- [ ] Backend Java Spring Boot running on `http://localhost:8080`
- [ ] MariaDB database connected
- [ ] Frontend dev server running on `http://localhost:5173`
- [ ] `.env` file has correct settings

### Quick Tests
- [ ] Login page loads without errors
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Register new user works
- [ ] Token saved to localStorage
- [ ] User redirected correctly (admin vs user)

### Detailed Tests
See: **TEST_AUTH_API.md** for comprehensive test cases

---

## 🎯 API Endpoints Being Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | New user registration |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/me` | GET | Get current user info |
| `/api/auth/change-password` | PUT | Change password |

---

## 🔐 How It Works

1. **User enters credentials** in AuthModal form
2. **Form validates** using Validation class
3. **AuthService.login()** is called
4. **Axios sends HTTP request** with token interceptor
5. **Backend processes** and returns JWT token
6. **Token & User data** saved to localStorage
7. **User is redirected** based on role (admin/user)

---

## 🧠 Key Concepts

### Service Factory Pattern
- Allows switching between java/mock/firebase implementations
- Currently uses: `java` (real API)
- Configuration: `.env` → `VITE_SERVICE_MODE`

### Axios Interceptors
- **Request:** Automatically adds token to Authorization header
- **Response:** Handles 401 errors (clears auth, shows login)

### localStorage
```javascript
// After successful login:
localStorage.user       // { id, username, fullname, email, admin }
localStorage.authToken  // JWT token from backend
```

---

## 🛠️ How to Test

### Option 1: Manual Testing (UI)
1. Open http://localhost:5173
2. Click Login button
3. Follow test cases from **TEST_AUTH_API.md**

### Option 2: Console Testing (Automated)
1. Open DevTools (F12) → Console
2. Copy content from **BROWSER_CONSOLE_TESTS.js**
3. Run test functions:
   ```javascript
   runQuickTests()           // All quick tests
   testLoginAPI()            // Test login endpoint
   testRegisterAPI()         // Test register endpoint
   checkAuthState()          // Check localStorage
   ```

### Option 3: Network Testing
1. DevTools → Network tab
2. Perform login/register
3. Check:
   - Request method: `POST`
   - Request URL: `/api/auth/login` or `/api/auth/register`
   - Response status: `200` (success) or `400/401` (error)
   - Authorization header: `Bearer <token>`

---

## ✨ Expected Results

| Scenario | Expected Behavior |
|----------|-------------------|
| Login with valid credentials | ✅ Shows success, redirects, token saved |
| Login with invalid credentials | ❌ Shows error, modal stays open, no token |
| Register new user | ✅ Shows success, switches to login tab |
| Register with duplicate email | ❌ Shows error, form stays open |
| Password validation (< 6 chars) | ❌ Shows error, button disabled |
| Open DevTools → Storage | ✅ Can see `authToken` and `user` in localStorage |

---

## 🐛 Troubleshooting

### Issue: "Network Error" / Cannot reach backend
**Solution:**
```bash
# Check if backend is running
curl http://localhost:8080/api/users

# Check .env
cat .env | grep VITE_API_BASE_URL
```

### Issue: Login button disabled or not working
**Solution:**
```javascript
// Check console for errors
console.error()

// Check if AuthService is imported
// Should see in Sources: JavaAuthService.js
```

### Issue: Token not saved to localStorage
**Solution:**
```javascript
// Open console and check
localStorage.getItem('authToken')
// Should not return null after login

// Check network response
// DevTools → Network tab → Look for /api/auth/login response
```

### Issue: No redirect after login
**Solution:**
```javascript
// Check if user.admin field exists
const user = JSON.parse(localStorage.getItem('user'))
console.log(user.admin)  // Should be true or false

// Check router
// Should have routes for /admin and /favorites
```

---

## 📊 Files Organization

```
Project Root
├── TEST_AUTH_API.md              ← Detailed test cases
├── TEST_SUMMARY.md               ← Summary & checklist
├── QUICK_TEST_GUIDE.md           ← Quick 30-sec test
├── CHANGES_SUMMARY.md            ← Technical changes
├── ARCHITECTURE_DIAGRAM.txt      ← Visual diagrams
├── BROWSER_CONSOLE_TESTS.js      ← Automated tests
├── README_TESTING.md             ← This file
│
└── src/
    ├── services/
    │   ├── JavaAuthService.js    ← NEW ✨
    │   └── factories/
    │       └── AuthService.js     ← NEW ✨
    └── components/
        └── modals/
            └── AuthModal.vue      ← MODIFIED ✨
```

---

## 🎓 Learning Resources

- **Axios Documentation:** https://axios-http.com/
- **Vue 3 Documentation:** https://vuejs.org/
- **Bootstrap Documentation:** https://getbootstrap.com/
- **JWT Documentation:** https://jwt.io/

---

## ✅ Success Criteria

All of the following must be true:

1. ✅ AuthModal.vue does NOT contain mockAccounts object
2. ✅ handleLogin() calls AuthService.login()
3. ✅ handleRegister() calls AuthService.register()
4. ✅ JavaAuthService.js exists with all required methods
5. ✅ AuthService factory exists and works
6. ✅ Login with valid credentials succeeds
7. ✅ Login with invalid credentials fails with error
8. ✅ Token saved to localStorage after login
9. ✅ User object saved to localStorage after login
10. ✅ User redirected to /admin or /favorites based on role

---

## 🚀 Next Steps

After testing is complete:

1. ✅ Commit changes to git
2. 📝 Update AccountPage.vue to use API
3. 📝 Implement Share Module
4. 📝 Implement Comment Module
5. 📝 Implement Favorite Module

---

## 📞 Support

**If tests fail:**
1. Check backend is running
2. Check .env configuration
3. Check browser console for errors
4. Check network tab for API responses
5. Review CHANGES_SUMMARY.md for what was changed

**Questions?**
- Review TEST_AUTH_API.md for detailed explanations
- Check ARCHITECTURE_DIAGRAM.txt for data flows
- Look at BROWSER_CONSOLE_TESTS.js for example code

---

## 📋 Test Report Template

Use this to document your test results:

```
Date: ___________
Tester: __________
Backend: Running? Yes/No
Frontend: Running? Yes/No

Test 1: Login Success
Result: ✅ / ❌
Notes: _______________________

Test 2: Login Failed
Result: ✅ / ❌
Notes: _______________________

Test 3: Register Success
Result: ✅ / ❌
Notes: _______________________

Test 4: Token in localStorage
Result: ✅ / ❌
Notes: _______________________

Overall Status: ✅ PASS / ❌ FAIL
Issues Found: _________________
```

---

## 🎉 Summary

| Item | Status |
|------|--------|
| Implementation | ✅ Complete |
| Documentation | ✅ Complete |
| Test Files | ✅ Ready |
| Ready for Testing | ✅ YES |

**Next Action:** Follow QUICK_TEST_GUIDE.md to test! 🚀

---

**Last Updated:** 2025-12-03
**Version:** 1.0
**Status:** ✅ Ready for Testing
