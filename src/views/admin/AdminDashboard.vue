<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <div class="admin-page-header mb-4">
        <h1 class="admin-welcome-title">
          <i class="bi bi-speedometer2 me-2"></i>Chào mừng đến với trang quản trị hệ thống 4in1
        </h1>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-card-blue">
            <div class="stat-icon"><i class="bi bi-people-fill"></i></div>
            <div class="stat-content">
              <div class="stat-number">{{ statistics.totalUsers }}</div>
              <div class="stat-label">TỔNG NGƯỜI DÙNG</div>
              <router-link to="/admin/users" class="stat-link">
                Xem chi tiết <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-card-green">
            <div class="stat-icon"><i class="bi bi-play-circle-fill"></i></div>
            <div class="stat-content">
              <div class="stat-number">{{ statistics.totalVideos }}</div>
              <div class="stat-label">TỔNG VIDEO</div>
              <router-link to="/admin/videos" class="stat-link">
                Xem chi tiết <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-card-pink">
            <div class="stat-icon"><i class="bi bi-bar-chart-fill"></i></div>
            <div class="stat-content">
              <div class="stat-number">{{ statistics.totalReports }}</div>
              <div class="stat-label">BÁO CÁO</div>
              <router-link to="/admin/reports" class="stat-link">
                Xem chi tiết <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="stat-card stat-card-cyan">
            <div class="stat-icon"><i class="bi bi-person-check-fill"></i></div>
            <div class="stat-content">
              <div class="stat-number">{{ statistics.activeUsers }}</div>
              <div class="stat-label">NGƯỜI DÙNG HOẠT ĐỘNG</div>
              <router-link to="/admin/users" class="stat-link">
                Xem chi tiết <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="row g-3 mb-4">
        <!-- Quick Tools -->
        <div class="col-lg-6">
          <div class="info-card">
            <div class="info-card-header">
              <i class="bi bi-gear-fill"></i>
              <h3>CÔNG CỤ QUẢN LÝ</h3>
            </div>
            <div class="info-card-body">
              <router-link to="/admin/users" class="tool-item">
                <div class="tool-icon"><i class="bi bi-people-fill"></i></div>
                <div class="tool-content">
                  <div class="tool-title">Quản lý người dùng</div>
                  <div class="tool-desc">Thêm, sửa, xóa tài khoản người dùng</div>
                </div>
                <i class="bi bi-chevron-right"></i>
              </router-link>
              <router-link to="/admin/videos" class="tool-item">
                <div class="tool-icon"><i class="bi bi-play-circle-fill"></i></div>
                <div class="tool-content">
                  <div class="tool-title">Quản lý video</div>
                  <div class="tool-desc">Thêm, sửa, xóa video</div>
                </div>
                <i class="bi bi-chevron-right"></i>
              </router-link>
              <router-link to="/admin/reports" class="tool-item">
                <div class="tool-icon"><i class="bi bi-bar-chart-fill"></i></div>
                <div class="tool-content">
                  <div class="tool-title">Báo cáo thống kê</div>
                  <div class="tool-desc">Xem báo cáo và thống kê hệ thống</div>
                </div>
                <i class="bi bi-chevron-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="col-lg-6">
          <div class="info-card">
            <div class="info-card-header">
              <i class="bi bi-info-circle-fill"></i>
              <h3>THÔNG TIN HỆ THỐNG</h3>
            </div>
            <div class="info-card-body">
              <div class="system-info-item">
                <i class="bi bi-calendar-check"></i>
                <span class="info-label">Ngày hôm nay</span>
                <span class="info-value">{{ currentDate }}</span>
              </div>
              <div class="system-info-item">
                <i class="bi bi-layers"></i>
                <span class="info-label">Phiên bản hệ thống</span>
                <span class="info-value">4in1 v1.0</span>
              </div>
              <div class="system-info-item">
                <i class="bi bi-activity"></i>
                <span class="info-label">Trạng thái</span>
                <span class="info-value">
                  <span class="badge bg-success">
                    <i class="bi bi-check-circle-fill me-1"></i>Hoạt động bình thường
                  </span>
                </span>
              </div>
              <div class="system-info-item">
                <i class="bi bi-person-badge"></i>
                <span class="info-label">Admin đang đăng nhập</span>
                <span class="info-value">{{ adminName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Videos Section -->
      <div class="row g-3 mb-4">
        <div class="col-12">
          <div class="info-card">
            <div class="info-card-header">
              <i class="bi bi-collection-play-fill"></i>
              <h3>VIDEO GẦN ĐÂY</h3>
            </div>
            <div class="info-card-body p-3">
              <div v-if="loadingVideos" class="text-center py-4">
                <div class="spinner-border text-primary spinner-border-sm"></div>
                <span class="ms-2">Đang tải...</span>
              </div>
              <div v-else class="video-grid">
                <div v-for="video in recentVideos" :key="video.id" class="video-container">
                  <div class="video-thumbnail">
                    <img :src="video.thumbnail" :alt="video.title" class="img-fluid">
                    <span class="duration-badge">{{ video.duration }}</span>
                  </div>
                  <div class="video-metadata">
                    <img :src="video.channelAvatar" :alt="video.channelName" class="channel-avatar">
                    <div class="video-info">
                      <h6 class="video-title">{{ video.title }}</h6>
                      <p class="channel-name">{{ video.channelName }}</p>
                      <p class="video-stats">{{ video.views }} lượt xem • {{ video.uploadTime }}</p>
                    </div>
                  </div>
                  <div class="video-actions">
                    <button class="btn-action" title="Sửa" @click="editVideo(video)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action text-danger" title="Xóa" @click="deleteVideo(video.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import UserService from '@/services/UserService'
import MockVideoService from '@/services/MockVideoService'

const router = useRouter()

const statistics = reactive({
  totalUsers: 0,
  totalVideos: 0,
  totalReports: 45,
  activeUsers: 0
})

const currentDate = ref(new Date().toLocaleString('vi-VN'))
const recentVideos = ref([])
const loadingVideos = ref(false)

const adminName = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.fullname || user.username || 'Admin'
})

