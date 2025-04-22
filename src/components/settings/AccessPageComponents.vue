<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiService } from '@/services/api.services'
import SubHeaderComponents from './components/SubHeaderComponents.vue'
import PermissionTableComponents from './components/PermissionTableComponents.vue'

interface Role {
  id: number
  role_name: string
  pages: { page_id: number; page_name: string; permissions: string[] }[]
}

interface PermissionNode {
  id: number
  name: string
  children: PermissionNode[]
}

// State
const roles = ref<Role[]>([])
const pageTree = ref<PermissionNode[]>([])
const selectedRole = ref<Role | null>(null)
const searchQuery = ref<string>('')
const actions = ref<string[]>(['View', 'Edit', 'Delete', 'Import', 'Export', 'Manage'])

onMounted(async () => {
  try {
    const response = await apiService.get('/settings')
    const data = response.data as { roles: Role[]; pageTree: PermissionNode[] }
    // Ensure each page has a page_name property
    roles.value = (data.roles || []).map((role) => ({
      ...role,
      pages: (role.pages || []).map((page) => ({
        ...page,
        page_name: page.page_name || '', // Default to empty string if missing
      })),
    }))
    pageTree.value = data.pageTree || []
    if (roles.value.length > 0) {
      selectedRole.value = roles.value[0] // Default to first role
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }
})

const permissionTree = computed(() => pageTree.value)

const selectedRolePermissions = computed(() => {
  if (!selectedRole.value) return {}
  const permissionsMap: Record<number, Record<string, boolean>> = {}
  selectedRole.value.pages.forEach((page) => {
    const permObj: Record<string, boolean> = {}
    actions.value.forEach((action) => {
      permObj[action] = page.permissions.includes(action)
    })
    permissionsMap[page.page_id] = permObj
  })
  return permissionsMap
})

const addPermission = () => {
  alert('Add Permission functionality to be implemented.')
}

const togglePermission = (pageId: number, action: string) => {
  console.log(`Toggle permission for page ${pageId}, action ${action}`)
}
</script>

<template>
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
  >
    <SubHeaderComponents
      :roles="roles"
      :selected-role="selectedRole"
      @select-role="(role) => (selectedRole = role)"
      @update-search="(query: string) => (searchQuery = query)"
      @add-permission="addPermission"
    />
    <PermissionTableComponents
      v-if="selectedRole && permissionTree.length > 0"
      :permission-tree="permissionTree"
      :role-permissions="selectedRolePermissions"
      :actions="actions"
      @toggle-permission="togglePermission"
    />
    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      {{ roles.length === 0 ? 'No roles available' : 'Loading permissions...' }}
    </div>
  </div>
</template>
