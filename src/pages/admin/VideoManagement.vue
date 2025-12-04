<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <PageHeader
        title="Quản lý Video"
        description="Quản lý video trong hệ thống"
        icon="bi-play-circle"
      >
        <template #actions>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#videoModal" @click="openCreateModal">
            <i class="bi bi-plus-circle me-2"></i>Thêm video
          </button>
        </template>
      </PageHeader>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <StatCard v-for="stat in statsConfig" :key="stat.key" v-bind="stat" :value="statistics[stat.key]" />
      </div>

      <!-- Search & Filter -->
      <SearchBar v-model="searchKeyword" placeholder="Tìm kiếm video..." @search="handleSearch" @reset="resetFilters">
        <template #filters>
          <div class="col-6 col-md-3">
            <select class="form-select" v-model="filterStatus" @change="handleFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </template>
      </SearchBar>

      <!-- Video Table -->
      <DataTable :data="filteredItems" :columns="tableColumns" :loading="loading" loading-text="Đang tải..." empty-text="Không tìm thấy video nào" empty-icon="bi-film">
        <template #cell-poster="{ value, item }">
          <img :src="getThumbnail(item)" width="100" class="rounded" :alt="item.title" />
        </template>
        <template #cell-title="{ value, item }">
          <div class="video-title-cell fw-semibold">{{ value }}</div>
          <small class="text-muted">ID: {{ item.id }}</small>
        </template>
        <template #cell-views="{ value }">
          <span class="badge bg-info">{{ formatNumber(value) }}</span>
        </template>
        <template #cell-active="{ value }">
          <span class="badge" :class="value ? 'bg-success' : 'bg-secondary'">{{ value ? 'Hoạt động' : 'Ẩn' }}</span>
        </template>
        <template #cell-actions="{ item }">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-info" @click="previewVideo(item)" title="Xem trước"><i class="bi bi-eye"></i></button>
            <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#videoModal" @click="openEditModal(item)" title="Sửa"><i class="bi bi-pencil"></i></button>
            <button class="btn" :class="item.active ? 'btn-outline-success' : 'btn-outline-secondary'" @click="toggleActive(item)" :title="item.active ? 'Ẩn video' : 'Hiện video'"><i class="bi" :class="item.active ? 'bi-toggle-on' : 'bi-toggle-off'"></i></button>
            <button class="btn btn-outline-danger" @click="handleDelete(item)" title="Xóa"><i class="bi bi-trash"></i></button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Video Modal (Create/Edit) -->
    <div class="modal fade" id="videoModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title"><i class="bi bi-camera-video me-2"></i>{{ isEditMode ? 'Chỉnh sửa video' : 'Thêm video mới' }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <!-- Video ID (only for create) -->
                <div class="col-md-6" v-if="!isEditMode">
                  <label class="form-label">ID Video *</label>
                  <input type="text" class="form-control" :class="{ 'is-invalid': formErrors.id }" v-model="formData.id" placeholder="vid001" />
                  <div v-if="formErrors.id" class="invalid-feedback">{{ formErrors.id }}</div>
                  <small class="form-text text-muted">Chỉ chữ cái, số và dấu gạch dưới</small>
                </div>

                <!-- Title -->
                <div :class="isEditMode ? 'col-12' : 'col-md-6'">
                  <label class="form-label">Tiêu đề *</label>
                  <input type="text" class="form-control" :class="{ 'is-invalid': formErrors.title }" v-model="formData.title" placeholder="Nhập tiêu đề video" @input="validateTitle" />
                  <div v-if="formErrors.title" class="invalid-feedback">{{ formErrors.title }}</div>
                </div>

                <!-- Video URL (YouTube) -->
                <div class="col-12">
                  <label class="form-label">URL Video (YouTube) *</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-youtube text-danger"></i></span>
                    <input type="url" class="form-control" :class="{ 'is-invalid': formErrors.poster }" v-model="formData.poster" placeholder="https://www.youtube.com/watch?v=..." @input="handleVideoUrlChange" />
                    <button type="button" class="btn btn-outline-secondary" @click="previewYouTube" :disabled="!youtubeVideoId">
                      <i class="bi bi-play-circle"></i> Xem trước
                    </button>
                  </div>
                  <div v-if="formErrors.poster" class="invalid-feedback d-block">{{ formErrors.poster }}</div>
                  <small class="form-text text-muted">Hỗ trợ: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...</small>
                </div>

                <!-- YouTube Preview -->
                <div v-if="showYouTubePreview && youtubeVideoId" class="col-12">
                  <div class="youtube-preview rounded overflow-hidden">
                    <iframe :src="`https://www.youtube.com/embed/${youtubeVideoId}`" class="w-100" style="aspect-ratio: 16/9;" frameborder="0" allowfullscreen></iframe>
                  </div>
                </div>

                <!-- Description -->
                <div class="col-12">
                  <label class="form-label">Mô tả</label>
                  <textarea class="form-control" :class="{ 'is-invalid': formErrors.description }" v-model="formData.description" rows="3" placeholder="Mô tả video..." @input="validateDescription"></textarea>
                  <div v-if="formErrors.description" class="invalid-feedback">{{ formErrors.description }}</div>
                  <small class="form-text text-muted">{{ (formData.description || '').length }}/1000 ký tự</small>
                </div>

                <!-- Active Status -->
                <div class="col-md-6">
                  <label class="form-label">Trạng thái</label>
                  <select class="form-select" v-model="formData.active">
                    <option :value="true">Hoạt động</option>
                    <option :value="false">Ẩn</option>
                  </select>
                </div>

                <!-- User ID -->
                <div class="col-md-6">
                  <label class="form-label">User ID (chủ sở hữu)</label>
                  <input type="text" class="form-control" v-model="formData.userId" disabled readonly />
                  <small class="form-text text-muted">Tự động lấy từ tài khoản đăng nhập</small>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit" :disabled="submitting || !isFormValid">
              <span v-if="submitting"><span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...</span>
              <span v-else><i class="bi bi-check-circle me-2"></i>{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div class="modal fade" id="previewModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ previewVideoData.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-0">
            <div v-if="previewVideoId" class="ratio ratio-16x9">
              <iframe :src="`https://www.youtube.com/embed/${previewVideoId}`" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>


<script setup>
/**
 * VideoManagement.vue - Quản lý video (Admin)
 * Features: CRUD video, YouTube URL validation, Preview
 * @author DEV 2 - Video Module
 */
import { ref, computed } from 'vue'
import { Modal } from 'bootstrap'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import DataTable from '@/components/ui/DataTable.vue'
import { useCrudOperations } from '@/composables/useCrudOperations'
import { useModal } from '@/composables/useModal'
import VideoService from '@/services/factories/VideoService'
import Validation from '@/utils/validation'
import Helpers from '@/utils/helpers'

// Statistics config
const statsConfig = [
  { key: 'totalVideos', label: 'Tổng video', icon: 'bi-play-circle', color: 'primary', colClass: 'col-lg-3' },
  { key: 'activeVideos', label: 'Đang hoạt động', icon: 'bi-check-circle', color: 'success', colClass: 'col-lg-3' },
  { key: 'totalViews', label: 'Tổng lượt xem', icon: 'bi-eye', color: 'info', colClass: 'col-lg-3' },
  { key: 'thisMonth', label: 'Video tháng này', icon: 'bi-calendar', color: 'warning', colClass: 'col-lg-3' }
]

// Table columns
const tableColumns = [
  { key: 'poster', label: 'Thumbnail' },
  { key: 'title', label: 'Tiêu đề' },
  { key: 'views', label: 'Lượt xem', headerClass: 'd-none d-md-table-cell', cellClass: 'd-none d-md-table-cell' },
  { key: 'active', label: 'Trạng thái' },
  { key: 'actions', label: 'Thao tác' }
]

// CRUD composable
const { items, loading, submitting, searchKeyword, statistics, loadItems, loadStatistics, createItem, updateItem, deleteItem, resetSearch } = useCrudOperations(VideoService, {
  loadMethod: 'getAllVideos', createMethod: 'createVideo', updateMethod: 'updateVideo', deleteMethod: 'deleteVideo',
  searchMethod: 'searchVideos', statisticsMethod: 'getStatistics', itemName: 'video', itemNamePlural: 'video'
})

// Modal composable
const { modalRef, isEditMode, currentItemId, formData, openCreateModal: baseOpenCreate, openEditModal: baseOpenEdit, hideModal } = useModal({
  id: '', title: '', poster: '', thumbnail: '', description: '', active: true, userId: ''
})

// Additional state
const filterStatus = ref('')
const formErrors = ref({})
const showYouTubePreview = ref(false)
const previewVideoData = ref({})
const previewVideoId = ref('')

// Get current logged in user
const getCurrentUserId = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return user.id || user.userId || ''
    }
  } catch (e) {
    console.error('Error getting current user:', e)
  }
  return ''
}

