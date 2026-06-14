<template>
  <main class="page">
    <section class="page-title">
      <div>
        <p class="eyebrow">Delivery Order</p>
        <h1>Tracking DO Bahan Ajar</h1>
      </div>
    </section>

    <section class="card filter-card">
      <div class="search-row">
        <input
          v-model.trim="keyword"
          placeholder="Cari Nomor DO atau NIM, tekan Enter untuk mencari, Esc untuk reset"
          @keyup.enter="search"
          @keyup.esc="clearSearch"
        />
        <button class="btn btn-primary" @click="search">Cari</button>
        <button class="btn" @click="clearSearch">Reset</button>
      </div>
    </section>

    <section class="card form-card">
      <h2>Tambah Delivery Order</h2>
      <form class="form-grid" @submit.prevent="addDeliveryOrder" @keyup.enter.prevent="addDeliveryOrder">
        <div class="field-group">
          <label>Nomor DO</label>
          <input :value="previewNomorDO" disabled class="input-readonly" />
        </div>
        <div class="field-group">
          <label>NIM <span class="required">*</span></label>
          <input v-model.trim="form.nim" placeholder="Contoh: 123456789" />
          <span v-if="formError.nim" class="field-error">{{ formError.nim }}</span>
        </div>
        <div class="field-group">
          <label>Nama Mahasiswa <span class="required">*</span></label>
          <input v-model.trim="form.nama" placeholder="Nama lengkap" />
          <span v-if="formError.nama" class="field-error">{{ formError.nama }}</span>
        </div>
        <div class="field-group">
          <label>Ekspedisi <span class="required">*</span></label>
          <select v-model="form.ekspedisi">
            <option value="">Pilih ekspedisi</option>
            <option v-for="item in pengirimanList" :key="item.kode" :value="item.nama">{{ item.nama }}</option>
          </select>
          <span v-if="formError.ekspedisi" class="field-error">{{ formError.ekspedisi }}</span>
        </div>
        <div class="field-group">
          <label>Paket Bahan Ajar <span class="required">*</span></label>
          <select v-model="form.paket">
            <option value="">Pilih paket</option>
            <option v-for="item in paketList" :key="item.kode" :value="item.kode">
              {{ item.kode }} - {{ item.nama }}
            </option>
          </select>
          <span v-if="formError.paket" class="field-error">{{ formError.paket }}</span>
        </div>

        <!-- Detail paket muncul setelah memilih paket -->
        <div v-if="selectedPaket" class="wide paket-detail">
          <strong>Detail Paket: {{ selectedPaket.nama }}</strong>
          <ul>
            <li v-for="isi in selectedPaket.isi" :key="isi">{{ isi }}</li>
          </ul>
        </div>

        <div class="field-group">
          <label>Tanggal Kirim <span class="required">*</span></label>
          <input v-model="form.tanggalKirim" type="date" />
          <small v-if="form.tanggalKirim" class="hint">{{ $filters.tanggal(form.tanggalKirim) }}</small>
          <span v-if="formError.tanggalKirim" class="field-error">{{ formError.tanggalKirim }}</span>
        </div>
        <div class="field-group">
          <label>Total Harga</label>
          <input :value="$filters.rupiah(totalHarga)" disabled class="input-readonly" />
        </div>

        <div class="form-actions wide">
          <button class="btn btn-primary" type="submit">Simpan DO</button>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
      </form>
    </section>

    <section class="card">
      <div class="table-header">
        <h2>Hasil Tracking</h2>
        <span>{{ hasilTracking.length }} data</span>
      </div>

      <p v-if="hasilTracking.length === 0" class="empty-state">
        Tidak ada data tracking yang ditemukan.
      </p>

      <div class="tracking-list">
        <article v-for="item in hasilTracking" :key="item.nomorDO" class="tracking-card">
          <div class="tracking-head">
            <div>
              <h3>{{ item.nomorDO }}</h3>
              <p>{{ item.nama }} - {{ item.nim }}</p>
            </div>
            <span class="status-badge" :class="statusClass(item.status)">{{ item.status }}</span>
          </div>

          <div class="tracking-meta">
            <span>Ekspedisi: <strong>{{ item.ekspedisi }}</strong></span>
            <span>Paket: <strong>{{ item.paket }}</strong></span>
            <span>Tanggal: <strong>{{ $filters.tanggal(item.tanggalKirim) }}</strong></span>
            <span>Total: <strong>{{ $filters.rupiah(item.total) }}</strong></span>
          </div>

          <div class="timeline">
            <div v-for="(jalan, index) in item.perjalanan" :key="index" class="timeline-item">
              <strong>{{ jalan.waktu }}</strong>
              <p>{{ jalan.keterangan }}</p>
            </div>
          </div>

          <div class="progress-form">
            <input
              v-model.trim="progressInput[item.nomorDO]"
              placeholder="Tambah keterangan perjalanan, tekan Enter"
              @keyup.enter="addProgress(item.nomorDO)"
            />
            <button class="btn btn-primary" @click="addProgress(item.nomorDO)">Tambah Progress</button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import dataBahanAjar from '../json/dataBahanAjar.json'

