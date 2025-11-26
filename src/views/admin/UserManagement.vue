<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 class="h2 mb-1"><i class="bi bi-people-fill me-2"></i>Quản lý người dùng</h1>
          <p class="text-muted mb-0">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
        <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#userModal"
          @click="openCreateModal">
          <i class="bi bi-plus-circle me-2"></i>Thêm người dùng
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
          <div class="card border-primary h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Tổng người dùng</h6>
                  <h3 class="mb-0">{{ statistics.totalUsers }}</h3>
                </div>
                <i class="bi bi-people fs-1 text-primary d-none d-sm-block"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card border-success h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Đang hoạt động</h6>
                  <h3 class="mb-0">{{ statistics.activeUsers }}</h3>
                </div>
                <i class="bi bi-check-circle fs-1 text-success d-none d-sm-block"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card border-warning h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Không hoạt động</h6>
                  <h3 class="mb-0">{{ statistics.inactiveUsers }}</h3>
                </div>
                <i class="bi bi-x-circle fs-1 text-warning d-none d-sm-block"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card border-info h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Quản trị viên</h6>
                  <h3 class="mb-0">{{ statistics.adminUsers }}</h3>
                </div>
                <i class="bi bi-shield-check fs-1 text-info d-none d-sm-block"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Tìm kiếm theo tên, email..."
                  v-model="searchKeyword"
                  @input="handleSearch" />
              </div>
            </div>
            <div class="col-6 col-md-3">
              <select class="form-select" v-model="filterRole" @change="handleFilter">
                <option value="">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="user">Người dùng</option>
              </select>
            </div>
            <div class="col-6 col-md-3">
              <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                <i class="bi bi-arrow-clockwise me-2"></i>Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card">
        <div class="card-body p-0 p-md-3">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="users.length === 0" class="text-center py-5">
            <i class="bi bi-inbox fs-1 text-muted"></i>
            <p class="mt-2 text-muted">Không tìm thấy người dùng nào</p>
          </div>

          <!-- Users Table -->
          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th class="d-none d-md-table-cell">Avatar</th>
                  <th>Tên đăng nhập</th>
                  <th class="d-none d-lg-table-cell">Họ tên</th>
                  <th class="d-none d-md-table-cell">Email</th>
                  <th>Vai trò</th>
                  <th class="d-none d-sm-table-cell">Trạng thái</th>
                  <th class="d-none d-xl-table-cell">Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td class="d-none d-md-table-cell">
                    <img
                      :src="user.avatar"
                      :alt="user.username"
                      class="rounded-circle"
                      width="40"
                      height="40" />
                  </td>
                  <td>
                    <strong>{{ user.username }}</strong>
                    <div class="d-lg-none small text-muted">{{ user.fullname }}</div>
                  </td>
                  <td class="d-none d-lg-table-cell">{{ user.fullname }}</td>
                  <td class="d-none d-md-table-cell">{{ user.email }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="user.role === 'admin' ? 'bg-danger' : 'bg-primary'">
                      {{ user.role === "admin" ? "Admin" : "User" }}
                    </span>
                  </td>
                  <td class="d-none d-sm-table-cell">
                    <span
                      class="badge"
                      :class="user.isActive ? 'bg-success' : 'bg-secondary'">
                      {{ user.isActive ? "Hoạt động" : "Không hoạt động" }}
                    </span>
                  </td>
                  <td class="d-none d-xl-table-cell">{{ user.createdAt }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        class="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#userModal"
                        @click="openEditModal(user)"
                        title="Sửa">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        class="btn btn-outline-warning"
                        @click="toggleStatus(user.id)"
                        title="Chuyển trạng thái">
                        <i class="bi bi-toggle-on"></i>
                      </button>
                      <button
                        class="btn btn-outline-danger"
                        @click="confirmDelete(user)"
                        title="Xóa"
                        :disabled="user.role === 'admin'">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- User Modal (Create/Edit) -->
      <div class="modal fade" id="userModal" tabindex="-1" ref="userModalRef">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới" }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.username"
                    :disabled="isEditMode"
                    required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Họ tên *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.fullname"
                    required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="formData.email"
                    required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Vai trò</label>
                  <select class="form-select" v-model="formData.role">
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Avatar URL</label>
                  <input
                    type="url"
                    class="form-control"
                    v-model="formData.avatar"
                    placeholder="https://..." />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Hủy
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="handleSubmit"
                :disabled="submitting">
                <span v-if="submitting">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Đang xử lý...
                </span>
                <span v-else>
                  {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
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
import { ref, reactive, onMounted } from "vue"
import { Modal } from "bootstrap"
import AdminLayout from "@/components/layout/AdminLayout.vue"
import UserService from "@/services/UserService"
import Validation from "@/utils/validation"

// State
const users = ref([])
const loading = ref(false)
const submitting = ref(false)
const searchKeyword = ref("")
const filterRole = ref("")

const statistics = reactive({
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  adminUsers: 0,
  regularUsers: 0,
})

// Modal
const userModalRef = ref(null)
let userModal = null
const isEditMode = ref(false)
const currentUserId = ref(null)

const formData = reactive({
  username: "",
  fullname: "",
  email: "",
  role: "user",
  avatar: "https://via.placeholder.com/150",
})

// Load users
const loadUsers = async () => {
  loading.value = true
  try {
    const result = await UserService.getAllUsers()
    if (result.success) {
      users.value = result.data
    } else {
      window.Toast?.error(result.error)
    }
  } catch (error) {
    window.Toast?.error("Lỗi khi tải danh sách người dùng")
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Load statistics
const loadStatistics = async () => {
  try {
    const result = await UserService.getStatistics()
    if (result.success) {
      Object.assign(statistics, result.data)
    }
  } catch (error) {
    console.error("Error loading statistics:", error)
  }
}

// Search
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    await loadUsers()
    return
  }

  loading.value = true
  try {
    const result = await UserService.searchUsers(searchKeyword.value)
    if (result.success) {
      users.value = result.data
    }
  } catch (error) {
    window.Toast?.error("Lỗi khi tìm kiếm")
  } finally {
    loading.value = false
  }
}

// Filter by role
const handleFilter = async () => {
  if (!filterRole.value) {
    await loadUsers()
    return
  }

  loading.value = true
  try {
    const result = await UserService.getUsersByRole(filterRole.value)
    if (result.success) {
      users.value = result.data
    }
  } catch (error) {
    window.Toast?.error("Lỗi khi lọc dữ liệu")
  } finally {
    loading.value = false
  }
}

// Reset filters
const resetFilters = () => {
  searchKeyword.value = ""
  filterRole.value = ""
  loadUsers()
}

// Open create modal
const openCreateModal = () => {
  isEditMode.value = false
  currentUserId.value = null
  Object.assign(formData, {
    username: "",
    fullname: "",
    email: "",
    role: "user",
    avatar: "https://via.placeholder.com/150",
  })
}

// Open edit modal
const openEditModal = (user) => {
  isEditMode.value = true
  currentUserId.value = user.id
  Object.assign(formData, {
    username: user.username,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  })
}

// Submit form
const handleSubmit = async () => {
  // Validate
  if (!Validation.isValidEmail(formData.email)) {
    window.Toast?.error("Email không hợp lệ")
    return
  }

  const usernameCheck = Validation.isValidUsername(formData.username)
  if (!usernameCheck.valid) {
    window.Toast?.error(usernameCheck.message)
    return
  }

  submitting.value = true
  try {
    let result
    if (isEditMode.value) {
      result = await UserService.updateUser(currentUserId.value, formData)
    } else {
      result = await UserService.createUser(formData)
    }

    if (result.success) {
      window.Toast?.success(result.message)
      userModal.hide()
      await loadUsers()
      await loadStatistics()
    } else {
      window.Toast?.error(result.error)
    }
  } catch (error) {
    window.Toast?.error("Có lỗi xảy ra")
    console.error(error)
  } finally {
    submitting.value = false
  }
}

// Toggle user status
const toggleStatus = async (userId) => {
  try {
    const result = await UserService.toggleUserStatus(userId)
    if (result.success) {
      window.Toast?.success(result.message)
      await loadUsers()
      await loadStatistics()
    } else {
      window.Toast?.error(result.error)
    }
  } catch (error) {
    window.Toast?.error("Lỗi khi thay đổi trạng thái")
  }
}

// Confirm delete
const confirmDelete = async (user) => {
  if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.username}"?`)) {
    return
  }

  try {
    const result = await UserService.deleteUser(user.id)
    if (result.success) {
      window.Toast?.success(result.message)
      await loadUsers()
      await loadStatistics()
    } else {
      window.Toast?.error(result.error)
    }
  } catch (error) {
    window.Toast?.error("Lỗi khi xóa người dùng")
  }
}

// Initialize
onMounted(() => {
  loadUsers()
  loadStatistics()

  if (userModalRef.value) {
    userModal = new Modal(userModalRef.value)
  }
})
</script>

<style scoped>
.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: #6c757d;
  white-space: nowrap;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

@media (max-width: 576px) {
  .table th,
  .table td {
    padding: 0.5rem 0.25rem;
    font-size: 0.85rem;
  }
}
</style>
