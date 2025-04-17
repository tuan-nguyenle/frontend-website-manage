<script setup lang="ts">
import { ref } from 'vue'
import Subheader from './components/SubHeaderComponents.vue'
import UserTable from './components/UserTableComponents.vue'

// Define types
type PermissionState = 'on' | 'off'

interface User {
  name: string
  avatar: string
  status: string
  permissions: Record<string, PermissionState>
}

// Sample user data
const users = ref<User[]>([
  {
    name: 'leilacolle',
    avatar: 'placeholder.png',
    status: 'Online',
    permissions: {
      'Manage workspace settings': 'on',
      'Manage workspace billing': 'on',
      'Manage workspace integration settings': 'on',
      'Manage workspace users': 'on',
      'Manage workspace permissions': 'on',
    },
  },
  {
    name: 'aiden',
    avatar: 'placeholder.png',
    status: 'Last online 3m ago',
    permissions: {
      'Manage workspace settings': 'on',
      'Manage workspace billing': 'on',
      'Manage workspace integration settings': 'on',
      'Manage workspace users': 'on',
      'Manage workspace permissions': 'on',
    },
  },
  {
    name: 'johnny.b',
    avatar: 'placeholder.png',
    status: 'Online',
    permissions: {
      'Manage workspace settings': 'on',
      'Manage workspace billing': 'on',
      'Manage workspace integration settings': 'off',
      'Manage workspace users': 'on',
      'Manage workspace permissions': 'on',
    },
  },
])

const activeSubTab = ref<string>('Permissions')
const searchQuery = ref<string>('') // New state for search input

const permissions = [
  'Manage workspace settings',
  'Manage workspace billing',
  'Manage workspace integration settings',
  'Manage workspace users',
  'Manage workspace permissions',
]

// Filter users based on tab and search query
const filteredUsers = () => {
  return users.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
}

// Toggle permission logic
const togglePermission = (user: User, permission: string) => {
  user.permissions[permission] = user.permissions[permission] === 'on' ? 'off' : 'on'
}

// Placeholder for Add User functionality
const addUser = () => {
  alert('Add User functionality to be implemented.')
}
</script>

<template>
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
  >
    <Subheader
      :active-sub-tab="activeSubTab"
      @set-sub-tab="(subTab) => (activeSubTab = subTab)"
      @update-search="(query: string) => (searchQuery = query)"
      @add-user="addUser"
    />
    <UserTable
      :users="filteredUsers()"
      :permissions="permissions"
      @toggle-permission="togglePermission"
    />
  </div>
</template>
