import { ref } from 'vue'

/**
 * Composable for share functionality
 * 
 * TODO: [DEV 3] Cần tạo:
 * 1. src/services/JavaShareService.js
 * 2. src/services/factories/ShareService.js
 * 
 * Sau đó import và implement các methods
 */
export function useShare() {
  const sharing = ref(false)
  const shareHistory = ref([])

  // TODO: [DEV 3] Implement khi có ShareService
  const shareVideo = async (videoId, emails) => {
    console.log('TODO: Share video:', videoId, 'to:', emails)
    return { success: false }
  }

  const loadShareHistory = async (userId) => {
    console.log('TODO: Load share history for user:', userId)
    return { success: true, data: [] }
  }

  // Chức năng copy link hoạt động ngay
  const copyShareLink = (videoId) => {
    const url = `${window.location.origin}/video/${videoId}`
    navigator.clipboard.writeText(url)
    window.Toast?.success('Đã sao chép link!')
  }

  return {
    sharing,
    shareHistory,
    shareVideo,
    loadShareHistory,
    copyShareLink
  }
}
