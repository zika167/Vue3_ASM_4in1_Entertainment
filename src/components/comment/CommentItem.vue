<template>
  <div class="comment-item">
    <img 
      :src="comment.user?.avatar || 'https://via.placeholder.com/40'" 
      alt="Avatar" 
      class="rounded-circle comment-avatar"
    >
    <div class="comment-content">
      <div class="comment-header">
        <strong>{{ comment.user?.fullname || comment.userId }}</strong>
        <span class="text-muted ms-2">{{ formatDate(comment.createdDate) }}</span>
        <span v-if="comment.updatedDate" class="text-muted ms-1">(đã chỉnh sửa)</span>
      </div>
      
      <!-- Edit Mode -->
      <div v-if="isEditing" class="mt-2">
        <textarea
          v-model="editContent"
          class="form-control form-control-sm"
          rows="2"
        ></textarea>
        <div class="mt-2">
          <button class="btn btn-sm btn-primary me-2" @click="saveEdit">Lưu</button>
          <button class="btn btn-sm btn-outline-secondary" @click="cancelEdit">Hủy</button>
        </div>
      </div>
      
      <!-- View Mode -->
      <p v-else class="comment-text mb-1">{{ comment.content }}</p>
      
      <!-- Actions -->
      <div v-if="isOwner && !isEditing" class="comment-actions">
        <button class="btn-action" @click="startEdit" title="Sửa">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn-action text-danger" @click="$emit('delete', comment.id)" title="Xóa">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  comment: { type: Object, required: true },
  currentUserId: { type: String, default: '' }
})

const emit = defineEmits(['delete', 'edit'])

const isEditing = ref(false)
const editContent = ref('')

const isOwner = computed(() => props.currentUserId === props.comment.userId)

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  if (diff < 60000) return 'Vừa xong'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`
  return d.toLocaleDateString('vi-VN')
}

const startEdit = () => {
  editContent.value = props.comment.content
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editContent.value = ''
}

const saveEdit = () => {
  if (editContent.value.trim()) {
    emit('edit', props.comment.id, editContent.value.trim())
    isEditing.value = false
  }
}
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.comment-content {
  flex-grow: 1;
  min-width: 0;
}

.comment-header {
  font-size: 0.9rem;
}

.comment-text {
  font-size: 0.95rem;
  color: #333;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  background: none;
  border: none;
  color: #6c757d;
  padding: 2px 6px;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-action:hover {
  color: #333;
}
</style>
