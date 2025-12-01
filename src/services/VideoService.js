/**
 * Video Service Factory
 * Switch giữa các service implementations (Mock, Java API)
 * 
 * Cách sử dụng:
 * 1. Set SERVICE_MODE trong .env file:
 *    - VITE_SERVICE_MODE=mock (default - dùng mock data)
 *    - VITE_SERVICE_MODE=java (dùng Java API)
 * 
 * 2. Import và sử dụng:
 *    import VideoService from '@/services/VideoService'
 *    const videos = await VideoService.getAllVideos()
 */

import MockVideoService from './MockVideoService'
import JavaVideoService from './JavaVideoService'

// Get service mode from environment variable
const SERVICE_MODE = import.meta.env.VITE_SERVICE_MODE || 'mock'

/**
 * Service Factory
 * Returns appropriate service based on SERVICE_MODE
 */
function getServiceImplementation() {
  switch (SERVICE_MODE.toLowerCase()) {
    case 'java':
      console.log('🔧 VideoService: Using Java API Backend')
      return JavaVideoService
      
    case 'mock':
    default:
      console.log('🔧 VideoService: Using Mock Data (Development Mode)')
      return MockVideoService
  }
}

// Export the selected service implementation
const VideoService = getServiceImplementation()

export default VideoService

/**
 * Get current service mode
 */
export function getCurrentServiceMode() {
  return SERVICE_MODE
}

/**
 * Check if service is ready
 */
export async function checkServiceHealth() {
  try {
    const result = await VideoService.getStatistics()
    return {
      mode: SERVICE_MODE,
      isReady: result.success,
      message: result.success ? 'Service is ready' : result.error
    }
  } catch (error) {
    return {
      mode: SERVICE_MODE,
      isReady: false,
      message: error.message
    }
  }
}
