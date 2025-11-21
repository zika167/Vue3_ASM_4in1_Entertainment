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
            <span class="first-letter">4</span>IN<span class="first-letter">1</span> ENTERTAINMENT
          </span>
        </router-link>
      </div>
      
      <div class="user-menu">
        <router-link to="/" class="user-link" active-class="active">HOME</router-link>
        
        <template v-if="!isLoggedIn">
          <button 
            class="btn btn-warning ms-2" 
            @click="openAuthModal('login')"
          >
            <i class="bi bi-box-arrow-in-right me-1"></i>Đăng nhập
          </button>
          <button 
            class="btn btn-outline-warning ms-2" 
            @click="openAuthModal('register')"
          >
            <i class="bi bi-person-plus me-1"></i>Đăng ký
          </button>
        </template>
        
        <template v-else>
          <router-link to="/favorites" class="user-link" active-class="active">
            <i class="bi bi-heart me-1"></i>Yêu thích
          </router-link>
          <router-link to="/account" class="user-link" active-class="active">
            <i class="bi bi-person me-1"></i>Tài khoản
          </router-link>
          <button class="btn btn-outline-danger ms-2" @click="handleLogout">
            <i class="bi bi-box-arrow-right me-1"></i>Đăng xuất
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false) // TODO: Connect to auth store

const openAuthModal = (tab) => {
  // TODO: Emit event to open auth modal
  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { tab } }))
}

const handleLogout = () => {
  // TODO: Implement logout logic
  isLoggedIn.value = false
  router.push('/')
}
</script>

<style scoped>
.user-navbar {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
  height: 60px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.brand-text {
  color: #ffc107;
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 1.5px;
}

.first-letter {
  font-size: 1.5em;
  font-weight: 800;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0;
}

.user-link {
  color: #90EE90;
  text-decoration: none;
  padding: 1.5rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
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

@media (max-width: 768px) {
  .user-container {
    flex-direction: column;
    padding: 1rem;
  }

  .user-brand {
    padding: 0.8rem 0;
  }

  .brand-text {
    font-size: 1.2rem;
  }

  .user-menu {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  .user-link {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
