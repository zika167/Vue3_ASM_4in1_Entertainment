<template>
  <div class="container-fluid p-4 user-bg" style="max-width: 1400px; margin: 0 auto;">
    <!-- Page Header -->
    <div class="page-header user-facing mb-4">
      <h1 class="welcome-title">
        <i class="bi bi-film"></i>
        Chào mừng đến với 4IN1 Entertainment
      </h1>
      <p class="welcome-subtitle">Nền tảng chia sẻ video hàng đầu. Đăng nhập để khám phá thêm!</p>
    </div>

    <!-- Search & Filter Section -->
    <div class="search-filter-section mb-4">
      <div class="row g-3 align-items-center">
        <!-- Search Input -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="search-input-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              v-model="searchKeyword"
              @input="handleSearchInput"
              @keyup.enter="handleSearch"
              placeholder="Tìm kiếm video..."
            />
            <!-- Clear button -->
            <button 
              v-if="searchKeyword" 
              class="btn-clear" 
              @click="clearSearch"
              title="Xóa tìm kiếm"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="col-6 col-md-3 col-lg-2">
          <select 
            class="form-select filter-select" 
            v-model="selectedCategory"
            @change="handleFilter"
          >
            <option value="">Tất cả danh mục</option>
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="col-6 col-md-3 col-lg-2">
          <select 
            class="form-select filter-select" 
            v-model="sortBy"
            @change="handleSort"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="views">Lượt xem</option>
            <option value="title">Tên A-Z</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="active-filters mt-3">
        <span class="filter-label">Đang lọc:</span>
        <span v-if="searchKeyword" class="filter-tag">
          <i class="bi bi-search me-1"></i>{{ searchKeyword }}
          <button class="btn-remove-filter" @click="clearSearch">
            <i class="bi bi-x"></i>
          </button>
        </span>
        <span v-if="selectedCategory" class="filter-tag">
          <i class="bi bi-folder me-1"></i>{{ getCategoryLabel(selectedCategory) }}
          <button class="btn-remove-filter" @click="clearCategory">
            <i class="bi bi-x"></i>
          </button>
        </span>
        <button class="btn btn-sm btn-outline-secondary ms-2" @click="clearAllFilters">
          Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Video Grid Section -->
    <div class="video-grid-container">
      <!-- Section Header with Results Count -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">
          {{ sectionTitle }}
          <span v-if="!loading" class="results-count">({{ filteredVideos.length }} video)</span>
        </h2>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải video...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedVideos.length === 0" class="empty-state text-center py-5">
        <i class="bi bi-film fs-1 text-muted"></i>
        <h4 class="mt-3">Không tìm thấy video</h4>
        <p class="text-muted">
          {{ searchKeyword ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có video nào trong hệ thống' }}
        </p>
        <button v-if="hasActiveFilters" class="btn btn-primary" @click="clearAllFilters">
          <i class="bi bi-arrow-clockwise me-2"></i>Xóa bộ lọc
        </button>
      </div>
      
      <!-- Video Grid -->
      <div v-else class="video-grid">
        <VideoCard 
          v-for="video in paginatedVideos" 
          :key="video.id" 
          :video="video"
          :clickable="true"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container mt-4">
        <nav aria-label="Video pagination">
          <ul class="pagination justify-content-center mb-0">
            <!-- Previous Button -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button 
                class="page-link" 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>

            <!-- Page Numbers -->
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ active: page === currentPage, disabled: page === '...' }"
            >
              <button 
                v-if="page !== '...'"
                class="page-link" 
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <span v-else class="page-link">...</span>
            </li>

            <!-- Next Button -->
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button 
                class="page-link" 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Page Size Selector -->
        <div class="page-size-selector mt-3 text-center">
          <span class="text-muted me-2">Hiển thị:</span>
          <select 
            class="form-select form-select-sm d-inline-block w-auto"
            v-model="pageSize"
            @change="handlePageSizeChange"
          >
            <option :value="6">6</option>
            <option :value="12">12</option>
            <option :value="24">24</option>
            <option :value="48">48</option>
          </select>
          <span class="text-muted ms-2">video mỗi trang</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * HomePage.vue - Trang chủ hiển thị danh sách video
 * 
 * Features:
 * - Tìm kiếm video theo title/description (debounce 300ms)
 * - Lọc theo category
 * - Sắp xếp theo nhiều tiêu chí
 * - Phân trang với page size selector
 * 
 * @author DEV 2 - Video Module
 */

import { ref, computed, onMounted, watch } from 'vue'
import VideoCard from '../components/video/VideoCard.vue'
import VideoService from '@/services/factories/VideoService'
import Helpers from '@/utils/helpers'

// ========================================
// STATE
// ========================================

// Video data
const videos = ref([])           // Danh sách video gốc từ API
const loading = ref(true)        // Trạng thái loading

// Search & Filter
const searchKeyword = ref('')    // Từ khóa tìm kiếm
const selectedCategory = ref('') // Category đang chọn
const sortBy = ref('newest')     // Tiêu chí sắp xếp

// Pagination
const currentPage = ref(1)       // Trang hiện tại
const pageSize = ref(12)         // Số video mỗi trang

// Categories (có thể load từ API sau)
const categories = ref([
  { value: 'programming', label: 'Lập trình' },
  { value: 'music', label: 'Âm nhạc' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'education', label: 'Giáo dục' },
  { value: 'entertainment', label: 'Giải trí' }
])

// ========================================
// COMPUTED PROPERTIES
// ========================================

/**
 * Kiểm tra có filter nào đang active không
 */
const hasActiveFilters = computed(() => {
  return searchKeyword.value || selectedCategory.value
})

/**
 * Tiêu đề section dựa trên filter
 */
const sectionTitle = computed(() => {
  if (searchKeyword.value) {
    return `Kết quả tìm kiếm "${searchKeyword.value}"`
  }
  if (selectedCategory.value) {
    return getCategoryLabel(selectedCategory.value)
  }
  return 'Thịnh hành'
})

/**
 * Lọc và sắp xếp video
 * Pipeline: videos -> filter by search -> filter by category -> sort
 */
const filteredVideos = computed(() => {
  let result = [...videos.value]

  // Step 1: Filter by search keyword
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    result = result.filter(video => {
      const title = (video.title || '').toLowerCase()
      const description = (video.description || '').toLowerCase()
      const channelName = (video.channelName || '').toLowerCase()
      return title.includes(keyword) || 
             description.includes(keyword) || 
             channelName.includes(keyword)
    })
  }

  // Step 2: Filter by category (nếu video có field category)
  if (selectedCategory.value) {
    result = result.filter(video => video.category === selectedCategory.value)
  }

  // Step 3: Sort
  result = sortVideos(result, sortBy.value)

  return result
})

