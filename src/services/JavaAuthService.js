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
   * @param {string} userId - User ID (optional, for future use)
   * @param {Object} passwordData - Password data { oldPassword, newPassword, confirmPassword }
   * @returns {Promise<{success: boolean, error?}>}
   */
  async changePassword(userId, passwordData) {
    try {
      // If userId is actually passwordData (backward compatibility)
      let payload = passwordData
      if (typeof userId === 'object') {
        payload = userId
      }

      // Backend expects: { oldPassword, newPassword, confirmPassword }
      const requestPayload = {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword || payload.newPassword
      }

      // Backend uses POST for change-password (token from Authorization header)
      const response = await apiClient.post(`${this.endpoint}/change-password`, requestPayload)
      return {
        success: response.success || true,
        message: response.message || 'Password changed successfully',
        data: response.data
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
