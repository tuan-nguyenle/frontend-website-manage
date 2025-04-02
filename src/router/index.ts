import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from './dashboard/dashboardRoutes'
import formRoutes from './form/formRoutes'
import tableRoutes from './table/tableRoutes'
import chartRoutes from './chart/chartRoutes'
import uiRoutes from './uiElement/uiRoutes'
import miscRoutes from './misc/miscRoutes'
import authRouter from './auth/authRouter'
import { authService } from '@/services'

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
  const isAuthenticated = authService.isAuthenticated()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Signin' })
  }

  if (isAuthenticated && to.name && ['Signin', 'Signup'].includes(to.name.toString())) {
    next({ name: 'Dashboard' })
  }

  next()
})
