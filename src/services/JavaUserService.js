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
    // Convert fullname to fullName (Backend expects fullName)
    const payload = {
      ...userData,
      fullName: userData.fullname || userData.fullName
    }
    delete payload.fullname
    delete payload.username  // Remove username - backend doesn't accept it

    const result = await this.create(payload, 'User created successfully')
    if (result.success && result.data) {
      result.data = normalizeUser(result.data)
    }
    return result
  }

  async updateUser(id, userData) {
    // Convert fullname to fullName (Backend expects fullName)
    const payload = {
      ...userData,
      fullName: userData.fullname || userData.fullName
    }
    delete payload.fullname
    delete payload.username  // Remove username - backend doesn't accept it

    const result = await this.update(id, payload, 'User updated successfully')
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
      const data = Array.isArray(result.data) ? result.data : result.data?.content || []
      result.data = normalizeUsers(data)
    }
    return result
  }


}

export default new JavaUserService()
