<script setup lang="ts">
import { ref } from 'vue'
import SubHeaderComponents from './components/SubHeaderComponents.vue'
import PermissionTableComponents from './components/PermissionTableComponents.vue'

// Define types
interface PermissionNode {
  name: string
  children?: PermissionNode[]
}

interface Role {
  role_name: string
  permissions: Record<string, Record<string, boolean>>
}

// Define the permission tree based on the image
const permissionTree: PermissionNode[] = [
  { name: 'Orders', children: [{ name: 'Dispatch' }] },
  {
    name: 'Purchase orders',
    children: [
      { name: 'Purchase Order Details' },
      { name: 'Purchase Order Notes' },
      { name: 'Purchase Order Documents' },
      { name: 'Purchase Order Delivery Summary' },
      { name: 'Authorize Purchase Order' },
      { name: 'Allow Budget Check Override' },
      { name: 'Credit Note' },
      { name: 'Invoice' },
    ],
  },
]

// Define actions based on the image
const actions = ['View', 'Create', 'Modify', 'Cancel', 'Delete']

// Sample role data
const roles = ref<Role[]>([
  {
    role_name: 'Distributor',
    permissions: {
      Orders: { View: true, Create: false, Modify: false, Cancel: false, Delete: false },
      'Orders.Dispatch': { View: true, Create: false, Modify: false, Cancel: false, Delete: false },
      'Purchase orders': { View: true, Create: true, Modify: true, Cancel: true, Delete: true },
      'Purchase orders.Purchase Order Details': {
        View: true,
        Create: true,
        Modify: true,
        Cancel: false,
        Delete: false,
      },
      'Purchase orders.Purchase Order Notes': {
        View: true,
        Create: false,
        Modify: true,
        Cancel: false,
        Delete: false,
      },
      'Purchase orders.Purchase Order Documents': {
        View: true,
        Create: false,
        Modify: false,
        Cancel: false,
        Delete: false,
      },
      'Purchase orders.Purchase Order Delivery Summary': {
        View: true,
        Create: true,
        Modify: true,
        Cancel: false,
        Delete: true,
      },
      'Authorize Purchase Order': {
        View: true,
        Create: false,
        Modify: true,
        Cancel: false,
        Delete: false,
      },
      'Allow Budget Check Override': {
        View: false,
        Create: false,
        Modify: false,
        Cancel: false,
        Delete: false,
      },
      'Credit Note': { View: true, Create: true, Modify: true, Cancel: true, Delete: true },
      Invoice: { View: true, Create: false, Modify: false, Cancel: false, Delete: false },
    },
  },
])

const selectedRole = ref(roles.value[0])

const activeSubTab = ref<string>('Permissions')
const searchQuery = ref<string>('')

// Placeholder for Add User functionality
const addUser = () => {
  alert('Add Role functionality to be implemented.')
}

// Toggle permission logic
const togglePermission = (path: string, action: string) => {
  if (!selectedRole.value.permissions[path]) {
    selectedRole.value.permissions[path] = {}
    actions.forEach((act) => {
      selectedRole.value.permissions[path][act] = false
    })
  }
  selectedRole.value.permissions[path][action] = !selectedRole.value.permissions[path][action]
}
</script>

<template>
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
  >
    <SubHeaderComponents
      :active-sub-tab="activeSubTab"
      @set-sub-tab="(subTab) => (activeSubTab = subTab)"
      @update-search="(query: string) => (searchQuery = query)"
      @add-user="addUser"
    />
    <PermissionTableComponents
      v-if="activeSubTab === 'Permissions'"
      :permission-tree="permissionTree"
      :role-permissions="selectedRole.permissions"
      :actions="actions"
      @toggle-permission="togglePermission"
    />
  </div>
</template>
