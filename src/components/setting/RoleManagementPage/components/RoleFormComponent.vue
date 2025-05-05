<!-- RoleFormComponent.vue -->
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
        :key="permissionTree.length"
        :role="role"
        :actions="actions"
        :permission-tree="permissionTree"
        :loading="loadingPermissions"
        @toggle-permission="togglePermission"
        @retry-fetch="retryFetchPermissions"
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
          {{ isEditMode ? 'Update Role' : 'Create Role' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoleDetailsComponent from './RoleDetails/RoleDetailsComponent.vue'
import RolePermissionsComponent from './RolePermissions/RolePermissionsComponent.vue'
import RoleUsersComponent from './RoleUsers/RoleUsersComponent.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.services'

interface SelectOption {
  value: number
  label: string
  id: number
  name: string
  email: string
}

interface Role {
  id: number
  role_name: string
  description: string
  created_by: string
  pages: Page[]
  assigned: { users: SelectOption[] }
  permissions: Record<number, Record<string, boolean>>
}

interface Page {
  page_id: number
  permissions: { name: string }[]
}

interface PermissionNode {
  id: number
  name: string
  children: PermissionNode[]
}

const router = useRouter()

const role = ref<Role>({
  id: 0,
  role_name: '',
  description: '',
  created_by: '',
  pages: [],
  assigned: { users: [] },
  permissions: {}
})

const allUsers = ref<SelectOption[]>([])
const permissionTree = ref<PermissionNode[]>([])
const loadingPermissions = ref(false)
const actions: string[] = ['View', 'Create', 'Update', 'Delete']
const currentStep = ref(0)
const isEditMode = ref(false)
const steps = ['Role Details', 'Permissions', 'Assign Users']

// Fetch users and permissions when the component mounts
onMounted(async () => {
  console.log('RoleFormComponent mounted, starting fetch')
  try {
    loadingPermissions.value = true
    const userPromise = apiService.get<SelectOption[]>('/user/get-all-user').then(response => {
      console.log('Users fetched:', response.data)
      allUsers.value = response.data.map(user => ({
        value: user.id,
        label: `${user.name} (${user.email})`,
        id: user.id,
        name: user.name,
        email: user.email,
      }))
    })

    const permissionPromise = apiService
      .get<{ pageTree: PermissionNode[] }>('/settings/get-page-tree-structure')
      .then(response => {
        console.log('Permission tree response:', response.data)
        if (response.data && Array.isArray(response.data.pageTree)) {
          permissionTree.value = response.data.pageTree.map(node => ({
            ...node,
            id: Number(node.id)
          }))
          console.log('Permission tree set:', permissionTree.value)
        } else {
          console.error('Invalid permission tree response:', response.data)
          permissionTree.value = []
        }
      })

    await Promise.allSettled([userPromise, permissionPromise]).then(results => {
      console.log('Fetch results:', results)
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    permissionTree.value = []
  } finally {
    loadingPermissions.value = false
    console.log('Loading complete, permissionTree:', permissionTree.value)
  }

  const roleId = router.currentRoute.value.params.id
  if (roleId) {
    isEditMode.value = true
    console.log('Editing role:', roleId)
  }
})

const retryFetchPermissions = async () => {
  try {
    loadingPermissions.value = true
    const response = await apiService.get<{ pageTree: PermissionNode[] }>(
      '/settings/get-page-tree-structure'
    )
    console.log('Retry permission tree response:', response.data)
    if (response.data && Array.isArray(response.data.pageTree)) {
      permissionTree.value = response.data.pageTree.map(node => ({
        ...node,
        id: Number(node.id)
      }))
    } else {
      console.error('Invalid retry permission tree response:', response.data)
      permissionTree.value = []
    }
  } catch (error) {
    console.error('Retry fetch error:', error)
    permissionTree.value = []
  } finally {
    loadingPermissions.value = false
    console.log('Retry complete, permissionTree:', permissionTree.value)
  }
}

const canProceed = computed(() => {
  return currentStep.value === 0 ? role.value.role_name.trim() !== '' : true
})

const nextStep = () => {
  if (canProceed.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const togglePermission = (pageId: number, action: string) => {
  if (!role.value.permissions[pageId]) {
    role.value.permissions[pageId] = {} as Record<string, boolean>
  }
  role.value.permissions[pageId][action] = !role.value.permissions[pageId][action]

  const page = role.value.pages.find(p => p.page_id === pageId)
  if (!page) {
    role.value.pages.push({
      page_id: pageId,
      permissions: [{ name: action }]
    })
  } else {
    const permissionIndex = page.permissions.findIndex(p => p.name === action)
    if (permissionIndex === -1) {
      page.permissions.push({ name: action })
    }
  }
}

const emit = defineEmits(['saved'])

const saveRole = async () => {
  try {
    const roleData: Role = {
      id: role.value.id,
      role_name: role.value.role_name,
      description: role.value.description,
      created_by: 'current_user',
      pages: role.value.pages,
      assigned: role.value.assigned,
      permissions: role.value.permissions
    }

    console.log(roleData)
    emit('saved')
  } catch (error) {
    console.error('Failed to save role:', error)
  }
}

const cancel = () => {
  role.value = {
    id: 0,
    role_name: '',
    description: '',
    created_by: '',
    pages: [],
    assigned: { users: [] },
    permissions: {}
  }
  currentStep.value = 0
  router.push('/settings/roles')
}
</script>
