<script setup lang="ts">
import RoleDetailsComponent from './RoleDetails/RoleDetailsComponent.vue'
import RolePermissionsComponent from './RolePermissions/RolePermissionsComponent.vue'
import RoleUsersComponent from './RoleUsers/RoleUsersComponent.vue'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useRoleStore, useAuthStore, useUserStore, usePermissionStore } from '@/store'
import type { ExtendedRole, Role, PermissionNode, Item } from '@/types'

// Define types for external dependencies
interface User {
  id: string | number
  name: string
  email: string
}

const router = useRouter()
const roleStore = useRoleStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

// Initialize role with all required ExtendedRole properties
const role = ref<ExtendedRole>({
  id: 0,
  role_name: '',
  description: '',
  created_by: '',
  status: '1', // Default status as active
  pages: [],
  assigned: { users: [] },
  permissions: {},
  number_of_user: 0,
})

const allUsers = ref<Item[]>([])
const permissionTree = ref<PermissionNode[]>([])
const loadingPermissions = ref(false)
const actions: string[] = ['View', 'Create', 'Update', 'Delete']
const currentStep = ref(0)
const isEditMode = ref(false)
const steps = ['Role Details', 'Permissions', 'Assign Users'] as const

// Fetch data on component mount
onMounted(async () => {
  try {
    loadingPermissions.value = true

    // Fetch users and permissions concurrently
    await Promise.all([userStore.fetchAllUsers(), permissionStore.fetchPermissionTree()])

    // Map permission tree
    permissionTree.value = permissionStore.permissions.map((permission: PermissionNode) => ({
      ...permission,
      children: permission.children.map((child) => ({
        ...child,
        children: [],
      })),
    }))

    // Map users to Item interface
    allUsers.value = userStore.users.map((user: User) => ({
      id: Number(user.id),
      label: user.name,
      name: user.name,
      email: user.email,
    }))

    // Handle edit mode
    // const roleId = router.currentRoute.value.params.id
    // if (roleId) {
    //   isEditMode.value = true
    //   const roleData = await roleStore.fetchRole(Number(roleId)) as Role & {
    //     assigned: { users: Item[] }
    //     number_of_user: number
    //   }
    //   role.value = {
    //     ...roleData,
    //     permissions: roleData.pages.reduce(
    //       (acc, page) => {
    //         acc[page.page_id] = page.permissions.reduce(
    //           (permAcc, perm) => {
    //             permAcc[perm.name] = true
    //             return permAcc
    //           },
    //           {} as Record<string, boolean>,
    //         )
    //         return acc
    //       },
    //       {} as Record<number, Record<string, boolean>>,
    //     ),
    //     assigned: { users: roleData.assigned.users },
    //     number_of_user: roleData.number_of_user,
    //   }
    // }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loadingPermissions.value = false
  }
})

// Computed property to determine if the user can proceed
const canProceed = computed(() => {
  return currentStep.value === 0 ? role.value.role_name.trim() !== '' : true
})

// Navigation functions
const nextStep = () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Toggle permission for a page and action
const togglePermission = (pageId: number, action: string) => {
  if (!role.value.permissions[pageId]) {
    role.value.permissions[pageId] = {}
  }
  role.value.permissions[pageId][action] = !role.value.permissions[pageId][action]
}

// Define emits
const emit = defineEmits<{
  (e: 'saved'): void
}>()

// Save or update the role
const saveRole = async () => {
  try {
    // Convert permissions to pages array
    const pages = Object.entries(role.value.permissions).map(([pageId, perms]) => ({
      page_id: Number(pageId),
      permissions: Object.entries(perms)
        .filter(([, enabled]) => enabled)
        .map(([action]) => ({ name: action })),
    }))

    // Prepare role data for saving
    const roleData: Role = {
      id: role.value.id,
      role_name: role.value.role_name,
      description: role.value.description,
      created_by: authStore.user?.name || 'Admin',
      status: role.value.status,
      pages,
    }

    // Save or update role based on edit mode
    // if (isEditMode.value) {
    //   await roleStore.updateRole(roleData)
    // } else {
    await roleStore.createRole(roleData)
    // }

    emit('saved')
    router.push('/settings/roles')
  } catch (error) {
    console.error('Failed to save role:', error)
  }
}

// Cancel and reset
const cancel = () => {
  role.value = {
    id: 0,
    role_name: '',
    description: '',
    created_by: '',
    status: '1',
    pages: [],
    assigned: { users: [] },
    permissions: {},
    number_of_user: 0,
  }
  currentStep.value = 0
  router.push('/settings/roles')
}
</script>

<template>
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
  >
    <!-- Title -->
    <h1 class="text-2xl mb-4 font-semibold text-gray-800 dark:text-white/90">
      {{ isEditMode ? $t('Edit Role') : $t('Create Role') }}
    </h1>

    <!-- Stepper -->
    <div class="flex mb-6">
      <div v-for="(step, idx) in steps" :key="step" class="flex-1 flex items-center">
        <div
          :class="[
            'w-8 h-8 flex items-center justify-center rounded-full',
            currentStep === idx ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500',
          ]"
        >
          {{ idx + 1 }}
        </div>
        <div
          class="ml-2 text-sm font-medium"
          :class="currentStep === idx ? 'text-purple-600' : 'text-gray-500'"
        >
          {{ $t(step) }}
        </div>
        <div v-if="idx < steps.length - 1" class="flex-1 h-0.5 bg-gray-200 mx-2"></div>
      </div>
    </div>

    <!-- Step Components -->
    <div v-if="currentStep === 0">
      <RoleDetailsComponent
        :role="role"
        @update:role="
          (updatedRole) => {
            role.role_name = updatedRole.role_name
            role.description = updatedRole.description
          }
        "
      />
    </div>

    <div v-if="currentStep === 1">
      <RolePermissionsComponent
        :role="role"
        :actions="actions"
        :permission-tree="permissionTree"
        :loading="loadingPermissions"
        @toggle-permission="togglePermission"
      />
    </div>

    <div v-if="currentStep === 2">
      <RoleUsersComponent
        :role="role"
        :available-users="allUsers"
        @update:role="
          (updatedRole) => {
            role.assigned.users = updatedRole.assigned.users
          }
        "
      />
    </div>

    <!-- Footer -->
    <div class="flex justify-between mt-8">
      <button
        @click="cancel"
        class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
      >
        {{ $t('Discard') }}
      </button>
      <div>
        <button
          v-if="currentStep > 0"
          @click="prevStep"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm shadow-theme-xs bg-gray-200 text-gray-700 mr-2 hover:bg-gray-400"
        >
          {{ $t('Back') }}
        </button>
        <button
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          :disabled="!canProceed"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm text-white shadow-theme-xs bg-purple-500 hover:bg-purple-600"
        >
          {{ $t('Next') }}
        </button>
        <button
          v-else
          @click="saveRole"
          :disabled="!canProceed"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm text-white shadow-theme-xs bg-purple-500 hover:bg-purple-600"
        >
          {{ isEditMode ? $t('Update Role') : $t('Create Role') }}
        </button>
      </div>
    </div>
  </div>
</template>
