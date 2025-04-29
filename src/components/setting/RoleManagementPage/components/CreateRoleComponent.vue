<template>
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
  >
    <!-- Title -->
    <h1 class="text-2xl mb-4 font-semibold text-gray-800 dark:text-white/90">
      {{ isEditMode ? 'Edit Role' : 'Create New Role' }}
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
          {{ step }}
        </div>
        <div v-if="idx < steps.length - 1" class="flex-1 h-0.5 bg-gray-200 mx-2"></div>
      </div>
    </div>

    <!-- Step 1: Role Details -->
    <div v-if="currentStep === 0">
      <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Role Details</h2>
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >Role Name</label
        >
        <input
          v-model="role.name"
          type="text"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          placeholder="Enter role name"
        />
      </div>
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
          >Description</label
        >
        <textarea
          v-model="role.description"
          class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          rows="6"
          placeholder="Describe this role"
        ></textarea>
      </div>
    </div>

    <!-- Step 2: Permissions -->
    <div v-if="currentStep === 1">
      <h2 class="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Assign Permissions</h2>
      <table class="min-w-full text-sm">
        <thead>
          <tr>
            <th class="p-2 text-left text-gray-700 dark:text-white">Module</th>
            <th
              v-for="action in actions"
              :key="action"
              class="p-2 text-center text-gray-700 dark:text-white"
            >
              {{ action }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="module in modules" :key="module">
            <td class="p-2 text-gray-700 dark:text-white">{{ module }}</td>
            <td v-for="action in actions" :key="action" class="p-2 text-center">
              <input type="checkbox" v-model="role.permissions[module]" :value="action" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Step 3: Assign Users -->
    <div v-if="currentStep === 2">
      <h2 class="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Assign Users</h2>
      <MultipleSelectComponent
        v-if="users.length > 0"
        :model-value="role.assigned.users"
        @update:model-value="(value) => role.assigned.users = value"
        :options="users.map(user => ({ value: user.value, label: `${user.label} (${user.email})` }))"
        :multiple="true"
        :searchable="true"
        :close-on-select="false"
        :clear-on-select="false"
        placeholder="Search by name or email..."
        class="w-full"
      />
      <p v-else>Loading users...</p>
    </div>

    <!-- Footer -->
    <div class="flex justify-between mt-8">
      <button
        @click="cancel"
        class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
      >
        Discard
      </button>
      <div>
        <button
          v-if="currentStep > 0"
          @click="prevStep"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm shadow-theme-xs bg-gray-200 text-gray-700 mr-2 hover:bg-gray-400"
        >
          Back
        </button>
        <button
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          :disabled="!canProceed"
          class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm text-white shadow-theme-xs bg-purple-500 hover:bg-purple-600"
        >
          Next
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
import MultipleSelectComponent from '@/components/forms/FormElements/MultipleSelectComponent.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Type Definitions
type Role = {
  id: number
  name: string
  description: string
  permissions: Record<string, string[]>
  assigned: { users: Item[] }
  status: string
}

interface Item {
  value: number
  label: string
  id: number
  name: string
  email: string
}

// Mock Data
const users = ref<Item[]>([
  { value: 1, label: 'Alice Johnson', id: 1, name: 'Alice Johnson', email: 'alice@company.com' },
  { value: 2, label: 'Bob Smith', id: 2, name: 'Bob Smith', email: 'bob@company.com' },
  { value: 3, label: 'Carol Lee', id: 3, name: 'Carol Lee', email: 'carol@company.com' },
  { value: 4, label: 'Micheal Jackson', id: 4, name: 'Micheal Jackson', email: 'jackson@company.com' },
  { value: 5, label: 'Taylor Swift', id: 5, name: 'Taylor Swift', email: 'taylor@company.com' },
  { value: 6, label: 'Lionel Messi', id: 6, name: 'Lionel Messi', email: 'm10@company.com' },
  { value: 7, label: 'Cristiano Ronaldo', id: 7, name: 'Cristiano Ronaldo', email: 'cr7@company.com' },
  { value: 8, label: 'Bùi Lan Hương', id: 8, name: 'Bùi Lan Hương', email: 'blh@company.com' },
  { value: 9, label: 'Yu Ji Min', id: 9, name: 'Yu Ji Min', email: 'karina_aespa@company.com' },
  { value: 10, label: 'Uzumaki Naruto', id: 10, name: 'Uzumaki Naruto', email: 'naruto@company.com' },
  { value: 11, label: 'Uchiha Sasuke', id: 11, name: 'Uchiha Sasuke', email: 'uchiha@company.com' },
  { value: 12, label: 'Zinedine Zidane', id: 12, name: 'Zinedine Zidane', email: 'zizou@company.com' },
])

const roles = ref<Role[]>([
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full access role',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: {
      users: [
        { value: 1, label: 'Alice Johnson', id: 1, name: 'Alice Johnson', email: 'alice@company.com' },
        { value: 2, label: 'Bob Smith', id: 2, name: 'Bob Smith', email: 'bob@company.com' }
      ]
    },
    status: 'Active',
  },
])

const role = ref<Role>({
  id: 0,
  name: '',
  description: '',
  permissions: {},
  assigned: { users: [] },
  status: 'Active'
})

// Constants and Reactive Variables
const route = useRoute()
const router = useRouter()

const steps = ['Role Details', 'Permissions', 'Assign Users']
const currentStep = ref(0)
const isEditMode = ref(false)

const modules = ['Dashboard', 'Users', 'Settings', 'Reports']
const actions = ['View', 'Edit', 'Create', 'Delete']

// Initialize permissions object with empty arrays
modules.forEach((module) => {
  if (!role.value.permissions[module]) {
    role.value.permissions[module] = []
  }
})

// Computed Properties
const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return role.value.name.trim() !== ''
  }
  if (currentStep.value === 1) {
    return Object.values(role.value.permissions).some((permissions) => permissions.length > 0)
  }
  return true // Always allow proceeding in step 3
})

// Methods
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const saveRole = () => {
  if (isEditMode.value) {
    // Update existing role
    const index = roles.value.findIndex((r) => r.id === role.value.id)
    if (index !== -1) {
      roles.value[index] = { ...role.value }
    }
  } else {
    // Create new role
    const newRole = { ...role.value, id: roles.value.length + 1 }
    roles.value.push(newRole)
  }
  router.push('/settings/roles')
}

const cancel = () => {
  router.push('/settings/roles')
}

// Initialize edit mode if editing an existing role
onMounted(() => {
  const roleId = route.params.id
  if (roleId) {
    isEditMode.value = true
    const roleToEdit = roles.value.find((r) => r.id === parseInt(roleId as string))
    if (roleToEdit) {
      role.value = { ...roleToEdit }
    }
  }
})
</script>
