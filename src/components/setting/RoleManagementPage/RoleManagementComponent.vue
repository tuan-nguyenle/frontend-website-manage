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
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Next
      </button>
    </div>

    <!-- Drawer for Filters -->
    <FilterDrawerComponent
      v-if="isDrawerOpen"
      :uniqueRoles="uniqueRoles"
      :selectedRoles="selectedRoles"
      :selectAllRoles="selectAllRoles"
      :selectedStatuses="selectedStatuses"
      :selectAllStatuses="selectAllStatuses"
      @close="closeDrawer"
      @toggle-all-roles="toggleAllRoles"
      @toggle-role="toggleRole"
      @toggle-all-statuses="toggleAllStatuses"
      @toggle-status="toggleStatus"
      @reset="resetFilters"
      @apply="applyFilters"
    />

    <!-- Modal for Add/Edit Role -->
    <CreateRoleComponent
      v-if="showModal"
      :role="currentRole"
      @save="saveRole"
      @cancel="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import FilterDrawerComponent from './components/FilterDrawerComponent.vue'
import CreateRoleComponent from './components/CreateRoleComponent.vue'

// Define Role type
type Role = {
  id: number
  name: string
  createdBy: string
  modifiedBy: string
  numUsers: number
  status: string
  permissions: Record<string, string[]>
  assigned: {
    users: number[]
  }
}

// Mock data for roles
const roles = ref<Role[]>([
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
    name: 'Super Admin',
    createdBy: 'Nnena Igbokwe',
    modifiedBy: 'Gbenga Oladipo',
    numUsers: 14,
    status: 'Inactive',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: { users: [4, 5] },
  },
  {
    id: 4,
    name: 'Admin IT Support',
    createdBy: 'Ogechi Nwosu',
    modifiedBy: 'Ifeyinwa Okoye',
    numUsers: 8,
    status: 'Active',
    permissions: { Dashboard: ['View'], Users: ['View'], Settings: [], Reports: [] },
    assigned: { users: [6] },
  },
  {
    id: 5,
    name: 'Super Admin',
    createdBy: 'Chukwudi Eze',
    modifiedBy: 'Obinna Nwachukwu',
    numUsers: 12,
    status: 'Inactive',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: { users: [7, 8] },
  },
  {
    id: 6,
    name: 'Admin IT Support',
    createdBy: 'Adaobi Obi',
    modifiedBy: 'Chiamaka Okafor',
    numUsers: 10,
    status: 'Active',
    permissions: { Dashboard: ['View'], Users: ['View'], Settings: [], Reports: [] },
    assigned: { users: [9] },
  },
  {
    id: 7,
    name: 'Super Admin',
    createdBy: 'Oluwatoyin Ogundele',
    modifiedBy: 'Chidinma Uche',
    numUsers: 15,
    status: 'Inactive',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: { users: [10, 11] },
  },
  {
    id: 8,
    name: 'Admin IT Support',
    createdBy: 'Gbenga Oladipo',
    modifiedBy: 'Nnena Igbokwe',
    numUsers: 7,
    status: 'Active',
    permissions: { Dashboard: ['View'], Users: ['View'], Settings: [], Reports: [] },
    assigned: { users: [12] },
  },
  {
    id: 9,
    name: 'Super Admin',
    createdBy: 'Ifeyinwa Okoye',
    modifiedBy: 'Ogechi Nwosu',
    numUsers: 13,
    status: 'Inactive',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: { users: [13, 14] },
  },
  {
    id: 10,
    name: 'Admin IT Support',
    createdBy: 'Obinna Nwachukwu',
    modifiedBy: 'Chukwudi Eze',
    numUsers: 6,
    status: 'Active',
    permissions: { Dashboard: ['View'], Users: ['View'], Settings: [], Reports: [] },
    assigned: { users: [15] },
  },
  {
    id: 11,
    name: 'Super Admin',
    createdBy: 'Chiamaka Okafor',
    modifiedBy: 'Adaobi Obi',
    numUsers: 11,
    status: 'Inactive',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: { users: [16, 17] },
  },
  {
    id: 12,
    name: 'Admin IT Support',
    createdBy: 'Chidinma Uche',
    modifiedBy: 'Oluwatoyin Ogundele',
    numUsers: 9,
    status: 'Active',
    permissions: { Dashboard: ['View'], Users: ['View'], Settings: [], Reports: [] },
    assigned: { users: [18] },
  },
  {
    id: 13,
    name: 'Super Admin',
    createdBy: 'Nnena Igbokwe',
    modifiedBy: 'Gbenga Oladipo',
    numUsers: 14,
    status: 'Inactive',
    permissions: { Dashboard: ['View'], Users: ['View', 'Edit'], Settings: ['View'], Reports: [] },
    assigned: { users: [19, 20] },
  },
  {
    id: 14,
    name: 'Admin IT Support',
    createdBy: 'Ogechi Nwosu',
    modifiedBy: 'Ifeyinwa Okoye',
    numUsers: 8,
    status: 'Active',
    permissions: { Dashboard: ['View'], Users: ['View'], Settings: [], Reports: [] },
    assigned: { users: [21] },
  },
])

