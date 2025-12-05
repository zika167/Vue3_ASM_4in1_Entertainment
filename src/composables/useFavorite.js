import { ref } from 'vue'
import FavoriteService from '@/services/factories/FavoriteService'

/**
 * Composable for favorite functionality
 * Provides reactive state and methods for managing favorites
 */
export function useFavorite() {
  const favorites = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Load favorites for current user
   */
  const loadFavorites = async (page = 0, size = 10) => {
    loading.value = true
    error.value = null
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.username) {
        return { success: false, error: 'Chưa đăng nhập' }
      }
      
      const result = await FavoriteService.getFavoritesByUserId(user.username, page, size)
      if (result.success) {
        favorites.value = result.data || []
      } else {
        error.value = result.error
      }
      return result
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Add video to favorites
   */
  const addFavorite = async (videoId) => {
    loading.value = true
    try {
      const result = await FavoriteService.addFavorite(videoId)
      if (result.success) {
        await loadFavorites()
        window.Toast?.success('Đã thêm vào yêu thích')
      } else {
        window.Toast?.error(result.error || 'Không thể thêm vào yêu thích')
      }
      return result
    } catch (err) {
      window.Toast?.error(err.message)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove video from favorites
   */
  const removeFavorite = async (favoriteId) => {
    loading.value = true
    try {
      const result = await FavoriteService.removeFavorite(favoriteId)
      if (result.success) {
        favorites.value = favorites.value.filter(f => f.id !== favoriteId)
        window.Toast?.success('Đã xóa khỏi yêu thích')
      } else {
        window.Toast?.error(result.error || 'Không thể xóa khỏi yêu thích')
      }
      return result
    } catch (err) {
      window.Toast?.error(err.message)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Toggle favorite status for a video
   */
  const toggleFavorite = async (videoId) => {
    loading.value = true
    try {
      const result = await FavoriteService.toggleFavorite(videoId)
      if (result.success) {
        await loadFavorites()
        window.Toast?.success(result.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích')
      } else {
        window.Toast?.error(result.error || 'Không thể thực hiện')
      }
      return result
    } catch (err) {
      window.Toast?.error(err.message)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Check if video is in favorites
   */
  const checkFavorite = async (videoId) => {
    try {
      return await FavoriteService.checkFavorite(videoId)
    } catch (err) {
      return { success: false, isFavorite: false, error: err.message }
    }
  }

  /**
   * Check if video is in local favorites list
   */
  const isFavorite = (videoId) => {
    return favorites.value.some(f => f.videoId === videoId || f.video?.id === videoId)
  }

  /**
   * Get favorite ID for a video
   */
  const getFavoriteId = (videoId) => {
    const fav = favorites.value.find(f => f.videoId === videoId || f.video?.id === videoId)
    return fav?.id || null
  }

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    checkFavorite,
    isFavorite,
    getFavoriteId
  }
}
