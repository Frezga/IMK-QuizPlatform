import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MateriView from '@/views/MateriView.vue'
import ArenaView from '@/views/ArenaView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Beranda — HeuriLab' },
  },
  {
    path: '/materi',
    name: 'materi',
    component: MateriView,
    meta: { title: 'Materi 10 Heuristik — HeuriLab' },
  },
  {
    path: '/arena',
    name: 'arena',
    component: ArenaView,
    meta: { title: 'Arena Kasus Interaktif — HeuriLab' },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderboardView,
    meta: { title: 'Progres & Leaderboard — HeuriLab' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
