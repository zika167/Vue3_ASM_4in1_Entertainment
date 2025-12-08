<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <PageHeader
        title="Quản lý Chia sẻ"
        description="Quản lý lịch sử chia sẻ video trong hệ thống"
        icon="bi-share"
      />

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <StatCard
            title="Tổng chia sẻ"
            :value="statistics.total || 0"
            icon="bi-share"
            color="primary"
          />
        </div>
        <div class="col-md-3">
          <StatCard
            title="Hôm nay"
            :value="statistics.today || 0"
            icon="bi-calendar-check"
            color="success"
          />
        </div>
        <div class="col-md-3">
          <StatCard
            title="Tuần này"
            :value="statistics.thisWeek || 0"
            icon="bi-calendar-week"
            color="info"
          />
        </div>
        <div class="col-md-3">
          <StatCard
            title="Tháng này"
            :value="statistics.thisMonth || 0"
            icon="bi-calendar-month"
            color="warning"
          />
        </div>
      </div>

      <!-- Search -->
      <SearchBar
        v-model="searchKeyword"
        placeholder="Tìm kiếm theo email, video ID, user ID..."
        @search="handleSearch"
        @reset="resetSearch"
      />

      <!-- Share Table -->
      <DataTable
        :data="filteredItems"
        :columns="tableColumns"
        :loading="loading"
        loading-text="Đang tải dữ liệu..."
        empty-text="Không có lịch sử chia sẻ"
        empty-icon="bi-share"
      >
        <!-- ID Column -->
        <template #cell-id="{ value }">
          <span class="badge bg-secondary">#{{ value }}</span>
        </template>

        <!-- User Column -->
        <template #cell-userId="{ value }">
          <span class="fw-medium">{{ value }}</span>
        </template>

        <!-- Video Column -->
        <template #cell-videoId="{ value }">
          <router-link 
            :to="`/video/${value}`" 
            class="badge bg-primary text-decoration-none"
            target="_blank"
          >
            {{ value }}
          </router-link>
        </template>

        <!-- Emails Column -->
        <template #cell-emails="{ value }">
          <div class="emails-cell" :title="value">
            {{ formatEmails(value) }}
          </div>
        </template>

        <!-- Date Column -->
        <template #cell-shareDate="{ value }">
          <span class="text-muted">
            <i class="bi bi-clock me-1"></i>
            {{ formatDate(value) }}
          </span>
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-info"
              @click="viewShareDetail(item)"
              title="Xem chi tiết"
            >
              <i class="bi bi-eye"></i>
            </button>
            <button
              class="btn btn-outline-danger"
              @click="handleDelete(item)"
              title="Xóa"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </template>
      </DataTable>
    </div>
  </AdminLayout>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import DataTable from '@/components/ui/DataTable.vue'
import StatCard from '@/components/ui/StatCard.vue'
import ShareService from '@/services/factories/ShareService'

// Table columns configuration
const tableColumns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'userId', label: 'Người chia sẻ' },
  { key: 'videoId', label: 'Video ID' },
  { key: 'emails', label: 'Email nhận' },
  { key: 'shareDate', label: 'Ngày chia sẻ' },
  { key: 'actions', label: 'Thao tác', width: '120px' }
]

// State
const items = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedShare = ref(null)

// Statistics
const statistics = ref({
  total: 0,
  today: 0,
  thisWeek: 0,
  thisMonth: 0
})

// Computed: filtered items based on search
const filteredItems = computed(() => {
  if (!searchKeyword.value.trim()) {
    return items.value
  }
  
  const keyword = searchKeyword.value.toLowerCase().trim()
  return items.value.filter(item => {
    const userId = (item.userId || '').toLowerCase()
    const videoId = (item.videoId || '').toLowerCase()
    const emails = (item.emails || '').toLowerCase()
    
    return userId.includes(keyword) || 
           videoId.includes(keyword) || 
           emails.includes(keyword)
  })
})

// Load all shares
const loadItems = async () => {
  loading.value = true
  try {
    const result = await ShareService.getAllShares()
    if (result.success) {
      items.value = result.data || []
      calculateStatistics()
    } else {
      window.Toast?.error(result.error || 'Không thể tải dữ liệu')
    }
  } catch (error) {
    console.error('Error loading shares:', error)
    window.Toast?.error('Lỗi khi tải dữ liệu')
  } finally {
    loading.value = false
  }
}

// Calculate statistics from loaded data
const calculateStatistics = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  statistics.value = {
    total: items.value.length,
    today: items.value.filter(s => new Date(s.shareDate) >= today).length,
    thisWeek: items.value.filter(s => new Date(s.shareDate) >= weekAgo).length,
    thisMonth: items.value.filter(s => new Date(s.shareDate) >= monthAgo).length
  }
}

// Delete share
const deleteItem = async (id) => {
  try {
    const result = await ShareService.deleteShare(id)
    if (result.success) {
      items.value = items.value.filter(s => s.id !== id)
      calculateStatistics()
      window.Toast?.success(result.message || 'Đã xóa thành công')
    } else {
      window.Toast?.error(result.error || 'Không thể xóa')
    }
  } catch (error) {
    console.error('Error deleting share:', error)
    window.Toast?.error('Lỗi khi xóa')
  }
}

// Handle search
const handleSearch = () => {
  // Filtering is done via computed property
}

// Reset search
const resetSearch = () => {
  searchKeyword.value = ''
}

// Handle delete with confirmation
const handleDelete = (share) => {
  if (confirm(`Bạn có chắc muốn xóa lịch sử chia sẻ #${share.id}?`)) {
    deleteItem(share.id)
  }
}

// View share detail
const viewShareDetail = (share) => {
  selectedShare.value = share
  // Show detail in alert for simplicity
  const emails = share.emails ? share.emails.split(';').join('\n- ') : 'Không có'
  alert(`Chi tiết chia sẻ #${share.id}\n\nNgười chia sẻ: ${share.userId}\nVideo: ${share.videoId}\nEmail:\n- ${emails}\nNgày: ${formatDate(share.shareDate)}`)
}

// Format emails for display
const formatEmails = (emails) => {
  if (!emails) return '-'
  const arr = emails.split(';').filter(e => e.trim())
  if (arr.length === 0) return '-'
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return arr.join(', ')
  return `${arr[0]}, +${arr.length - 1} khác`
}

// Format date
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initialize
onMounted(() => {
  loadItems()
})
</script>

<style scoped>
.emails-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
