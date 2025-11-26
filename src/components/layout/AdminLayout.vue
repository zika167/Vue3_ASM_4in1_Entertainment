<template>
  <div class="admin-layout">
    <AdminNavbar />
    <main class="admin-main">
      <div class="admin-content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminNavbar from './AdminNavbar.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-main {
  min-height: calc(100vh - 70px);
}

.admin-content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
