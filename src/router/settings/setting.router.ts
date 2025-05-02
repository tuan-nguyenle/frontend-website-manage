import AccessManagementView from '@/views/Settings/AccessManagementView.vue'
import RoleFormPageView from '@/views/Settings/RoleFormPageView.vue'
import RoleManagementView from '@/views/Settings/RoleManagementView.vue'

export default [
  {
    path: '/settings/access-management',
    name: 'Access Management',
    component: AccessManagementView,
    meta: { title: 'Access Management' },
  },
  {
    path: '/settings/roles',
    name: 'Role Management',
    component: RoleManagementView,
    meta: { title: 'Role Management' },
  },
  {
    path: '/settings/roles/create',
    name: 'CreateRole',
    component: RoleFormPageView,
    meta: { title: 'Create Role' },
  },
  {
    path: '/settings/roles/edit/:id',
    name: 'EditRole',
    component: RoleFormPageView,
    meta: { title: 'Edit Role' },
    props: true,
  },
]
