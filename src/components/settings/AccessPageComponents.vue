<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { apiService } from '@/services/api.services'
import HeaderTableComponents from './components/HeaderTableComponents.vue'
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

const roles = ref<Role[]>([])
const pageTree = ref<PermissionNode[]>([])
const selectedRole = ref<Role | null>(null)
const searchQuery = ref<string>('')
const actions = ref<string[]>([
  'View',
  // 'Edit',
  // 'Delete',
  // 'Manage',
  // 'Import_Excel', 'Export_Excel'
])
const currentPermissions = ref<Record<number, Record<string, boolean>>>({})

onMounted(async () => {
  try {
    const response = await apiService.get('/settings')
    const data = response.data as { roles: Role[]; pageTree: PermissionNode[] }
    roles.value = (data.roles || []).map((role) => ({
      ...role,
      pages: (role.pages || []).map((page) => ({
        ...page,
        page_name: page.page_name || '',
      })),
    }))
    pageTree.value = data.pageTree || []
    if (roles.value.length > 0) {
      selectedRole.value = roles.value[0]
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }
})

watch(
  () => selectedRole.value,
  (newRole) => {
    if (newRole) {
      const permissionsMap: Record<number, Record<string, boolean>> = {}
      newRole.pages.forEach((page) => {
        const permObj: Record<string, boolean> = {}
        actions.value.forEach((action) => {
          permObj[action] = page.permissions.includes(action)
        })
        permissionsMap[page.page_id] = permObj
      })
      currentPermissions.value = permissionsMap
    } else {
      currentPermissions.value = {}
    }
  },
  { immediate: true },
)

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

const togglePermission = (pageId: number, action: string) => {
  if (!currentPermissions.value[pageId]) {
    currentPermissions.value[pageId] = {}
    actions.value.forEach((act) => {
      currentPermissions.value[pageId][act] = false
    })
  }
  currentPermissions.value[pageId][action] = !currentPermissions.value[pageId][action]
}

const savePermissions = async () => {
  if (!selectedRole.value) return
  const permissionsToSave = Object.entries(currentPermissions.value).map(([pageId, perms]) => ({
    page_id: Number(pageId),
    permission_names: actions.value.filter((action) => perms[action]),
  }))

  try {
    await apiService.put(`/settings/${selectedRole.value.id}/update-permission-role`, {
      permissions: permissionsToSave,
    })

    alert('Save Success')
  } catch (error) {
    alert(`Failed to save permissions ${error}`)
  }
}
</script>

<template>
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
  >
    <HeaderTableComponents
      :roles="roles"
      :selected-role="selectedRole"
      @select-role="(role) => (selectedRole = role)"
      @update-search="(query: string) => (searchQuery = query)"
      @save-permissions="savePermissions"
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