/**
 * Tính tổng số trang
 */
const totalPages = computed(() => {
  return Math.ceil(filteredVideos.value.length / pageSize.value)
})

/**
 * Lấy video cho trang hiện tại
 */
const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredVideos.value.slice(start, end)
})

/**
 * Tính các số trang hiển thị (với ellipsis)
 * Ví dụ: [1, 2, 3, '...', 10] hoặc [1, '...', 5, 6, 7, '...', 10]
 */
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    // Hiển thị tất cả nếu ít hơn 7 trang
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Luôn hiển thị trang đầu
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    // Hiển thị các trang xung quanh trang hiện tại
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Luôn hiển thị trang cuối
    pages.push(total)
  }

  return pages
})

// ========================================
// METHODS
// ========================================

/**
 * Load danh sách video từ API
 */
const loadVideos = async () => {
  loading.value = true
  try {
    const result = await VideoService.getAllVideos()
    if (result.success) {
      // Chỉ hiển thị video có active = true
      videos.value = (result.data || []).filter(video => video.active === true)
    } else {
      window.Toast?.error('Không thể tải danh sách video')
    }
  } catch (error) {
    console.error('Error loading videos:', error)
    window.Toast?.error('Đã xảy ra lỗi khi tải video')
  } finally {
    loading.value = false
  }
}

/**
 * Sắp xếp video theo tiêu chí
 * @param {Array} videoList - Danh sách video
 * @param {string} criteria - Tiêu chí sắp xếp
 */
