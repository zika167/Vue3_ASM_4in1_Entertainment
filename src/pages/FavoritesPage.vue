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
            v-for="video in videos" 
            :key="video.id" 
            class="video-container"
          >
            <router-link :to="`/video/${video.id}`" class="video-link">
              <div class="video-thumbnail">
                <img 
                  :src="video.thumbnail" 
                  :alt="video.title" 
                  class="img-fluid"
                  @error="handleImageError"
                >
                <span class="duration-badge">{{ video.duration }}</span>
              </div>
              <div class="video-metadata">
                <img 
                  :src="video.channelAvatar" 
                  :alt="video.channelName" 
                  class="channel-avatar"
                >
                <div class="video-info">
                  <h6 class="video-title">{{ video.title }}</h6>
                  <p class="channel-name">{{ video.channelName }}</p>
                  <p class="video-stats">{{ video.views }} lượt xem • {{ video.uploadTime }}</p>
                </div>
              </div>
            </router-link>
            <div class="video-actions">
              <button 
                class="btn-action" 
                :class="{ liked: video.isFavorite }"
                @click="toggleFavorite(video.id)"
                title="Bỏ thích"
              >
                <i class="bi" :class="video.isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
              </button>
              <button class="btn-action" @click="shareVideo(video)" title="Chia sẻ">
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
                    <a class="dropdown-item" href="#" @click.prevent="addToPlaylist(video)">
                      <i class="bi bi-collection me-2"></i>Thêm vào danh sách
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" @click.prevent="removeFromFavorites(video.id)">
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

/**
 * TODO: [DEV 5] Cần tạo FavoriteService để trang này hoạt động
 * Xem hướng dẫn: documents/7_DEV_NEXT_STEPS.md
 */

const videos = ref([])
const loading = ref(false)

const loadFavorites = async () => {
  // TODO: [DEV 5] Implement với FavoriteService
  console.log('[DEV 5] TODO: Load favorites')
}

const toggleFavorite = async (videoId) => {
  // TODO: [DEV 5] Implement với FavoriteService
  console.log('[DEV 5] TODO: Toggle favorite:', videoId)
}

const removeFromFavorites = async (videoId) => {
  if (!confirm('Bạn có chắc muốn xóa video này khỏi yêu thích?')) return
  await toggleFavorite(videoId)
}

const shareVideo = (video) => {
  window.dispatchEvent(new CustomEvent('open-share-video', { detail: { video } }))
}

const addToPlaylist = (video) => {
  window.Toast?.info('Tính năng đang phát triển')
}

const sortBy = (type) => {
  switch (type) {
    case 'newest':
      videos.value.sort((a, b) => b.id - a.id)
      break
    case 'oldest':
      videos.value.sort((a, b) => a.id - b.id)
      break
    case 'popular':
      videos.value.sort((a, b) => b.likes - a.likes)
      break
  }
  window.Toast?.info(`Đã sắp xếp theo: ${type}`)
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/320x180/2d3748/ffffff?text=Video+Lỗi'
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
