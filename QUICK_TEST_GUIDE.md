# 🚀 QUICK TEST GUIDE - AuthModal API Integration

## ⚡ 30-Second Quick Start

### Step 1: Check Backend
```
✅ Open: http://localhost:8080/api/users
✅ You should see JSON response with users list
```

### Step 2: Open App
```
✅ Open: http://localhost:5173
✅ Click Login button or user icon
```

### Step 3: Test Login
```
Enter:
- Username: user001 (or any existing user)
- Password: password123 (or correct password)

Click "Đăng nhập"

Expected: 
✅ Success message appears
✅ Redirects to /admin or /favorites
✅ Navbar shows your name
```

### Step 4: Verify in Console (F12)
```javascript
// Paste in DevTools Console:
localStorage.getItem('user')
localStorage.getItem('authToken')

// Should show:
// user = { id, username, fullname, email, admin }
// authToken = eyJhbGciOi...
```

---

## 📋 Main Test Cases (5 min)

### Test 1: Login Success ✅
```
1. Click Login
2. Enter: user001 / password123
3. ✅ Should show "Chào mừng [Name]!"
4. ✅ Should redirect
5. ✅ localStorage should have token
```

### Test 2: Login Failed ❌
```
1. Click Login
2. Enter: user001 / wrongpass
3. ✅ Should show error
4. ✅ Modal stays open
5. ✅ No token in localStorage
```

### Test 3: Register New User 📝
```
1. Click "Đăng ký" tab
2. Fill form with new data:
   - Username: testuser123
   - Full Name: Test User
   - Email: test@example.com
   - Password: Pass@123
3. ✅ Should show success
4. ✅ Auto-switch to login tab
5. ✅ Username pre-filled
```

### Test 4: Validation 🔍
```
1. Click Login tab
2. Type "ab" in username
3. ✅ Should show error "phải có ít nhất 3 ký tự"
4. ✅ Submit button disabled
```

### Test 5: Password Strength 💪
```
1. Click "Đăng ký" tab
2. Type in password: "123456"
3. ✅ Strength bar shows (red = weak)
4. Type: "Abc@123xyz"
5. ✅ Strength bar turns green (strong)
```

---

## 🔧 Advanced Testing (DevTools)

### Network Tab Testing
```
1. F12 → Network tab
2. Login
3. Look for: POST /api/auth/login
4. ✅ Status should be 200
5. ✅ Request has Authorization header
6. ✅ Response has data.token
```

### Console Testing (Copy & Paste)
```javascript
// 1. Test API directly
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 'user001', password: 'password123' })
})
.then(r => r.json())
.then(d => console.log(d))

// 2. Check auth state
console.log({
  user: localStorage.getItem('user'),
  token: localStorage.getItem('authToken')
})

// 3. Clear auth (logout simulation)
localStorage.removeItem('user')
localStorage.removeItem('authToken')
```

---

## 📊 What Changed?

### Before (Mock)
```javascript
// Fake login
if (mockAccounts[username] && mockAccounts[username].password === password) {
  // Mock logic
}
```

### After (Real API)
```javascript
// Real login
const result = await AuthService.login(username, password)
if (result.success) {
  const { user, token } = result.data
  // Real data from backend
}
```

---

## ❓ Expected Results

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Login with valid credentials | Shows success, redirects | ✅ |
| Login with invalid credentials | Shows error, stays on modal | ✅ |
| Register new user | Shows success, shows login form | ✅ |
| Validation - short username | Shows error message | ✅ |
| Validation - weak password | Shows weak strength bar | ✅ |
| Token saved in localStorage | `localStorage.getItem('authToken')` returns token | ✅ |
| User data saved | `localStorage.getItem('user')` has all fields | ✅ |

---

## 🎯 Checkpoints

- [ ] Backend API responding (http://localhost:8080/api/users)
- [ ] Frontend app loads (http://localhost:5173)
- [ ] No console errors in browser DevTools
- [ ] AuthModal component opens
- [ ] Login with valid credentials works
- [ ] Success message shows
- [ ] User redirects correctly
- [ ] Token appears in localStorage
- [ ] Register new user works
- [ ] Validation messages appear

---

## 🚨 If Something Fails

### "Network Error" or "Cannot reach server"
```
→ Check if backend runs: http://localhost:8080/api/users
→ Check .env: VITE_API_BASE_URL=http://localhost:8080/api
→ Restart backend
```

### "Credentials invalid" error
```
→ Verify user exists in database
→ Try: user001 / password123
→ Or create new user via Register
```

### "No token in localStorage"
```
→ Check DevTools Console for errors
→ Check Network tab - response status
→ Make sure login was successful before checking
```

### "Modal not opening"
```
→ Check Console for errors
→ Make sure Bootstrap JS is loaded
→ Try refresh page
```

---

## 📱 Mobile Testing

1. Open DevTools (F12)
2. Click device toggle (⌨️📱)
3. Select mobile device size
4. Test form on small screen
5. Verify responsive layout works

---

## 🎬 Video Recording Tips

If recording test for documentation:

1. Open DevTools → Network tab
2. Start recording
3. Perform login/register
4. Show localStorage after success
5. Show redirect to dashboard

---

## ✅ Final Verification

After all tests pass, verify:

```
✅ AuthModal.vue uses AuthService (not mock)
✅ JavaAuthService.js created and working
✅ AuthService factory created
✅ No "mockAccounts" in code
✅ Token saved to localStorage
✅ User redirect works
✅ Validation class used
✅ API endpoints called correctly
```

---

## 📞 Next Action

Once tests pass:
1. Commit changes to git
2. Test AccountPage.vue (next task)
3. Test with other backend modules

**Status: Ready to Test! 🚀**
