<template>
  <div class="favorites-page" style="background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%); min-height: calc(100vh - 200px);">
    <div class="container-fluid p-4" style="max-width: 1400px; margin: 0 auto;">
      <!-- Header Section -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h2 mb-0">
          <i class="bi bi-heart-fill text-danger me-2"></i>Video Yêu Thích
        </h1>
        <div class="dropdown">
          <button 
            class="btn btn-outline-secondary dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-sort-down me-2"></i>Sắp xếp
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#" @click.prevent="sortBy('newest')">Mới nhất</a></li>
            <li><a class="dropdown-item" href="#" @click.prevent="sortBy('oldest')">Cũ nhất</a></li>
            <li><a class="dropdown-item" href="#" @click.prevent="sortBy('popular')">Phổ biến nhất</a></li>
          </ul>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải video yêu thích...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="videos.length === 0" class="text-center py-5">
        <i class="bi bi-heart fs-1 text-muted"></i>
        <h4 class="mt-3">Chưa có video yêu thích</h4>
        <p class="text-muted">Hãy thêm video vào danh sách yêu thích của bạn</p>
        <router-link to="/" class="btn btn-primary">
          <i class="bi bi-house me-2"></i>Khám phá video
        </router-link>
      </div>

      <!-- Video Grid -->
      <div v-else class="video-grid-container">
        <div class="video-grid">
          <div 
            v-for="favorite in videos" 
            :key="favorite.id" 
            class="video-container"
          >
            <router-link :to="`/video/${getVideoId(favorite)}`" class="video-link">
              <div class="video-thumbnail">
                <img 
                  :src="getVideoThumbnail(favorite)" 
                  :alt="getVideoTitle(favorite)" 
                  class="img-fluid"
                  @error="handleImageError"
                >
                <span class="duration-badge">{{ getVideoDuration(favorite) }}</span>
              </div>
              <div class="video-metadata">
                <img 
                  :src="getChannelAvatar(favorite)" 
                  :alt="getChannelName(favorite)" 
                  class="channel-avatar"
                >
                <div class="video-info">
                  <h6 class="video-title">{{ getVideoTitle(favorite) }}</h6>
                  <p class="channel-name">{{ getChannelName(favorite) }}</p>
                  <p class="video-stats">{{ formatViews(getVideoViews(favorite)) }} lượt xem • {{ formatDate(favorite.likeDate) }}</p>
                </div>
              </div>
            </router-link>
            <div class="video-actions">
              <button 
                class="btn-action liked"
                @click="removeFromFavorites(favorite)"
                title="Bỏ thích"
              >
                <i class="bi bi-heart-fill"></i>
              </button>
              <button class="btn-action" @click="shareVideo(favorite)" title="Chia sẻ">
                <i class="bi bi-share"></i>
              </button>
              <div class="dropdown">
                <button 
                  class="btn-action dropdown-toggle" 
                  data-bs-toggle="dropdown" 
                  title="Thêm"
                >
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="addToPlaylist(favorite)">
                      <i class="bi bi-collection me-2"></i>Thêm vào danh sách
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" @click.prevent="removeFromFavorites(favorite)">
                      <i class="bi bi-trash me-2"></i>Xóa khỏi yêu thích
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FavoriteService from '@/services/factories/FavoriteService'
import Validation from '@/utils/validation'

const videos = ref([])
const loading = ref(false)

const loadFavorites = async () => {
  loading.value = true
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.username) {
      window.Toast?.warning('Vui lòng đăng nhập để xem video yêu thích')
      return
    }
    
    const result = await FavoriteService.getFavoritesByUserId(user.username)
    if (result.success) {
      // Backend returns favorites with video info embedded
      // Need to fetch video details if not included
      const favorites = result.data || []
      
      // If video data is not embedded, we need to load it
      const enrichedFavorites = await Promise.all(
        favorites.map(async (fav) => {
          // If video object exists and has title, use it
          if (fav.video && fav.video.title) {
            return fav
          }
          
          // Otherwise try to fetch video details
          try {
            const { default: VideoService } = await import('@/services/factories/VideoService')
            const videoId = fav.video?.id || fav.videoId
            if (videoId) {
              const videoResult = await VideoService.getVideoById(videoId)
              if (videoResult.success && videoResult.data) {
                return { ...fav, video: videoResult.data }
              }
            }
          } catch (e) {
            console.warn('Could not load video details:', e)
          }
          return fav
        })
      )
      
      videos.value = enrichedFavorites
    } else {
      window.Toast?.error(result.error || 'Không thể tải danh sách yêu thích')
    }
  } catch (err) {
    window.Toast?.error(err.message)
  } finally {
    loading.value = false
  }
}

