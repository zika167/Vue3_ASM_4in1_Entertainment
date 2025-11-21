<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 11000">
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      class="toast show" 
      :class="`bg-${toast.type}`"
      role="alert"
    >
      <div class="toast-header">
        <i class="bi me-2" :class="getIcon(toast.type)"></i>
        <strong class="me-auto">{{ getTitle(toast.type) }}</strong>
        <button type="button" class="btn-close" @click="removeToast(toast.id)"></button>
      </div>
      <div class="toast-body text-white">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const toasts = ref([])
let toastId = 0

const getIcon = (type) => {
  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  }
  return icons[type] || icons.info
}

const getTitle = (type) => {
  const titles = {
    success: 'Thành công',
    error: 'Lỗi',
    warning: 'Cảnh báo',
    info: 'Thông tin'
  }
  return titles[type] || titles.info
}

const show = (type, message) => {
  const id = toastId++
  toasts.value.push({ id, type, message })
  
  setTimeout(() => {
    removeToast(id)
  }, 3000)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

onMounted(() => {
  // Expose Toast globally
  window.Toast = {
    success: (msg) => show('success', msg),
    error: (msg) => show('error', msg),
    warning: (msg) => show('warning', msg),
    info: (msg) => show('info', msg)
  }
})
</script>

<style scoped>
.toast {
  min-width: 300px;
  margin-bottom: 0.5rem;
}

.bg-success {
  background-color: #198754 !important;
}

.bg-error {
  background-color: #dc3545 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
}

.bg-info {
  background-color: #0dcaf0 !important;
}
</style>
