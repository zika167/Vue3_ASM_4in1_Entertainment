<template>
  <form @submit.prevent="handleSubmit" class="comment-form">
    <div class="d-flex gap-3">
      <img 
        :src="userAvatar" 
        alt="Avatar" 
        class="rounded-circle"
        width="40"
        height="40"
      >
      <div class="flex-grow-1">
        <textarea
          v-model="content"
          class="form-control"
          rows="2"
          placeholder="Viết bình luận..."
          :disabled="submitting"
        ></textarea>
        <div class="d-flex justify-content-end mt-2">
          <button 
            type="button" 
            class="btn btn-outline-secondary btn-sm me-2"
            @click="content = ''"
            :disabled="!content || submitting"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            class="btn btn-primary btn-sm"
            :disabled="!content.trim() || submitting"
          >
            <span v-if="submitting">
              <span class="spinner-border spinner-border-sm me-1"></span>
              Đang gửi...
            </span>
            <span v-else>Bình luận</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  submitting: { type: Boolean, default: false }
})

const emit = defineEmits(['submit'])

const content = ref('')

const userAvatar = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.avatar || 'https://via.placeholder.com/40'
})

const handleSubmit = () => {
  if (content.value.trim()) {
    emit('submit', content.value.trim())
    content.value = ''
  }
}
</script>

<style scoped>
.comment-form {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

textarea {
  resize: none;
}
</style>
