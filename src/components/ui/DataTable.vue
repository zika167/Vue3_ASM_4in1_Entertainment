<template>
  <div class="card">
    <div class="card-body p-0 p-md-3">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">{{ loadingText }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!data || data.length === 0" class="text-center py-5">
        <i class="bi fs-1 text-muted" :class="emptyIcon"></i>
        <p class="mt-2 text-muted">{{ emptyText }}</p>
      </div>

      <!-- Table -->
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th v-for="column in columns" :key="column.key" :class="column.headerClass">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item[itemKey]">
              <td v-for="column in columns" :key="column.key" :class="column.cellClass">
                <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                  {{ item[column.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  itemKey: { type: String, default: 'id' },
  loadingText: { type: String, default: 'Đang tải dữ liệu...' },
  emptyText: { type: String, default: 'Không có dữ liệu' },
  emptyIcon: { type: String, default: 'bi-inbox' }
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

@media (max-width: 576px) {
  .table th,
  .table td {
    padding: 0.5rem 0.25rem;
    font-size: 0.85rem;
  }
}
</style>
