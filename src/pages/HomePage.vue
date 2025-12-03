<template>
  <div class="container-fluid p-4 user-bg" style="max-width: 1400px; margin: 0 auto;">
    <!-- Page Header -->
    <div class="page-header user-facing mb-4">
      <h1 class="welcome-title">
        <i class="bi bi-film"></i>
        Chào mừng đến với 4IN1 Entertainment
      </h1>
      <p class="welcome-subtitle">Nền tảng chia sẻ video hàng đầu. Đăng nhập để khám phá thêm!</p>
    </div>

    <!-- Video Grid -->
    <div class="video-grid-container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Thịnh hành</h2>
      </div>
      
      <div class="video-grid">
        <VideoCard 
          v-for="video in videos" 
          :key="video.id" 
          :video="video"
          :clickable="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VideoCard from '../components/video/VideoCard.vue'
import VideoService from '@/services/factories/VideoService'

const videos = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const result = await VideoService.getAllVideos()
    if (result.success) {
      videos.value = result.data || []
    }
  } catch (error) {
    console.error('Error loading videos:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.user-bg {
  background: #fafafa;
  min-height: calc(100vh - 200px);
}

.page-header.user-facing {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffc107;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-subtitle {
  color: #90EE90;
  font-size: 1.125rem;
  margin: 0.5rem 0 0;
  letter-spacing: 0.5px;
}

.video-grid-container {
  padding: 24px 0;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

@media (max-width: 1200px) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .video-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 576px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
