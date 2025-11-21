<template>
  <article class="video-container" :class="{ 'video-clickable': clickable }" @click="handleClick">
    <div class="video-thumbnail">
      <img 
        :src="video.thumbnail" 
        :alt="video.title" 
        class="img-fluid"
        loading="lazy"
      >
      <span class="duration-badge">{{ video.duration }}</span>
    </div>
    
    <div class="video-metadata">
      <img 
        :src="video.channelAvatar" 
        :alt="video.channelName" 
        class="channel-avatar"
        loading="lazy"
      >
      <div class="video-info">
        <h3 class="video-title">{{ video.title }}</h3>
        <p class="channel-name">{{ video.channelName }}</p>
        <p class="video-stats">{{ video.views }} lượt xem • {{ video.uploadTime }}</p>
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
import { ref } from 'vue'
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

const handleClick = () => {
  if (props.clickable) {
    router.push(`/video/${props.video.id}`)
  }
}

const handleLike = () => {
  isLiked.value = !isLiked.value
  // TODO: Call API to like/unlike video
}

const handleShare = () => {
  // TODO: Open share modal
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

.video-thumbnail img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
  transition: transform 0.2s;
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
