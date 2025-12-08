/**
 * Share Service Factory
 * Tự động chọn implementation dựa trên VITE_SERVICE_MODE
 */

import { createServiceFactory, getCurrentServiceMode } from '../createServiceFactory'
import JavaShareService from '../JavaShareService'

const ShareService = createServiceFactory('Share', {
  java: JavaShareService,
  mock: JavaShareService,  // Fallback to Java if no mock
  firebase: null
})

export default ShareService
export { getCurrentServiceMode }
