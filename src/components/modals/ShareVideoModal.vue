<template>
  <div class="modal fade" id="shareVideoModal" tabindex="-1" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content share-modal-content">
        <div class="modal-header share-modal-header">
          <div class="share-modal-title">
            <i class="bi bi-share fs-4"></i>
            <h2 class="modal-title">Chia sẻ video cho bạn bè</h2>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body share-modal-body">
          <!-- Video Info -->
          <div v-if="videoData" class="video-preview mb-4">
            <img :src="videoData.thumbnail" :alt="videoData.title" class="preview-thumbnail">
            <div class="preview-info">
              <h6 class="preview-title">{{ videoData.title }}</h6>
              <p class="preview-channel">{{ videoData.channelName }}</p>
            </div>
          </div>
          
          <!-- Share via Email -->
          <form @submit.prevent="handleShare">
            <div class="mb-3">
              <label for="friendEmail" class="form-label">
                <i class="bi bi-envelope me-1"></i>Email của bạn bè
              </label>
              <input 
                type="email" 
                class="form-control share-input" 
                id="friendEmail" 
                v-model="friendEmail"
                placeholder="Nhập email bạn bè"
                required
              >
            </div>
            
            <div class="mb-4">
              <label for="shareMessage" class="form-label">
                <i class="bi bi-chat-text me-1"></i>Lời nhắn (tùy chọn)
              </label>
              <textarea 
                class="form-control share-input" 
                id="shareMessage" 
                v-model="message"
                rows="3"
                placeholder="Thêm lời nhắn của bạn..."
              ></textarea>
            </div>
            
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Hủy
              </button>
              <button type="submit" class="btn share-btn-primary flex-grow-1" :disabled="submitting">
                <span v-if="submitting">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Đang gửi...
                </span>
                <span v-else>
                  <i class="bi bi-send me-2"></i>Gửi
                </span>
              </button>
            </div>
          </form>
          
          <!-- Divider -->
          <div class="share-divider">
            <span>hoặc</span>
          </div>
          
          <!-- Share via Social -->
          <div class="social-share">
            <p class="text-muted mb-3">Chia sẻ qua mạng xã hội:</p>
            <div class="social-buttons">
              <button class="social-btn facebook" @click="shareToSocial('facebook')" title="Facebook">
                <i class="bi bi-facebook"></i>
              </button>
              <button class="social-btn twitter" @click="shareToSocial('twitter')" title="Twitter">
                <i class="bi bi-twitter"></i>
              </button>
              <button class="social-btn whatsapp" @click="shareToSocial('whatsapp')" title="WhatsApp">
                <i class="bi bi-whatsapp"></i>
              </button>
              <button class="social-btn telegram" @click="shareToSocial('telegram')" title="Telegram">
                <i class="bi bi-telegram"></i>
              </button>
            </div>
          </div>
          
          <!-- Copy Link -->
          <div class="copy-link-section">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control share-input" 
                :value="videoLink"
                readonly
              >
              <button class="btn btn-outline-primary" @click="copyLink">
                <i class="bi" :class="copied ? 'bi-check-lg' : 'bi-clipboard'"></i>
                {{ copied ? 'Đã sao chép' : 'Sao chép' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import Validation from '@/utils/validation'

const modalRef = ref(null)
const videoData = ref(null)
const friendEmail = ref('')
const message = ref('')
const submitting = ref(false)
const copied = ref(false)
let modalInstance = null

const videoLink = computed(() => {
  if (!videoData.value) return ''
  return `${window.location.origin}/video/${videoData.value.id}`
})

const handleShare = async () => {
  if (!Validation.isValidEmail(friendEmail.value)) {
    window.Toast?.error('Email không hợp lệ')
    return
  }
  
  submitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  submitting.value = false
  window.Toast?.success(`Đã gửi video đến ${friendEmail.value}!`)
  
  // Reset and close
  friendEmail.value = ''
  message.value = ''
  closeModal()
}

const shareToSocial = (platform) => {
  const url = videoLink.value
  const text = videoData.value?.title || 'Check out this video!'
  
  let shareUrl = ''
  
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      break
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      break
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
      break
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      break
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(videoLink.value)
    copied.value = true
    window.Toast?.success('Đã sao chép liên kết!')
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    window.Toast?.error('Không thể sao chép liên kết')
  }
}

const closeModal = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
}

const handleOpenShareVideo = (event) => {
  videoData.value = event.detail.video
  friendEmail.value = ''
  message.value = ''
  copied.value = false
  
  if (modalInstance) {
    modalInstance.show()
  }
}

onMounted(() => {
  if (modalRef.value) {
    const existingModal = Modal.getInstance(modalRef.value)
    modalInstance = existingModal || new Modal(modalRef.value)
    
    window.addEventListener('open-share-video', handleOpenShareVideo)
  }
})

onUnmounted(() => {
  window.removeEventListener('open-share-video', handleOpenShareVideo)
})
</script>

<style scoped>
.share-modal-content {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.share-modal-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem 1.5rem;
}

.share-modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-grow: 1;
}

.share-modal-title i {
  color: #667eea;
}

.share-modal-title .modal-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.share-modal-body {
  padding: 1.5rem;
}

.video-preview {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-thumbnail {
  width: 120px;
  height: 68px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.preview-info {
  flex-grow: 1;
  min-width: 0;
}

.preview-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.preview-channel {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

.share-input {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.share-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.share-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.share-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.share-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.share-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.share-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.share-divider span {
  position: relative;
  background: white;
  padding: 0 1rem;
  color: #999;
  font-size: 0.9rem;
}

.social-share {
  margin-bottom: 1.5rem;
}

.social-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.social-btn.facebook {
  background: #1877f2;
}

.social-btn.twitter {
  background: #1da1f2;
}

.social-btn.whatsapp {
  background: #25d366;
}

.social-btn.telegram {
  background: #0088cc;
}

.copy-link-section {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

@media (max-width: 576px) {
  .share-modal-body {
    padding: 1rem;
  }
  
  .video-preview {
    flex-direction: column;
  }
  
  .preview-thumbnail {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }
  
  .social-buttons {
    flex-wrap: wrap;
  }
}
</style>
