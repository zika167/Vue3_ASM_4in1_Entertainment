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
  response => response.data,
  error => {
    if (error.response) {
      const message = error.response.data?.message || 'Server error'
      if (error.response.status === 401) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
      return Promise.reject(new Error(message))
    } else if (error.request) {
      return Promise.reject(new Error('No response from server'))
    }
    return Promise.reject(error)
  }
)

export default apiClient
