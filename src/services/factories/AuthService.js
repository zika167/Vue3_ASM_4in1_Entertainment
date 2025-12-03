/**
 * Auth Service Factory
 * Tự động chọn implementation dựa trên VITE_SERVICE_MODE
 */

import { createServiceFactory, getCurrentServiceMode } from '../createServiceFactory'
import JavaAuthService from '../JavaAuthService'

const AuthService = createServiceFactory('Auth', {
  java: JavaAuthService,
  mock: JavaAuthService,
  firebase: null
})

export default AuthService
export { getCurrentServiceMode }
