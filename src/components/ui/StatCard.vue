<template>
  <div class="col-6" :class="colClass">
    <div class="card h-100" :class="`border-${color}`">
      <div class="card-body" :class="{ 'text-center': centered }">
        <div v-if="!centered" class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="text-muted mb-1">{{ label }}</h6>
            <h3 class="mb-0">{{ formattedValue }}</h3>
          </div>
          <i class="bi fs-1 d-none d-sm-block" :class="[icon, `text-${color}`]"></i>
        </div>
        <div v-else>
          <i class="bi fs-1" :class="[icon, `text-${color}`]"></i>
          <h3 class="mt-2">{{ formattedValue }}</h3>
          <p class="text-muted mb-0">{{ label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  icon: { type: String, required: true },
  color: { type: String, default: 'primary' },
  colClass: { type: String, default: 'col-lg-3' },
  centered: { type: Boolean, default: false },
  formatNumber: { type: Boolean, default: false }
})

const formattedValue = computed(() => {
  if (props.formatNumber && typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})
</script>
