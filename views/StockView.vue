<template>
  <main class="page">
    <section class="page-title">
      <div>
        <p class="eyebrow">Manajemen Stok</p>
        <h1>Stok Bahan Ajar</h1>
      </div>
      <button class="btn btn-primary" @click="showForm = true; resetForm()">+ Tambah Bahan Ajar</button>
    </section>

    <!-- Filter & Sort -->
    <section class="card filter-card">
      <div class="filter-grid">
        <div class="field-group">
          <label>Filter UPBJJ</label>
          <select v-model="filter.upbjj">
            <option value="">Semua UPBJJ</option>
            <option v-for="upbjj in upbjjList" :key="upbjj" :value="upbjj">{{ upbjj }}</option>
          </select>
        </div>

        <!-- Dependent: hanya muncul jika UPBJJ dipilih -->
        <div v-show="filter.upbjj" class="field-group">
          <label>Filter Kategori</label>
          <select v-model="filter.kategori">
            <option value="">Semua Kategori</option>
            <option v-for="kategori in kategoriByUpbjj" :key="kategori" :value="kategori">{{ kategori }}</option>
          </select>
        </div>

        <div class="field-group">
          <label>Status Stok</label>
          <select v-model="filter.status">
            <option value="">Semua Status</option>
            <option value="reorder">Perlu Re-order (qty &lt; safety)</option>
            <option value="kosong">Kosong (qty = 0)</option>
          </select>
        </div>

        <div class="field-group">
          <label>Urutkan</label>
          <select v-model="sortBy">
            <option value="judul">Judul</option>
            <option value="qty">Stok</option>
            <option value="harga">Harga</option>
          </select>
        </div>

        <button class="btn" @click="resetFilter">Reset Filter</button>
      </div>

      <!-- Info jumlah hasil filter -->
      <p v-if="isFiltered" class="filter-info">
        Menampilkan <strong>{{ filteredStok.length }}</strong> dari <strong>{{ stok.length }}</strong> data
      </p>
    </section>

    <!-- Form Tambah / Edit -->
    <section v-if="showForm" class="card form-card">
      <h2>{{ editMode ? 'Edit Data Bahan Ajar' : 'Tambah Data Bahan Ajar' }}</h2>
      <form class="form-grid" @submit.prevent="saveItem">
        <div class="field-group">
          <label>Kode MK <span class="required">*</span></label>
          <input v-model.trim="form.kode" placeholder="Contoh: EKMA4116" :disabled="editMode" />
          <span v-if="formError.kode" class="field-error">{{ formError.kode }}</span>
        </div>
        <div class="field-group">
          <label>Judul Bahan Ajar <span class="required">*</span></label>
          <input v-model.trim="form.judul" placeholder="Judul bahan ajar" @keyup.enter="saveItem" />
          <span v-if="formError.judul" class="field-error">{{ formError.judul }}</span>
        </div>
        <div class="field-group">
          <label>Kategori <span class="required">*</span></label>
          <select v-model="form.kategori">
            <option value="">Pilih kategori</option>
            <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">{{ kategori }}</option>
          </select>
          <span v-if="formError.kategori" class="field-error">{{ formError.kategori }}</span>
        </div>
        <div class="field-group">
          <label>UPBJJ <span class="required">*</span></label>
          <select v-model="form.upbjj">
            <option value="">Pilih UPBJJ</option>
            <option v-for="upbjj in upbjjList" :key="upbjj" :value="upbjj">{{ upbjj }}</option>
          </select>
          <span v-if="formError.upbjj" class="field-error">{{ formError.upbjj }}</span>
        </div>
        <div class="field-group">
          <label>Lokasi Rak</label>
          <input v-model.trim="form.lokasiRak" placeholder="Contoh: R1-A3" />
        </div>
        <div class="field-group">
          <label>Harga (Rp) <span class="required">*</span></label>
          <input v-model.number="form.harga" type="number" min="0" placeholder="65000" />
          <small v-if="form.harga >= 0" class="hint">{{ $filters.rupiah(form.harga) }}</small>
          <span v-if="formError.harga" class="field-error">{{ formError.harga }}</span>
        </div>
        <div class="field-group">
          <label>Jumlah Stok <span class="required">*</span></label>
          <input v-model.number="form.qty" type="number" min="0" placeholder="0" />
          <span v-if="formError.qty" class="field-error">{{ formError.qty }}</span>
        </div>
        <div class="field-group">
          <label>Safety Stock <span class="required">*</span></label>
          <input v-model.number="form.safety" type="number" min="0" placeholder="10" />
          <span v-if="formError.safety" class="field-error">{{ formError.safety }}</span>
        </div>
        <div class="field-group wide">
          <label>Catatan (HTML)</label>
          <input v-model.trim="form.catatanHTML" placeholder="Contoh: &lt;em&gt;Edisi 2024&lt;/em&gt;" />
        </div>

        <div class="form-actions wide">
          <button class="btn btn-primary" type="submit">{{ editMode ? 'Update' : 'Simpan' }}</button>
          <button class="btn" type="button" @click="cancelForm">Batal</button>
        </div>
      </form>
    </section>

    <!-- Tabel Stok -->
    <section class="card">
      <div class="table-header">
        <h2>Daftar Stok</h2>
        <span>{{ filteredStok.length }} data ditampilkan</span>
      </div>

      <p v-if="filteredStok.length === 0" class="empty-state">
        Tidak ada data yang sesuai filter.
      </p>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kode / Judul</th>
              <th>Kategori</th>
              <th>UPBJJ</th>
              <th>Rak</th>
              <th>Harga</th>
              <th>Qty</th>
              <th>Safety</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredStok" :key="item.kode">
              <td>
                <strong>{{ item.kode }}</strong><br />
                <span>{{ item.judul }}</span>
              </td>
              <td>{{ item.kategori }}</td>
              <td>{{ item.upbjj }}</td>
              <td>{{ item.lokasiRak }}</td>
              <td>{{ $filters.rupiah(item.harga) }}</td>
              <td>{{ $filters.buah(item.qty) }}</td>
              <td>{{ $filters.buah(item.safety) }}</td>
              <!-- Tooltip: hover untuk lihat catatan -->
              <td class="tooltip-cell">
                <StatusBadge :qty="item.qty" :safety="item.safety" />
                <div v-if="item.catatanHTML" class="tooltip-box" v-html="item.catatanHTML"></div>
              </td>
              <td class="action-cell">
                <button class="btn btn-small" @click="editItem(item)">✏️ Edit</button>
                <button class="btn btn-small btn-danger" @click="askDelete(item)">🗑️ Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal Konfirmasi Hapus -->
    <AppModal
      :show="modal.show"
      title="Hapus Data Stok"
      :message="`Yakin ingin menghapus '${modal.item?.judul || 'data ini'}'? Tindakan ini tidak dapat dibatalkan.`"
      @cancel="modal.show = false"
      @confirm="deleteItem"
    />
  </main>