const removeFromFavorites = async (favorite) => {
  if (!confirm('Bạn có chắc muốn xóa video này khỏi yêu thích?')) return
  
  try {
    const result = await FavoriteService.removeFavorite(favorite.id)
    if (result.success) {
      videos.value = videos.value.filter(v => v.id !== favorite.id)
      window.Toast?.success('Đã xóa khỏi yêu thích')
    } else {
      window.Toast?.error(result.error || 'Không thể xóa')
    }
  } catch (err) {
    window.Toast?.error(err.message)
  }
}

const shareVideo = (favorite) => {
  const video = favorite.video || { id: favorite.videoId, title: getVideoTitle(favorite) }
  window.dispatchEvent(new CustomEvent('open-share-video', { detail: { video } }))
}

const addToPlaylist = (favorite) => {
  window.Toast?.info('Tính năng đang phát triển')
}

const sortBy = (type) => {
  switch (type) {
    case 'newest':
      videos.value.sort((a, b) => new Date(b.likeDate) - new Date(a.likeDate))
      break
    case 'oldest':
      videos.value.sort((a, b) => new Date(a.likeDate) - new Date(b.likeDate))
      break
    case 'popular':
      videos.value.sort((a, b) => getVideoViews(b) - getVideoViews(a))
      break
  }
  window.Toast?.info(`Đã sắp xếp theo: ${type}`)
}

// Helper functions to get video data
const getVideoId = (favorite) => favorite.video?.id || favorite.videoId
const getVideoTitle = (favorite) => favorite.video?.title || 'Video'
const getVideoDuration = (favorite) => favorite.video?.duration || '0:00'
const getVideoViews = (favorite) => favorite.video?.views || 0
const getChannelName = (favorite) => favorite.video?.channelName || favorite.video?.userId || 'Unknown'
const getChannelAvatar = (favorite) => {
  return favorite.video?.channelAvatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23667eea' width='40' height='40' rx='20'/%3E%3Ctext fill='white' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.35em'%3ECH%3C/text%3E%3C/svg%3E`
}

const getVideoThumbnail = (favorite) => {
  if (favorite.video?.thumbnail) return favorite.video.thumbnail
  if (favorite.video?.poster) {
    const youtubeId = Validation.extractYouTubeVideoId(favorite.video.poster)
    if (youtubeId) return Validation.getYouTubeThumbnailUrl(youtubeId, 'medium')
  }
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect fill='%232d3748' width='320' height='180'/%3E%3Ctext fill='%23a0aec0' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Thumbnail%3C/text%3E%3C/svg%3E`
}

const formatViews = (views) => {
  const num = parseInt(views) || 0
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

const handleImageError = (e) => {
  e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect fill='%232d3748' width='320' height='180'/%3E%3Ctext fill='%23a0aec0' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EVideo Lỗi%3C/text%3E%3C/svg%3E`
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.video-container {
  background: white;
  border-radius: 8px;
  overflow: visible;
  padding: 12px;
  transition: all 0.3s ease;
}

.video-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.video-link {
  text-decoration: none;
  color: inherit;
}

.video-thumbnail {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.video-thumbnail img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-metadata {
  display: flex;
  gap: 12px;
}

.channel-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.video-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.channel-name, .video-stats {
  font-size: 12px;
  color: #606060;
  margin: 0;
}

.video-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  margin-top: 12px;
}

.btn-action {
  background: none;
  border: none;
  color: #606060;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #f0f0f0;
}

.btn-action.liked {
  color: #dc3545;
}

@media (max-width: 992px) {
  .video-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 576px) {
  .video-grid { grid-template-columns: 1fr; }
}
</style>
