/**
 * Base Java Service
 * Class cơ sở cho tất cả Java services
 * Giảm code lặp giữa JavaUserService, JavaVideoService, etc.
 */

import apiClient from './apiClient'

class BaseJavaService {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  /**
   * GET all items
   */
  async getAll() {
    try {
      const response = await apiClient.get(this.endpoint)
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
   * GET item by ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`${this.endpoint}/${id}`)
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * POST create item
   */
  async create(data, successMessage = 'Created successfully') {
    try {
      const response = await apiClient.post(this.endpoint, data)
      return {
        success: true,
        data: response.data || response,
        message: successMessage
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }


  /**
   * PUT update item
   */
  async update(id, data, successMessage = 'Updated successfully') {
    try {
      const response = await apiClient.put(`${this.endpoint}/${id}`, data)
      return {
        success: true,
        data: response.data || response,
        message: successMessage
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * DELETE item
   */
  async delete(id, successMessage = 'Deleted successfully') {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`)
      return { success: true, message: successMessage }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * GET search items
   */
  async search(keyword) {
    try {
      const response = await apiClient.get(`${this.endpoint}/search`, {
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
   * GET statistics
   */
  async getStatistics() {
    try {
      const response = await apiClient.get(`${this.endpoint}/statistics`)
      return { success: true, data: response.data || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default BaseJavaService
