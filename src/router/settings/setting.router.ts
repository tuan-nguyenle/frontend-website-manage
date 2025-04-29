import AccessManagementView from '@/views/Settings/AccessManagementView.vue'
import CreateRolePageView from '@/views/Settings/CreateRolePageView.vue'
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
    component: CreateRolePageView,
  },
  {
    path: '/settings/roles/edit/:id',
    name: 'EditRole',
    component: CreateRolePageView,
    props: true, // Pass route params as props to the component
  },
]