</template>

<script>
import dataBahanAjar from '../json/dataBahanAjar.json'
import StatusBadge from '../components/StatusBadge.vue'
import AppModal from '../components/AppModal.vue'

const emptyForm = () => ({
  kode: '',
  judul: '',
  kategori: '',
  upbjj: '',
  lokasiRak: '',
  harga: 0,
  qty: 0,
  safety: 0,
  catatanHTML: ''
})

export default {
  name: 'StockView',
  components: {
    StatusBadge,
    AppModal
  },
  data() {
    return {
      stok: JSON.parse(JSON.stringify(dataBahanAjar.stok)),
      upbjjList: dataBahanAjar.upbjjList,
      kategoriList: dataBahanAjar.kategoriList,
      filter: {
        upbjj: '',
        kategori: '',
        status: ''
      },
      sortBy: 'judul',
      form: emptyForm(),
      formError: {},
      editMode: false,
      showForm: false,
      modal: {
        show: false,
        item: null
      },
      // Notifikasi sort untuk watcher
      sortNotif: ''
    }
  },
  computed: {
    // Dependent options: kategori berubah sesuai UPBJJ yang dipilih
    kategoriByUpbjj() {
      if (!this.filter.upbjj) return this.kategoriList
      const kategori = this.stok
        .filter((item) => item.upbjj === this.filter.upbjj)
        .map((item) => item.kategori)
      return [...new Set(kategori)]
    },
    // Computed dengan caching — tidak recompute jika filter tidak berubah
    filteredStok() {
      let result = [...this.stok]

      if (this.filter.upbjj) {
        result = result.filter((item) => item.upbjj === this.filter.upbjj)
      }
      if (this.filter.kategori) {
        result = result.filter((item) => item.kategori === this.filter.kategori)
      }
      if (this.filter.status === 'reorder') {
        result = result.filter((item) => item.qty < item.safety || item.qty === 0)
      }
      if (this.filter.status === 'kosong') {
        result = result.filter((item) => item.qty === 0)
      }

      return result.sort((a, b) => {
        if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul)
        return Number(a[this.sortBy]) - Number(b[this.sortBy])
      })
    },
    isFiltered() {
      return this.filter.upbjj || this.filter.kategori || this.filter.status
    }
  },
  watch: {
    // Watcher 1: Reset kategori saat UPBJJ berubah (dependent filter)
    'filter.upbjj'() {
      this.filter.kategori = ''
    },
    // Watcher 2: Tampilkan notifikasi saat sort berubah
    sortBy(newValue) {
      const label = { judul: 'Judul', qty: 'Stok', harga: 'Harga' }
      this.sortNotif = `Data diurutkan berdasarkan: ${label[newValue] || newValue}`
      setTimeout(() => { this.sortNotif = '' }, 2000)
    }
  },
  methods: {
    validateForm() {
      const err = {}
      if (!this.form.kode) err.kode = 'Kode MK wajib diisi.'
      if (!this.form.judul) err.judul = 'Judul wajib diisi.'
      if (!this.form.kategori) err.kategori = 'Kategori wajib dipilih.'
      if (!this.form.upbjj) err.upbjj = 'UPBJJ wajib dipilih.'
      if (this.form.harga === null || this.form.harga === '' || this.form.harga < 0)
        err.harga = 'Harga tidak boleh negatif.'
      if (this.form.qty === null || this.form.qty === '' || this.form.qty < 0)
        err.qty = 'Qty tidak boleh negatif.'
      if (this.form.safety === null || this.form.safety === '' || this.form.safety < 0)
        err.safety = 'Safety tidak boleh negatif.'
      if (!this.editMode && this.stok.some((item) => item.kode === this.form.kode))
        err.kode = 'Kode MK sudah terdaftar.'
      this.formError = err
      return Object.keys(err).length === 0
    },
    saveItem() {
      if (!this.validateForm()) return

      if (this.editMode) {
        const index = this.stok.findIndex((item) => item.kode === this.form.kode)
        this.stok.splice(index, 1, { ...this.form })
      } else {
        this.stok.push({ ...this.form })
      }

      this.cancelForm()
    },
    editItem(item) {
      this.form = { ...item }
      this.formError = {}
      this.editMode = true
      this.showForm = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    askDelete(item) {
      this.modal.item = item
      this.modal.show = true
    },
    deleteItem() {
      this.stok = this.stok.filter((item) => item.kode !== this.modal.item.kode)
      this.modal.show = false
      this.modal.item = null
    },
    cancelForm() {
      this.form = emptyForm()
      this.formError = {}
      this.editMode = false
      this.showForm = false
    },
    resetFilter() {
      this.filter = { upbjj: '', kategori: '', status: '' }
      this.sortBy = 'judul'
    }
  }
}
</script>
