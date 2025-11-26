/**
 * User Service Factory
 * Switch giữa các service implementations (Mock, Java API, Firebase)
 * 
 * Cách sử dụng:
 * 1. Set SERVICE_MODE trong .env file:
 *    - VITE_SERVICE_MODE=mock (default - dùng mock data)
 *    - VITE_SERVICE_MODE=java (dùng Java API)
 *    - VITE_SERVICE_MODE=firebase (dùng Firebase)
 * 
 * 2. Import và sử dụng:
 *    import UserService from '@/services/UserService'
 *    const users = await UserService.getAllUsers()
 */

import MockUserService from './MockUserService'
import JavaUserService from './JavaUserService'
import FirebaseUserService from './FirebaseUserService'

// Get service mode from environment variable
const SERVICE_MODE = import.meta.env.VITE_SERVICE_MODE || 'mock'

/**
 * Service Factory
 * Returns appropriate service based on SERVICE_MODE
 */
function getServiceImplementation() {
  switch (SERVICE_MODE.toLowerCase()) {
    case 'java':
      console.log('🔧 UserService: Using Java API Backend')
      return JavaUserService
      
    case 'firebase':
      console.log('🔧 UserService: Using Firebase Backend')
      return FirebaseUserService
      
    case 'mock':
    default:
      console.log('🔧 UserService: Using Mock Data (Development Mode)')
      return MockUserService
  }
}

// Export the selected service implementation
const UserService = getServiceImplementation()

export default UserService

/**
 * Utility function to switch service mode at runtime
 * (Optional - for advanced use cases)
 */
export function switchServiceMode(mode) {
  console.warn('⚠️ Runtime service switching is not recommended. Please use .env configuration instead.')
  console.log(`Requested mode: ${mode}`)
  console.log('Current mode:', SERVICE_MODE)
  console.log('To change mode, update VITE_SERVICE_MODE in .env file and restart dev server.')
}

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
    const result = await UserService.getStatistics()
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
