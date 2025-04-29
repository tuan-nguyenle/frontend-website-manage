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

    <!-- Drawer for Filters (Assuming a separate component, simplified here) -->
    <div v-if="isDrawerOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50">
      <div class="bg-white p-4 w-1/3 h-full">
        <button @click="closeDrawer" class="mb-4 text-red-500">Close</button>
        <!-- Filter logic can be added here -->
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
])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(roles.value.length / itemsPerPage))
const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return roles.value.slice(start, start + itemsPerPage)
})

// Drawer state (simplified)
const isDrawerOpen = ref(false)

const openDrawer = () => {
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

// Role management functions
const addNewRole = () => {
  router.push('/settings/roles/create')
}

const editRole = (role: Role) => {
  router.push(`/settings/roles/edit/${role.id}`)
}

const deleteRole = (role: Role) => {
  const index = roles.value.findIndex((r) => r.id === role.id)
  if (index !== -1) {
    roles.value.splice(index, 1)
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
