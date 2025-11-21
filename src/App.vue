<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <TheNavbar />
    
    <main class="flex-grow-1">
      <router-view />
    </main>
    
    <TheFooter />
    
    <!-- Global Modals -->
    <AuthModal />
    <LoadingOverlay />
    <ToastContainer />
  </div>
</template>

<script setup>
import TheNavbar from './components/layout/TheNavbar.vue'
import TheFooter from './components/layout/TheFooter.vue'
import AuthModal from './components/modals/AuthModal.vue'
import LoadingOverlay from './components/ui/LoadingOverlay.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
</script>

<style>
body {
  background: #fafafa;
}
</style>
