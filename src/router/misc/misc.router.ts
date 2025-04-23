import BlankPage from '@/views/Pages/BlankPage.vue'
import FourZeroFour from '@/views/Errors/FourZeroFour.vue'
import FourZeroThree from '@/views/Errors/FourZeroThree.vue'

export default [
  {
    path: '/blank',
    name: 'Blank',
    component: BlankPage,
    meta: { title: 'Blank' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404 Error',
    component: FourZeroFour,
    meta: { title: '404 Error' },
  },
  {
    path: '/403',
    name: '403 Error',
    component: FourZeroThree,
    meta: { title: '403 Error' },
  },
]
