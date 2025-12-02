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
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#videoModal"
            @click="openCreateModal"
          >
            <i class="bi bi-plus-circle me-2"></i>Thêm video
          </button>
        </template>
      </PageHeader>

      <!-- Search -->
      <SearchBar
        v-model="searchKeyword"
        placeholder="Tìm kiếm video..."
        @search="handleSearch"
        @reset="resetSearch"
      />

      <!-- Video Table -->
      <DataTable
        :data="items"
        :columns="tableColumns"
        :loading="loading"
        loading-text="Đang tải..."
        empty-text="Không tìm thấy video nào"
        empty-icon="bi-film"
      >
        <!-- Thumbnail Column -->
        <template #cell-thumbnail="{ value, item }">
          <img :src="value" width="80" class="rounded" :alt="item.title" />
        </template>

        <!-- Title Column -->
        <template #cell-title="{ value, item }">
          <div class="video-title-cell">{{ value }}</div>
          <div class="d-md-none small text-muted">{{ item.channelName }}</div>
        </template>

        <!-- Views Column -->
        <template #cell-views="{ value }">
          {{ value }}
        </template>

        <!-- Likes Column -->
        <template #cell-likes="{ value }">
          {{ value?.toLocaleString() }}
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-primary"
              data-bs-toggle="modal"
              data-bs-target="#videoModal"
              @click="openEditModal(item)"
              title="Sửa"
            >
              <i class="bi bi-pencil"></i>
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

    <!-- Video Modal -->
    <div class="modal fade" id="videoModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Sửa video' : 'Thêm video mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tiêu đề *</label>
              <input type="text" class="form-control" v-model="formData.title" required />
            </div>
            <div class="mb-3">
              <label class="form-label">URL Thumbnail</label>
              <input
                type="url"
                class="form-control"
                v-model="formData.thumbnail"
                placeholder="https://..."
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Tên kênh *</label>
              <input type="text" class="form-control" v-model="formData.channelName" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Thời lượng</label>
              <input
                type="text"
                class="form-control"
                v-model="formData.duration"
                placeholder="12:34"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleSubmit"
              :disabled="submitting"
            >
              <span v-if="submitting">
                <span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...
              </span>
              <span v-else>{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import DataTable from '@/components/ui/DataTable.vue'
import { useCrudOperations } from '@/composables/useCrudOperations'
import { useModal } from '@/composables/useModal'
import VideoService from '@/services/factories/VideoService'

// DRY: Table columns configuration
const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'thumbnail', label: 'Thumbnail' },
  { key: 'title', label: 'Tiêu đề' },
  { key: 'channelName', label: 'Kênh', headerClass: 'd-none d-md-table-cell', cellClass: 'd-none d-md-table-cell' },
  { key: 'views', label: 'Lượt xem', headerClass: 'd-none d-lg-table-cell', cellClass: 'd-none d-lg-table-cell' },
  { key: 'likes', label: 'Likes', headerClass: 'd-none d-lg-table-cell', cellClass: 'd-none d-lg-table-cell' },
  { key: 'actions', label: 'Thao tác' }
]

// Use CRUD composable
const {
  items,
  loading,
  submitting,
  searchKeyword,
  loadItems,
  searchItems,
  createItem,
  updateItem,
  deleteItem,
  resetSearch
} = useCrudOperations(VideoService, {
  loadMethod: 'getAllVideos',
  searchMethod: 'searchVideos',
  itemName: 'video',
  itemNamePlural: 'video'
})

// Use Modal composable
const {
  modalRef,
  isEditMode,
  currentItemId,
  formData,
  openCreateModal,
  openEditModal,
  hideModal
} = useModal({
  id: null,
  title: '',
  thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  channelName: '',
  duration: '00:00'
})

// Handlers
const handleSearch = () => searchItems(searchKeyword.value)

const handleSubmit = async () => {
  if (!formData.value.title || !formData.value.channelName) {
    window.Toast?.error('Vui lòng điền đầy đủ thông tin')
    return
  }

  // Simulate save (MockVideoService doesn't have create/update)
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  
  window.Toast?.success(isEditMode.value ? 'Đã cập nhật video' : 'Đã thêm video mới')
  hideModal()
  submitting.value = false
}

const handleDelete = (video) => {
  if (confirm('Bạn có chắc muốn xóa video này?')) {
    items.value = items.value.filter(v => v.id !== video.id)
    window.Toast?.success('Đã xóa video')
  }
}

// Initialize
loadItems()
</script>

<style scoped>
.video-title-cell {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .video-title-cell {
    max-width: 150px;
  }
}
</style>
