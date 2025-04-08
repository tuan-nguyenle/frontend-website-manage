import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from './dashboard/dashboard.router'
import formRoutes from './form/form.router'
import tableRoutes from './table/table.router'
import chartRoutes from './chart/chart.router'
import uiRoutes from './uiElement/ui.router'
import miscRoutes from './misc/misc.router'
import authRouter from './auth/auth.router'
import { useAuthStore } from '@/store/auth.store'
import { storeToRefs } from 'pinia'

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
  const verifyAuthenticated = storeToRefs(useAuthStore()).isAuthenticated.value
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)

  if (requiresAuth && !verifyAuthenticated) {
    return next({ name: 'Signin' })
  }

  if (verifyAuthenticated && to.name && ['Signin', 'Signup'].includes(to.name.toString())) {
    return next({ name: 'Dashboard' })
  }

  next()
})
