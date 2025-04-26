<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
      <!-- Close Button -->
      <button
        @click="$emit('cancel')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <span class="text-2xl">&times;</span>
      </button>

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
        <h2 class="text-lg font-semibold mb-4">Role Details</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Role Name</label>
          <input
            v-model="role.name"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Enter role name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="role.description"
            class="w-full border rounded px-3 py-2"
            placeholder="Describe this role"
          ></textarea>
        </div>
      </div>

      <!-- Step 2: Permissions -->
      <div v-if="currentStep === 1">
        <h2 class="text-lg font-semibold mb-4">Assign Permissions</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr>
                <th class="p-2 text-left">Module</th>
                <th v-for="action in actions" :key="action" class="p-2 text-center">
                  {{ action }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="module in modules" :key="module">
                <td class="p-2">{{ module }}</td>
                <td v-for="action in actions" :key="action" class="p-2 text-center">
                  <input type="checkbox" v-model="role.permissions[module]" :value="action" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Step 3: Assign Users -->
      <div v-if="currentStep === 2">
        <h2 class="text-lg font-semibold mb-4">Assign Roles</h2>
        <div class="mb-4 flex border-b">
          <button
            @click="assignTab = 'users'"
            :class="'border-b-2 border-purple-500 text-purple-600'"
            class="px-4 py-2 font-medium"
          >
            Users
          </button>
        </div>
        <div class="mb-3">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Search..."
          />
        </div>
        <div class="max-h-40 overflow-y-auto">
          <div v-for="item in filteredAssignList" :key="item.id" class="flex items-center py-2">
            <img :src="item.avatar" class="w-8 h-8 rounded-full mr-3" v-if="item.avatar" />
            <div class="flex-1">
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-400">{{ item.email }}</div>
            </div>
            <input type="checkbox" v-model="role.assigned.users" :value="item.id" />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between mt-8">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Discard
        </button>
        <div>
          <button
            v-if="currentStep > 0"
            @click="prevStep"
            class="px-4 py-2 rounded bg-gray-200 text-gray-700 mr-2"
          >
            Back
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            @click="nextStep"
            :disabled="!canProceed"
            class="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
          >
            Next
          </button>
          <button
            v-else
            @click="saveRole"
            :disabled="!canProceed"
            class="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  role: {
    type: Object,
    default: () => ({
      id: 0,
      name: '',
      description: '',
      permissions: {},
      assigned: { users: [], teams: [] },
      status: 'Active',
    }),
  },
})
const emit = defineEmits(['save', 'cancel'])

const steps = ['Role Details', 'Permissions', 'Assign Roles']
const currentStep = ref(0)

const role = ref(JSON.parse(JSON.stringify(props.role)))

// Permissions mock
const modules = ['Dashboard', 'Users', 'Settings', 'Reports']
const actions = ['View', 'Edit', 'Delete', 'Create']

// Assign mock data
const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@company.com',
    avatar: '/public/asset/images/user/user-01.png',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@company.com',
    avatar: '/public/asset/images/user/user-02.png',
  },
  {
    id: 3,
    name: 'Carol Lee',
    email: 'carol@company.com',
    avatar: '/public/asset/images/user/user-03.png',
  },
]

const assignTab = ref('users')
const searchQuery = ref('')

const filteredAssignList = computed(() => {
  const list = users
  if (!searchQuery.value) return list
  return list.filter((item) => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return role.value.name.trim().length > 0
  }
  if (currentStep.value === 1) {
    return Object.keys(role.value.permissions).length > 0
  }
  if (currentStep.value === 2) {
    return role.value.assigned.users.length > 0
  }
  return true
})

function nextStep() {
  if (currentStep.value < steps.length - 1) currentStep.value++
}
function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}
function saveRole() {
  emit('save', { ...role.value })
}

// Ensure permissions object structure
watch(
  () => role.value.permissions,
  (val) => {
    for (const module of modules) {
      if (!val[module]) role.value.permissions[module] = []
    }
  },
  { immediate: true, deep: true },
)
// Ensure assigned object structure
watch(
  () => role.value.assigned,
  (val) => {
    if (!val.users) role.value.assigned.users = []
  },
  { immediate: true, deep: true },
)
</script>
