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
          <!-- Video Player Section -->
          <div class="video-player-container mb-3">
            <!-- YouTube Embed Player -->
            <div v-if="isPlaying && youtubeVideoId" class="video-player">
              <iframe
                :src="embedUrl"
                class="youtube-iframe"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                ref="videoIframe"
              ></iframe>
            </div>

            <!-- Thumbnail with Play Button -->
            <div v-else class="video-player video-thumbnail-wrapper">
              <img :src="videoThumbnail" :alt="video.title" class="video-thumbnail-large" />
              <div class="play-overlay" @click="playVideo">
                <button class="play-btn"><i class="bi bi-play-fill"></i></button>
              </div>
              <span v-if="video.duration" class="duration-badge-large">{{ video.duration }}</span>
            </div>

            <!-- Player Controls -->
            <div v-if="isPlaying" class="player-controls">
              <button class="btn btn-sm btn-outline-light" @click="stopVideo"><i class="bi bi-stop-fill"></i></button>
              <button class="btn btn-sm btn-outline-light" @click="toggleFullscreen"><i class="bi bi-fullscreen"></i></button>
            </div>
          </div>

          <!-- Video Info -->
          <div class="video-info-section">
            <h1 class="video-title">{{ video.title }}</h1>
            <div class="video-meta d-flex flex-wrap align-items-center gap-3 mb-3">
              <span class="text-muted"><i class="bi bi-eye me-1"></i>{{ formatViews(video.views) }} lượt xem</span>
              <span class="text-muted">•</span>
              <span class="text-muted"><i class="bi bi-calendar me-1"></i>{{ formatDate(video.createdDate) }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="video-actions d-flex flex-wrap gap-2 mb-4">
              <button class="btn" :class="video.isLiked ? 'btn-primary' : 'btn-outline-primary'" @click="toggleLike">
                <i class="bi" :class="video.isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
                <span class="ms-1">{{ formatNumber(video.likes) }}</span>
              </button>
              <button class="btn" :class="video.isFavorite ? 'btn-danger' : 'btn-outline-danger'" @click="toggleFavorite">
                <i class="bi" :class="video.isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
                <span class="ms-1 d-none d-sm-inline">{{ video.isFavorite ? 'Đã thích' : 'Yêu thích' }}</span>
              </button>
              <button class="btn btn-outline-secondary" @click="shareVideo">
                <i class="bi bi-share"></i><span class="ms-1 d-none d-sm-inline">Chia sẻ</span>
              </button>
              <button class="btn btn-outline-secondary" @click="copyVideoLink">
                <i class="bi bi-link-45deg"></i><span class="ms-1 d-none d-sm-inline">Sao chép link</span>
              </button>
            </div>

            <!-- Channel Info -->
            <div class="channel-info d-flex align-items-center gap-3 p-3 bg-light rounded mb-4">
              <img :src="video.channelAvatar || defaultAvatar" :alt="video.channelName" class="channel-avatar-large" />
              <div class="flex-grow-1">
                <h5 class="channel-name mb-1">{{ video.channelName || 'Unknown Channel' }}</h5>
                <p class="text-muted mb-0 small">{{ video.subscribers || '0' }} subscribers</p>
              </div>
              <button class="btn btn-danger"><i class="bi bi-bell me-1"></i>Đăng ký</button>
            </div>

            <!-- Description -->
            <div class="video-description p-3 bg-light rounded mb-4">
              <div class="description-content" :class="{ expanded: isDescriptionExpanded }">
                <p class="mb-0">{{ video.description || 'Không có mô tả cho video này.' }}</p>
              </div>
              <button v-if="hasLongDescription" class="btn btn-link btn-sm p-0 mt-2" @click="isDescriptionExpanded = !isDescriptionExpanded">
                {{ isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>

            <!-- Comments -->
            <CommentSection :video-id="route.params.id" />
          </div>
        </div>

        <!-- Sidebar - Related Videos -->
        <div class="col-lg-4">
          <div class="related-videos-section">
            <h5 class="mb-3"><i class="bi bi-collection-play me-2"></i>Video liên quan</h5>
            <div v-if="loadingRelated" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-primary"></div>
            </div>
            <div v-else-if="relatedVideos.length > 0" class="related-videos">
              <div v-for="related in relatedVideos" :key="related.id" class="related-video-item" @click="goToVideo(related.id)">
                <div class="related-thumbnail">
                  <img :src="getVideoThumbnail(related)" :alt="related.title" />
                </div>
                <div class="related-info">
                  <h6 class="related-title">{{ related.title }}</h6>
                  <p class="related-channel">{{ related.channelName }}</p>
                  <p class="related-stats">{{ formatViews(related.views) }} lượt xem</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-muted">
              <i class="bi bi-film fs-3"></i>
              <p class="mt-2 mb-0">Không có video liên quan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
/**
 * VideoDetailPage.vue - Trang chi tiết video
 * Features: YouTube embed player, Like/Favorite/Share, Related videos
 * @author DEV 2 - Video Module
 */
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VideoService from '@/services/factories/VideoService'
import CommentSection from '@/components/comment/CommentSection.vue'
import Validation from '@/utils/validation'
import Helpers from '@/utils/helpers'

const route = useRoute()
const router = useRouter()

// State
const video = ref({})
const loading = ref(true)
const error = ref(false)
const isPlaying = ref(false)
const videoIframe = ref(null)
const isDescriptionExpanded = ref(false)
const relatedVideos = ref([])
const loadingRelated = ref(false)

// Constants - Use inline SVG instead of external placeholder
const defaultAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect fill='%23667eea' width='50' height='50' rx='25'/%3E%3Ctext fill='white' font-family='Arial' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.35em'%3ECH%3C/text%3E%3C/svg%3E`
const defaultThumbnail = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect fill='%232d3748' width='320' height='180'/%3E%3Ctext fill='%23a0aec0' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Thumbnail%3C/text%3E%3C/svg%3E`

// Computed: Extract YouTube video ID
const youtubeVideoId = computed(() => {
  if (video.value.poster) {
    const id = Validation.extractYouTubeVideoId(video.value.poster)
    if (id) return id
  }
  if (video.value.videoUrl) {
    const id = Validation.extractYouTubeVideoId(video.value.videoUrl)
    if (id) return id
  }
  const thumbnail = video.value.thumbnail || ''
  const match = thumbnail.match(/\/vi\/([a-zA-Z0-9_-]{11})\//)
  return match ? match[1] : null
})

// Computed: YouTube embed URL
const embedUrl = computed(() => {
  if (!youtubeVideoId.value) return ''
  return `https://www.youtube.com/embed/${youtubeVideoId.value}?autoplay=1&rel=0`
})

// Computed: Video thumbnail
const videoThumbnail = computed(() => {
  if (video.value.thumbnail) return video.value.thumbnail
  if (youtubeVideoId.value) return Validation.getYouTubeThumbnailUrl(youtubeVideoId.value, 'high')
  return defaultThumbnail
})

// Computed: Check long description
const hasLongDescription = computed(() => (video.value.description || '').length > 200)

// Load video
const loadVideo = async () => {
  loading.value = true
  error.value = false
  isPlaying.value = false
  try {
    const result = await VideoService.getVideoById(route.params.id)
    if (result.success && result.data) {
      video.value = result.data
      await VideoService.incrementViews(route.params.id)
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

// Load related videos with recommendation
const loadRelatedVideos = async () => {
  loadingRelated.value = true
  try {
    const result = await VideoService.getAllVideos()
    if (result.success && result.data) {
      const others = result.data.filter(v => v.id !== route.params.id)
      // Simple recommendation: same channel first, then by views
      const recommended = others.sort((a, b) => {
        if (a.channelName === video.value.channelName && b.channelName !== video.value.channelName) return -1
        if (b.channelName === video.value.channelName && a.channelName !== video.value.channelName) return 1
        return (parseInt(b.views) || 0) - (parseInt(a.views) || 0)
      })
      relatedVideos.value = recommended.slice(0, 8)
    }
  } catch (err) {
    console.error('Error loading related videos:', err)
  } finally {
    loadingRelated.value = false
  }
}

// Player controls
const playVideo = () => {
  if (youtubeVideoId.value) {
    isPlaying.value = true
  } else {
    window.Toast?.warning('Video này không có nguồn phát')
  }
}

const stopVideo = () => { isPlaying.value = false }

const toggleFullscreen = () => {
  const iframe = videoIframe.value
  if (!iframe) return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    iframe.requestFullscreen?.()
  }
}

// Actions
const toggleLike = () => {
  video.value.isLiked = !video.value.isLiked
  video.value.likes = (video.value.likes || 0) + (video.value.isLiked ? 1 : -1)
  window.Toast?.info(video.value.isLiked ? 'Đã thích video' : 'Đã bỏ thích')
}

const toggleFavorite = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.username) {
    window.Toast?.warning('Vui lòng đăng nhập để thêm vào yêu thích')
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { tab: 'login' } }))
    return
  }
  video.value.isFavorite = !video.value.isFavorite
  window.Toast?.success(video.value.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích')
}

