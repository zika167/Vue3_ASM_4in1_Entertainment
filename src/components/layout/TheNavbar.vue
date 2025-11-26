<template>
  <nav class="user-navbar">
    <div class="user-container">
      <div class="user-brand">
        <router-link to="/" class="brand-link">
          <img 
            src="https://res.cloudinary.com/dlpi2u0ds/image/upload/v1763189405/logojava4-Photoroom_bgg2tz.png"
            alt="4in1 Logo"
            class="user-logo-img rounded-circle"
          >
          <span class="brand-text">
            <span class="first-letter">4</span>IN<span class="first-letter">1</span> 
            <span class="d-none d-md-inline">ENTERTAINMENT</span>
          </span>
        </router-link>
      </div>
      
      <!-- Mobile Toggle -->
      <button class="navbar-toggle d-lg-none" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
        <i class="bi" :class="isMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
      </button>
      
      <div class="user-menu" :class="{ 'show': isMenuOpen }">
        <router-link to="/" class="user-link" exact-active-class="active" @click="closeMenu">
          <i class="bi bi-house me-1 d-lg-none"></i>HOME
        </router-link>
        
        <template v-if="!isLoggedIn">
          <a href="#" class="user-link" @click.prevent="openAuthModal('login')">
            <i class="bi bi-box-arrow-in-right me-1"></i>Đăng nhập
          </a>
          <a href="#" class="user-link" @click.prevent="openAuthModal('register')">
            <i class="bi bi-person-plus me-1"></i>Đăng ký
          </a>
        </template>
        
        <template v-else>
          <router-link to="/favorites" class="user-link" active-class="active" @click="closeMenu">
            <i class="bi bi-heart me-1"></i>Yêu thích
          </router-link>
          
          <!-- User Dropdown -->
          <div class="dropdown" ref="dropdownRef">
            <button 
              class="user-link dropdown-toggle" 
              type="button"
              @click="toggleDropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-1"></i>
              <span>{{ userName }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" :class="{ 'show': isDropdownOpen }">
              <li>
                <router-link class="dropdown-item" to="/account" @click="closeAll">
                  <i class="bi bi-gear me-2"></i>Cài đặt tài khoản
                </router-link>
              </li>
              <li v-if="isAdmin">
                <router-link class="dropdown-item" to="/admin" @click="closeAll">
                  <i class="bi bi-shield-check me-2"></i>Trang quản trị
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

// Check login status from localStorage
const currentUser = ref(null)

const isLoggedIn = computed(() => !!currentUser.value)
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const userName = computed(() => currentUser.value?.fullname || currentUser.value?.username || 'User')

const checkAuth = () => {
  const user = localStorage.getItem('user')
  currentUser.value = user ? JSON.parse(user) : null
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeAll = () => {
  isMenuOpen.value = false
  isDropdownOpen.value = false
}

const openAuthModal = (tab) => {
  closeMenu()
  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { tab } }))
}

const handleLogout = () => {
  localStorage.removeItem('user')
  currentUser.value = null
  closeAll()
  window.Toast?.success('Đã đăng xuất thành công!')
  router.push('/')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

// Listen for auth changes
const handleStorageChange = () => {
  checkAuth()
}

onMounted(() => {
  checkAuth()
  
  // Listen for storage changes (login/logout from other tabs)
  window.addEventListener('storage', handleStorageChange)
  
  // Custom event for same-tab auth changes
  window.addEventListener('auth-changed', checkAuth)
  
  // Click outside handler
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('auth-changed', checkAuth)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-navbar {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1030;
}

.user-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.user-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  padding: 0.5rem 0;
}

.user-logo-img {
  height: 50px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.brand-text {
  color: #ffc107;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1.5px;
}

.first-letter {
  font-size: 1.4em;
  font-weight: 800;
}

.navbar-toggle {
  background: none;
  border: none;
  color: #90EE90;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

.navbar-toggle:hover {
  color: #98FB98;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0;
}

.user-link {
  color: #90EE90;
  text-decoration: none;
  padding: 1.2rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  cursor: pointer;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
}

.user-link:hover {
  background-color: rgba(144, 238, 144, 0.1);
  color: #98FB98;
  border-bottom-color: #90EE90;
}

.user-link.active {
  background-color: rgba(144, 238, 144, 0.15);
  color: #98FB98;
  border-bottom-color: #90EE90;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #2d2d2d;
  border: 1px solid rgba(144, 238, 144, 0.2);
  border-radius: 8px;
  min-width: 220px;
  padding: 0.5rem 0;
  display: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1050;
  margin-top: 0;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  color: #90EE90;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: rgba(144, 238, 144, 0.1);
  color: #98FB98;
}

.dropdown-item.text-danger {
  color: #ff6b6b !important;
}

.dropdown-item.text-danger:hover {
  background: rgba(255, 107, 107, 0.1);
}

.dropdown-divider {
  border-color: rgba(144, 238, 144, 0.2);
  margin: 0.25rem 0;
}

/* Mobile Styles */
@media (max-width: 991.98px) {
  .user-container {
    flex-wrap: wrap;
    padding: 0.5rem 1rem;
  }

  .user-logo-img {
    height: 45px;
  }

  .brand-text {
    font-size: 1rem;
  }

  .user-menu {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem 0;
    border-top: 1px solid rgba(144, 238, 144, 0.2);
    margin-top: 0.5rem;
  }

  .user-menu.show {
    display: flex;
  }

  .user-link {
    padding: 1rem 1.5rem;
    border-bottom: none;
    border-left: 3px solid transparent;
    text-align: left;
  }

  .user-link:hover,
  .user-link.active {
    border-bottom: none;
    border-left-color: #90EE90;
  }

  .dropdown {
    width: 100%;
  }

  .dropdown .user-link {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .dropdown-menu {
    position: static;
    width: 100%;
    margin-top: 0;
    border-radius: 0;
    box-shadow: none;
    border-left: none;
    border-right: none;
  }
}

@media (max-width: 575.98px) {
  .user-logo-img {
    height: 40px;
  }

  .brand-text {
    font-size: 0.9rem;
  }
}
</style>
