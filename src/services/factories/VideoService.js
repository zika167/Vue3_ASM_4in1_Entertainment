/**
 * Video Service Factory
 * Tự động chọn implementation dựa trên VITE_SERVICE_MODE
 */

import { createServiceFactory, getCurrentServiceMode } from '../createServiceFactory'
import JavaVideoService from '../JavaVideoService'

const VideoService = createServiceFactory('Video', {
  java: JavaVideoService,
  mock: JavaVideoService,  // Fallback to Java if no mock
  firebase: null
})

export default VideoService
export { getCurrentServiceMode }
