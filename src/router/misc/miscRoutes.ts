import BlankPage from '@/views/Pages/BlankPage.vue'
import FourZeroFour from '@/views/Errors/FourZeroFour.vue'

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
]
