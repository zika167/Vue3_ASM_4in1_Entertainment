/**
 * Java Auth Service
 * Handles authentication API calls (login, register, logout, change password)
 */

import apiClient from './apiClient'

class JavaAuthService {
  constructor() {
    this.endpoint = '/auth'
  }

  /**
   * Login user
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {Promise<{success: boolean, data?, error?}>}
   */
  async login(email, password) {
    try {
      // Backend returns: { success, message, data: LoginResponse }
      const response = await apiClient.post(`${this.endpoint}/login`, {
        email,
        password
      })
      return {
        success: response.success || true,
        data: response.data,
        message: response.message || 'Login successful'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed'
      }
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User data (id, password, email, fullname)
   * @returns {Promise<{success: boolean, data?, error?}>}
   */
  async register(userData) {
    try {
      // Convert fullname to fullName (Backend expects fullName)
      const payload = {
        ...userData,
        fullName: userData.fullname || userData.fullName
      }
      // Remove fullname if it exists to avoid duplication
      delete payload.fullname

      const response = await apiClient.post(`${this.endpoint}/register`, payload)
      return {
        success: response.success || true,
        data: response.data,
        message: response.message || 'Registration successful'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Registration failed'
      }
    }
  }

  /**
   * Logout user
   * @returns {Promise<{success: boolean, error?}>}
   */
  async logout() {
    try {
      const response = await apiClient.post(`${this.endpoint}/logout`)
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return { success: true, message: response.message || 'Logout successful' }
    } catch (error) {
      // Even if API fails, remove from localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return { success: true }
    }
  }

  /**
   * Get current user info
   * @returns {Promise<{success: boolean, data?, error?}>}
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get(`${this.endpoint}/me`)
      return {
        success: true,
        data: response.data || response
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get user info'
      }
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, error?}>}
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put(`${this.endpoint}/change-password`, {
        currentPassword,
        newPassword
      })
      return {
        success: true,
        message: response.message || 'Password changed successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to change password'
      }
    }
  }
}

export default new JavaAuthService()
