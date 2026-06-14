<template>
  <span v-if="qty === 0" class="status-badge danger">
    Kosong
  </span>

  <span v-else-if="qty < safety" class="status-badge warning">
    Menipis
  </span>

  <span v-else class="status-badge safe">
    Aman
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    qty: {
      type: Number,
      required: true
    },
    safety: {
      type: Number,
      required: true
    }
  }
}
</script>