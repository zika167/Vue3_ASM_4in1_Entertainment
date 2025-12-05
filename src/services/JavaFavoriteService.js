/**
 * Java Favorite Service
 * Extends BaseJavaService với các methods đặc thù cho Favorite
 */

import BaseJavaService from './BaseJavaService'
import apiClient from './apiClient'

class JavaFavoriteService extends BaseJavaService {
  constructor() {
    super('/favorites')
  }

  /**
   * Get all favorites
   */
  async getAllFavorites() {
    return this.getAll()
  }

  /**
   * Get favorite by ID
   */
  async getFavoriteById(id) {
    return this.getById(id)
  }

  /**
   * Get favorites by user ID
   */
  async getFavoritesByUserId(userId) {
    try {
      const response = await apiClient.get(`${this.endpoint}/user/${userId}`)
      const items = Array.isArray(response.data) 
        ? response.data 
        : response.data?.content || []
      
      return {
        success: response.success !== false,
        data: items,
        message: response.message,
        total: items.length
      }
    } catch (error) {
      return { success: false, error: error.message, data: [] }
    }
  }

  /**
   * Get users who favorited a video
   */
  async getFavoritesByVideoId(videoId) {
    try {
      const response = await apiClient.get(`${this.endpoint}/video/${videoId}`)
      const items = Array.isArray(response.data) 
        ? response.data 
        : response.data?.content || []
      
      return {
        success: response.success !== false,
        data: items,
        message: response.message,
        total: items.length
      }
    } catch (error) {
      return { success: false, error: error.message, data: [] }
    }
  }

  /**
   * Add video to favorites
   * Backend expects: { user: { id: "..." }, video: { id: "..." } }
   */
  async addFavorite(videoId) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await apiClient.post(this.endpoint, { 
        user: { id: user.username },
        video: { id: videoId }
      })
      return {
        success: response.success !== false,
        data: response.data,
        message: response.message || 'Đã thêm vào yêu thích'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Update favorite
   */
  async updateFavorite(id, data) {
    return this.update(id, data, 'Cập nhật yêu thích thành công')
  }

  /**
   * Remove from favorites
   */
  async removeFavorite(id) {
    return this.delete(id, 'Đã xóa khỏi yêu thích')
  }

  /**
   * Check if video is favorited by current user
   * Lấy từ danh sách favorites của user để tìm favoriteId
   */
  async checkFavorite(videoId) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.username) {
        return { success: false, isFavorite: false, error: 'Chưa đăng nhập' }
      }
      
      const result = await this.getFavoritesByUserId(user.username)
      if (result.success && result.data) {
        // Tìm favorite có videoId trùng khớp
        const favorite = result.data.find(f => 
          f.video?.id === videoId || f.videoId === videoId
        )
        return {
          success: true,
          isFavorite: !!favorite,
          favoriteId: favorite?.id || null,
          data: favorite
        }
      }
      return { success: false, isFavorite: false, error: result.error }
    } catch (error) {
      return { success: false, isFavorite: false, error: error.message }
    }
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(videoId) {
    try {
      const checkResult = await this.checkFavorite(videoId)
      
      if (checkResult.isFavorite && checkResult.favoriteId) {
        // Đã yêu thích -> Bỏ yêu thích
        const result = await this.removeFavorite(checkResult.favoriteId)
        return { ...result, isFavorite: false }
      } else {
        // Chưa yêu thích -> Thêm yêu thích
        const result = await this.addFavorite(videoId)
        return { ...result, isFavorite: true }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Search favorites
   */
  async searchFavorites(keyword) {
    return this.search(keyword)
  }
}

export default new JavaFavoriteService()
