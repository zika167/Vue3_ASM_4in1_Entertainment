/**
 * Java Video Service
 * Extends BaseJavaService với các methods đặc thù cho Video
 */

import BaseJavaService from './BaseJavaService'
import apiClient from './apiClient'

class JavaVideoService extends BaseJavaService {
  constructor() {
    super('/videos')
  }

  // Alias methods để tương thích với code cũ
  async getAllVideos() {
    return this.getAll()
  }

  async getVideoById(id) {
    return this.getById(id)
  }

  async createVideo(videoData) {
    return this.create(videoData, 'Video created successfully')
  }

  async updateVideo(id, videoData) {
    return this.update(id, videoData, 'Video updated successfully')
  }

  async deleteVideo(id) {
    return this.delete(id, 'Đã xóa video thành công')
  }

  async searchVideos(keyword) {
    return this.search(keyword)
  }

  // Methods đặc thù cho Video
  async getVideosByUser(userId) {
    try {
      const response = await apiClient.get(`${this.endpoint}/user/${userId}`)
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async toggleActive(id) {
    try {
      // First get the current video to know its active status
      const currentVideo = await this.getById(id)
      if (!currentVideo.success) {
        return { success: false, error: 'Video not found' }
      }

      const video = currentVideo.data
      
      // Get userId from video or from logged in user
      let userId = video.userId
      if (!userId) {
        try {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const user = JSON.parse(userStr)
            userId = user.id || user.userId
          }
        } catch (e) {
          console.error('Error getting current user:', e)
        }
      }
      
      // Only send fields that VideoRequest DTO accepts
      const response = await apiClient.put(`${this.endpoint}/${id}`, {
        id: video.id,
        title: video.title,
        description: video.description || '',
        poster: video.poster,
        userId: userId || 'admin',
        active: !video.active
      })
      return {
        success: true,
        data: response.data || response,
        message: 'Video status updated'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async incrementViews(id) {
    try {
      const response = await apiClient.patch(`${this.endpoint}/${id}/view`)
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Get video statistics
   * Tính toán thống kê từ danh sách video (backend không có endpoint statistics)
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  async getStatistics() {
    try {
      // Tính toán statistics từ danh sách video
      const allVideos = await this.getAllVideos()
      if (allVideos.success && allVideos.data) {
        const videos = allVideos.data
        const now = new Date()
        const thisMonth = now.getMonth()
        const thisYear = now.getFullYear()

        const stats = {
          totalVideos: videos.length,
          activeVideos: videos.filter(v => v.active === true).length,
          inactiveVideos: videos.filter(v => v.active === false).length,
          totalViews: videos.reduce((sum, v) => sum + (parseInt(v.views) || 0), 0),
          thisMonth: videos.filter(v => {
            const created = new Date(v.createdDate)
            return created.getMonth() === thisMonth && created.getFullYear() === thisYear
          }).length
        }

        return { success: true, data: stats }
      }
      return { success: false, error: 'Cannot calculate statistics' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default new JavaVideoService()
