/**
 * Java User Service
 * Dùng Axios để gọi API Java Backend
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
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor - Xử lý lỗi chung
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'Server error'
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('No response from server'))
    } else {
      // Something else happened
      return Promise.reject(error)
    }
  }
)

/**
 * Java User Service Class
 */
class JavaUserService {
  /**
   * Get all users
   * @returns {Promise<Object>}
   */
  async getAllUsers() {
    try {
      const response = await apiClient.get('/users')
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get user by ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`)
      return {
        success: true,
        data: response.data || response
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Create new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData)
      return {
        success: true,
        data: response.data || response,
        message: 'User created successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Update user
   * @param {number} id
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/users/${id}`, userData)
      return {
        success: true,
        data: response.data || response,
        message: 'User updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Delete user
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async deleteUser(id) {
    try {
      await apiClient.delete(`/users/${id}`)
      return {
        success: true,
        message: 'User deleted successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Toggle user active status
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async toggleUserStatus(id) {
    try {
      const response = await apiClient.patch(`/users/${id}/toggle-status`)
      return {
        success: true,
        data: response.data || response,
        message: 'User status updated successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Search users
   * @param {string} keyword
   * @returns {Promise<Object>}
   */
  async searchUsers(keyword) {
    try {
      const response = await apiClient.get('/users/search', {
        params: { q: keyword }
      })
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get users by role
   * @param {string} role
   * @returns {Promise<Object>}
   */
  async getUsersByRole(role) {
    try {
      const response = await apiClient.get('/users/by-role', {
        params: { role }
      })
      return {
        success: true,
        data: response.data || response,
        total: response.total || response.data?.length || 0
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get statistics
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    try {
      const response = await apiClient.get('/users/statistics')
      return {
        success: true,
        data: response.data || response
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default new JavaUserService()
