<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <div class="mb-4">
        <h1 class="h2 mb-1"><i class="bi bi-bar-chart me-2"></i>Báo cáo & Thống kê</h1>
        <p class="text-muted mb-0">Xem báo cáo và thống kê hệ thống</p>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
          <div class="card border-primary h-100">
            <div class="card-body text-center">
              <i class="bi bi-people fs-1 text-primary"></i>
              <h3 class="mt-2">{{ stats.totalUsers }}</h3>
              <p class="text-muted mb-0">Tổng người dùng</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card border-success h-100">
            <div class="card-body text-center">
              <i class="bi bi-play-circle fs-1 text-success"></i>
              <h3 class="mt-2">{{ stats.totalVideos }}</h3>
              <p class="text-muted mb-0">Tổng video</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card border-warning h-100">
            <div class="card-body text-center">
              <i class="bi bi-eye fs-1 text-warning"></i>
              <h3 class="mt-2">{{ stats.totalViews }}</h3>
              <p class="text-muted mb-0">Tổng lượt xem</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card border-danger h-100">
            <div class="card-body text-center">
              <i class="bi bi-heart fs-1 text-danger"></i>
              <h3 class="mt-2">{{ stats.totalLikes?.toLocaleString() }}</h3>
              <p class="text-muted mb-0">Tổng lượt thích</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Placeholder -->
      <div class="row g-3 mb-4">
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0"><i class="bi bi-graph-up me-2"></i>Lượt xem theo tháng</h5>
            </div>
            <div class="card-body d-flex flex-column align-items-center justify-content-center py-5">
              <i class="bi bi-bar-chart-line fs-1 text-muted"></i>
              <p class="text-muted mt-3 mb-0">Biểu đồ sẽ được hiển thị khi kết nối API</p>
              <small class="text-muted">Tích hợp Chart.js hoặc ApexCharts</small>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Phân bố người dùng</h5>
            </div>
            <div class="card-body d-flex flex-column align-items-center justify-content-center py-5">
              <i class="bi bi-pie-chart fs-1 text-muted"></i>
              <p class="text-muted mt-3 mb-0">Biểu đồ sẽ được hiển thị khi kết nối API</p>
              <small class="text-muted">Tích hợp Chart.js hoặc ApexCharts</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>Hoạt động gần đây</h5>
        </div>
        <div class="card-body p-0">
          <ul class="list-group list-group-flush">
            <li v-for="(activity, index) in recentActivities" :key="index" class="list-group-item d-flex justify-content-between align-items-start flex-wrap gap-2">
              <span>
                <i class="bi me-2" :class="activity.icon"></i>
                {{ activity.message }}
              </span>
              <small class="text-muted">{{ activity.time }}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import UserService from '@/services/UserService'
import MockVideoService from '@/services/MockVideoService'

const stats = reactive({
  totalUsers: 0,
  totalVideos: 0,
  totalViews: '0',
  totalLikes: 0
})

const recentActivities = ref([
  { icon: 'bi-person-plus text-success', message: 'Người dùng mới đăng ký: john_doe', time: '2 phút trước' },
  { icon: 'bi-play text-primary', message: 'Video mới được upload: "Vue 3 Tutorial"', time: '15 phút trước' },
  { icon: 'bi-heart text-danger', message: 'Video "React Guide" đạt 1000 likes', time: '1 giờ trước' },
  { icon: 'bi-flag text-warning', message: 'Báo cáo vi phạm mới từ user123', time: '3 giờ trước' },
  { icon: 'bi-person-check text-info', message: 'Admin đã xác minh tài khoản: jane_smith', time: '5 giờ trước' },
  { icon: 'bi-trash text-secondary', message: 'Video vi phạm đã bị xóa', time: '1 ngày trước' }
])

const loadStats = async () => {
  try {
    const userStats = await UserService.getStatistics()
    if (userStats.success) {
      stats.totalUsers = userStats.data.totalUsers
    }

    const videoStats = await MockVideoService.getStatistics()
    if (videoStats.success) {
      stats.totalVideos = videoStats.data.totalVideos
      stats.totalViews = videoStats.data.totalViews
      stats.totalLikes = videoStats.data.totalLikes
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

onMounted(loadStats)
</script>
