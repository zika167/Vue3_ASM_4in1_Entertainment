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
import { ref } from 'vue'

/**
 * TODO: [DEV 4] Cần tạo CommentService để trang này hoạt động
 * Xem hướng dẫn: documents/7_DEV_NEXT_STEPS.md
 */

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

const loadItems = () => {
  // TODO: [DEV 4] Implement với CommentService
  console.log('[DEV 4] TODO: Load comments')
}

const deleteItem = (id) => {
  // TODO: [DEV 4] Implement với CommentService
  console.log('[DEV 4] TODO: Delete comment:', id)
}

const resetSearch = () => {
  searchKeyword.value = ''
}

const handleSearch = () => loadItems()

const handleDelete = (comment) => {
  deleteItem(comment.id, `Bạn có chắc muốn xóa bình luận này?`)
}

const viewComment = (comment) => {
  alert(`Nội dung: ${comment.content}`)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN')
}

loadItems()
</script>

<style scoped>
.content-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
