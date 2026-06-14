<template>
  <main class="page dashboard-page">
    <section class="hero-card">
      <div>
        <p class="eyebrow">Dashboard</p>
        <h1>{{ greeting }}, {{ namaUser }}</h1>
        <p>
          Selamat datang di Dashboard Bahan Ajar UT. Pantau stok bahan ajar, data paket, dan status pengiriman DO dalam satu aplikasi.
        </p>
      </div>
      <div class="hero-stat">
        <strong>{{ data.stok.length }}</strong>
        <span>Data Bahan Ajar</span>
      </div>
    </section>

    <section class="summary-grid">
      <div class="summary-card">
        <span>Total UPBJJ</span>
        <strong>{{ data.upbjjList.length }}</strong>
      </div>
      <div class="summary-card">
        <span>Total Paket</span>
        <strong>{{ data.paket.length }}</strong>
      </div>
      <div class="summary-card">
        <span>Stok Menipis/Kosong</span>
        <strong>{{ jumlahReorder }}</strong>
      </div>
      <div class="summary-card">
        <span>Total Nilai Stok</span>
        <strong>{{ $filters.rupiah(totalNilaiStok) }}</strong>
      </div>
    </section>

    <section class="card">
      <h2>Daftar Bahan Ajar Perlu Perhatian</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Judul</th>
              <th>UPBJJ</th>
              <th>Qty</th>
              <th>Safety</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stokMenipis" :key="item.kode">
              <td>{{ item.kode }}</td>
              <td>{{ item.judul }}</td>
              <td>{{ item.upbjj }}</td>
              <td>{{ $filters.buah(item.qty) }}</td>
              <td>{{ $filters.buah(item.safety) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script>
import dataBahanAjar from '../json/dataBahanAjar.json'

export default {
  name: 'DashboardView',
  data() {
    return {
      data: dataBahanAjar,
      namaUser: 'Pengguna',
      greeting: ''
    }
  },

  computed: {
    totalUpbjj() {
      return this.data.upbjjList.length
    },

    totalPaket() {
      return this.data.paket.length
    },

    stokMenipis() {
      return this.data.stok.filter(item => item.qty < item.safety || item.qty === 0)
    },

    jumlahReorder() {
      return this.stokMenipis.length
    },

    totalNilaiStok() {
      return this.data.stok.reduce((total, item) => {
        return total + Number(item.harga) * Number(item.qty)
      }, 0)
    }
  },

  mounted() {
    this.namaUser = localStorage.getItem('namaUser') || 'Pengguna'

    const hours = new Date().getHours()

    if (hours >= 5 && hours < 11) {
      this.greeting = 'Selamat pagi'
    } else if (hours >= 11 && hours < 15) {
      this.greeting = 'Selamat siang'
    } else if (hours >= 15 && hours < 18) {
      this.greeting = 'Selamat sore'
    } else {
      this.greeting = 'Selamat malam'
    }
  }
}
</script>
