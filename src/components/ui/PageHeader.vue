<template>
  <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
    <div>
      <h1 class="h2 mb-1">
        <i v-if="icon" class="bi me-2" :class="icon"></i>
        {{ title }}
      </h1>
      <p v-if="description" class="text-muted mb-0">{{ description }}</p>
    </div>
    <slot name="actions"></slot>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' }
})
</script>
