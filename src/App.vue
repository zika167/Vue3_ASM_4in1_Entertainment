<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- Ẩn navbar và footer khi ở admin routes -->
    <TheNavbar v-if="!isAdminRoute" />
    
    <main class="flex-grow-1">
      <router-view />
    </main>
    
    <TheFooter />
    
    <!-- Global Modals -->
    <AuthModal />
    <ForgotPasswordModal />
    <ShareVideoModal />
    <LoadingOverlay />
    <ToastContainer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheNavbar from './components/layout/TheNavbar.vue'
import TheFooter from './components/layout/TheFooter.vue'
import AuthModal from './components/modals/AuthModal.vue'
import ForgotPasswordModal from './components/modals/ForgotPasswordModal.vue'
import ShareVideoModal from './components/modals/ShareVideoModal.vue'
import LoadingOverlay from './components/ui/LoadingOverlay.vue'
import ToastContainer from './components/ui/ToastContainer.vue'

const route = useRoute()

// Check if current route is admin
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<style>
body {
  background: #fafafa;
}
</style>