// Filter state
const isDrawerOpen = ref(false)
const selectedRoles = ref<string[]>([])
const selectedStatuses = ref<string[]>([])
const appliedRoles = ref<string[]>([])
const appliedStatuses = ref<string[]>([])
const selectAllRoles = ref(false)
const selectAllStatuses = ref(false)

// Modal state
const showModal = ref(false)
const currentRole = ref<Role>({
  id: 0,
  name: '',
  createdBy: '',
  modifiedBy: '',
  numUsers: 0,
  status: 'Active',
  permissions: {},
  assigned: { users: [] },
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties
const uniqueRoles = computed(() => [...new Set(roles.value.map((role) => role.name))])
const filteredRoles = computed(() => {
  let filtered = roles.value
  if (appliedRoles.value.length > 0) {
    filtered = filtered.filter((role) => appliedRoles.value.includes(role.name))
  }
  if (appliedStatuses.value.length > 0) {
    filtered = filtered.filter((role) => appliedStatuses.value.includes(role.status))
  }
  return filtered
})
const totalPages = computed(() => Math.ceil(filteredRoles.value.length / itemsPerPage))
const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRoles.value.slice(start, start + itemsPerPage)
})

// Filter functions
const openDrawer = () => {
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const toggleAllRoles = () => {
  if (selectAllRoles.value) {
    selectedRoles.value = [...uniqueRoles.value]
  } else {
    selectedRoles.value = []
  }
}

const toggleAllStatuses = () => {
  if (selectAllStatuses.value) {
    selectedStatuses.value = ['Active', 'Inactive']
  } else {
    selectedStatuses.value = []
  }
}

const toggleRole = (role: string) => {
  const idx = selectedRoles.value.indexOf(role)
  if (idx === -1) {
    selectedRoles.value.push(role)
  } else {
    selectedRoles.value.splice(idx, 1)
  }
}

const toggleStatus = (status: string) => {
  const idx = selectedStatuses.value.indexOf(status)
  if (idx === -1) {
    selectedStatuses.value.push(status)
  } else {
    selectedStatuses.value.splice(idx, 1)
  }
}

const applyFilters = () => {
  appliedRoles.value = [...selectedRoles.value]
  appliedStatuses.value = [...selectedStatuses.value]
  closeDrawer()
  currentPage.value = 1 // Reset to first page after filtering
}

const resetFilters = () => {
  selectedRoles.value = []
  selectedStatuses.value = []
  selectAllRoles.value = false
  selectAllStatuses.value = false
  appliedRoles.value = []
  appliedStatuses.value = []
  closeDrawer()
  currentPage.value = 1 // Reset to first page after resetting
}

// Role management functions
const addNewRole = () => {
  currentRole.value = {
    id: 0,
    name: '',
    createdBy: '',
    modifiedBy: '',
    numUsers: 0,
    status: 'Active',
    permissions: {},
    assigned: { users: [] },
  }
  showModal.value = true
}

const editRole = (role: Role) => {
  currentRole.value = { ...role }
  showModal.value = true
}

const deleteRole = (role: Role) => {
  const index = roles.value.findIndex((r) => r.id === role.id)
  if (index !== -1) {
    roles.value.splice(index, 1)
  }
}

const saveRole = (role: Role) => {
  if (role.id && roles.value.some((r) => r.id === role.id)) {
    const index = roles.value.findIndex((r) => r.id === role.id)
    if (index !== -1) {
      roles.value[index] = { ...role }
    }
  } else {
    const newId = roles.value.length > 0 ? Math.max(...roles.value.map((r) => r.id)) + 1 : 1
    roles.value.push({ ...role, id: newId })
  }
  showModal.value = false
}

// Pagination functions
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Watchers to update selectAll checkboxes
watch(selectedRoles, (newVal) => {
  selectAllRoles.value = newVal.length === uniqueRoles.value.length
})

watch(selectedStatuses, (newVal) => {
  selectAllStatuses.value = newVal.length === 2 // Since there are only 2 statuses
})
</script>
