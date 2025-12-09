import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

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
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../pages/FavoritesPage.vue'),
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
    component: () => import('../pages/VideoDetailPage.vue'),
    meta: { showInNav: false }
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../pages/AccountPage.vue'),
    meta: { 
      requiresAuth: true,
      showInNav: false
    }
  },
  // Admin Routes
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../pages/admin/AdminDashboard.vue'),
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
    component: () => import('../pages/admin/UserManagement.vue'),
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
    component: () => import('../pages/admin/VideoManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      showInAdminNav: true,
      label: 'VIDEOS',
      icon: 'bi-play-circle'
    }
  },
  {
    path: '/admin/shares',
    name: 'ShareManagement',
    component: () => import('../pages/admin/ShareManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      showInAdminNav: true,
      label: 'SHARES',
      icon: 'bi-share'
    }
  },
  {
    path: '/admin/comments',
    name: 'CommentManagement',
    component: () => import('../pages/admin/CommentManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      showInAdminNav: true,
      label: 'COMMENTS',
      icon: 'bi-chat-dots'
    }
  },
  {
    path: '/admin/favorites',
    name: 'FavoriteManagement',
    component: () => import('../pages/admin/FavoriteManagement.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      showInAdminNav: true,
      label: 'FAVORITES',
      icon: 'bi-heart'
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
    
    // Redirect to Home and open auth modal
    next({ name: 'Home' })
    
    // Open auth modal after navigation (register tab for admin routes)
    setTimeout(() => {
      const tab = to.meta.requiresAdmin ? 'login' : 'register'
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { tab } }))
    }, 100)
    return
  }
  
  // Check admin permission
  if (to.meta.requiresAdmin && !user.admin) {
    window.Toast?.error('Bạn không có quyền truy cập trang này')
    return next({ name: 'Home' })
  }
  
  next()
})

export default router
