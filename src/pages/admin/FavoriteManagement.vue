<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <PageHeader
        title="Quản lý Yêu thích"
        description="Quản lý danh sách video yêu thích của người dùng"
        icon="bi-heart"
      >
        <template #actions>
          <button 
            class="btn btn-primary" 
            data-bs-toggle="modal"
            data-bs-target="#favoriteModal"
            @click="openCreateModal"
          >
            <i class="bi bi-plus-lg me-2"></i>Thêm mới
          </button>
        </template>
      </PageHeader>

      <!-- Search -->
      <SearchBar
        v-model="searchKeyword"
        placeholder="Tìm kiếm theo user, video..."
        @search="handleSearch"
        @reset="resetSearch"
      />

      <!-- Favorite Table -->
      <DataTable
        :data="items"
        :columns="tableColumns"
        :loading="loading"
        loading-text="Đang tải..."
        empty-text="Không có dữ liệu yêu thích"
        empty-icon="bi-heart"
      >
        <!-- User Column -->
        <template #cell-userId="{ item }">
          <span class="badge bg-info">{{ item.user?.id || item.userId || '-' }}</span>
        </template>

        <!-- Video Column -->
        <template #cell-videoId="{ item }">
          <span class="badge bg-primary">{{ item.video?.id || item.videoId || '-' }}</span>
        </template>

        <!-- Video Title -->
        <template #cell-videoTitle="{ item }">
          {{ item.video?.title || '-' }}
        </template>

        <!-- Date Column -->
        <template #cell-likeDate="{ value }">
          {{ formatDate(value) }}
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-info"
              data-bs-toggle="modal"
              data-bs-target="#favoriteModal"
              @click="openViewModal(item)"
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

      <!-- Create/Edit Modal -->
      <div class="modal fade" id="favoriteModal" tabindex="-1" ref="modalRef">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-heart me-2"></i>
                {{ modalMode === 'create' ? 'Thêm yêu thích' : 'Chi tiết yêu thích' }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <!-- View Mode -->
              <div v-if="modalMode === 'view'">
                <div class="mb-3">
                  <label class="form-label fw-bold">ID:</label>
                  <p>{{ currentItem.id }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">Người dùng:</label>
                  <p><span class="badge bg-info">{{ currentItem.user?.id || currentItem.userId }}</span></p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">Video:</label>
                  <p>
                    <span class="badge bg-primary">{{ currentItem.video?.id || currentItem.videoId }}</span>
                    <span class="ms-2">{{ currentItem.video?.title || '' }}</span>
                  </p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold">Ngày thích:</label>
                  <p>{{ formatDate(currentItem.likeDate) }}</p>
                </div>
              </div>

              <!-- Create Mode -->
              <form v-else @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label">User ID <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.userId"
                    required
                    placeholder="Nhập ID người dùng"
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Video ID <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.videoId"
                    required
                    placeholder="Nhập ID video"
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Ngày thích</label>
                  <input 
                    type="datetime-local" 
                    class="form-control" 
                    v-model="formData.likeDate"
                  >
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                {{ modalMode === 'view' ? 'Đóng' : 'Hủy' }}
              </button>
              <button 
                v-if="modalMode === 'create'"
                type="button" 
                class="btn btn-primary" 
                @click="handleSubmit"
                :disabled="submitting"
              >
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import DataTable from '@/components/ui/DataTable.vue'
import FavoriteService from '@/services/factories/FavoriteService'
import VideoService from '@/services/factories/VideoService'

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'userId', label: 'Người dùng' },
  { key: 'videoId', label: 'Video ID' },
  { key: 'videoTitle', label: 'Tên video' },
  { key: 'likeDate', label: 'Ngày thích' },
  { key: 'actions', label: 'Thao tác' }
]

const items = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const modalRef = ref(null)
const modalMode = ref('create') // 'create', 'view'
const currentItem = ref({})
const submitting = ref(false)

const formData = ref({
  userId: '',
  videoId: '',
  likeDate: ''
})

// Video map để lưu thông tin video
const videoMap = ref({})

// Load videos để lấy title
const loadVideos = async () => {
  try {
    const result = await VideoService.getAllVideos()
    if (result.success && result.data) {
      result.data.forEach(video => {
        videoMap.value[video.id] = video
      })
    }
  } catch (err) {
    console.error('Error loading videos:', err)
  }
}

// Load items
const loadItems = async () => {
  loading.value = true
  try {
    // Load videos first để có title
    await loadVideos()
    
    const result = await FavoriteService.getAllFavorites()
    if (result.success) {
      // Enrich favorites với video title
      items.value = (result.data || []).map(item => {
        const videoId = item.video?.id || item.videoId
        const videoInfo = videoMap.value[videoId]
        return {
          ...item,
          video: {
            ...item.video,
            id: videoId,
            title: item.video?.title || videoInfo?.title || '-'
          }
        }
      })
    } else {
      window.Toast?.error(result.error || 'Không thể tải danh sách')
    }
  } catch (err) {
    window.Toast?.error(err.message)
  } finally {
    loading.value = false
  }
}

// Modal functions
const openCreateModal = () => {
  modalMode.value = 'create'
  currentItem.value = {}
  formData.value = {
    userId: '',
    videoId: '',
    likeDate: new Date().toISOString().slice(0, 16)
  }
}

const openViewModal = (item) => {
  modalMode.value = 'view'
  currentItem.value = item
}

// CRUD operations
const handleSubmit = async () => {
  if (!formData.value.userId || !formData.value.videoId) {
    window.Toast?.warning('Vui lòng nhập đầy đủ thông tin')
    return
  }

  submitting.value = true
  try {
    let result
    const payload = {
      user: { id: formData.value.userId },
      video: { id: formData.value.videoId }
    }

    result = await FavoriteService.create(payload)

    if (result.success) {
      window.Toast?.success('Thêm thành công')
      // Close modal using Bootstrap
      const modal = window.bootstrap?.Modal.getInstance(modalRef.value)
      modal?.hide()
      loadItems()
    } else {
      window.Toast?.error(result.error || 'Thao tác thất bại')
    }
  } catch (err) {
    window.Toast?.error(err.message)
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (item) => {
  if (!confirm(`Bạn có chắc muốn xóa yêu thích này?`)) return
  
  try {
    const result = await FavoriteService.removeFavorite(item.id)
    if (result.success) {
      items.value = items.value.filter(i => i.id !== item.id)
      window.Toast?.success('Đã xóa thành công')
    } else {
      window.Toast?.error(result.error || 'Không thể xóa')
    }
  } catch (err) {
    window.Toast?.error(err.message)
  }
}

// Search
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    loadItems()
    return
  }
  
  loading.value = true
  try {
    const result = await FavoriteService.getAllFavorites()
    if (result.success) {
      const keyword = searchKeyword.value.toLowerCase()
      items.value = (result.data || []).filter(item => 
        (item.user?.id || item.userId || '').toLowerCase().includes(keyword) ||
        (item.video?.id || item.videoId || '').toLowerCase().includes(keyword) ||
        (item.video?.title || '').toLowerCase().includes(keyword)
      )
    }
  } catch (err) {
    window.Toast?.error(err.message)
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchKeyword.value = ''
  loadItems()
}

// Helpers
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN')
}

onMounted(() => {
  loadItems()
})
</script>

<style scoped>
.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}
</style>
