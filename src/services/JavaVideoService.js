/**
 * Java Video Service
 * Dùng Axios để gọi API Java Backend cho Video
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Tạo VideoService.js tương tự UserService.js
 * 2. Import service này khi VITE_SERVICE_MODE=java
 */

import axios from 'axios'

// Base URL của Java API
const API_BASE_URL = import.meta.env.VITE_JAVA_API_URL || 'http://localhost:8080/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Thêm token vào header
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor - Xử lý lỗi chung
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      const message = error.response.data?.message || 'Server error'
      return Promise.reject(new Error(message))
    } else if (error.request) {
      return Promise.reject(new Error('No response from server'))
    }
    return Promise.reject(error)
  }
)

/**
 * Java Video Service Class
 */
class JavaVideoService {
  /**
   * Get all videos
   * @returns {Promise<Object>}
   */
  async getAllVideos() {
    try {
      const response = await apiClient.get('/videos')
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Get video by ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getVideoById(id) {
    try {
      const response = await apiClient.get(`/videos/${id}`)
      return {
        success: true,
        data: response.data || response
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Create new video
   * @param {Object} videoData
   * @returns {Promise<Object>}
   */
  async createVideo(videoData) {
    try {
      const response = await apiClient.post('/videos', videoData)
      return {
        success: true,
        data: response.data || response,
        message: 'Video created successfully'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Update video
   * @param {number} id
   * @param {Object} videoData
   * @returns {Promise<Object>}
   */
  async updateVideo(id, videoData) {
    try {
      const response = await apiClient.put(`/videos/${id}`, videoData)
      return {
        success: true,
        data: response.data || response,
        message: 'Video updated successfully'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete video
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async deleteVideo(id) {
    try {
      await apiClient.delete(`/videos/${id}`)
      return {
        success: true,
        message: 'Video deleted successfully'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Search videos
   * @param {string} keyword
   * @returns {Promise<Object>}
   */
  async searchVideos(keyword) {
    try {
      const response = await apiClient.get('/videos/search', {
        params: { q: keyword }
      })
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Get favorite videos (requires auth)
   * @returns {Promise<Object>}
   */
  async getFavoriteVideos() {
    try {
      const response = await apiClient.get('/videos/favorites')
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Toggle favorite status
   * @param {number} videoId
   * @returns {Promise<Object>}
   */
  async toggleFavorite(videoId) {
    try {
      const response = await apiClient.post(`/videos/${videoId}/favorite`)
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Favorite toggled'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Toggle like status
   * @param {number} videoId
   * @returns {Promise<Object>}
   */
  async toggleLike(videoId) {
    try {
      const response = await apiClient.post(`/videos/${videoId}/like`)
      return {
        success: true,
        data: response.data || response
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Get video statistics
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    try {
      const response = await apiClient.get('/videos/statistics')
      return {
        success: true,
        data: response.data || response
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default new JavaVideoService()
