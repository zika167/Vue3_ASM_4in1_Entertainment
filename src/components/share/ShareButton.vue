<template>
  <button 
    class="btn" 
    :class="buttonClass"
    @click="openShareModal"
    :title="title"
  >
    <i class="bi bi-share"></i>
    <span v-if="showLabel" class="ms-1">{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  video: { type: Object, required: true },
  variant: { type: String, default: 'outline-secondary' },
  size: { type: String, default: '' },
  showLabel: { type: Boolean, default: true },
  label: { type: String, default: 'Chia sẻ' },
  title: { type: String, default: 'Chia sẻ video' }
})

const buttonClass = computed(() => {
  let classes = [`btn-${props.variant}`]
  if (props.size) classes.push(`btn-${props.size}`)
  return classes
})

const openShareModal = () => {
  window.dispatchEvent(new CustomEvent('open-share-video', { 
    detail: { video: props.video } 
  }))
}
</script>
