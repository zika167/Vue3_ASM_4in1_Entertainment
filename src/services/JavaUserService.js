/**
 * Java User Service
 * Extends BaseJavaService với các methods đặc thù cho User
 */

import BaseJavaService from './BaseJavaService'
import apiClient from './apiClient'
import { normalizeUser, normalizeUsers } from './normalizers/userNormalizer'

class JavaUserService extends BaseJavaService {
  constructor() {
    super('/users')
  }

  // Alias methods để tương thích với code cũ
  async getAllUsers() {
    const result = await this.getAll()
    if (result.success && result.data) {
      result.data = normalizeUsers(result.data)
    }
    return result
  }

  async getUserById(id) {
    const result = await this.getById(id)
    if (result.success && result.data) {
      result.data = normalizeUser(result.data)
    }
    return result
  }

  async createUser(userData) {
    const result = await this.create(userData, 'User created successfully')
    if (result.success && result.data) {
      result.data = normalizeUser(result.data)
    }
    return result
  }

  async updateUser(id, userData) {
    const result = await this.update(id, userData, 'User updated successfully')
    if (result.success && result.data) {
      result.data = normalizeUser(result.data)
    }
    return result
  }

  async deleteUser(id) {
    return this.delete(id, 'User deleted successfully')
  }

  async searchUsers(keyword) {
    const result = await this.search(keyword)
    if (result.success && result.data) {
      result.data = normalizeUsers(result.data)
    }
    return result
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
