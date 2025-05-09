<script setup lang="ts">
import RoleDetailsComponent from './RoleDetails/RoleDetailsComponent.vue'
import RolePermissionsComponent from './RolePermissions/RolePermissionsComponent.vue'
import RoleUsersComponent from './RoleUsers/RoleUsersComponent.vue'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useRoleStore, useAuthStore, useUserStore, usePermissionStore } from '@/store'
import type { ExtendedRole, PermissionNode, Item } from '@/types'
import { useI18n } from 'vue-i18n'

// Initialize composables and stores
const { t } = useI18n()
const { showToast } = useToast()
const router = useRouter()
const route = useRoute()
const roleStore = useRoleStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

// Reactive state for the role
const role = ref<ExtendedRole>({
  id: 0,
  role_name: '',
  description: '',
  created_by: '',
  status: '1',
  pages: [],
  assigned: { users: [] },
  permissions: {},
  number_of_user: 0,
})

// Additional reactive state
const allUsers = ref<Item[]>([])
const permissionTree = ref<PermissionNode[]>([])
const loadingPermissions = ref(false)
const currentStep = ref(0)
const isEditMode = ref(false)
const isSubmitting = ref(false)

// Static data
const steps = ['Role Details', 'Permissions', 'Assign Users']
const actions = ['View', 'Create', 'Update', 'Delete']

// Validation states and computed properties
const showRoleNameError = ref(false)
const showPermissionsError = ref(false)
const showUsersAssignedError = ref(false)

const isRoleNameValid = computed(() => role.value.role_name.trim() !== '')
const hasPermissions = computed(() =>
  Object.values(role.value.permissions).some((pagePerms) =>
    Object.values(pagePerms).some((enabled) => enabled),
  ),
)
const hasUsersAssigned = computed(() => role.value.assigned.users.length > 0)

const roleNameError = computed(() =>
  showRoleNameError.value && !isRoleNameValid.value ? t('Role name is required') : '',
)
const permissionsError = computed(() =>
  showPermissionsError.value && !hasPermissions.value
    ? t('At least one permission must be selected')
    : '',
)
const usersAssignedError = computed(() =>
  showUsersAssignedError.value && !hasUsersAssigned.value
    ? t('At least one user must be assigned')
    : '',
)

// Load initial data and handle edit mode
onMounted(async () => {
  try {
    loadingPermissions.value = true

    if (!permissionStore.permissions.length) {
      await permissionStore.fetchPermissionTree()
    }
    permissionTree.value = permissionStore.permissions.map((permission: PermissionNode) => ({
      ...permission,
      children: permission.children.map((child) => ({ ...child, children: [] })),
    }))

    if (!userStore.users.length) {
      await userStore.fetchAllUsers()
    }
    allUsers.value = userStore.users.map((user: { id: string; name: string; email: string }) => ({
      id: Number(user.id),
      label: user.name,
      name: user.name,
      email: user.email,
    }))

    const roleId = route.params.id
    if (roleId) {
      isEditMode.value = true
      try {
        const fetchedRole = await roleStore.fetchRoleById(Number(roleId))
        role.value = {
          ...fetchedRole,
          permissions: fetchedRole.pages.reduce(
            (
              acc: Record<number, Record<string, boolean>>,
              page: { page_id: number; permissions: [] },
            ) => {
              acc[page.page_id] = page.permissions.reduce(
                (permAcc, perm) => {
                  permAcc[perm] = true
                  return permAcc
                },
                {} as Record<string, boolean>,
              )
              return acc
            },
            {} as Record<number, Record<string, boolean>>,
          ),
        } as ExtendedRole
        console.log(role.value)
      } catch (error) {
        console.error('Error fetching role:', error)
        showToast('error', 'Error Fetching Role', 'Failed to fetch role data.')
        router.push('/settings/roles')
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    showToast('error', 'Error Loading Data', 'Failed to load required data.')
  } finally {
    loadingPermissions.value = false
  }
})

// Step validation
const validateStep = (step: number): boolean => {
  if (step === 0 && !isRoleNameValid.value) {
    showRoleNameError.value = true
    showToast('error', 'Validation Error', t('Role name is required'))
    return false
  }
  if (step === 1 && !hasPermissions.value) {
    showPermissionsError.value = true
    showToast('error', 'Validation Error', t('At least one permission must be selected'))
    return false
  }
  if (step === 2 && !hasUsersAssigned.value) {
    showUsersAssignedError.value = true
    showToast('error', 'Validation Error', t('At least one user must be assigned'))
    return false
  }
  return true
}

// Navigation between steps
const nextStep = () => {
  if (validateStep(currentStep.value) && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    showRoleNameError.value = false
    showPermissionsError.value = false
    showUsersAssignedError.value = false
  }
}

// Toggle permissions
const togglePermission = (pageId: number, action: string) => {
  if (!role.value.permissions[pageId]) {
    role.value.permissions[pageId] = {}
  }
  role.value.permissions[pageId][action] = !role.value.permissions[pageId][action]
}

// Save role to store
const saveRole = async () => {
  if (isSubmitting.value) return

  if (!validateStep(0)) {
    currentStep.value = 0
    return
  }
  if (!validateStep(1)) {
    currentStep.value = 1
    return
  }
  if (!validateStep(2)) {
    currentStep.value = 2
    return
  }

  isSubmitting.value = true
  const pages = Object.entries(role.value.permissions).map(([pageId, perms]) => ({
    page_id: Number(pageId),
    permissions: Object.entries(perms)
      .filter(([, enabled]) => enabled)
      .map(([action]) => ({ name: action })),
  }))

  const roleData = {
    id: role.value.id,
    role_name: role.value.role_name.trim(),
    description: role.value.description.trim(),
    created_by: authStore.user?.name || 'Admin',
    status: role.value.status,
    pages,
    assigned: { users: role.value.assigned.users.map((user) => user.id) },
  }

  roleStore
    .createRole(roleData)
    .then(() => {
      showToast('success', isEditMode.value ? 'Role Updated' : 'Role Created', 'Role saved.')
      router.push('/settings/roles')
    })
    .catch((error) => {
      showToast('error', 'Failed to Save', error.messages)
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

// Cancel and reset form
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
        :role-name-error="roleNameError"
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
        :permissions-error="permissionsError"
        @toggle-permission="togglePermission"
      />
    </div>

    <div v-if="currentStep === 2">
      <RoleUsersComponent
        :role="role"
        :available-users="allUsers"
        :users-error="usersAssignedError"
        @update:role="
          (updatedRole) => {
            role.assigned.users = updatedRole.assigned.users
          }
        "
      />
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-8">
      <button
        @click="cancel"
        :disabled="isSubmitting"
        class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
      >
        {{ $t('Discard') }}
      </button>
      <div>
        <button
          v-if="currentStep > 0"
          @click="prevStep"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm shadow-theme-xs bg-gray-200 text-gray-700 mr-2 hover:bg-gray-400"
        >
          {{ $t('Back') }}
        </button>
        <button
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm text-white shadow-theme-xs bg-purple-500 hover:bg-purple-600"
        >
          {{ $t('Next') }}
        </button>
        <button
          v-else
          @click="saveRole"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm text-white shadow-theme-xs bg-purple-500 hover:bg-purple-600"
        >
          <span v-if="isSubmitting">{{ $t('Saving...') }}</span>
          <span v-else>{{ isEditMode ? $t('Update Role') : $t('Create Role') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