// Computed: YouTube video ID from form
const youtubeVideoId = computed(() => Validation.extractYouTubeVideoId(formData.value.poster))

// Computed: Thumbnail preview
// Placeholder image as data URI (no external dependency)
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect fill="%23e9ecef" width="320" height="180"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Thumbnail%3C/text%3E%3C/svg%3E'

const thumbnailPreview = computed(() => {
  if (formData.value.thumbnail) return formData.value.thumbnail
  if (youtubeVideoId.value) return Validation.getYouTubeThumbnailUrl(youtubeVideoId.value, 'medium')
  return placeholderImage
})

// Computed: Filtered items
const filteredItems = computed(() => {
  let result = [...items.value]
  if (filterStatus.value === 'active') result = result.filter(v => v.active === true)
  else if (filterStatus.value === 'inactive') result = result.filter(v => v.active === false)
  return result
})

// Computed: Form validation
const isFormValid = computed(() => {
  const hasTitle = formData.value.title?.trim()
  const hasPoster = formData.value.poster?.trim()
  const hasId = isEditMode.value || formData.value.id?.trim()
  const noErrors = Object.values(formErrors.value).every(e => !e)
  return hasTitle && hasPoster && hasId && noErrors
})

// ========================================
// METHODS
// ========================================

const openCreateModal = () => {
  baseOpenCreate()
  formData.value.userId = getCurrentUserId()
  formErrors.value = {}
  showYouTubePreview.value = false
}

