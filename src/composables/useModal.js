import { ref, onMounted } from 'vue'
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

  // Initialize modal
  const initModal = () => {
    if (modalRef.value) {
      modalInstance = new Modal(modalRef.value)
    }
  }

  // Open create modal
  const openCreateModal = () => {
    isEditMode.value = false
    currentItemId.value = null
    formData.value = { ...initialFormData }
  }

  // Open edit modal
  const openEditModal = (item) => {
    isEditMode.value = true
    currentItemId.value = item.id
    formData.value = { ...item }
  }

  // Show modal
  const showModal = () => {
    modalInstance?.show()
  }

  // Hide modal
  const hideModal = () => {
    modalInstance?.hide()
  }

  // Reset form
  const resetForm = () => {
    formData.value = { ...initialFormData }
    isEditMode.value = false
    currentItemId.value = null
  }

  // Auto-initialize on mount
  onMounted(() => {
    initModal()
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
    resetForm
  }
}
