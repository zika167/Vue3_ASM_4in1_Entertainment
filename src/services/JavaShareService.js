/**
 * Java Share Service
 * Extends BaseJavaService với các methods đặc thù cho Share
 */

import BaseJavaService from './BaseJavaService'
import apiClient from './apiClient'

class JavaShareService extends BaseJavaService {
  constructor() {
    super('/shares')
  }

  /**
   * Get all shares
   */
  async getAllShares() {
    return this.getAll()
  }

  /**
   * Get share by ID
   */
  async getShareById(id) {
    return this.getById(id)
  }

  /**
   * Create new share
   * Backend ShareRequest DTO format: { user: {id}, video: {id}, emails }
   * @param {Object} shareData - { videoId, emails, userId? }
   */
  async createShare(shareData) {
    // Get current user from localStorage
    let userId = shareData.userId
    if (!userId) {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          userId = user.id || user.username
        }
      } catch (e) {
        console.error('Error getting current user:', e)
      }
    }

    // Convert frontend format to backend DTO format
    const payload = {
      user: { id: userId },
      video: { id: shareData.videoId || shareData.video },
      emails: shareData.emails
    }
    return this.create(payload, 'Chia sẻ video thành công')
  }

  /**
   * Delete share
   */
  async deleteShare(id) {
    return this.delete(id, 'Đã xóa lịch sử chia sẻ')
  }

  /**
   * Get shares by video ID
   * @param {string} videoId - Video ID
   */
  async getSharesByVideo(videoId) {
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

  /**
   * Get shares by user ID
   * @param {string} userId - User ID
   */
  async getSharesByUser(userId) {
    try {
      const response = await apiClient.get(`${this.endpoint}/user/${userId}`)
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

  /**
   * Get current user's share history
   */
  async getMyShares() {
    try {
      const response = await apiClient.get(this.endpoint)
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

  /**
   * Share video to multiple emails
   * @param {string} videoId - Video ID
   * @param {string} emails - Emails separated by semicolon
   */
  async shareVideo(videoId, emails) {
    return this.createShare({ videoId, emails })
  }
}

export default new JavaShareService()
