<template>
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
  >
    <!-- Filters and Add Button -->
    <div class="flex justify-between mb-4">
      <button @click="openDrawer" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
        Filters
      </button>
      <button
        @click="addNewRole"
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Add New Role
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-3 text-left">Role Name</th>
            <th class="p-3 text-left">Created By</th>
            <th class="p-3 text-left">Modified By</th>
            <th class="p-3 text-left">Number of Users</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in paginatedRoles" :key="role.id" class="border-b">
            <td class="p-3">{{ role.name }}</td>
            <td class="p-3">{{ role.createdBy }}</td>
            <td class="p-3">{{ role.modifiedBy }}</td>
            <td class="p-3">{{ role.numUsers }}</td>
            <td class="p-3">
              <span :class="role.status === 'Active' ? 'text-green-500' : 'text-gray-500'">{{
                role.status
              }}</span>
            </td>
            <td class="p-3">
              <button @click="editRole(role)" class="text-blue-500 mr-2">Edit</button>
              <button @click="deleteRole(role)" class="text-red-500">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Previous
      </button>
      <span class="text-gray-800 dark:text-white/90"
        >Page {{ currentPage }} of {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Next
      </button>
    </div>

    <!-- Drawer for Filters -->
    <div
      v-if="isDrawerOpen"
      class="fixed inset-0 bg-opacity-50 flex justify-end z-50"
      @click="closeDrawer"
    >
      <div class="bg-white w-80 h-full p-6 shadow-lg" @click.stop>
        <h3 class="font-bold mb-4">Filter</h3>
        <!-- Roles Filter -->
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Roles</h4>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="selectAllRoles"
              @change="toggleAllRoles"
              class="mr-2"
            />
            <label>Select All</label>
          </div>
          <div v-for="role in uniqueRoles" :key="role as string" class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="selectedRoles.includes(role)"
              @change="toggleRole(role)"
              class="mr-2"
            />
            <label>{{ role }}</label>
          </div>
        </div>
        <!-- Status Filter -->
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Status</h4>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="selectAllStatuses"
              @change="toggleAllStatuses"
              class="mr-2"
            />
            <label>Select All</label>
          </div>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="selectedStatuses.includes('Active')"
              @change="toggleStatus('Active')"
              class="mr-2"
            />
            <label>Active</label>
          </div>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="selectedStatuses.includes('Inactive')"
              @change="toggleStatus('Inactive')"
              class="mr-2"
            />
            <label>Inactive</label>
          </div>
        </div>
        <!-- Apply and Reset Buttons -->
        <div class="flex justify-between mt-4">
          <button @click="resetFilters" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Reset
          </button>
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Define Role type
type Role = {
  id: number
  name: string
  createdBy: string
  modifiedBy: string
  numUsers: number
  status: string
  permissions: Record<string, string[]>
  assigned: { users: number[] }
}

const router = useRouter()

// Mock data for roles
const originalRoles = ref<Role[]>([
  {
    id: 1,
    name: 'Super Admin',
    createdBy: 'Chiamaka Okafor',
    modifiedBy: 'Oluwatoyin Ogundele',
    numUsers: 11,
    status: 'Active',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: { users: [1, 2] },
  },
  {
    id: 2,
    name: 'Admin IT Support',
    createdBy: 'Chidinma Uche',
    modifiedBy: 'Chidinma Eze',
    numUsers: 9,
    status: 'Active',
    permissions: { Dashboard: ['View'], Users: ['View'], Settings: [], Reports: [] },
    assigned: { users: [3] },
  },
  {
    id: 3,
    name: 'Admin IT Support',
    createdBy: 'John Doe',
    modifiedBy: 'Jane Smith',
    numUsers: 15,
    status: 'Inactive',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: { users: [] },
  },
])

// Filter state
const isDrawerOpen = ref(false)
const selectedRoles = ref<string[]>([])
const selectedStatuses = ref<string[]>([])
const selectAllRoles = ref(false)
const selectAllStatuses = ref(false)

// Computed unique roles and statuses
const uniqueRoles = computed(() => [...new Set(originalRoles.value.map((role) => role.name))])

// Computed filtered roles
const filteredRoles = computed(() => {
  return originalRoles.value.filter((role) => {
    const matchesRole = selectedRoles.value.length === 0 || selectedRoles.value.includes(role.name)
    const matchesStatus =
      selectedStatuses.value.length === 0 || selectedStatuses.value.includes(role.status)
    return matchesRole && matchesStatus
  })
})

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

// Computed paginated roles
const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRoles.value.slice(start, start + itemsPerPage)
})

// Computed total pages
const totalPages = computed(() => Math.ceil(filteredRoles.value.length / itemsPerPage))

// Filter methods
const openDrawer = () => {
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const toggleAllRoles = () => {
  selectAllRoles.value = !selectAllRoles.value
  if (selectAllRoles.value) {
    selectedRoles.value = uniqueRoles.value
  } else {
    selectedRoles.value = []
  }
}

const toggleRole = (role: string) => {
  const index = selectedRoles.value.indexOf(role)
  if (index > -1) {
    selectedRoles.value.splice(index, 1)
  } else {
    selectedRoles.value.push(role)
  }
}

const toggleAllStatuses = () => {
  selectAllStatuses.value = !selectAllStatuses.value
  if (selectAllStatuses.value) {
    selectedStatuses.value = ['Active', 'Inactive']
  } else {
    selectedStatuses.value = []
  }
}

const toggleStatus = (status: string) => {
  const index = selectedStatuses.value.indexOf(status)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  } else {
    selectedStatuses.value.push(status)
  }
}

const resetFilters = () => {
  selectedRoles.value = []
  selectedStatuses.value = []
  selectAllRoles.value = false
  selectAllStatuses.value = false
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

// Role management functions
const addNewRole = () => {
  router.push('/settings/roles/create')
}

const editRole = (role: Role) => {
  router.push(`/settings/roles/edit/${role.id}`)
}

const deleteRole = (role: Role) => {
  const index = originalRoles.value.findIndex((r) => r.id === role.id)
  if (index !== -1) {
    originalRoles.value.splice(index, 1)
  }
}

// Pagination functions
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>
