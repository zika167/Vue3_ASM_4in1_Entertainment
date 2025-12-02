import { ref } from 'vue'

/**
 * Composable for favorite functionality
 * 
 * TODO: [DEV 5] Cần tạo:
 * 1. src/services/JavaFavoriteService.js
 * 2. src/services/factories/FavoriteService.js
 * 
 * Sau đó import và implement các methods
 */
export function useFavorite() {
  const favorites = ref([])
  const loading = ref(false)

  // TODO: [DEV 5] Implement khi có FavoriteService
  const loadFavorites = async () => {
    console.log('TODO: Load favorites')
    return { success: true, data: [] }
  }

  const addFavorite = async (videoId) => {
    console.log('TODO: Add favorite:', videoId)
    return { success: false }
  }

  const removeFavorite = async (videoId) => {
    console.log('TODO: Remove favorite:', videoId)
    return { success: false }
  }

  const toggleFavorite = async (videoId) => {
    console.log('TODO: Toggle favorite:', videoId)
    return { success: false }
  }

  const isFavorite = (videoId) => {
    return favorites.value.some(f => f.videoId === videoId)
  }

  return {
    favorites,
    loading,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  }
}