const shareVideo = () => {
  window.dispatchEvent(new CustomEvent('open-share-video', { detail: { video: video.value } }))
}

const copyVideoLink = async () => {
  const url = `${window.location.origin}/video/${video.value.id}`
  const success = await Helpers.copyToClipboard(url)
  window.Toast?.[success ? 'success' : 'error'](success ? 'Đã sao chép link!' : 'Không thể sao chép')
}

const goToVideo = (id) => { router.push(`/video/${id}`) }

// Formatting
const formatViews = (views) => {
  const num = parseInt(views) || 0
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const formatNumber = (num) => Helpers.formatNumber(num || 0)
const formatDate = (date) => (date ? Helpers.getRelativeTime(date) : '')

// Get thumbnail from YouTube poster URL
const getVideoThumbnail = (v) => {
  if (v.poster) {
    const youtubeId = Validation.extractYouTubeVideoId(v.poster)
    if (youtubeId) {
      return Validation.getYouTubeThumbnailUrl(youtubeId, 'medium')
    }
  }
  if (v.thumbnail) return v.thumbnail
  return defaultThumbnail
}

// Watch route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadVideo()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

onMounted(() => { loadVideo() })
onUnmounted(() => { isPlaying.value = false })
</script>

<style scoped>
.video-detail-page { background: #f9f9f9; min-height: calc(100vh - 200px); }
.video-player-container { position: relative; width: 100%; border-radius: 12px; overflow: hidden; background: #000; }
.video-player { position: relative; width: 100%; aspect-ratio: 16/9; }
.youtube-iframe { width: 100%; height: 100%; border: none; }
.video-thumbnail-wrapper { cursor: pointer; }
.video-thumbnail-large { width: 100%; height: 100%; object-fit: cover; }
.play-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); transition: background 0.3s; }
.play-overlay:hover { background: rgba(0,0,0,0.5); }
.play-btn { width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.9); border: none; font-size: 2.5rem; color: #333; cursor: pointer; transition: transform 0.3s; display: flex; align-items: center; justify-content: center; }
.play-btn:hover { transform: scale(1.1); background: #fff; }
.duration-badge-large { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 14px; }
.player-controls { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); display: flex; gap: 8px; justify-content: flex-end; }
.video-title { font-size: 1.5rem; font-weight: 600; line-height: 1.4; margin-bottom: 0.5rem; }
.channel-avatar-large { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
.channel-name { font-weight: 600; margin: 0; }
.description-content { max-height: 100px; overflow: hidden; transition: max-height 0.3s; }
.description-content.expanded { max-height: none; }
.related-videos-section { position: sticky; top: 80px; }
.related-video-item { display: flex; gap: 12px; padding: 8px; border-radius: 8px; cursor: pointer; transition: all 0.2s; margin-bottom: 8px; }
.related-video-item:hover { background: #f0f0f0; transform: translateX(4px); }
.related-thumbnail { position: relative; width: 168px; flex-shrink: 0; border-radius: 8px; overflow: hidden; }
.related-thumbnail img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.duration-badge { position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.8); color: white; padding: 2px 4px; border-radius: 2px; font-size: 11px; }
.related-info { flex-grow: 1; min-width: 0; }
.related-title { font-size: 14px; font-weight: 500; margin: 0 0 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.related-channel, .related-stats { font-size: 12px; color: #606060; margin: 0; }
@media (max-width: 992px) { .related-thumbnail { width: 120px; } .related-videos-section { position: static; } }
@media (max-width: 576px) { .video-title { font-size: 1.2rem; } .play-btn { width: 60px; height: 60px; font-size: 2rem; } .channel-info { flex-wrap: wrap; } .channel-info .btn { width: 100%; margin-top: 0.5rem; } .related-thumbnail { width: 100px; } }
</style>
