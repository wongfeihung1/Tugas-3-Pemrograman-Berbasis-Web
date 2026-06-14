<template>
  <header class="navbar">
    <div class="brand">
      <RouterLink to="/dashboard" class="brand-link">
        <img src="../assets/logo-ut.png" alt="Logo UT" class="logo-img" />

        <div>
          <h2>SITTA UT</h2>
          <p>Sistem Pemesanan Bahan Ajar</p>
        </div>
      </RouterLink>
    </div>

    <nav class="nav-menu">
      <RouterLink to="/stok">Informasi Bahan Ajar</RouterLink>
      <RouterLink to="/tracking">Tracking Pengiriman</RouterLink>

      <div class="dropdown">
        <button class="dropdown-toggle" type="button">
          Laporan ▾
        </button>

        <div class="dropdown-menu">
          <RouterLink to="/tracking">Monitoring Progress DO</RouterLink>
          <RouterLink to="/dashboard">Rekap Bahan Ajar</RouterLink>
        </div>
      </div>

      <RouterLink to="/order">Histori Transaksi</RouterLink>

      <button class="btn-logout" @click="logout">Keluar</button>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppNavbar',
  methods: {
    logout() {
      localStorage.removeItem('isLogin')
      localStorage.removeItem('namaUser')
      this.$router.push('/')
    }
  }
}
</script>