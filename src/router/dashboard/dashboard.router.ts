import DashboardView from '@/views/DashboardView.vue'
import EcommerceView from '@/views/EcommerceView.vue'
import Calendar from '@/views/Others/Calendar.vue'
import UserProfile from '@/views/Others/UserProfile.vue'

export default [
  {
    path: '/',
    name: 'DashboardView',
    component: DashboardView,
    meta: { title: 'eCommerce' },
  },
  {
    path: '/ecommerce',
    name: 'EcommerceView',
    component: EcommerceView,
    meta: { title: 'Dashboard' },
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    meta: { title: 'Calendar' },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfile,
    meta: { title: 'Profile' },
  },
]
