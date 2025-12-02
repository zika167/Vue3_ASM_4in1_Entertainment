<template>
  <button 
    class="btn" 
    :class="buttonClass"
    @click="handleToggle"
    :disabled="loading"
    :title="isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm"></span>
    <i v-else class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
    <span v-if="showLabel" class="ms-1">{{ label }}</span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'

/**
 * TODO: [DEV 5] Cần tạo FavoriteService để component này hoạt động
 * Xem hướng dẫn: documents/7_DEV_NEXT_STEPS.md
 */

const props = defineProps({
  videoId: { type: String, required: true },
  initialState: { type: Boolean, default: false },
  variant: { type: String, default: 'outline-danger' },
  activeVariant: { type: String, default: 'danger' },
  size: { type: String, default: '' },
  showLabel: { type: Boolean, default: true }
})

const emit = defineEmits(['change'])

const isFavorite = ref(props.initialState)
const loading = ref(false)

const label = computed(() => isFavorite.value ? 'Đã thích' : 'Yêu thích')

const buttonClass = computed(() => {
  let classes = [isFavorite.value ? `btn-${props.activeVariant}` : `btn-${props.variant}`]
  if (props.size) classes.push(`btn-${props.size}`)
  return classes
})

const handleToggle = async () => {
  // TODO: [DEV 5] Implement với FavoriteService
  console.log('[DEV 5] TODO: Toggle favorite for video:', props.videoId)
  isFavorite.value = !isFavorite.value
  emit('change', isFavorite.value)
}
</script>
