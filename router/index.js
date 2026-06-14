import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import StockView from '../views/StockView.vue'
import TrackingView from '../views/TrackingView.vue'


const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/stok', name: 'stok', component: StockView, meta: { requiresAuth: true } },
  { path: '/tracking', name: 'tracking', component: TrackingView, meta: { requiresAuth: true } },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const isLogin = localStorage.getItem('isLogin') === 'true'
  if (to.meta.requiresAuth && !isLogin) {
    return { name: 'login' }
  }
  if (to.name === 'login' && isLogin) {
    return { name: 'dashboard' }
  }
})

export default router