const openEditModal = (item) => {
  baseOpenEdit(item)
  // Nếu video không có userId, lấy từ user đang đăng nhập
  if (!formData.value.userId) {
    formData.value.userId = getCurrentUserId()
  }
  formErrors.value = {}
  showYouTubePreview.value = false
}

const validateTitle = () => {
  const check = Validation.isValidVideoTitle(formData.value.title)
  formErrors.value.title = check.valid ? '' : check.message
}

const validateDescription = () => {
  const check = Validation.isValidVideoDescription(formData.value.description)
  formErrors.value.description = check.valid ? '' : check.message
}

const handleVideoUrlChange = () => {
  if (formData.value.poster) {
    const check = Validation.isValidVideoUrl(formData.value.poster)
    formErrors.value.poster = check.valid ? '' : check.message
  } else {
    formErrors.value.poster = ''
  }
}

const previewYouTube = () => { showYouTubePreview.value = !showYouTubePreview.value }

const handleSearch = () => {
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    items.value = items.value.filter(v => v.title?.toLowerCase().includes(keyword) || v.description?.toLowerCase().includes(keyword))
  } else {
    loadItems()
  }
}

const handleFilter = () => { /* filteredItems computed handles this */ }

const resetFilters = async () => {
  filterStatus.value = ''
  resetSearch()
  
  // Bật tất cả video inactive thành active (không cần xác nhận)
  const inactiveVideos = items.value.filter(v => v.active === false)
  if (inactiveVideos.length > 0) {
    for (const video of inactiveVideos) {
      await VideoService.toggleActive(video.id)
    }
    await loadItems()
    loadStatistics()
  }
}

const handleSubmit = async () => {
  // Validate all
  validateTitle()
  handleVideoUrlChange()
  validateDescription()
  if (!isFormValid.value) { window.Toast?.error('Vui lòng kiểm tra lại thông tin'); return }

  // Prepare data
  const videoData = {
    id: formData.value.id,
    title: formData.value.title.trim(),
    poster: formData.value.poster.trim(),
    description: formData.value.description?.trim() || '',
    active: formData.value.active,
    userId: formData.value.userId || 'admin'
  }

  const result = isEditMode.value ? await updateItem(currentItemId.value, videoData) : await createItem(videoData)
  if (result.success) hideModal()
}

const handleDelete = (video) => { deleteItem(video.id, `Bạn có chắc muốn xóa video "${video.title}"?`) }

const toggleActive = async (video) => {
  console.log('Toggle active for video:', video.id, 'Current active:', video.active)
  const result = await VideoService.toggleActive(video.id)
  console.log('Toggle result:', result)
  if (result.success) {
    window.Toast?.success('Đã cập nhật trạng thái')
    await loadItems()
    loadStatistics()
  } else {
    window.Toast?.error(result.error || 'Lỗi cập nhật trạng thái')
  }
}

const previewVideo = (video) => {
  previewVideoData.value = video
  previewVideoId.value = Validation.extractYouTubeVideoId(video.poster) || ''
  const modal = new Modal(document.getElementById('previewModal'))
  modal.show()
}

const getThumbnail = (video) => {
  if (video.thumbnail) return video.thumbnail
  const videoId = Validation.extractYouTubeVideoId(video.poster)
  if (videoId) return Validation.getYouTubeThumbnailUrl(videoId, 'medium')
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="56" viewBox="0 0 100 56"%3E%3Crect fill="%23e9ecef" width="100" height="56"/%3E%3Ctext fill="%236c757d" font-family="Arial" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
}

const formatNumber = (num) => Helpers.formatNumber(num || 0)

// Initialize
loadItems()
loadStatistics()
</script>


<style scoped>
.video-title-cell { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.youtube-preview { border: 2px solid #dee2e6; }
.is-invalid { border-color: #dc3545 !important; }
.invalid-feedback { color: #dc3545; font-size: 0.875rem; }
@media (max-width: 768px) { .video-title-cell { max-width: 150px; } }
</style>
