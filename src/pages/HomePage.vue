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
import { ref } from 'vue'
import VideoCard from '../components/video/VideoCard.vue'

// Mock data - 6 videos
const videos = ref([
  {
    id: 1,
    title: 'Hướng dẫn lập trình Java Spring Boot từ cơ bản đến nâng cao',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    duration: '12:34',
    channelName: 'Code Academy VN',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '1.2M',
    uploadTime: '2 ngày trước'
  },
  {
    id: 2,
    title: 'ReactJS Tutorial 2024 - Xây dựng ứng dụng web hiện đại',
    thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg',
    duration: '25:18',
    channelName: 'Frontend Master',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '850K',
    uploadTime: '1 tuần trước'
  },
  {
    id: 3,
    title: 'Docker & Kubernetes - DevOps Essentials cho Developer',
    thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg',
    duration: '18:42',
    channelName: 'DevOps Vietnam',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '3.1M',
    uploadTime: '3 tuần trước'
  },
  {
    id: 4,
    title: 'SQL Advanced Queries - Database Optimization Tips',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
    duration: '32:15',
    channelName: 'Database Guru',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '560K',
    uploadTime: '1 tháng trước'
  },
  {
    id: 5,
    title: 'Python Machine Learning - Build Your First AI Model',
    thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg',
    duration: '15:30',
    channelName: 'AI Academy',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '2.5M',
    uploadTime: '2 tháng trước'
  },
  {
    id: 6,
    title: 'Git & GitHub Complete Course - Version Control Mastery',
    thumbnail: 'https://i.ytimg.com/vi/3EMxBkqC4z0/mqdefault.jpg',
    duration: '22:50',
    channelName: 'Git Pro',
    channelAvatar: 'https://yt3.googleusercontent.com/ytc/AIdro_nTv3-_qWX7O5H8FWFPAJGsQvEYA3cZ_-g5NW9YVg=s88-c-k-c0x00ffffff-no-rj',
    views: '1.8M',
    uploadTime: '3 tháng trước'
  }
])
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
