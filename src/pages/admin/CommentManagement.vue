<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <PageHeader
        title="Quản lý Bình luận"
        description="Quản lý bình luận video trong hệ thống"
        icon="bi-chat-dots"
      />

      <!-- Search -->
      <SearchBar
        v-model="searchKeyword"
        placeholder="Tìm kiếm bình luận..."
        @search="handleSearch"
        @reset="resetSearch"
      />

      <!-- Comment Detail Modal -->
      <div class="modal fade" id="commentDetailModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-info text-white">
              <h5 class="modal-title">
                <i class="bi bi-chat-dots me-2"></i>Chi tiết bình luận #{{ selectedComment?.id }}
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" v-if="selectedComment">
              <div class="mb-3">
                <label class="form-label fw-bold">Người bình luận:</label>
                <p class="mb-0">{{ selectedComment.userId }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Video ID:</label>
                <p class="mb-0">
                  <router-link :to="`/video/${selectedComment.videoId}`" target="_blank" class="text-primary">
                    {{ selectedComment.videoId }} <i class="bi bi-box-arrow-up-right ms-1"></i>
                  </router-link>
                </p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Nội dung:</label>
                <div class="p-3 bg-light rounded">{{ selectedComment.content }}</div>
              </div>
              <div class="mb-0">
                <label class="form-label fw-bold">Ngày tạo:</label>
                <p class="mb-0">
                  <i class="bi bi-calendar me-2 text-muted"></i>{{ formatDate(selectedComment.createdDate) }}
                </p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" @click="handleDeleteFromModal" data-bs-dismiss="modal">
                <i class="bi bi-trash me-2"></i>Xóa
              </button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Comment Table -->
      <DataTable
        :data="items"
        :columns="tableColumns"
        :loading="loading"
        loading-text="Đang tải..."
        empty-text="Không có bình luận nào"
        empty-icon="bi-chat"
      >
        <!-- Content Column -->
        <template #cell-content="{ value }">
          <div class="content-cell">{{ value }}</div>
        </template>

        <!-- Date Column -->
        <template #cell-createdDate="{ value }">
          {{ formatDate(value) }}
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-info"
              @click="viewComment(item)"
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
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import DataTable from '@/components/ui/DataTable.vue'
import CommentService from '@/services/factories/CommentService'
import { ref, onMounted } from 'vue'

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'userId', label: 'Người bình luận' },
  { key: 'videoId', label: 'Video ID' },
  { key: 'content', label: 'Nội dung' },
  { key: 'createdDate', label: 'Ngày tạo' },
  { key: 'actions', label: 'Thao tác' }
]

const items = ref([])
const loading = ref(false)
const searchKeyword = ref('')

const loadItems = async () => {
  loading.value = true
  try {
    const result = await CommentService.getAllComments()
    if (result.success) {
      items.value = result.data || []
    } else {
      console.error('Failed to load comments:', result.error)
      items.value = []
    }
  } catch (error) {
    console.error('Error loading comments:', error)
    items.value = []
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  loading.value = true
  try {
    const result = await CommentService.deleteComment(id)
    if (result.success) {
      window.Toast?.success(result.message || 'Xóa bình luận thành công')
      // Remove from local array instead of reloading
      items.value = items.value.filter(item => item.id !== id)
    } else {
      window.Toast?.error(result.error || 'Không thể xóa bình luận')
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
    window.Toast?.error('Có lỗi xảy ra khi xóa bình luận')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchKeyword.value = ''
  loadItems()
}

const handleSearch = () => loadItems()

const handleDelete = (comment) => {
  if (!confirm(`Bạn có chắc muốn xóa bình luận này?\n"${comment.content?.substring(0, 50)}..."`)) return
  deleteItem(comment.id)
}

// Selected comment for detail modal
const selectedComment = ref(null)

const viewComment = (comment) => {
  selectedComment.value = comment
  // Use Bootstrap modal - import dynamically
  import('bootstrap').then(({ Modal }) => {
    const modalEl = document.getElementById('commentDetailModal')
    if (modalEl) {
      const modal = new Modal(modalEl)
      modal.show()
    }
  }).catch(() => {
    // Fallback if bootstrap not available as module
    const Modal = window.bootstrap?.Modal
    if (Modal) {
      const modalEl = document.getElementById('commentDetailModal')
      if (modalEl) {
        const modal = new Modal(modalEl)
        modal.show()
      }
    }
  })
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN')
}

const handleDeleteFromModal = () => {
  if (selectedComment.value) {
    deleteItem(selectedComment.value.id)
  }
}

onMounted(loadItems)
</script>

<style scoped>
.content-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
