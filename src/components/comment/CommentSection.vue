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
import { computed, onMounted } from 'vue'
import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'
import { useComment } from '@/composables/useComment'

const props = defineProps({
  videoId: { type: String, required: true }
})

const { 
  comments, 
  loading, 
  submitting, 
  loadComments, 
  addComment, 
  updateComment, 
  deleteComment 
} = useComment(props.videoId)

const currentUserId = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id || user.username
})

const isLoggedIn = computed(() => !!currentUserId.value)

const handleAddComment = async (content) => {
  const result = await addComment(content)
  if (!result.success) {
    alert(result.error || 'Không thể thêm bình luận')
  }
}

const handleDeleteComment = async (commentId) => {
  if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return
  
  const result = await deleteComment(commentId)
  if (!result.success) {
    alert(result.error || 'Không thể xóa bình luận')
  }
}

const handleEditComment = async (commentId, newContent) => {
  const result = await updateComment(commentId, newContent)
  if (!result.success) {
    alert(result.error || 'Không thể cập nhật bình luận')
  }
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
