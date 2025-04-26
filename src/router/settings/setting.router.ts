import AccessManagementView from '@/views/Settings/AccessManagementView.vue'
import RoleManagementView from '@/views/Settings/RoleManagementView.vue'

export default [
  {
    path: '/access-management',
    name: 'Access Management',
    component: AccessManagementView,
    meta: { title: 'Access Management' },
  },
  {
    path: '/role-management',
    name: 'Role Management',
    component: RoleManagementView,
    meta: { title: 'Role Management' },
  },
]
