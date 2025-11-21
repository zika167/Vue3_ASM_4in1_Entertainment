<template>
  <div v-if="isVisible" class="loading-overlay" id="loadingOverlay">
    <div class="spinner-border text-warning" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-3 text-white">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const message = ref('Đang tải...')

const show = (msg = 'Đang tải...') => {
  message.value = msg
  isVisible.value = true
}

const hide = () => {
  isVisible.value = false
}

onMounted(() => {
  // Expose methods globally
  window.Loading = { show, hide }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
