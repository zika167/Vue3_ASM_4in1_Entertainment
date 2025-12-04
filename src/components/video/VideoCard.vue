<template>
  <article class="video-container" :class="{ 'video-clickable': clickable }" @click="handleClick">
    <div class="video-thumbnail">
      <!-- Hiển thị iframe nếu có YouTube ID, ngược lại hiển thị thumbnail -->
      <iframe 
        v-if="youtubeVideoId"
        :src="`https://www.youtube.com/embed/${youtubeVideoId}`"
        class="youtube-embed"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      ></iframe>
      <img 
        v-else
        :src="thumbnailUrl" 
        :alt="video.title" 
        class="img-fluid"
        loading="lazy"
      >
      <span v-if="video.duration" class="duration-badge">{{ video.duration }}</span>
    </div>
    
    <div class="video-metadata">
      <img 
        :src="video.channelAvatar || defaultAvatar" 
        :alt="video.channelName || 'Channel'" 
        class="channel-avatar"
        loading="lazy"
      >
      <div class="video-info">
        <h3 class="video-title">{{ video.title }}</h3>
        <p class="channel-name">{{ video.channelName || 'Unknown Channel' }}</p>
        <p class="video-stats">{{ formatViews(video.views) }} lượt xem • {{ formatDate(video.createdDate || video.uploadTime) }}</p>
      </div>
    </div>
    
    <div v-if="showActions" class="video-actions">
      <button class="btn-action" :class="{ liked: isLiked }" @click.stop="handleLike">
        <i :class="isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
      </button>
      <button class="btn-action" @click.stop="handleShare">
        <i class="bi bi-share"></i>
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  clickable: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const isLiked = ref(false)

// Default avatar
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle fill="%23e9ecef" cx="20" cy="20" r="20"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="16" x="50%25" y="55%25" text-anchor="middle"%3E?%3C/text%3E%3C/svg%3E'

/**
 * Extract YouTube video ID from various URL formats
 */
const extractYouTubeId = (url) => {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Computed: YouTube video ID
const youtubeVideoId = computed(() => {
  return extractYouTubeId(props.video.poster) || extractYouTubeId(props.video.thumbnail)
})

// Computed: Thumbnail URL (fallback)
const thumbnailUrl = computed(() => {
  if (props.video.thumbnail) return props.video.thumbnail
  if (youtubeVideoId.value) {
    return `https://img.youtube.com/vi/${youtubeVideoId.value}/mqdefault.jpg`
  }
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect fill="%23e9ecef" width="320" height="180"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Thumbnail%3C/text%3E%3C/svg%3E'
})

// Format views
const formatViews = (views) => {
  const num = parseInt(views) || 0
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Hôm nay'
  if (days === 1) return 'Hôm qua'
  if (days < 7) return `${days} ngày trước`
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`
  return `${Math.floor(days / 365)} năm trước`
}

const handleClick = () => {
  if (props.clickable) {
    router.push(`/video/${props.video.id}`)
  }
}

const handleLike = () => {
  isLiked.value = !isLiked.value
}

const handleShare = () => {
  window.dispatchEvent(new CustomEvent('open-share-modal', { 
    detail: { videoId: props.video.id, videoTitle: props.video.title } 
  }))
}
</script>

<style scoped>
.video-container {
  background: white;
  border-radius: 8px;
  overflow: visible;
  transition: all 0.3s ease;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.video-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.video-container.video-clickable {
  cursor: pointer;
}

.video-container.video-clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.video-thumbnail img,
.video-thumbnail .youtube-embed {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
  transition: transform 0.2s;
}

.youtube-embed {
  border: none;
  pointer-events: none; /* Prevent interaction on card, click goes to detail page */
}

.video-container:hover .youtube-embed {
  pointer-events: auto; /* Allow interaction on hover */
}

.video-container:hover .video-thumbnail img {
  transform: scale(1.02);
}

.duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 6px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
}

.video-metadata {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.channel-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.video-info {
  flex-grow: 1;
  min-width: 0;
}

.video-title {
  font-size: 14px;
  font-weight: 500;
  color: #0f0f0f;
  margin: 0 0 4px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.channel-name {
  font-size: 12px;
  color: #606060;
  margin: 0 0 2px 0;
  line-height: 1.4;
}

.video-stats {
  font-size: 12px;
  color: #606060;
  margin: 0;
}

.video-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.btn-action {
  background: none;
  border: none;
  color: #606060;
  cursor: pointer;
  padding: 6px 8px;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action:hover {
  background-color: #f0f0f0;
  color: #0f0f0f;
}

.btn-action.liked {
  color: #d32f2f;
}

.btn-action i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .video-container {
    padding: 8px;
  }

  .video-metadata {
    gap: 8px;
  }

  .channel-avatar {
    width: 36px;
    height: 36px;
  }

  .video-title {
    font-size: 13px;
  }
}
</style>
