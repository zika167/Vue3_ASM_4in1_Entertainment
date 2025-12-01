import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { 
      showInNav: true,
      label: 'HOME',
      icon: 'bi-house'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { showInNav: false }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoritesPage.vue'),
    meta: { 
      requiresAuth: true,
      showInNav: true,
      label: 'Yêu thích',
      icon: 'bi-heart'
    }
  },
  {
    path: '/video/:id',
    name: 'VideoDetail',
    component: () => import('../views/VideoDetailPage.vue'),
    meta: { showInNav: false }
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/AccountPage.vue'),
    meta: { 
      requiresAuth: true,
      showInNav: false // Hiện trong dropdown
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      showInAdminNav: true,
      label: 'HOME',
      icon: 'bi-speedometer2'
    }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: () => import('../views/admin/UserManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      showInAdminNav: true,
      label: 'USERS',
      icon: 'bi-people'
    }
  },
  {
    path: '/admin/videos',
    name: 'VideoManagement',
    component: () => import('../views/admin/VideoManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      showInAdminNav: true,
      label: 'VIDEOS',
      icon: 'bi-play-circle'
    }
  },
  {
    path: '/admin/reports',
    name: 'ReportsManagement',
    component: () => import('../views/admin/ReportsManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      showInAdminNav: true,
      label: 'REPORTS',
      icon: 'bi-bar-chart'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  // Check authentication
  if (to.meta.requiresAuth && !user.username) {
    window.Toast?.warning('Vui lòng đăng nhập để tiếp tục')
    return next({ name: 'Home' })
  }
  
  // Check admin permission
  if (to.meta.requiresAdmin && user.role !== 'admin') {
    window.Toast?.error('Bạn không có quyền truy cập trang này')
    return next({ name: 'Home' })
  }
  
  next()
})

export default router
