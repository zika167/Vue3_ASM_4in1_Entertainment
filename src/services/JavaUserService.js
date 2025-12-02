/**
 * Java User Service
 * Extends BaseJavaService với các methods đặc thù cho User
 */

import BaseJavaService from './BaseJavaService'
import apiClient from './apiClient'

class JavaUserService extends BaseJavaService {
  constructor() {
    super('/users')
  }

  // Alias methods để tương thích với code cũ
  async getAllUsers() {
    return this.getAll()
  }

  async getUserById(id) {
    return this.getById(id)
  }

  async createUser(userData) {
    return this.create(userData, 'User created successfully')
  }

  async updateUser(id, userData) {
    return this.update(id, userData, 'User updated successfully')
  }

  async deleteUser(id) {
    return this.delete(id, 'User deleted successfully')
  }

  async searchUsers(keyword) {
    return this.search(keyword)
  }

  // Methods đặc thù cho User
  async toggleUserStatus(id) {
    try {
      const response = await apiClient.patch(`${this.endpoint}/${id}/toggle-status`)
      return {
        success: true,
        data: response.data || response,
        message: 'User status updated successfully'
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getUsersByRole(role) {
    try {
      const response = await apiClient.get(`${this.endpoint}/by-role`, {
        params: { role }
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
}

export default new JavaUserService()
