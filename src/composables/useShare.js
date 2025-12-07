import { ref } from 'vue'
import ShareService from '@/services/factories/ShareService'

/**
 * Composable for share functionality
 * Provides methods for sharing videos and managing share history
 */
export function useShare() {
  const sharing = ref(false)
  const shareHistory = ref([])
  const loading = ref(false)

  /**
   * Share video to emails
   * @param {string} videoId - Video ID to share
   * @param {string} emails - Emails separated by semicolon (;)
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  const shareVideo = async (videoId, emails) => {
    if (!videoId || !emails) {
      return { success: false, error: 'Video ID và email không được để trống' }
    }

    sharing.value = true
    try {
      const result = await ShareService.shareVideo(videoId, emails)
      if (result.success) {
        window.Toast?.success(result.message || 'Đã chia sẻ video thành công!')
      } else {
        window.Toast?.error(result.error || 'Không thể chia sẻ video')
      }
      return result
    } catch (error) {
      window.Toast?.error('Lỗi khi chia sẻ video')
      return { success: false, error: error.message }
    } finally {
      sharing.value = false
    }
  }

  /**
   * Load share history for current user
   * @returns {Promise<{success: boolean, data?: Array}>}
   */
  const loadShareHistory = async () => {
    loading.value = true
    try {
      const result = await ShareService.getMyShares()
      if (result.success) {
        shareHistory.value = result.data || []
      }
      return result
    } catch (error) {
      console.error('Error loading share history:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Load share history by user ID
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, data?: Array}>}
   */
  const loadShareHistoryByUser = async (userId) => {
    if (!userId) {
      return { success: false, error: 'User ID không được để trống' }
    }

    loading.value = true
    try {
      const result = await ShareService.getSharesByUser(userId)
      if (result.success) {
        shareHistory.value = result.data || []
      }
      return result
    } catch (error) {
      console.error('Error loading share history:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Get shares for a specific video
   * @param {string} videoId - Video ID
   * @returns {Promise<{success: boolean, data?: Array}>}
   */
  const getSharesByVideo = async (videoId) => {
    if (!videoId) {
      return { success: false, error: 'Video ID không được để trống' }
    }

    try {
      return await ShareService.getSharesByVideo(videoId)
    } catch (error) {
      console.error('Error getting shares by video:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete a share record
   * @param {number|string} shareId - Share ID to delete
   * @returns {Promise<{success: boolean}>}
   */
  const deleteShare = async (shareId) => {
    try {
      const result = await ShareService.deleteShare(shareId)
      if (result.success) {
        // Remove from local history
        shareHistory.value = shareHistory.value.filter(s => s.id !== shareId)
        window.Toast?.success(result.message || 'Đã xóa lịch sử chia sẻ')
      } else {
        window.Toast?.error(result.error || 'Không thể xóa')
      }
      return result
    } catch (error) {
      window.Toast?.error('Lỗi khi xóa')
      return { success: false, error: error.message }
    }
  }

  /**
   * Copy video share link to clipboard
   * @param {string} videoId - Video ID
   */
  const copyShareLink = async (videoId) => {
    const url = `${window.location.origin}/video/${videoId}`
    try {
      await navigator.clipboard.writeText(url)
      window.Toast?.success('Đã sao chép link!')
      return { success: true }
    } catch (error) {
      window.Toast?.error('Không thể sao chép link')
      return { success: false, error: error.message }
    }
  }

  return {
    // State
    sharing,
    shareHistory,
    loading,
    
    // Methods
    shareVideo,
    loadShareHistory,
    loadShareHistoryByUser,
    getSharesByVideo,
    deleteShare,
    copyShareLink
  }
}
