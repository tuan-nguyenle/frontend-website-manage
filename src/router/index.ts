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
  // Set page title from route metadata
  document.title = `${to.meta.title}`

  const isAuthenticated = authService.isAuthenticated()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'Signin' })
  }

  if (to.name === 'Signin' && isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  next()
})