const loadStatistics = async () => {
  try {
    const userStats = await UserService.getStatistics()
    if (userStats.success) {
      statistics.totalUsers = userStats.data.totalUsers
      statistics.activeUsers = userStats.data.activeUsers
    }

    const videoStats = await MockVideoService.getStatistics()
    if (videoStats.success) {
      statistics.totalVideos = videoStats.data.totalVideos
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
  }
}

const loadRecentVideos = async () => {
  loadingVideos.value = true
  try {
    const result = await MockVideoService.getAllVideos()
    if (result.success) {
      recentVideos.value = result.data.slice(0, 4) // Get first 4 videos
    }
  } catch (error) {
    console.error('Error loading videos:', error)
  } finally {
    loadingVideos.value = false
  }
}

const editVideo = (video) => {
  router.push(`/admin/videos?edit=${video.id}`)
}

const deleteVideo = (id) => {
  if (confirm('Bạn có chắc muốn xóa video này?')) {
    recentVideos.value = recentVideos.value.filter(v => v.id !== id)
    window.Toast?.success('Đã xóa video')
  }
}

onMounted(() => {
  loadStatistics()
  loadRecentVideos()
})
</script>

<style scoped>
.admin-page-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffc107;
  padding: 2rem;
  border-radius: 12px;
}

.admin-welcome-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card-blue::before { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-card-green::before { background: linear-gradient(135deg, #11998e, #38ef7d); }
.stat-card-pink::before { background: linear-gradient(135deg, #f093fb, #f5576c); }
.stat-card-cyan::before { background: linear-gradient(135deg, #4facfe, #00f2fe); }

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-card-blue .stat-icon { color: #667eea; }
.stat-card-green .stat-icon { color: #11998e; }
.stat-card-pink .stat-icon { color: #f5576c; }
.stat-card-cyan .stat-icon { color: #4facfe; }

.stat-number {
  font-size: 2rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.stat-link {
  color: #6c757d;
  text-decoration: none;
  font-size: 0.875rem;
}

.stat-link:hover {
  color: #333;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
}

.info-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-card-header h3 {
  margin: 0;
  font-size: 1rem;
}

.info-card-body {
  padding: 1rem;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.tool-item:last-child {
  margin-bottom: 0;
}

.tool-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.tool-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 10px;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.tool-content {
  flex-grow: 1;
}

.tool-title {
  font-weight: 600;
}

.tool-desc {
  font-size: 0.875rem;
  color: #6c757d;
}

.system-info-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.system-info-item:last-child {
  margin-bottom: 0;
}

.system-info-item i {
  color: #667eea;
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.info-label {
  flex-grow: 1;
  color: #6c757d;
}

.info-value {
  font-weight: 500;
}

/* Video Grid Styles */
.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.video-container {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  padding: 12px;
  transition: all 0.3s ease;
}

.video-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
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
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-metadata {
  display: flex;
  gap: 10px;
}

.channel-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.video-info {
  flex-grow: 1;
  min-width: 0;
}

.video-title {
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.channel-name, .video-stats {
  font-size: 11px;
  color: #606060;
  margin: 0;
}

.video-actions {
  display: flex;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid #e9ecef;
  margin-top: 10px;
}

.btn-action {
  background: none;
  border: none;
  color: #606060;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #e9ecef;
  color: #333;
}

.btn-action.text-danger:hover {
  background: #fee2e2;
  color: #dc3545;
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
  .admin-welcome-title {
    font-size: 1.2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
