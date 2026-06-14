import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/style.css'

const app = createApp(App)

// Pengganti konsep filter di Vue 3: dipakai sebagai $filters.rupiah(), $filters.buah(), $filters.tanggal()
app.config.globalProperties.$filters = {
  rupiah(value) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(value || 0))
  },
  buah(value) {
    return `${Number(value || 0)} buah`
  },
  tanggal(value) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
}

app.use(router).mount('#app')
