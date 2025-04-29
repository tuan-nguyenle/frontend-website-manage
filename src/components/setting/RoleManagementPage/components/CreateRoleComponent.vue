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
      <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
        Assign Permissions
      </h2>
      <div class="overflow-hidden rounded-xl border dark:border-gray-700 dark:bg-gray-900">
        <table class="w-full table-fixed">
          <thead class="border dark:border-gray-700 dark:bg-gray-800">
            <tr class="border-b border-gray-300 dark:border-gray-700">
              <th class="w-3/5 p-4 text-left dark:text-white/90">{{ $t('Permissions') }}</th>
              <th
                v-for="action in actions"
                :key="action"
                class="w-12 p-4 text-center dark:text-white/90"
              >
                {{ $t(action) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in flattenedPermissions"
              :key="entry.node.id"
              class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
              @click="toggleExpand(entry.node.id)"
            >
              <td class="p-2 break-words">
                <div class="flex items-center" :style="{ 'padding-left': entry.depth * 20 + 'px' }">
                  <button v-if="entry.node.children.length > 0" class="mr-2 focus:outline-none">
                    <svg
                      class="w-4 h-4 dark:text-white/90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      :class="{ 'rotate-90': expanded[entry.node.id] }"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <span class="text-gray-900 dark:text-white/90">{{ entry.node.name }}</span>
                </div>
              </td>
              <td v-for="action in actions" :key="action" class="p-2 text-center">
                <input
                  v-if="entry.node.children.length === 0"
                  type="checkbox"
                  :checked="role.permissions[entry.node.id]?.[action] || false"
                  @change="togglePermission(entry.node.id, action)"
                  class="w-4 h-4 text-indigo-500 border-gray-500 rounded focus:ring-indigo-400 cursor-pointer"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Step 3: Assign Users -->
    <div v-if="currentStep === 2">
      <h2 class="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Assign Users</h2>
      <div class="flex flex-col gap-4">
        <template v-if="users.length > 0">
          <MultipleSelectComponent
            :model-value="role.assigned.users"
            @update:model-value="(value) => (role.assigned.users = value)"
            :options="users.map((user) => ({ value: user.value, label: `${user.label}` }))"
            :multiple="true"
            :searchable="true"
            :close-on-select="false"
            :clear-on-select="false"
            placeholder="Search by name or email..."
            class="w-full"
          />
        </template>
        <p v-else class="mt-4">Loading users...</p>
      </div>
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
import { useRouter } from 'vue-router'

// Initialize router
const router = useRouter()

// Type Definitions
interface Role {
  id: number
  name: string
  description: string
  permissions: Record<number, Record<string, boolean>>
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

// Initialize role with proper types
const role = ref<Role>({
  id: 0,
  name: '',
  description: '',
  permissions: {},
  assigned: { users: [] },
  status: 'active',
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

const actions = ['view', 'create', 'update', 'delete'] as const

interface PermissionNode {
  id: number
  name: string
  children: PermissionNode[]
}

const permissionTree = ref<PermissionNode[]>([
  {
    id: 1,
    name: 'Users',
    children: [
      { id: 2, name: 'View Users', children: [] },
      { id: 3, name: 'Create User', children: [] },
      { id: 4, name: 'Update User', children: [] },
      { id: 5, name: 'Delete User', children: [] },
    ],
  },
  {
    id: 6,
    name: 'Roles',
    children: [
      { id: 7, name: 'View Roles', children: [] },
      { id: 8, name: 'Create Role', children: [] },
      { id: 9, name: 'Update Role', children: [] },
      { id: 10, name: 'Delete Role', children: [] },
    ],
  },
])

const expanded = ref<Record<number, boolean>>({})

const setExpanded = (nodes: PermissionNode[]) => {
  nodes.forEach((node) => {
    if (node.children.length > 0) {
      expanded.value[node.id] = true
      setExpanded(node.children)
    }
  })
}

setExpanded(permissionTree.value)

const toggleExpand = (pageId: number) => {
  expanded.value[pageId] = !expanded.value[pageId]
}

const flattenedPermissions = computed(() => {
  const result: { node: PermissionNode; depth: number }[] = []
  function flatten(nodes: PermissionNode[], depth: number = 0) {
    nodes.forEach((node) => {
      result.push({ node, depth })
      if (node.children.length > 0 && expanded.value[node.id]) {
        flatten(node.children, depth + 1)
      }
    })
  }
  flatten(permissionTree.value)
  return result
})

const togglePermission = (pageId: number, action: string) => {
  if (!role.value.permissions[pageId]) {
    role.value.permissions[pageId] = {}
  }
  role.value.permissions[pageId][action] = !role.value.permissions[pageId][action]
}

// Computed Properties
const canProceed = computed(() => {
  return currentStep.value === 0 ? role.value.name.trim() !== '' : true
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

const saveRole = async () => {
  try {
    // Add your save logic here
    console.log('Saving role:', role.value)
    // Reset to first step
    currentStep.value = 0
  } catch (error) {
    console.error('Error saving role:', error)
  }
}

const cancel = () => {
  // Reset form
  role.value = {
    id: 0,
    name: '',
    description: '',
    permissions: {},
    assigned: { users: [] },
    status: 'active',
  }
  currentStep.value = 0
  router.push('/settings/roles')
}

onMounted(() => {
  const roleId = router.currentRoute.value.params.id
  if (roleId) {
    isEditMode.value = true
    console.log('Editing role:', roleId)
  }
})
</script>
