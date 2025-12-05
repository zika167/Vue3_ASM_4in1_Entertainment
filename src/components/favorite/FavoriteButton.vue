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
import { ref, computed, onMounted, watch } from 'vue'
import FavoriteService from '@/services/factories/FavoriteService'

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
const favoriteId = ref(null)
const loading = ref(false)

const label = computed(() => isFavorite.value ? 'Đã thích' : 'Yêu thích')

const buttonClass = computed(() => {
  let classes = [isFavorite.value ? `btn-${props.activeVariant}` : `btn-${props.variant}`]
  if (props.size) classes.push(`btn-${props.size}`)
  return classes
})

const checkFavoriteStatus = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.username) return
  
  try {
    const result = await FavoriteService.checkFavorite(props.videoId)
    if (result.success) {
      isFavorite.value = result.isFavorite
      favoriteId.value = result.favoriteId
    }
  } catch (err) {
    console.error('Error checking favorite status:', err)
  }
}

const handleToggle = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.username) {
    window.Toast?.warning('Vui lòng đăng nhập để thêm vào yêu thích')
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { tab: 'login' } }))
    return
  }

  loading.value = true
  try {
    const result = await FavoriteService.toggleFavorite(props.videoId)
    if (result.success) {
      isFavorite.value = result.isFavorite
      favoriteId.value = result.isFavorite ? result.data?.id : null
      emit('change', isFavorite.value)
      window.Toast?.success(result.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích')
    } else {
      window.Toast?.error(result.error || 'Không thể thực hiện')
    }
  } catch (err) {
    window.Toast?.error(err.message)
  } finally {
    loading.value = false
  }
}

watch(() => props.videoId, () => {
  checkFavoriteStatus()
})

watch(() => props.initialState, (newVal) => {
  isFavorite.value = newVal
})

onMounted(() => {
  checkFavoriteStatus()
})
</script>
