/**
 * Service Factory Creator
 * Tạo factory pattern cho tất cả services
 * Giảm code lặp giữa UserService.js, VideoService.js, etc.
 */

const SERVICE_MODE = import.meta.env.VITE_SERVICE_MODE || 'java'

/**
 * Tạo service factory
 * @param {string} serviceName - Tên service (User, Video, Share, etc.)
 * @param {Object} implementations - Object chứa các implementations
 * @returns {Object} Service implementation phù hợp
 */
export function createServiceFactory(serviceName, implementations) {
  const { java, mock, firebase } = implementations
  
  function getServiceImplementation() {
    switch (SERVICE_MODE.toLowerCase()) {
      case 'java':
        console.log(`🔧 ${serviceName}Service: Using Java API Backend`)
        return java
        
      case 'firebase':
        if (firebase) {
          console.log(`🔧 ${serviceName}Service: Using Firebase Backend`)
          return firebase
        }
        console.warn(`⚠️ ${serviceName}Service: Firebase not available, using Java`)
        return java
        
      case 'mock':
      default:
        if (mock) {
          console.log(`🔧 ${serviceName}Service: Using Mock Data`)
          return mock
        }
        console.warn(`⚠️ ${serviceName}Service: Mock not available, using Java`)
        return java
    }
  }
  
  return getServiceImplementation()
}

/**
 * Get current service mode
 */
export function getCurrentServiceMode() {
  return SERVICE_MODE
}

export default createServiceFactory
