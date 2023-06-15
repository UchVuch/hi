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
  {
    path: '/generator',
    name: 'generator',
    component: () => import('@/views/GeneratorView.vue')
  },
  {
    path: '/database',
    name: 'database',
    component: () => import('@/views/DatabaseView.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router