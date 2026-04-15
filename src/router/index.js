import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import SearchListView from '../views/SearchListView.vue'

// --- Маршруты ---
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/schedule', component: ScheduleView, meta: { requiresAuth: true } },
  { path: '/search-list', component: SearchListView, meta: { requiresAuth: true } },
  // Можно добавить "страницу 404"
  { path: '/:catchAll(.*)', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- Защита маршрутов ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Если маршрут требует авторизацию, а токена нет → редирект на /login
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // Если пытаются зайти на логин, но уже авторизованы → редирект на /schedule
  if (to.path === '/login' && token) {
    return next('/schedule')
  }

  if (to.meta.requiresRole) {
    if (!role || role.toUpperCase() !== to.meta.requiresRole.toUpperCase()) {
      return next('/schedule') // нет доступа
    }
  }

  next()
})

export default router