const today = () => new Date().toISOString().slice(0, 10)

// Normalisasi tracking di luar component (tidak di data() agar tidak ada masalah 'this')
function normalizeTracking(rawTracking) {
  const seen = new Set()
  return rawTracking.flatMap((entry) => {
    const nomorDO = Object.keys(entry)[0]
    if (seen.has(nomorDO)) return []
    seen.add(nomorDO)
    return [{ nomorDO, ...entry[nomorDO] }]
  })
}

export default {
  name: 'TrackingView',
  data() {
    return {
      keyword: '',
      activeKeyword: '',
      paketList: dataBahanAjar.paket,
      pengirimanList: dataBahanAjar.pengirimanList,
      // FIX: normalizeTracking dipindah ke luar component agar tidak error di Vue 3
      trackingList: normalizeTracking(dataBahanAjar.tracking),
      progressInput: {},
      form: {
        nim: '',
        nama: '',
        ekspedisi: '',
        paket: '',
        tanggalKirim: today()
      },
      formError: {
        nim: '',
        nama: '',
        ekspedisi: '',
        paket: '',
        tanggalKirim: ''
      },
      error: ''
    }
  },
  computed: {
    selectedPaket() {
      return this.paketList.find((item) => item.kode === this.form.paket) || null
    },
    totalHarga() {
      return this.selectedPaket ? this.selectedPaket.harga : 0
    },
    hasilTracking() {
      if (!this.activeKeyword) return this.trackingList
      const keyword = this.activeKeyword.toLowerCase()
      return this.trackingList.filter(
        (item) =>
          item.nomorDO.toLowerCase().includes(keyword) ||
          item.nim.includes(keyword)
      )
    },
    // Preview nomor DO sebelum disimpan
    previewNomorDO() {
      return this.generateNomorDO()
    }
  },
  watch: {
    // Watcher 1: Reset detail & harga saat paket berubah
    'form.paket'(newVal) {
      console.log('Paket dipilih:', newVal)
    },
    // Watcher 2: Otomatis clear hasil pencarian saat keyword dikosongkan
    keyword(newVal) {
      if (!newVal) this.activeKeyword = ''
    },
    // Watcher 3: Catat tiap kali tracking baru ditambahkan
    trackingList(newVal) {
      console.log('Total tracking saat ini:', newVal.length)
    }
  },
  methods: {
    search() {
      this.activeKeyword = this.keyword
    },
    clearSearch() {
      this.keyword = ''
      this.activeKeyword = ''
    },
    generateNomorDO() {
      const year = new Date().getFullYear()
      const sameYear = this.trackingList.filter((item) =>
        item.nomorDO.startsWith(`DO${year}`)
      )
      const next = sameYear.length + 1
      return `DO${year}-${String(next).padStart(3, '0')}`
    },
    validateDO() {
      let valid = true
      this.formError = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '' }

      if (!this.form.nim) { this.formError.nim = 'NIM wajib diisi.'; valid = false }
      if (!this.form.nama) { this.formError.nama = 'Nama wajib diisi.'; valid = false }
      if (!this.form.ekspedisi) { this.formError.ekspedisi = 'Pilih ekspedisi.'; valid = false }
      if (!this.form.paket) { this.formError.paket = 'Pilih paket bahan ajar.'; valid = false }
      if (!this.form.tanggalKirim) { this.formError.tanggalKirim = 'Tanggal kirim wajib diisi.'; valid = false }

      return valid
    },
    addDeliveryOrder() {
      if (!this.validateDO()) return
      this.error = ''

      const nomorDO = this.generateNomorDO()
      this.trackingList.unshift({
        nomorDO,
        nim: this.form.nim,
        nama: this.form.nama,
        status: 'Diproses',
        ekspedisi: this.form.ekspedisi,
        tanggalKirim: this.form.tanggalKirim,
        paket: this.form.paket,
        total: this.totalHarga,
        perjalanan: [
          {
            waktu: new Date().toLocaleString('id-ID'),
            keterangan: 'Delivery order dibuat oleh sistem'
          }
        ]
      })

      this.form = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: today() }
    },
    addProgress(nomorDO) {
      const text = this.progressInput[nomorDO]
      if (!text || !text.trim()) return

      const item = this.trackingList.find((t) => t.nomorDO === nomorDO)
      if (!item) return

      item.perjalanan.push({
        waktu: new Date().toLocaleString('id-ID'),
        keterangan: text.trim()
      })
      item.status = 'Dalam Perjalanan'
      this.progressInput[nomorDO] = ''
    },
    statusClass(status) {
      if (status === 'Terkirim') return 'safe'
      if (status === 'Dalam Perjalanan') return 'warning'
      return 'info'
    }
  }
}
</script>
