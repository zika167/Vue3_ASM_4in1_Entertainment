<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <PageHeader
        title="Quản lý Chia sẻ"
        description="Quản lý lịch sử chia sẻ video trong hệ thống"
        icon="bi-share"
      />

      <!-- Search -->
      <SearchBar
        v-model="searchKeyword"
        placeholder="Tìm kiếm theo email, video..."
        @search="handleSearch"
        @reset="resetSearch"
      />

      <!-- Share Table -->
      <DataTable
        :data="items"
        :columns="tableColumns"
        :loading="loading"
        loading-text="Đang tải..."
        empty-text="Không có lịch sử chia sẻ"
        empty-icon="bi-share"
      >
        <!-- Video Column -->
        <template #cell-videoId="{ value }">
          <span class="badge bg-primary">{{ value }}</span>
        </template>

        <!-- Emails Column -->
        <template #cell-emails="{ value }">
          <div class="emails-cell">
            {{ formatEmails(value) }}
          </div>
        </template>

        <!-- Date Column -->
        <template #cell-shareDate="{ value }">
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
 * TODO: [DEV 3] Cần tạo ShareService để trang này hoạt động
 * Xem hướng dẫn: documents/7_DEV_NEXT_STEPS.md
 */

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'userId', label: 'Người chia sẻ' },
  { key: 'videoId', label: 'Video ID' },
  { key: 'emails', label: 'Email nhận' },
  { key: 'shareDate', label: 'Ngày chia sẻ' },
  { key: 'actions', label: 'Thao tác' }
]

const items = ref([])
const loading = ref(false)
const searchKeyword = ref('')

const loadItems = () => {
  // TODO: [DEV 3] Implement với ShareService
  console.log('[DEV 3] TODO: Load shares')
}

const deleteItem = (id) => {
  // TODO: [DEV 3] Implement với ShareService
  console.log('[DEV 3] TODO: Delete share:', id)
}

const resetSearch = () => {
  searchKeyword.value = ''
}

const handleSearch = () => {
  // Filter locally since no search API
  loadItems()
}

const handleDelete = (share) => {
  deleteItem(share.id, `Bạn có chắc muốn xóa lịch sử chia sẻ này?`)
}

const formatEmails = (emails) => {
  if (!emails) return '-'
  const arr = emails.split(';')
  return arr.length > 2 ? `${arr[0]}, +${arr.length - 1} khác` : arr.join(', ')
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN')
}

loadItems()
</script>

<style scoped>
.emails-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