const sortVideos = (videoList, criteria) => {
  const sorted = [...videoList]
  
  switch (criteria) {
    case 'newest':
      // Sắp xếp theo ngày tạo mới nhất
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdDate || a.uploadTime || 0)
        const dateB = new Date(b.createdDate || b.uploadTime || 0)
        return dateB - dateA
      })
    
    case 'oldest':
      // Sắp xếp theo ngày tạo cũ nhất
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdDate || a.uploadTime || 0)
        const dateB = new Date(b.createdDate || b.uploadTime || 0)
        return dateA - dateB
      })
    
    case 'views':
      // Sắp xếp theo lượt xem giảm dần
      return sorted.sort((a, b) => {
        const viewsA = parseInt(a.views) || 0
        const viewsB = parseInt(b.views) || 0
        return viewsB - viewsA
      })
    
    case 'title':
      // Sắp xếp theo tên A-Z
      return sorted.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase()
        const titleB = (b.title || '').toLowerCase()
        return titleA.localeCompare(titleB, 'vi')
      })
    
    default:
      return sorted
  }
}

/**
 * Debounced search handler
 * Chờ 300ms sau khi user ngừng gõ mới thực hiện search
 */
const debouncedSearch = Helpers.debounce(() => {
  // Reset về trang 1 khi search
  currentPage.value = 1
}, 300)

/**
 * Handle search input (với debounce)
 */
const handleSearchInput = () => {
  debouncedSearch()
}

/**
 * Handle search khi nhấn Enter
 */
const handleSearch = () => {
  currentPage.value = 1
}

/**
 * Handle filter change
 */
const handleFilter = () => {
  currentPage.value = 1
}

/**
 * Handle sort change
 */
const handleSort = () => {
  // Không cần reset page khi sort
}

/**
 * Handle page size change
 */
const handlePageSizeChange = () => {
  // Reset về trang 1 khi đổi page size
  currentPage.value = 1
}

/**
 * Navigate to specific page
 * @param {number} page - Số trang
 */
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top of video grid
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }
}

/**
 * Clear search keyword
 */
const clearSearch = () => {
  searchKeyword.value = ''
  currentPage.value = 1
}

/**
 * Clear category filter
 */
const clearCategory = () => {
  selectedCategory.value = ''
  currentPage.value = 1
}

/**
 * Clear all filters
 */
const clearAllFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
  sortBy.value = 'newest'
  currentPage.value = 1
}

/**
 * Get category label by value
 * @param {string} value - Category value
 */
const getCategoryLabel = (value) => {
  const cat = categories.value.find(c => c.value === value)
  return cat ? cat.label : value
}

// ========================================
// WATCHERS
// ========================================

// Reset page khi filter thay đổi
watch([searchKeyword, selectedCategory], () => {
  currentPage.value = 1
})

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => {
  loadVideos()
})
</script>

<style scoped>
/* ========================================
   Layout & Background
   ======================================== */
.user-bg {
  background: #fafafa;
  min-height: calc(100vh - 200px);
}

/* ========================================
   Page Header
   ======================================== */
.page-header.user-facing {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffc107;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-subtitle {
  color: #90EE90;
  font-size: 1.125rem;
  margin: 0.5rem 0 0;
  letter-spacing: 0.5px;
}

/* ========================================
   Search & Filter Section
   ======================================== */
.search-filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: #f0f0f0;
  color: #333;
}

.filter-select {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.filter-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Active Filters */
.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-label {
  color: #6c757d;
  font-size: 0.875rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  background: #e9ecef;
  padding: 4px 8px 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
}

.btn-remove-filter {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0 4px;
  margin-left: 4px;
  line-height: 1;
}

.btn-remove-filter:hover {
  color: #dc3545;
}

/* ========================================
   Video Grid
   ======================================== */
.video-grid-container {
  padding: 24px 0;
}

.results-count {
  font-size: 0.875rem;
  font-weight: normal;
  color: #6c757d;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 12px;
  padding: 3rem;
}

/* ========================================
   Pagination
   ======================================== */
.pagination-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.pagination .page-link {
  border-radius: 8px;
  margin: 0 2px;
  border: none;
  color: #333;
  transition: all 0.2s;
}

.pagination .page-link:hover {
  background: #e9ecef;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #adb5bd;
}

.page-size-selector {
  font-size: 0.875rem;
}

/* ========================================
   Responsive
   ======================================== */
@media (max-width: 1200px) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .video-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .search-filter-section {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .video-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 1.2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
