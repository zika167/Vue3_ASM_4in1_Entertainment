/**
 * BROWSER CONSOLE TEST SCRIPT
 * Copy & Paste vào DevTools Console (F12) để test AuthModal
 * 
 * Usage:
 * 1. Mở http://localhost:5173 trong browser
 * 2. Mở DevTools (F12) → Console tab
 * 3. Copy toàn bộ script này
 * 4. Paste vào console và Enter
 * 5. Gọi hàm muốn test
 */

console.log('🧪 AuthModal Test Suite Loaded');
console.log('Available functions:');
console.log('  - testLoginAPI()');
console.log('  - testRegisterAPI()');
console.log('  - testValidationClass()');
console.log('  - checkAuthState()');
console.log('  - clearAuthState()');

// ==========================================
// 1. TEST LOGIN API
// ==========================================
async function testLoginAPI(username = 'user001', password = 'password123') {
  console.log(`\n📝 Testing Login API...`);
  console.log(`Input: username=${username}, password=${password}`);
  
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: username,
        password: password
      })
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    
    if (response.ok && data.data?.token) {
      console.log(`✅ Login Success!`);
      console.log(`Token: ${data.data.token.substring(0, 20)}...`);
      console.log(`User:`, data.data.user);
      return data;
    } else {
      console.log(`❌ Login Failed: ${data.error}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// ==========================================
// 2. TEST REGISTER API
// ==========================================
async function testRegisterAPI() {
  const newUsername = 'testuser' + Date.now();
  const userData = {
    id: newUsername,
    fullname: 'Test User ' + Date.now(),
    email: `testuser${Date.now()}@example.com`,
    password: 'TestPassword@123'
  };
  
  console.log(`\n📝 Testing Register API...`);
  console.log(`Input:`, userData);
  
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    
    if (response.ok) {
      console.log(`✅ Register Success!`);
      console.log(`New User ID: ${newUsername}`);
      console.log(`You can now login with this account`);
      return data;
    } else {
      console.log(`❌ Register Failed: ${data.error}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

// ==========================================
// 3. TEST VALIDATION CLASS
// ==========================================
async function testValidationClass() {
  console.log(`\n📝 Testing Validation Class...`);
  
  try {
    // Import Validation class (assuming it's available in global scope)
    const Validation = (await import('/src/utils/validation.js')).default;
    
    console.log(`✅ Validation class loaded`);
    
    // Test cases
    const tests = [
      {
        name: 'Valid Email',
        method: 'isValidEmail',
        input: 'test@example.com',
        expected: true
      },
      {
        name: 'Invalid Email',
        method: 'isValidEmail',
        input: 'invalid-email',
        expected: false
      },
      {
        name: 'Valid Username',
        method: 'isValidUsername',
        input: 'user123',
        expected: true
      },
      {
        name: 'Short Username',
        method: 'isValidUsername',
        input: 'ab',
        expected: false
      },
      {
        name: 'Valid Password',
        method: 'isValidPassword',
        input: 'password123',
        expected: true
      },
      {
        name: 'Short Password',
        method: 'isValidPassword',
        input: '123',
        expected: false
      }
    ];
    
    tests.forEach(test => {
      const result = Validation[test.method](test.input);
      const isValid = result.valid !== undefined ? result.valid : result;
      const status = isValid === test.expected ? '✅' : '❌';
      console.log(`${status} ${test.name}: ${test.input}`);
      if (result.message) console.log(`   → ${result.message}`);
    });
    
  } catch (error) {
    console.error(`❌ Error loading Validation: ${error.message}`);
  }
}

// ==========================================
// 4. CHECK AUTH STATE
// ==========================================
function checkAuthState() {
  console.log(`\n📝 Checking Auth State...`);
  
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('authToken');
  
  console.log(`LocalStorage Keys:`);
  console.log(`  - "user": ${user ? '✅ Present' : '❌ Missing'}`);
  console.log(`  - "authToken": ${token ? '✅ Present' : '❌ Missing'}`);
  
  if (user) {
    const userObj = JSON.parse(user);
    console.log(`\nUser Data:`, userObj);
  }
  
  if (token) {
    console.log(`\nToken: ${token.substring(0, 30)}...`);
    console.log(`Token Length: ${token.length} characters`);
  }
  
  return { user: user ? JSON.parse(user) : null, token };
}

// ==========================================
// 5. CLEAR AUTH STATE
// ==========================================
function clearAuthState() {
  console.log(`\n📝 Clearing Auth State...`);
  
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  
  console.log(`✅ Cleared localStorage`);
  console.log(`Verify:`, checkAuthState());
  
  // Reload page to reset component state
  console.log(`\n💡 Tip: Reload page to reset component state`);
}

// ==========================================
// 6. TEST AUTHSERVICE DIRECTLY
// ==========================================
async function testAuthServiceDirect() {
  console.log(`\n📝 Testing AuthService Directly...`);
  
  try {
    // This assumes AuthService is available in global scope
    // If not, you need to import it properly
    const AuthService = (await import('/src/services/factories/AuthService.js')).default;
    
    console.log(`✅ AuthService loaded`);
    console.log(`AuthService methods:`, Object.getOwnPropertyNames(AuthService.__proto__));
    
    // Test login
    console.log(`\nTesting login('user001', 'password123')...`);
    const result = await AuthService.login('user001', 'password123');
    console.log(`Result:`, result);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log(`💡 Note: You might need to import modules properly`);
  }
}

// ==========================================
// 7. TEST WITH CORRECT CREDENTIALS
// ==========================================
async function testWithCorrectCredentials() {
  console.log(`\n🔐 Testing Login with Correct Credentials...`);
  
  // You need to have a user in your database first
  const username = prompt('Enter existing username (e.g., user001):') || 'user001';
  const password = prompt('Enter password:') || 'password123';
  
  const result = await testLoginAPI(username, password);
  
  if (result) {
    checkAuthState();
  }
}

// ==========================================
// 8. TEST WITH WRONG CREDENTIALS
// ==========================================
async function testWithWrongCredentials() {
  console.log(`\n🔐 Testing Login with Wrong Credentials...`);
  
  const result = await testLoginAPI('user001', 'wrongpassword');
  
  if (!result || !result.data?.token) {
    console.log(`✅ Expected failure - Got error as expected`);
  }
}

// ==========================================
// 9. QUICK TEST SUITE
// ==========================================
async function runQuickTests() {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 QUICK TEST SUITE`);
  console.log(`${'='.repeat(50)}\n`);
  
  // Test 1: Check backend connectivity
  console.log(`Test 1: Backend Connectivity`);
  try {
    const response = await fetch('http://localhost:8080/api/users');
    if (response.ok) {
      console.log(`✅ Backend is running on localhost:8080`);
    }
  } catch (error) {
    console.log(`❌ Backend not reachable: ${error.message}`);
    return;
  }
  
  // Test 2: Login with wrong credentials (should fail)
  console.log(`\nTest 2: Login with Wrong Credentials`);
  await testLoginAPI('nonexistent', 'wrongpass');
  
  // Test 3: Check localStorage
  console.log(`\nTest 3: LocalStorage State`);
  checkAuthState();
  
  // Test 4: Clear state
  console.log(`\nTest 4: Clear Auth State`);
  clearAuthState();
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Quick tests completed!`);
  console.log(`${'='.repeat(50)}\n`);
}

// ==========================================
// EXPORT FUNCTIONS
// ==========================================
console.log(`\n✅ Test functions ready to use!`);
console.log(`\n📞 Available Functions:\n`);
console.log(`1. testLoginAPI(username, password)`);
console.log(`   → Test login endpoint`);
console.log(`   → Usage: testLoginAPI('user001', 'password123')\n`);

console.log(`2. testRegisterAPI()`);
console.log(`   → Test register endpoint with random user\n`);

console.log(`3. testValidationClass()`);
console.log(`   → Test Validation utility functions\n`);

console.log(`4. checkAuthState()`);
console.log(`   → Check current localStorage auth data\n`);

console.log(`5. clearAuthState()`);
console.log(`   → Clear auth from localStorage\n`);

console.log(`6. testWithCorrectCredentials()`);
console.log(`   → Test login with user input\n`);

console.log(`7. testWithWrongCredentials()`);
console.log(`   → Test login failure case\n`);

console.log(`8. runQuickTests()`);
console.log(`   → Run all quick tests in sequence\n`);

console.log(`\n💡 PRO TIP: Start with runQuickTests() for a quick overview!\n`);
