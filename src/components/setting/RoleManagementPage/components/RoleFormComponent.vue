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
        @toggle-permission="togglePermission"
      />
    </div>

    <div v-if="currentStep === 2">
      <RoleUsersComponent
        :role="role"
        :users="users"
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
import { ref, computed, onMounted, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
// import { useSettingsStore } from '@/store'

// Type Definitions
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

interface Item {
  value: number
  label: string
  id: number
  name: string
  email: string
}

// Initialize router
const router = useRouter()

// Initialize role
const role = ref<Role>({
  id: 0,
  role_name: '',
  description: '',
  created_by: '',
  pages: [] as Page[],
  assigned: { users: [] },
  permissions: {} as Record<number, Record<string, boolean>>
})



// Mock Data
const users = ref<Item[]>([
  { value: 1, label: 'Alice Johnson', id: 1, name: 'Alice Johnson', email: 'alice@company.com' },
  { value: 2, label: 'Bob Smith', id: 2, name: 'Bob Smith', email: 'bob@company.com' },
  { value: 3, label: 'Carol Lee', id: 3, name: 'Carol Lee', email: 'carol@company.com' },
  {
    value: 4,
    label: 'Micheal Jackson',
    id: 4,
    name: 'Micheal Jackson',
    email: 'jackson@company.com',
  },
  { value: 5, label: 'Taylor Swift', id: 5, name: 'Taylor Swift', email: 'taylor@company.com' },
  { value: 6, label: 'Lionel Messi', id: 6, name: 'Lionel Messi', email: 'm10@company.com' },
  {
    value: 7,
    label: 'Cristiano Ronaldo',
    id: 7,
    name: 'Cristiano Ronaldo',
    email: 'cr7@company.com',
  },
  { value: 8, label: 'Bùi Lan Hương', id: 8, name: 'Bùi Lan Hương', email: 'blh@company.com' },
  { value: 9, label: 'Yu Ji Min', id: 9, name: 'Yu Ji Min', email: 'karina_aespa@company.com' },
  {
    value: 10,
    label: 'Uzumaki Naruto',
    id: 10,
    name: 'Uzumaki Naruto',
    email: 'naruto@company.com',
  },
  { value: 11, label: 'Uchiha Sasuke', id: 11, name: 'Uchiha Sasuke', email: 'uchiha@company.com' },
])

const actions: string[] = ['View', 'Create', 'Update', 'Delete']

// Computed Properties
const canProceed = computed(() => {
  return currentStep.value === 0 ? role.value.role_name.trim() !== '' : true
})

const currentStep = ref(0)
const isEditMode = ref(false)
const steps = ['Role Details', 'Permissions', 'Assign Users']

// Methods
const nextStep = () => {
  if (canProceed.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const togglePermission = (pageId: number, action: string) => {
  // Update the permissions object
  if (!role.value.permissions[pageId]) {
    role.value.permissions[pageId] = {} as Record<string, boolean>
  }
  role.value.permissions[pageId][action] = !role.value.permissions[pageId][action]

  // Update the pages array
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

    // if (role.value.id) {
    //   await settingsStore.updateRole(roleData)
    // } else {
    //   await settingsStore.createRole(roleData)
    // }

    emit('saved')
  } catch (error) {
    console.error('Failed to save role:', error)
  }
}

const cancel = () => {
  // Reset form
  role.value = {
    id: 0,
    role_name: '',
    description: '',
    created_by: '',
    pages: [] as Page[],
    assigned: { users: [] },
    permissions: {} as Record<number, Record<string, boolean>>
  }
  currentStep.value = 0
  router.push('/settings/roles')
}

// Initialize edit mode if editing an existing role
onMounted(() => {
  const roleId = router.currentRoute.value.params.id
  if (roleId) {
    isEditMode.value = true
    console.log('Editing role:', roleId)
  }
})
</script>
