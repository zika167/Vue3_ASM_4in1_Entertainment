import { ref } from 'vue'

/**
 * Composable for comment functionality
 * 
 * TODO: [DEV 4] Cần tạo:
 * 1. src/services/JavaCommentService.js
 * 2. src/services/factories/CommentService.js
 * 
 * Sau đó import và implement các methods
 */
export function useComment(videoId) {
  const comments = ref([])
  const loading = ref(false)
  const submitting = ref(false)

  // TODO: [DEV 4] Implement khi có CommentService
  const loadComments = async () => {
    console.log('TODO: Load comments for video:', videoId)
    return { success: true, data: [] }
  }

  const addComment = async (content) => {
    console.log('TODO: Add comment:', content)
    return { success: false }
  }

  const updateComment = async (commentId, content) => {
    console.log('TODO: Update comment:', commentId, content)
    return { success: false }
  }

  const deleteComment = async (commentId) => {
    console.log('TODO: Delete comment:', commentId)
    return { success: false }
  }

  return {
    comments,
    loading,
    submitting,
    loadComments,
    addComment,
    updateComment,
    deleteComment
  }
}
