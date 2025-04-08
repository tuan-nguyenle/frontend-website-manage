import Alerts from '@/views/UiElements/Alerts.vue'
import Avatars from '@/views/UiElements/Avatars.vue'
import Badges from '@/views/UiElements/Badges.vue'
import Buttons from '@/views/UiElements/Buttons.vue'
import Images from '@/views/UiElements/Images.vue'
import Videos from '@/views/UiElements/Videos.vue'

export default [
  {
    path: '/alerts',
    name: 'Alerts',
    component: Alerts,
    meta: { title: 'Alerts' },
  },
  {
    path: '/avatars',
    name: 'Avatars',
    component: Avatars,
    meta: { title: 'Avatars' },
  },
  {
    path: '/badge',
    name: 'Badge',
    component: Badges,
    meta: { title: 'Badge' },
  },
  {
    path: '/buttons',
    name: 'Buttons',
    component: Buttons,
    meta: { title: 'Buttons' },
  },
  {
    path: '/images',
    name: 'Images',
    component: Images,
    meta: { title: 'Images' },
  },
  {
    path: '/videos',
    name: 'Videos',
    component: Videos,
    meta: { title: 'Videos' },
  },
]
