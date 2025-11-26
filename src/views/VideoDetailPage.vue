<template>
  <div class="video-detail-page">
    <div class="container-fluid p-4" style="max-width: 1400px; margin: 0 auto;">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải video...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
        <h4 class="mt-3">Không tìm thấy video</h4>
        <p class="text-muted">Video này không tồn tại hoặc đã bị xóa</p>
        <router-link to="/" class="btn btn-primary">
          <i class="bi bi-house me-2"></i>Về trang chủ
        </router-link>
      </div>

      <!-- Video Content -->
      <div v-else class="row g-4">
        <!-- Main Content -->
        <div class="col-lg-8">
          <!-- Video Player -->
          <div class="video-player-container mb-3">
            <div class="video-player">
              <img :src="video.thumbnail" :alt="video.title" class="video-thumbnail-large">
              <div class="play-overlay">
                <button class="play-btn" @click="playVideo">
                  <i class="bi bi-play-fill"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Video Info -->
          <div class="video-info-section">
            <h1 class="video-title">{{ video.title }}</h1>
            
            <div class="video-meta d-flex flex-wrap align-items-center gap-3 mb-3">
              <span class="text-muted">{{ video.views }} lượt xem</span>
              <span class="text-muted">•</span>
              <span class="text-muted">{{ video.uploadTime }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="video-actions d-flex flex-wrap gap-2 mb-4">
              <button 
                class="btn" 
                :class="video.isLiked ? 'btn-primary' : 'btn-outline-primary'"
                @click="toggleLike"
              >
                <i class="bi" :class="video.isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
                <span class="ms-1">{{ video.likes?.toLocaleString() }}</span>
              </button>
              <button 
                class="btn" 
                :class="video.isFavorite ? 'btn-danger' : 'btn-outline-danger'"
                @click="toggleFavorite"
              >
                <i class="bi" :class="video.isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
                <span class="ms-1 d-none d-sm-inline">{{ video.isFavorite ? 'Đã thích' : 'Yêu thích' }}</span>
              </button>
              <button class="btn btn-outline-secondary" @click="shareVideo">
                <i class="bi bi-share"></i>
                <span class="ms-1 d-none d-sm-inline">Chia sẻ</span>
              </button>
              <button class="btn btn-outline-secondary">
                <i class="bi bi-download"></i>
                <span class="ms-1 d-none d-sm-inline">Tải xuống</span>
              </button>
            </div>

            <!-- Channel Info -->
            <div class="channel-info d-flex align-items-center gap-3 p-3 bg-light rounded mb-4">
              <img :src="video.channelAvatar" :alt="video.channelName" class="channel-avatar-large">
              <div class="flex-grow-1">
                <h5 class="channel-name mb-1">{{ video.channelName }}</h5>
                <p class="text-muted mb-0 small">1.2M subscribers</p>
              </div>
              <button class="btn btn-danger">
                <i class="bi bi-bell me-1"></i>Đăng ký
              </button>
            </div>

            <!-- Description -->
            <div class="video-description p-3 bg-light rounded">
              <p class="mb-0">{{ video.description || 'Không có mô tả cho video này.' }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar - Related Videos -->
        <div class="col-lg-4">
          <h5 class="mb-3">Video liên quan</h5>
          <div class="related-videos">
            <div 
              v-for="related in relatedVideos" 
              :key="related.id" 
              class="related-video-item"
              @click="goToVideo(related.id)"
            >
              <div class="related-thumbnail">
                <img :src="related.thumbnail" :alt="related.title">
                <span class="duration-badge">{{ related.duration }}</span>
              </div>
              <div class="related-info">
                <h6 class="related-title">{{ related.title }}</h6>
                <p class="related-channel">{{ related.channelName }}</p>
                <p class="related-stats">{{ related.views }} • {{ related.uploadTime }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MockVideoService from '@/services/MockVideoService'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref(false)
const video = ref({})
const relatedVideos = ref([])

const loadVideo = async () => {
  loading.value = true
  error.value = false
  
  try {
    const result = await MockVideoService.getVideoById(route.params.id)
    if (result.success) {
      video.value = result.data
      await loadRelatedVideos()
    } else {
      error.value = true
    }
  } catch (err) {
    error.value = true
    console.error('Error loading video:', err)
  } finally {
    loading.value = false
  }
}

const loadRelatedVideos = async () => {
  try {
    const result = await MockVideoService.getAllVideos()
    if (result.success) {
      // Filter out current video and limit to 5
      relatedVideos.value = result.data
        .filter(v => v.id !== parseInt(route.params.id))
        .slice(0, 5)
    }
  } catch (err) {
    console.error('Error loading related videos:', err)
  }
}

const toggleLike = async () => {
  try {
    const result = await MockVideoService.toggleLike(video.value.id)
    if (result.success) {
      video.value = result.data
      window.Toast?.success(video.value.isLiked ? 'Đã thích video' : 'Đã bỏ thích')
    }
  } catch (err) {
    window.Toast?.error('Lỗi khi thực hiện')
  }
}

const toggleFavorite = async () => {
  try {
    const result = await MockVideoService.toggleFavorite(video.value.id)
    if (result.success) {
      video.value = result.data
      window.Toast?.success(result.message)
    }
  } catch (err) {
    window.Toast?.error('Lỗi khi thực hiện')
  }
}

const shareVideo = () => {
  window.dispatchEvent(new CustomEvent('open-share-video', { detail: { video: video.value } }))
}

const playVideo = () => {
  window.Toast?.info('Tính năng phát video đang được phát triển')
}

const goToVideo = (id) => {
  router.push(`/video/${id}`)
}

// Watch for route changes
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadVideo()
  }
})

onMounted(loadVideo)
</script>

<style scoped>
.video-detail-page {
  background: #f9f9f9;
  min-height: calc(100vh - 200px);
}

.video-player-container {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.video-player {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}

.video-thumbnail-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.3s;
}

.play-overlay:hover {
  background: rgba(0, 0, 0, 0.5);
}

.play-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 2.5rem;
  color: #333;
  cursor: pointer;
  transition: transform 0.3s, background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn:hover {
  transform: scale(1.1);
  background: #fff;
}

.video-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.channel-avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.related-video-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 8px;
}

.related-video-item:hover {
  background: #f0f0f0;
}

.related-thumbnail {
  position: relative;
  width: 168px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.related-thumbnail img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.duration-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 11px;
}

.related-info {
  flex-grow: 1;
  min-width: 0;
}

.related-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-channel,
.related-stats {
  font-size: 12px;
  color: #606060;
  margin: 0;
}

@media (max-width: 992px) {
  .related-thumbnail {
    width: 120px;
  }
}

@media (max-width: 576px) {
  .video-title {
    font-size: 1.2rem;
  }
  
  .play-btn {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .channel-info {
    flex-wrap: wrap;
  }
  
  .channel-info .btn {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
