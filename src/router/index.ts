import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sudoku',
      name: 'Sudoku',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SudokuView.vue'),
    },
    {
      path: '/binary',
      name: 'Binary',
      component: () => import('../views/BinaryView.vue'),
    },
    {
      path: '/unicode',
      name: 'Unicode',
      component: () => import('../views/UnicodeView.vue'),
    }
  ],
})

export default router
