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
    return this.delete(id, 'Video deleted successfully')
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
      const response = await apiClient.patch(`${this.endpoint}/${id}/toggle-active`)
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
}

export default new JavaVideoService()
