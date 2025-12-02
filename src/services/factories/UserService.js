/**
 * User Service Factory
 * Tự động chọn implementation dựa trên VITE_SERVICE_MODE
 */

import { createServiceFactory, getCurrentServiceMode } from '../createServiceFactory'
import JavaUserService from '../JavaUserService'

const UserService = createServiceFactory('User', {
  java: JavaUserService,
  mock: JavaUserService,  // Fallback to Java if no mock
  firebase: null
})

export default UserService
export { getCurrentServiceMode }
