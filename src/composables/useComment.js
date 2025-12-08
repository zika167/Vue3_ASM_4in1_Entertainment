import { ref } from 'vue'
import CommentService from '@/services/factories/CommentService'
import Validation from '@/utils/validation'

/**
 * Composable for comment functionality
 */
export function useComment(videoId) {
  const comments = ref([])
  const loading = ref(false)
  const submitting = ref(false)

  /**
   * Load comments for a video
   */
  const loadComments = async () => {
    if (!videoId) {
      console.error('Video ID is required')
      return { success: false, error: 'Video ID is required' }
    }

    loading.value = true
    try {
      const result = await CommentService.getCommentsByVideo(videoId)
      if (result.success) {
        comments.value = result.data || []
      }
      return result
    } catch (error) {
      console.error('Error loading comments:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a new comment
   */
  const addComment = async (content) => {
    // Validate comment content
    const validation = Validation.isValidComment(content)
    if (!validation.valid) {
      return { success: false, error: validation.message }
    }

    // Get current user
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      return { success: false, error: 'Vui lòng đăng nhập để bình luận' }
    }

    submitting.value = true
    try {
      // Backend expects: { user: { id }, video: { id }, content }
      const commentData = {
        user: {
          id: user.id
        },
        video: {
          id: videoId
        },
        content: Validation.sanitizeHTML(content)
      }

      const result = await CommentService.createComment(commentData)
      if (result.success) {
        // Reload comments to get updated list
        await loadComments()
      }
      return result
    } catch (error) {
      console.error('Error adding comment:', error)
      return { success: false, error: error.message }
    } finally {
      submitting.value = false
    }
  }

  /**
   * Update a comment
   */
  const updateComment = async (commentId, content) => {
    // Validate comment content
    const validation = Validation.isValidComment(content)
    if (!validation.valid) {
      return { success: false, error: validation.message }
    }

    // Get current user
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      return { success: false, error: 'Vui lòng đăng nhập' }
    }

    submitting.value = true
    try {
      // Backend expects: { user: { id }, video: { id }, content }
      const updateData = {
        user: {
          id: user.id
        },
        video: {
          id: videoId
        },
        content: Validation.sanitizeHTML(content)
      }

      const result = await CommentService.updateComment(commentId, updateData)
      if (result.success) {
        // Reload comments to get updated list
        await loadComments()
      }
      return result
    } catch (error) {
      console.error('Error updating comment:', error)
      return { success: false, error: error.message }
    } finally {
      submitting.value = false
    }
  }

  /**
   * Delete a comment
   */
  const deleteComment = async (commentId) => {
    if (!commentId) {
      return { success: false, error: 'Comment ID is required' }
    }

    try {
      const result = await CommentService.deleteComment(commentId)
      if (result.success) {
        // Remove from local list
        comments.value = comments.value.filter(c => c.id !== commentId)
      }
      return result
    } catch (error) {
      console.error('Error deleting comment:', error)
      return { success: false, error: error.message }
    }
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
