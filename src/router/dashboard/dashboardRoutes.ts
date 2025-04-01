import Ecommerce from '@/views/Ecommerce.vue'
import Calendar from '@/views/Others/Calendar.vue'
import UserProfile from '@/views/Others/UserProfile.vue'

export default [
  {
    path: '/',
    name: 'Ecommerce',
    component: Ecommerce,
    meta: { title: 'eCommerce Dashboard' },
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
