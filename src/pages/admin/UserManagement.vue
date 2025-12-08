<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <PageHeader
        title="Quản lý người dùng"
        description="Quản lý tài khoản người dùng trong hệ thống"
        icon="bi-people-fill"
      >
        <template #actions>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
            @click="openCreateModal"
          >
            <i class="bi bi-plus-circle me-2"></i>Thêm người dùng
          </button>
        </template>
      </PageHeader>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <StatCard
          v-for="stat in statsConfig"
          :key="stat.key"
          v-bind="stat"
          :value="statistics[stat.key]"
        />
      </div>

      <!-- Search and Filter -->
      <SearchBar
        v-model="searchKeyword"
        placeholder="Tìm kiếm theo tên, email..."
        @search="handleSearch"
        @reset="resetFilters"
      >
        <template #filters>
          <div class="col-6 col-md-3">
            <select class="form-select" v-model="filterRole" @change="handleFilter">
              <option value="">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng</option>
            </select>
          </div>
        </template>
      </SearchBar>

      <!-- Users Table -->
      <DataTable
        :data="items"
        :columns="tableColumns"
        :loading="loading"
        loading-text="Đang tải dữ liệu..."
        empty-text="Không tìm thấy người dùng nào"
        empty-icon="bi-inbox"
      >
        <!-- Fullname Column -->
        <template #cell-fullname="{ value }">
          <strong>{{ value }}</strong>
        </template>

        <!-- Role Column -->
        <template #cell-role="{ value }">
          <span class="badge" :class="value === 'admin' ? 'bg-danger' : 'bg-primary'">
            {{ value === 'admin' ? 'Admin' : 'User' }}
          </span>
        </template>

        <!-- Created Date Column -->
        <template #cell-createdAt="{ value }">
          <span class="text-muted small">{{ formatDate(value) }}</span>
        </template>

        <!-- Actions Column -->
        <template #cell-actions="{ item }">
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-primary"
              data-bs-toggle="modal"
              data-bs-target="#userModal"
              @click="openEditModal(item)"
              title="Sửa"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-outline-danger"
              @click="handleDelete(item)"
              title="Xóa"
              :disabled="item.role === 'admin'"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </template>
      </DataTable>

      <!-- User Modal (Create/Edit) -->
      <div class="modal fade" id="userModal" tabindex="-1" ref="modalRef">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label">ID người dùng *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.id"
                    :disabled="isEditMode"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Họ tên *</label>
                  <input type="text" class="form-control" v-model="formData.fullname" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" v-model="formData.email" required />
                </div>
                <div class="mb-3" v-if="!isEditMode">
                  <label class="form-label">Mật khẩu *</label>
                  <input type="password" class="form-control" v-model="formData.password" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Vai trò</label>
                  <select class="form-select" v-model="formData.admin">
                    <option :value="false">Người dùng</option>
                    <option :value="true">Quản trị viên</option>
                  </select>
                </div>
              </form>
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
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Đang xử lý...
                </span>
                <span v-else>
                  {{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import DataTable from '@/components/ui/DataTable.vue'
import { useCrudOperations } from '@/composables/useCrudOperations'
import { useModal } from '@/composables/useModal'
import UserService from '@/services/factories/UserService'
import Validation from '@/utils/validation'

// DRY: Statistics configuration
const statsConfig = [
  {
    key: 'totalUsers',
    label: 'Tổng người dùng',
    icon: 'bi-people',
    color: 'primary',
    colClass: 'col-lg-3'
  },
  {
    key: 'activeUsers',
    label: 'Đang hoạt động',
    icon: 'bi-check-circle',
    color: 'success',
    colClass: 'col-lg-3'
  },
  {
    key: 'inactiveUsers',
    label: 'Không hoạt động',
    icon: 'bi-x-circle',
    color: 'warning',
    colClass: 'col-lg-3'
  },
  {
    key: 'adminUsers',
    label: 'Quản trị viên',
    icon: 'bi-shield-check',
    color: 'info',
    colClass: 'col-lg-3'
  }
]

// DRY: Table columns configuration - Removed avatar and username (not needed), added createdDate
const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'fullname', label: 'Họ tên' },
  { key: 'email', label: 'Email', headerClass: 'd-none d-md-table-cell', cellClass: 'd-none d-md-table-cell' },
  { key: 'role', label: 'Vai trò' },
  { key: 'createdAt', label: 'Ngày tạo', headerClass: 'd-none d-xl-table-cell', cellClass: 'd-none d-xl-table-cell' },
  { key: 'actions', label: 'Thao tác' }
]

// Use CRUD composable
const {
  items,
  loading,
  submitting,
  searchKeyword,
  statistics,
  loadItems,
  searchItems,
  createItem,
  updateItem,
  deleteItem,
  resetSearch
} = useCrudOperations(UserService, {
  loadMethod: 'getAllUsers',
  createMethod: 'createUser',
  updateMethod: 'updateUser',
  deleteMethod: 'deleteUser',
  searchMethod: 'searchUsers',
  statisticsMethod: 'getStatistics',
  itemName: 'người dùng',
  itemNamePlural: 'người dùng'
})

// Use Modal composable - Removed avatar field (not in DB)
const {
  modalRef,
  isEditMode,
  currentItemId,
  formData,
  openCreateModal,
  openEditModal,
  hideModal
} = useModal({
  id: '',
  fullname: '',
  email: '',
  password: '',
  admin: false
})

// Additional state for filtering
const filterRole = ref('')

// Handlers
const handleSearch = () => searchItems(searchKeyword.value)

const handleFilter = async () => {
  if (!filterRole.value) {
    await loadItems()
    return
  }
  
  // Filter locally - backend doesn't have by-role endpoint
  const roleValue = filterRole.value === 'admin'
  const filtered = items.value.filter(user => user.admin === roleValue)
  items.value = filtered
}

const resetFilters = () => {
  filterRole.value = ''
  resetSearch()
}

const handleSubmit = async () => {
  // Validate ID
  const idCheck = Validation.isValidUserId(formData.value.id)
  if (!idCheck.valid) {
    window.Toast?.error(idCheck.message)
    return
  }

  // Validate fullname
  const fullnameCheck = Validation.isValidFullname(formData.value.fullname)
  if (!fullnameCheck.valid) {
    window.Toast?.error(fullnameCheck.message)
    return
  }

  // Validate email
  if (!Validation.isValidEmail(formData.value.email)) {
    window.Toast?.error('Email không hợp lệ')
    return
  }

  // Validate password (only for create)
  if (!isEditMode.value) {
    const passwordCheck = Validation.isValidPassword(formData.value.password)
    if (!passwordCheck.valid) {
      window.Toast?.error(passwordCheck.message)
      return
    }
  }

  const result = isEditMode.value
    ? await updateItem(currentItemId.value, formData.value)
    : await createItem(formData.value)

  if (result.success) {
    hideModal()
  }
}

const handleDelete = (user) => {
  deleteItem(user.id, `Bạn có chắc muốn xóa người dùng "${user.username}"?`)
}

// Format date helper
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('vi-VN')
}

// Calculate statistics from loaded data (since backend doesn't have statistics endpoint)
const calculateStatistics = () => {
  const users = items.value || []
  statistics.totalUsers = users.length
  statistics.activeUsers = users.length // All users are active (no active field in DB)
  statistics.inactiveUsers = 0
  statistics.adminUsers = users.filter(u => u.admin === true || u.role === 'admin').length
}

// Initialize
loadItems().then(() => {
  calculateStatistics()
})
</script>

<style scoped>
.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}
</style>
