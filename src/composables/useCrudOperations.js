import { ref, reactive } from 'vue'

/**
 * Reusable composable for CRUD operations
 * @param {Object} service - Service object with CRUD methods
 * @param {Object} options - Configuration options
 */
export function useCrudOperations(service, options = {}) {
  const {
    loadMethod = 'getAll',
    createMethod = 'create',
    updateMethod = 'update',
    deleteMethod = 'delete',
    searchMethod = 'search',
    statisticsMethod = 'getStatistics',
    itemName = 'item',
    itemNamePlural = 'items'
  } = options

  // State
  const items = ref([])
  const loading = ref(false)
  const submitting = ref(false)
  const searchKeyword = ref('')
  const statistics = reactive({})

  // Load all items
  const loadItems = async () => {
    loading.value = true
    try {
      const result = await service[loadMethod]()
      if (result.success) {
        items.value = result.data
        return { success: true, data: result.data }
      } else {
        window.Toast?.error(result.error || `Lỗi khi tải ${itemNamePlural}`)
        return { success: false, error: result.error }
      }
    } catch (error) {
      window.Toast?.error(`Lỗi khi tải ${itemNamePlural}`)
      console.error(error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // Load statistics
  const loadStatistics = async () => {
    if (!service[statisticsMethod]) return
    
    try {
      const result = await service[statisticsMethod]()
      if (result.success) {
        Object.assign(statistics, result.data)
        return { success: true, data: result.data }
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
      return { success: false, error }
    }
  }

  // Search items
  const searchItems = async (keyword) => {
    if (!service[searchMethod]) {
      console.warn(`Search method '${searchMethod}' not found in service`)
      return
    }

    if (!keyword || !keyword.trim()) {
      return loadItems()
    }

    loading.value = true
    try {
      const result = await service[searchMethod](keyword)
      if (result.success) {
        items.value = result.data
        return { success: true, data: result.data }
      } else {
        window.Toast?.error(result.error || 'Lỗi khi tìm kiếm')
        return { success: false, error: result.error }
      }
    } catch (error) {
      window.Toast?.error('Lỗi khi tìm kiếm')
      console.error(error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // Create item
  const createItem = async (data) => {
    submitting.value = true
    try {
      const result = await service[createMethod](data)
      if (result.success) {
        window.Toast?.success(result.message || `Đã thêm ${itemName} mới`)
        await loadItems()
        await loadStatistics()
        return { success: true, data: result.data }
      } else {
        window.Toast?.error(result.error || `Lỗi khi thêm ${itemName}`)
        return { success: false, error: result.error }
      }
    } catch (error) {
      window.Toast?.error(`Lỗi khi thêm ${itemName}`)
      console.error(error)
      return { success: false, error }
    } finally {
      submitting.value = false
    }
  }

  // Update item
  const updateItem = async (id, data) => {
    submitting.value = true
    try {
      const result = await service[updateMethod](id, data)
      if (result.success) {
        window.Toast?.success(result.message || `Đã cập nhật ${itemName}`)
        await loadItems()
        await loadStatistics()
        return { success: true, data: result.data }
      } else {
        window.Toast?.error(result.error || `Lỗi khi cập nhật ${itemName}`)
        return { success: false, error: result.error }
      }
    } catch (error) {
      window.Toast?.error(`Lỗi khi cập nhật ${itemName}`)
      console.error(error)
      return { success: false, error }
    } finally {
      submitting.value = false
    }
  }

  // Delete item
  const deleteItem = async (id, confirmMessage) => {
    if (confirmMessage && !confirm(confirmMessage)) {
      return { success: false, cancelled: true }
    }

    try {
      const result = await service[deleteMethod](id)
      if (result.success) {
        window.Toast?.success(result.message || `Đã xóa ${itemName}`)
        await loadItems()
        await loadStatistics()
        return { success: true }
      } else {
        window.Toast?.error(result.error || `Lỗi khi xóa ${itemName}`)
        return { success: false, error: result.error }
      }
    } catch (error) {
      window.Toast?.error(`Lỗi khi xóa ${itemName}`)
      console.error(error)
      return { success: false, error }
    }
  }

  // Reset search
  const resetSearch = () => {
    searchKeyword.value = ''
    loadItems()
  }

  return {
    // State
    items,
    loading,
    submitting,
    searchKeyword,
    statistics,
    
    // Methods
    loadItems,
    loadStatistics,
    searchItems,
    createItem,
    updateItem,
    deleteItem,
    resetSearch
  }
}
