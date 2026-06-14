<template>
  <section class="login-page">
    <div class="login-left">
      <div class="login-badge">TUGAS PRAKTIK 3</div>
      <h1>SITTA UT</h1>
      <p>
        Aplikasi pemesanan, monitoring stok, dan tracking delivery order bahan ajar Universitas Terbuka.
      </p>
      <div class="login-info">
        <span>Vue Component</span>
        <span>Router</span>
        <span>JSON Data</span>
      </div>
    </div>

    <div class="login-card">
      <h2>Login Sistem</h2>
      <p class="muted">Masuk untuk mengakses dashboard bahan ajar.</p>

      <form @submit.prevent="login">
        <label>Username</label>
        <input v-model.trim="username" type="text" placeholder="Masukkan username" @keyup.enter="login" />

        <label>Password</label>
        <input v-model.trim="password" type="password" placeholder="Masukkan password" @keyup.enter="login" />

        <p v-if="error" class="error-message">{{ error }}</p>

        <button class="btn btn-primary full" type="submit">Login</button>
      </form>

      <div class="login-demo">
        <strong>Akun demo:</strong>
        <span>admin / admin123</span>
        <span>ilhan / 12345</span>
      </div>
    </div>
  </section>
</template>

<script>
import users from '../json/users.json'

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login() {
      if (!this.username || !this.password) {
        this.error = 'Username dan password wajib diisi.'
        return
      }

      const user = users.find(
        (item) => item.username === this.username && item.password === this.password
      )

      if (!user) {
        this.error = 'Username atau password salah.'
        return
      }

      localStorage.setItem('isLogin', 'true')
      localStorage.setItem('namaUser', user.nama)
      this.$router.push('/dashboard')
    }
  }
}
</script>
