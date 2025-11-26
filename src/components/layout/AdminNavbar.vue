<template>
  <nav class="admin-navbar">
    <div class="admin-container">
      <div class="admin-brand">
        <router-link to="/admin" class="text-decoration-none d-flex align-items-center gap-3">
          <img 
            src="https://res.cloudinary.com/dlpi2u0ds/image/upload/v1763189405/logojava4-Photoroom_bgg2tz.png"
            alt="4in1 Logo"
            class="admin-logo-img rounded-circle"
          >
          <span class="brand-text">
            <span class="first-letter">A</span>DMIN <span class="first-letter">P</span>ANEL
          </span>
        </router-link>
      </div>
      
      <!-- Mobile Toggle -->
      <button class="admin-toggle d-lg-none" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
        <i class="bi" :class="isMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
      </button>
      
      <div class="admin-menu" :class="{ 'show': isMenuOpen }">
        <router-link to="/admin" class="admin-link" exact-active-class="active" @click="closeMenu">
          <i class="bi bi-speedometer2 me-1 d-lg-none"></i>HOME
        </router-link>
        <router-link to="/admin/videos" class="admin-link" active-class="active" @click="closeMenu">
          <i class="bi bi-play-circle me-1 d-lg-none"></i>VIDEOS
        </router-link>
        <router-link to="/admin/users" class="admin-link" active-class="active" @click="closeMenu">
          <i class="bi bi-people me-1 d-lg-none"></i>USERS
        </router-link>
        <router-link to="/admin/reports" class="admin-link" active-class="active" @click="closeMenu">
          <i class="bi bi-bar-chart me-1 d-lg-none"></i>REPORTS
        </router-link>
        
        <!-- User Dropdown -->
        <div class="dropdown ms-lg-auto" ref="dropdownRef">
          <button 
            class="admin-link dropdown-toggle" 
            type="button"
            @click="toggleDropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle me-1"></i>
            <span class="admin-username">{{ adminName }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" :class="{ 'show': isDropdownOpen }">
            <li>
              <router-link class="dropdown-item" to="/" @click="closeAll">
                <i class="bi bi-house me-2"></i>Về trang chủ
              </router-link>
            </li>
            <li>
              <router-link class="dropdown-item" to="/account" @click="closeAll">
                <i class="bi bi-gear me-2"></i>Cài đặt tài khoản
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

const adminName = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.fullname || user.username || 'Admin User'
})

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

const handleLogout = () => {
  localStorage.removeItem('user')
  window.Toast?.success('Đã đăng xuất')
  closeAll()
  router.push('/')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.admin-navbar {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1030;
}

.admin-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.admin-brand {
  display: flex;
  align-items: center;
}

.admin-logo-img {
  height: 50px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.brand-text {
  color: #ffc107;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.first-letter {
  font-size: 1.3em;
  font-weight: 800;
}

.admin-toggle {
  background: none;
  border: none;
  color: #90EE90;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
}

.admin-menu {
  display: flex;
  align-items: center;
}

.admin-link {
  color: #90EE90;
  text-decoration: none;
  padding: 1.2rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
}

.admin-link:hover {
  background-color: rgba(144, 238, 144, 0.1);
  color: #98FB98;
  border-bottom-color: #90EE90;
}

.admin-link.active {
  background-color: rgba(144, 238, 144, 0.15);
  color: #98FB98;
  border-bottom-color: #90EE90;
}

.admin-username {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
}

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
  min-width: 200px;
  padding: 0.5rem 0;
  display: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1050;
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
  .admin-container {
    flex-wrap: wrap;
    padding: 0.5rem 1rem;
  }

  .admin-menu {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem 0;
    border-top: 1px solid rgba(144, 238, 144, 0.2);
    margin-top: 0.5rem;
  }

  .admin-menu.show {
    display: flex;
  }

  .admin-link {
    padding: 1rem 1.5rem;
    border-bottom: none;
    border-left: 3px solid transparent;
    text-align: left;
  }

  .admin-link:hover,
  .admin-link.active {
    border-bottom: none;
    border-left-color: #90EE90;
  }

  .dropdown {
    width: 100%;
  }

  .dropdown .admin-link {
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
</style>
