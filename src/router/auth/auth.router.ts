import Signin from '@/views/Auth/Signin.vue'
import Signup from '@/views/Auth/Signup.vue'

export default [
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
    meta: { title: 'Signin', requiresAuth: false },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { title: 'Signup', requiresAuth: false },
  },
]
