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
              class="btn btn-outline-primary"
              @click="viewComment(item)"
              title="Xem"
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
  if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

  loading.value = true
  try {
    const result = await CommentService.deleteComment(id)
    if (result.success) {
      alert(result.message || 'Xóa bình luận thành công')
      await loadItems()
    } else {
      alert(result.error || 'Không thể xóa bình luận')
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
    alert('Có lỗi xảy ra khi xóa bình luận')
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
  deleteItem(comment.id)
}

const viewComment = (comment) => {
  alert(`Nội dung: ${comment.content}`)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN')
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
