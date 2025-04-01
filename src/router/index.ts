import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/auth'
import dashboardRoutes from './dashboard/dashboardRoutes'
import formRoutes from './form/formRoutes'
import tableRoutes from './table/tableRoutes'
import chartRoutes from './chart/chartRoutes'
import uiRoutes from './uiElement/uiRoutes'
import miscRoutes from './misc/miscRoutes'
import authRouter from './auth/authRouter'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    ...authRouter,
    ...dashboardRoutes,
    ...formRoutes,
    ...tableRoutes,
    ...chartRoutes,
    ...uiRoutes,
    ...miscRoutes,
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`

  if (to.meta.title !== 'Signin' && !isAuthenticated()) {
    next({ name: 'Signin' })
  }
  next()
})
