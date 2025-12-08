/**
 * Java Comment Service
 * Extends BaseJavaService với các methods đặc thù cho Comment
 */

import BaseJavaService from './BaseJavaService'
import apiClient from './apiClient'

class JavaCommentService extends BaseJavaService {
  constructor() {
    super('/comments')
  }

  /**
   * Get all comments
   */
  async getAllComments() {
    return this.getAll()
  }

  /**
   * Get comment by ID
   */
  async getCommentById(id) {
    return this.getById(id)
  }

  /**
   * Create new comment
   */
  async createComment(data) {
    return this.create(data, 'Comment created successfully')
  }

  /**
   * Update comment
   */
  async updateComment(id, data) {
    return this.update(id, data, 'Comment updated successfully')
  }

  /**
   * Delete comment
   */
  async deleteComment(id) {
    return this.delete(id, 'Comment deleted successfully')
  }

  /**
   * Get comments by video ID
   */
  async getCommentsByVideo(videoId) {
    try {
      const response = await apiClient.get(`${this.endpoint}/video/${videoId}`)
      const items = Array.isArray(response.data) 
        ? response.data 
        : response.data?.content || []
      
      return {
        success: response.success !== false,
        data: items,
        message: response.message,
        total: items.length
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default new JavaCommentService()
