<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-box">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="btn" @click="$emit('cancel')">Batal</button>
        <button class="btn btn-danger" @click="$emit('confirm')">Ya, Hapus</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppModal',
  props: {
    show: Boolean,
    title: {
      type: String,
      default: 'Konfirmasi'
    },
    message: {
      type: String,
      default: 'Apakah Anda yakin?'
    }
  },
  emits: ['cancel', 'confirm']
}
</script>
