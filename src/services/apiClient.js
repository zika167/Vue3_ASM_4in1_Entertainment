/**
 * Base API Client
 * Cấu hình Axios chung cho tất cả services
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

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
  error => Promise.reject(error)
)

// Response interceptor - Xử lý response/error
apiClient.interceptors.response.use(
  response => {
    // Backend trả về: { success, message, data }
    // Return nguyên cấu trúc để các services có thể xử lý
    return response.data
  },
  error => {
    if (error.response) {
      // Handle 401 - Token hết hạn
      if (error.response.status === 401) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
      // Backend trả về ApiResponse format: { success: false, message, data }
      // Return error object để services có thể catch
      const apiError = error.response.data
      if (apiError && apiError.message) {
        return Promise.reject(new Error(apiError.message))
      }
      return Promise.reject(new Error('Server error'))
    } else if (error.request) {
      return Promise.reject(new Error('No response from server'))
    }
    return Promise.reject(error)
  }
)

export default apiClient
