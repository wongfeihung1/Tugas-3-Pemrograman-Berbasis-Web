# Tugas 3 Pemrograman Berbasis Web - Vue

Aplikasi Vue + Vite untuk pemesanan bahan ajar UT.

## Cara menjalankan

```bash
npm install
npm run dev
```

Akun login:
- username: admin, password: admin123
- username: ilhan, password: 12345

## Struktur

- `src/views/LoginView.vue` halaman login
- `src/views/DashboardView.vue` dashboard
- `src/views/StockView.vue` CRUD stok, filter, sort, status badge, modal delete
- `src/views/TrackingView.vue` tracking DO, tambah DO, tambah progress
- `src/views/OrderView.vue` simulasi pemesanan
- `src/json/dataBahanAjar.json` dummy data bahan ajar
- `src/json/users.json` dummy data user login
- `src/router/index.js` pengaturan route
