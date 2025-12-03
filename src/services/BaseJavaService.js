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
   * Handles both array and PaginatedResponse formats from backend
   */
  async getAll() {
    try {
      // apiClient returns: { success, message, data }
      const response = await apiClient.get(this.endpoint)
      
      // Handle PaginatedResponse format { content, pageNumber, pageSize, totalElements, ... }
      const items = Array.isArray(response.data) 
        ? response.data 
        : response.data?.content || []
      
      const pagination = !Array.isArray(response.data) ? response.data : null
      
      return {
        success: response.success || true,
        data: items,
        message: response.message,
        total: pagination?.totalElements || items.length,
        pagination: pagination
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
      return {
        success: response.success || true,
        data: response.data,
        message: response.message
      }
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
        success: response.success || true,
        data: response.data,
        message: response.message || successMessage
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
        success: response.success || true,
        data: response.data,
        message: response.message || successMessage
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
      const response = await apiClient.delete(`${this.endpoint}/${id}`)
      return {
        success: response.success || true,
        message: response.message || successMessage
      }
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
        success: response.success || true,
        data: response.data,
        message: response.message,
        total: response.data?.length || 0
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
      return {
        success: response.success || true,
        data: response.data,
        message: response.message
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default BaseJavaService
