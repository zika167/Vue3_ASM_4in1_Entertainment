/**
 * Mock Video Service
 * Dùng để test UI với dữ liệu video giả
 */

// Mock data - Danh sách videos
const mockVideos = [
  {
    id: 1,
    title: 'Hướng dẫn lập trình Java Spring Boot từ cơ bản đến nâng cao',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    duration: '12:34',
    channelName: 'Code Academy VN',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '1.2M',
    uploadTime: '2 ngày trước',
    description: 'Khóa học Java Spring Boot đầy đủ nhất...',
    likes: 15000,
    isLiked: true,
    isFavorite: true
  },
  {
    id: 2,
    title: 'ReactJS Tutorial 2024 - Xây dựng ứng dụng web hiện đại',
    thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg',
    duration: '25:18',
    channelName: 'Frontend Master',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '850K',
    uploadTime: '1 tuần trước',
    description: 'Học ReactJS từ cơ bản đến nâng cao...',
    likes: 8500,
    isLiked: false,
    isFavorite: true
  },
  {
    id: 3,
    title: 'Docker & Kubernetes - DevOps Essentials cho Developer',
    thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg',
    duration: '18:42',
    channelName: 'DevOps Vietnam',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '3.1M',
    uploadTime: '3 tuần trước',
    description: 'Tìm hiểu Docker và Kubernetes...',
    likes: 31000,
    isLiked: true,
    isFavorite: true
  },
  {
    id: 4,
    title: 'SQL Advanced Queries - Database Optimization Tips',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
    duration: '32:15',
    channelName: 'Database Guru',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '560K',
    uploadTime: '1 tháng trước',
    description: 'Tối ưu hóa database với SQL...',
    likes: 5600,
    isLiked: false,
    isFavorite: true
  },
  {
    id: 5,
    title: 'Python Machine Learning - Build Your First AI Model',
    thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg',
    duration: '15:30',
    channelName: 'AI Academy',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '2.5M',
    uploadTime: '2 tháng trước',
    description: 'Xây dựng model AI đầu tiên...',
    likes: 25000,
    isLiked: true,
    isFavorite: true
  },
  {
    id: 6,
    title: 'Git & GitHub Complete Course - Version Control Mastery',
    thumbnail: 'https://i.ytimg.com/vi/3EMxBkqC4z0/mqdefault.jpg',
    duration: '22:50',
    channelName: 'Git Pro',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '1.8M',
    uploadTime: '3 tháng trước',
    description: 'Làm chủ Git và GitHub...',
    likes: 18000,
    isLiked: false,
    isFavorite: true
  }
]

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

class MockVideoService {
  async getAllVideos() {
    await delay(600)
    return { success: true, data: [...mockVideos], total: mockVideos.length }
  }

  async getVideoById(id) {
    await delay(400)
    const video = mockVideos.find(v => v.id === parseInt(id))
    if (!video) return { success: false, error: 'Video not found' }
    return { success: true, data: { ...video } }
  }

  async getFavoriteVideos() {
    await delay(500)
    const favorites = mockVideos.filter(v => v.isFavorite)
    return { success: true, data: favorites, total: favorites.length }
  }

  async toggleFavorite(videoId) {
    await delay(300)
    const video = mockVideos.find(v => v.id === parseInt(videoId))
    if (!video) return { success: false, error: 'Video not found' }
    video.isFavorite = !video.isFavorite
    return { 
      success: true, 
      data: { ...video },
      message: video.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích'
    }
  }

  async toggleLike(videoId) {
    await delay(300)
    const video = mockVideos.find(v => v.id === parseInt(videoId))
    if (!video) return { success: false, error: 'Video not found' }
    video.isLiked = !video.isLiked
    video.likes += video.isLiked ? 1 : -1
    return { success: true, data: { ...video } }
  }

  async searchVideos(keyword) {
    await delay(500)
    const results = mockVideos.filter(v => 
      v.title.toLowerCase().includes(keyword.toLowerCase()) ||
      v.channelName.toLowerCase().includes(keyword.toLowerCase())
    )
    return { success: true, data: results, total: results.length }
  }

  async getStatistics() {
    await delay(300)
    return {
      success: true,
      data: {
        totalVideos: mockVideos.length,
        totalViews: '12.5M',
        totalLikes: mockVideos.reduce((sum, v) => sum + v.likes, 0),
        favoriteCount: mockVideos.filter(v => v.isFavorite).length
      }
    }
  }
}

export default new MockVideoService()
