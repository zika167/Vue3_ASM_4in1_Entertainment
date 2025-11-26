<template>
  <div class="login-redirect">
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Đang chuyển hướng...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirect to home and open auth modal
  router.push('/')
  
  // Delay to ensure home page is loaded
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { tab: 'login' } }))
  }, 300)
})
</script>
