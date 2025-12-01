<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <PageHeader
        title="Báo cáo & Thống kê"
        description="Xem báo cáo và thống kê hệ thống"
        icon="bi-bar-chart"
      />

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <StatCard
          v-for="stat in statsConfig"
          :key="stat.key"
          v-bind="stat"
          :value="stats[stat.key]"
          centered
        />
      </div>

      <!-- Charts Placeholder -->
      <div class="row g-3 mb-4">
        <div v-for="chart in chartsConfig" :key="chart.title" class="col-lg-6">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi me-2" :class="chart.icon"></i>{{ chart.title }}
              </h5>
            </div>
            <div class="card-body d-flex flex-column align-items-center justify-content-center py-5">
              <i class="bi fs-1 text-muted" :class="chart.placeholderIcon"></i>
              <p class="text-muted mt-3 mb-0">{{ chart.placeholderText }}</p>
              <small class="text-muted">{{ chart.placeholderHint }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-clock-history me-2"></i>Hoạt động gần đây
          </h5>
        </div>
        <div class="card-body p-0">
          <ul class="list-group list-group-flush">
            <li
              v-for="(activity, index) in recentActivities"
              :key="index"
              class="list-group-item d-flex justify-content-between align-items-start flex-wrap gap-2"
            >
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
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import UserService from '@/services/UserService'
import VideoService from '@/services/VideoService'

// DRY: Statistics configuration
const statsConfig = [
  {
    key: 'totalUsers',
    label: 'Tổng người dùng',
    icon: 'bi-people',
    color: 'primary',
    colClass: 'col-lg-3',
    formatNumber: true
  },
  {
    key: 'totalVideos',
    label: 'Tổng video',
    icon: 'bi-play-circle',
    color: 'success',
    colClass: 'col-lg-3',
    formatNumber: true
  },
  {
    key: 'totalViews',
    label: 'Tổng lượt xem',
    icon: 'bi-eye',
    color: 'warning',
    colClass: 'col-lg-3'
  },
  {
    key: 'totalLikes',
    label: 'Tổng lượt thích',
    icon: 'bi-heart',
    color: 'danger',
    colClass: 'col-lg-3',
    formatNumber: true
  }
]

// DRY: Charts configuration
const chartsConfig = [
  {
    title: 'Lượt xem theo tháng',
    icon: 'bi-graph-up',
    placeholderIcon: 'bi-bar-chart-line',
    placeholderText: 'Biểu đồ sẽ được hiển thị khi kết nối API',
    placeholderHint: 'Tích hợp Chart.js hoặc ApexCharts'
  },
  {
    title: 'Phân bố người dùng',
    icon: 'bi-pie-chart',
    placeholderIcon: 'bi-pie-chart',
    placeholderText: 'Biểu đồ sẽ được hiển thị khi kết nối API',
    placeholderHint: 'Tích hợp Chart.js hoặc ApexCharts'
  }
]

// DRY: Recent activities configuration
const recentActivities = ref([
  {
    icon: 'bi-person-plus text-success',
    message: 'Người dùng mới đăng ký: john_doe',
    time: '2 phút trước'
  },
  {
    icon: 'bi-play text-primary',
    message: 'Video mới được upload: "Vue 3 Tutorial"',
    time: '15 phút trước'
  },
  {
    icon: 'bi-heart text-danger',
    message: 'Video "React Guide" đạt 1000 likes',
    time: '1 giờ trước'
  },
  {
    icon: 'bi-flag text-warning',
    message: 'Báo cáo vi phạm mới từ user123',
    time: '3 giờ trước'
  },
  {
    icon: 'bi-person-check text-info',
    message: 'Admin đã xác minh tài khoản: jane_smith',
    time: '5 giờ trước'
  },
  {
    icon: 'bi-trash text-secondary',
    message: 'Video vi phạm đã bị xóa',
    time: '1 ngày trước'
  }
])

const stats = reactive({
  totalUsers: 0,
  totalVideos: 0,
  totalViews: '0',
  totalLikes: 0
})

const loadStats = async () => {
  try {
    const userStats = await UserService.getStatistics()
    if (userStats.success) {
      stats.totalUsers = userStats.data.totalUsers
    }

    const videoStats = await VideoService.getStatistics()
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
