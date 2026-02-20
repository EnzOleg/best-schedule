import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import SearchListView from '../views/SearchListView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/schedule',
    component: ScheduleView
  },
  {
    path: '/search-list',
    component: SearchListView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
