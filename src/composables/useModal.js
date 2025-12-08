import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Modal } from 'bootstrap'

/**
 * Reusable composable for Bootstrap modal management
 * @param {Object} initialFormData - Initial form data structure
 */
export function useModal(initialFormData = {}) {
  const modalRef = ref(null)
  const isEditMode = ref(false)
  const currentItemId = ref(null)
  const formData = ref({ ...initialFormData })
  let modalInstance = null

  // Cleanup backdrop and body styles
  const cleanupModal = () => {
    // Remove all modal backdrops
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
    // Remove modal-open class from body
    document.body.classList.remove('modal-open')
    // Reset body styles
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('padding-right')
    document.body.style.overflow = ''
    // Also hide any visible modals
    document.querySelectorAll('.modal.show').forEach(el => {
      el.classList.remove('show')
      el.style.display = 'none'
    })
  }

  // Initialize modal
  const initModal = () => {
    if (modalRef.value && !modalInstance) {
      modalInstance = Modal.getOrCreateInstance(modalRef.value)
    }
  }

  // Open create modal - reset form completely
  const openCreateModal = () => {
    // Cleanup any existing modal state first
    cleanupModal()
    
    // Reset state
    isEditMode.value = false
    currentItemId.value = null
    // Deep copy initial form data
    formData.value = JSON.parse(JSON.stringify(initialFormData))
    
    // Ensure modal is properly initialized
    nextTick(() => {
      initModal()
    })
  }

  // Open edit modal
  const openEditModal = (item) => {
    // Cleanup any existing modal state first
    cleanupModal()
    
    isEditMode.value = true
    currentItemId.value = item.id
    // Deep copy item data
    formData.value = JSON.parse(JSON.stringify(item))
    
    nextTick(() => {
      initModal()
    })
  }

  // Show modal
  const showModal = () => {
    initModal()
    modalInstance?.show()
  }

  // Hide modal and optionally reload page
  const hideModal = (reloadPage = false) => {
    // Get modal instance and hide it
    if (modalRef.value) {
      const existingModal = Modal.getInstance(modalRef.value)
      if (existingModal) {
        existingModal.hide()
      }
    }
    
    // Force cleanup after animation
    setTimeout(() => {
      cleanupModal()
      resetForm()
      
      // Reload page if requested (for stubborn modal issues)
      if (reloadPage) {
        window.location.reload()
      }
    }, 350)
  }

  // Reset form
  const resetForm = () => {
    formData.value = JSON.parse(JSON.stringify(initialFormData))
    isEditMode.value = false
    currentItemId.value = null
  }

  // Event handler for modal hidden
  const handleModalHidden = () => {
    cleanupModal()
    resetForm()
  }

  // Auto-initialize on mount
  onMounted(() => {
    if (modalRef.value) {
      modalRef.value.addEventListener('hidden.bs.modal', handleModalHidden)
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (modalRef.value) {
      modalRef.value.removeEventListener('hidden.bs.modal', handleModalHidden)
    }
    // Dispose modal instance
    if (modalInstance) {
      try {
        modalInstance.dispose()
      } catch (e) {
        // Ignore dispose errors
      }
      modalInstance = null
    }
    cleanupModal()
  })

  return {
    // Refs
    modalRef,
    isEditMode,
    currentItemId,
    formData,
    
    // Methods
    initModal,
    openCreateModal,
    openEditModal,
    showModal,
    hideModal,
    resetForm,
    cleanupModal
  }
}
