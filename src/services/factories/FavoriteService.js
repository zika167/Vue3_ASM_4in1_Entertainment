/**
 * Favorite Service Factory
 * Tự động chọn implementation dựa trên VITE_SERVICE_MODE
 */

import { createServiceFactory, getCurrentServiceMode } from '../createServiceFactory'
import JavaFavoriteService from '../JavaFavoriteService'

const FavoriteService = createServiceFactory('Favorite', {
  java: JavaFavoriteService,
  mock: JavaFavoriteService,  // Fallback to Java if no mock
  firebase: null
})

export default FavoriteService
export { getCurrentServiceMode }
