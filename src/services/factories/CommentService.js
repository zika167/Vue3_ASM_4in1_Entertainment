/**
 * Comment Service Factory
 * Tự động chọn implementation dựa trên VITE_SERVICE_MODE
 */

import { createServiceFactory, getCurrentServiceMode } from '../createServiceFactory'
import JavaCommentService from '../JavaCommentService'

const CommentService = createServiceFactory('Comment', {
  java: JavaCommentService,
  mock: JavaCommentService,  // Fallback to Java if no mock
  firebase: null
})

export default CommentService
export { getCurrentServiceMode }
