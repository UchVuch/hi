import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: () => import('@/views/AuthView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router