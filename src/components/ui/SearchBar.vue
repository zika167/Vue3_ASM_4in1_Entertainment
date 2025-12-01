<template>
  <div class="card mb-4">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-12" :class="filterSlot ? 'col-md-6' : 'col-md-8'">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              :placeholder="placeholder"
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              @keyup.enter="$emit('search')"
            />
          </div>
        </div>
        
        <slot name="filters"></slot>
        
        <div class="col-12" :class="filterSlot ? 'col-md-3' : 'col-md-4'">
          <button class="btn btn-outline-secondary w-100" @click="$emit('reset')">
            <i class="bi bi-arrow-clockwise me-2"></i>{{ resetText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSlots } from 'vue'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Tìm kiếm...' },
  resetText: { type: String, default: 'Đặt lại' }
})

defineEmits(['update:modelValue', 'search', 'reset'])

const slots = useSlots()
const filterSlot = slots.filters
</script>
