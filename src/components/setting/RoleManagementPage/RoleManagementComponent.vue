<template>
  <div
    class="min-h-screen dark:border-gray-800 dark:bg-white/[0.03] rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12"
  >
    <!-- Filters and Add Button -->
    <div class="flex justify-between mb-4">
      <button
        @click="openDrawer"
        class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
      >
        Filters
      </button>
      <div class="flex gap-2">
        <button
          @click="refreshRoles"
          class="group inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
        >
          <div
            class="transform relative inline-flex items-center justify-center w-4 h-4 transition-all duration-200 ease-in-out group-hover:rotate-180 group-hover:scale-110"
          >
            <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <span>Refresh</span>
        </button>
        <button
          @click="addNewRole"
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
        >
          Add New Role
        </button>
      </div>
    </div>

    <!-- Filter Drawer -->
    <FilterDrawerComponent
      v-model:isOpen="isDrawerOpen"
      :unique-roles="uniqueRoles"
      :selected-roles="selectedRoles"
      :select-all-roles="selectAllRoles"
      :selected-statuses="selectedStatuses"
      :select-all-statuses="selectAllStatuses"
      @toggle-all-roles="toggleAllRoles"
      @toggle-role="toggleRole"
      @toggle-all-statuses="toggleAllStatuses"
      @toggle-status="toggleStatus"
      @reset="resetFilters"
      @apply-search="applySearchValues"
      @close="closeDrawer"
    />

    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Table -->
    <div
      v-else
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <table class="w-full table-fixed">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="p-4 text-left text-base font-medium text-gray-900 dark:text-white">
              Role Name
            </th>
            <th
              class="p-4 text-left text-base font-medium text-gray-900 dark:text-white w-[30%] min-w-[300px]"
            >
              Description
            </th>
            <th class="p-4 text-left text-base font-medium text-gray-900 dark:text-white">
              Created By
            </th>
            <th class="p-4 text-left text-base font-medium text-gray-900 dark:text-white">
              Number of Users
            </th>
            <th class="p-4 text-left text-base font-medium text-gray-900 dark:text-white">
              Status
            </th>
            <th class="p-4 text-left text-base font-medium text-gray-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="role in paginatedRoles"
            :key="role.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td class="p-4 text-md text-gray-900 dark:text-white">
              {{ role.role_name }}
            </td>
            <td class="p-4 text-md text-gray-900 dark:text-white w-[30%] min-w-[300px]">
              {{ role.description }}
            </td>
            <td class="p-4 text-md text-gray-900 dark:text-white">
              {{ role.created_by }}
            </td>
            <td class="p-4 text-md text-gray-900 dark:text-white">
              {{ role.number_of_user }}
            </td>
            <td class="p-4">
              <span
                :class="
                  role.status === '1'
                    ? 'bg-green-100 text-green-800 dark:bg-green-600/20 dark:text-lime-400'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-600/20 dark:text-white/90'
                "
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
              >
                {{ role.status === '1' ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="p-4 text-lg text-gray-900 dark:text-white whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <button
                  @click="editRole(role)"
                  class="inline-flex items-center px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </button>
              </div>
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
        class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
      >
        Previous
      </button>
      <span class="text-gray-800 dark:text-white/90"
        >Page {{ currentPage }} of {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FilterDrawerComponent from './components/FilterDrawerComponent.vue'
import { useSettingsStore } from '@/store'
import type { Role } from '@/types'

const router = useRouter()
const settingsStore = useSettingsStore()

const isLoading = ref(true)

const refreshRoles = async () => {
  isLoading.value = true
  try {
    await settingsStore.fetchRoles()
    resetFilters()
    currentPage.value = 1
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    await settingsStore.fetchRoles()
  } finally {
    isLoading.value = false
  }
})

const isDrawerOpen = ref(false)
const selectedRoles = ref<string[]>([])
const selectedStatuses = ref<string[]>([])
const selectAllRoles = ref(false)
const selectAllStatuses = ref(false)
const searchDescription = ref('')
const searchCreatedBy = ref('')
const minUsers = ref<number | null>(null)
const maxUsers = ref<number | null>(null)

const uniqueRoles = computed(() => [...new Set(settingsStore.roles.map((role) => role.role_name))])

const filteredRoles = computed(() => {
  return settingsStore.roles.filter((role) => {
    const matchesRole =
      selectedRoles.value.length === 0 || selectedRoles.value.includes(role.role_name)
    const matchesStatus =
      selectedStatuses.value.length === 0 || selectedStatuses.value.includes(role.status)
    const matchesDescription =
      !searchDescription.value ||
      role.description.toLowerCase().includes(searchDescription.value.toLowerCase())
    const matchesCreatedBy =
      !searchCreatedBy.value ||
      role.created_by.toLowerCase().includes(searchCreatedBy.value.toLowerCase())
    const matchesUsers =
      (!minUsers.value || role.number_of_user >= minUsers.value) &&
      (!maxUsers.value || role.number_of_user <= maxUsers.value)
    return matchesRole && matchesStatus && matchesDescription && matchesCreatedBy && matchesUsers
  })
})

const currentPage = ref(1)
const itemsPerPage = 10

const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRoles.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredRoles.value.length / itemsPerPage))

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
    selectedStatuses.value = ['0', '1']
  } else {
    selectedStatuses.value = []
  }
}

const toggleStatus = (status: string) => {
  const index = selectedStatuses.value.indexOf(status)
  if (index === -1) {
    selectedStatuses.value.push(status)
  } else {
    selectedStatuses.value.splice(index, 1)
  }
}

const resetFilters = () => {
  selectedRoles.value = []
  selectedStatuses.value = []
  selectAllRoles.value = false
  selectAllStatuses.value = false
  searchDescription.value = ''
  searchCreatedBy.value = ''
  minUsers.value = null
  maxUsers.value = null
  currentPage.value = 1
}

const applySearchValues = (values: {
  description: string
  createdBy: string
  minUsers: number | null
  maxUsers: number | null
}) => {
  searchDescription.value = values.description
  searchCreatedBy.value = values.createdBy
  minUsers.value = values.minUsers
  maxUsers.value = values.maxUsers
  currentPage.value = 1
}

const addNewRole = () => {
  router.push('/settings/roles/create')
}

const editRole = (role: Role) => {
  router.push(`/settings/roles/edit/${role.id}`)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>
