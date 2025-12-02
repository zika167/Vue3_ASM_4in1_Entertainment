<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <PageHeader
        title="Quản lý Yêu thích"
        description="Quản lý danh sách video yêu thích của người dùng"
        icon="bi-heart"
      />

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
        <template #cell-userId="{ value }">
          <span class="badge bg-info">{{ value }}</span>
        </template>

        <!-- Video Column -->
        <template #cell-videoId="{ value }">
          <span class="badge bg-primary">{{ value }}</span>
        </template>

        <!-- Date Column -->
        <template #cell-likeDate="{ value }">
          {{ formatDate(value) }}
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <button
            class="btn btn-sm btn-outline-danger"
            @click="handleDelete(item)"
            title="Xóa"
          >
            <i class="bi bi-trash"></i>
          </button>
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
 * TODO: [DEV 5] Cần tạo FavoriteService để trang này hoạt động
 * Xem hướng dẫn: documents/7_DEV_NEXT_STEPS.md
 */

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'userId', label: 'Người dùng' },
  { key: 'videoId', label: 'Video ID' },
  { key: 'likeDate', label: 'Ngày thích' },
  { key: 'actions', label: 'Thao tác' }
]

const items = ref([])
const loading = ref(false)
const searchKeyword = ref('')

const loadItems = () => {
  // TODO: [DEV 5] Implement với FavoriteService
  console.log('[DEV 5] TODO: Load favorites')
}

const deleteItem = (id) => {
  // TODO: [DEV 5] Implement với FavoriteService
  console.log('[DEV 5] TODO: Delete favorite:', id)
}

const resetSearch = () => {
  searchKeyword.value = ''
}

const handleSearch = () => loadItems()

const handleDelete = (favorite) => {
  deleteItem(favorite.id, `Bạn có chắc muốn xóa?`)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN')
}

loadItems()
</script>
