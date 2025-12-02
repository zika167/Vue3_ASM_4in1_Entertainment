<template>
  <div class="comment-section">
    <h5 class="mb-3">
      <i class="bi bi-chat-dots me-2"></i>
      Bình luận ({{ comments.length }})
    </h5>

    <!-- Comment Form -->
    <CommentForm 
      v-if="isLoggedIn" 
      @submit="handleAddComment" 
      :submitting="submitting"
    />
    <div v-else class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>
      Vui lòng đăng nhập để bình luận
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border spinner-border-sm text-primary"></div>
      <span class="ms-2">Đang tải bình luận...</span>
    </div>

    <!-- Comments List -->
    <div v-else-if="comments.length > 0" class="comments-list mt-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :current-user-id="currentUserId"
        @delete="handleDeleteComment"
        @edit="handleEditComment"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-4 text-muted">
      <i class="bi bi-chat fs-1"></i>
      <p class="mt-2">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'

/**
 * TODO: [DEV 4] Cần tạo CommentService để component này hoạt động
 * Xem hướng dẫn: documents/7_DEV_NEXT_STEPS.md
 */

const props = defineProps({
  videoId: { type: String, required: true }
})

const comments = ref([])
const loading = ref(false)
const submitting = ref(false)

const currentUserId = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id || user.username
})

const isLoggedIn = computed(() => !!currentUserId.value)

const loadComments = async () => {
  // TODO: [DEV 4] Implement với CommentService
  console.log('[DEV 4] TODO: Load comments for video:', props.videoId)
}

const handleAddComment = async (content) => {
  // TODO: [DEV 4] Implement với CommentService
  console.log('[DEV 4] TODO: Add comment:', content)
}

const handleDeleteComment = async (commentId) => {
  // TODO: [DEV 4] Implement với CommentService
  console.log('[DEV 4] TODO: Delete comment:', commentId)
}

const handleEditComment = async (commentId, newContent) => {
  // TODO: [DEV 4] Implement với CommentService
  console.log('[DEV 4] TODO: Edit comment:', commentId, newContent)
}

onMounted(loadComments)
</script>

<style scoped>
.comment-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 2rem;
}
</style>
