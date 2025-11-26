<template>
  <AdminLayout>
    <div class="container-fluid p-4">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 class="h2 mb-1"><i class="bi bi-play-circle me-2"></i>Quản lý Video</h1>
          <p class="text-muted mb-0">Quản lý video trong hệ thống</p>
        </div>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#videoModal" @click="openCreateModal">
          <i class="bi bi-plus-circle me-2"></i>Thêm video
        </button>
      </div>

      <!-- Search -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-8">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" placeholder="Tìm kiếm video..." v-model="searchKeyword" @input="handleSearch">
              </div>
            </div>
            <div class="col-12 col-md-4">
              <button class="btn btn-outline-secondary w-100" @click="resetSearch">
                <i class="bi bi-arrow-clockwise me-2"></i>Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Table -->
      <div class="card">
        <div class="card-body p-0 p-md-3">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Đang tải...</p>
          </div>
          
          <div v-else-if="videos.length === 0" class="text-center py-5">
            <i class="bi bi-film fs-1 text-muted"></i>
            <p class="mt-2 text-muted">Không tìm thấy video nào</p>
          </div>
          
          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Thumbnail</th>
                  <th>Tiêu đề</th>
                  <th class="d-none d-md-table-cell">Kênh</th>
                  <th class="d-none d-lg-table-cell">Lượt xem</th>
                  <th class="d-none d-lg-table-cell">Likes</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="video in videos" :key="video.id">
                  <td>{{ video.id }}</td>
                  <td>
                    <img :src="video.thumbnail" width="80" class="rounded" :alt="video.title">
                  </td>
                  <td>
                    <div class="video-title-cell">{{ video.title }}</div>
                    <div class="d-md-none small text-muted">{{ video.channelName }}</div>
                  </td>
                  <td class="d-none d-md-table-cell">{{ video.channelName }}</td>
                  <td class="d-none d-lg-table-cell">{{ video.views }}</td>
                  <td class="d-none d-lg-table-cell">{{ video.likes?.toLocaleString() }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#videoModal" @click="editVideo(video)" title="Sửa">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="deleteVideo(video.id)" title="Xóa">
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
    </div>

    <!-- Video Modal -->
    <div class="modal fade" id="videoModal" tabindex="-1" ref="videoModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Sửa video' : 'Thêm video mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tiêu đề *</label>
              <input type="text" class="form-control" v-model="formData.title" required>
            </div>
            <div class="mb-3">
              <label class="form-label">URL Thumbnail</label>
              <input type="url" class="form-control" v-model="formData.thumbnail" placeholder="https://...">
            </div>
            <div class="mb-3">
              <label class="form-label">Tên kênh *</label>
              <input type="text" class="form-control" v-model="formData.channelName" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Thời lượng</label>
              <input type="text" class="form-control" v-model="formData.duration" placeholder="12:34">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="saveVideo" :disabled="submitting">
              <span v-if="submitting">
                <span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...
              </span>
              <span v-else>{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import MockVideoService from '@/services/MockVideoService'

const videos = ref([])
const loading = ref(false)
const submitting = ref(false)
const searchKeyword = ref('')
const isEdit = ref(false)
const videoModalRef = ref(null)
let videoModal = null

const formData = reactive({
  id: null,
  title: '',
  thumbnail: '',
  channelName: '',
  duration: ''
})

const loadVideos = async () => {
  loading.value = true
  try {
    const result = await MockVideoService.getAllVideos()
    if (result.success) videos.value = result.data
  } catch (error) {
    window.Toast?.error('Lỗi khi tải danh sách video')
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) return loadVideos()
  
  loading.value = true
  try {
    const result = await MockVideoService.searchVideos(searchKeyword.value)
    if (result.success) videos.value = result.data
  } catch (error) {
    window.Toast?.error('Lỗi khi tìm kiếm')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchKeyword.value = ''
  loadVideos()
}

const openCreateModal = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: null,
    title: '',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    channelName: '',
    duration: '00:00'
  })
}

const editVideo = (video) => {
  isEdit.value = true
  Object.assign(formData, {
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail,
    channelName: video.channelName,
    duration: video.duration
  })
}

const saveVideo = async () => {
  if (!formData.title || !formData.channelName) {
    window.Toast?.error('Vui lòng điền đầy đủ thông tin')
    return
  }
  
  submitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  window.Toast?.success(isEdit.value ? 'Đã cập nhật video' : 'Đã thêm video mới')
  videoModal?.hide()
  submitting.value = false
}

const deleteVideo = (id) => {
  if (confirm('Bạn có chắc muốn xóa video này?')) {
    videos.value = videos.value.filter(v => v.id !== id)
    window.Toast?.success('Đã xóa video')
  }
}

onMounted(() => {
  loadVideos()
  if (videoModalRef.value) {
    videoModal = new Modal(videoModalRef.value)
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
