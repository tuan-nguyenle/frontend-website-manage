<template>
  <!-- Backdrop with fade transition -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 dark:bg-black/75"
    @click="emit('close')"
    role="dialog"
  ></div>

  <!-- Drawer with slide transition -->
  <transition
    enter-active-class="transform transition duration-300 ease-in-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transform transition duration-300 ease-in-out"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-lg z-50"
      @click.stop
    >
      <div class="p-4">
        <h3 class="font-bold mb-4 text-gray-900 dark:text-gray-200">Filters</h3>
        <!-- Role Name Filter -->
        <div class="mb-4">
          <h4 class="font-semibold mb-2 text-gray-900 dark:text-gray-300">Role Name</h4>
          <MultipleSelectComponent
            :model-value="mutableSelectedRoles"
            @update:model-value="updateSelectedRoles"
            :options="mutableUniqueRoles"
            :multiple="true"
            :searchable="true"
            placeholder="Search by role name..."
            class="w-full"
          />
        </div>
        <!-- Description Filter -->
        <div class="mb-4">
          <h4 class="font-semibold mb-2 text-gray-900 dark:text-gray-100">Description</h4>
          <input
            type="text"
            v-model="searchDescription"
            placeholder="Search description..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900/20 dark:text-gray-300"
          />
        </div>
        <!-- Created By Filter -->
        <div class="mb-4">
          <h4 class="font-semibold mb-2 text-gray-900 dark:text-gray-100">Created By</h4>
          <input
            type="text"
            v-model="searchCreatedBy"
            placeholder="Search created by..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900/20 dark:text-gray-300"
          />
        </div>
        <!-- Number of Users Filter -->
        <div class="mb-4">
          <h4 class="font-semibold mb-2 text-gray-900 dark:text-gray-100">Number of Users</h4>
          <div class="flex space-x-2">
            <input
              type="number"
              v-model="minUsers"
              placeholder="Min"
              class="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900/20 dark:text-gray-200"
            />
            <input
              type="number"
              v-model="maxUsers"
              placeholder="Max"
              class="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900/20 dark:text-gray-200"
            />
          </div>
        </div>
        <!-- Status Filter -->
        <div class="mb-4">
          <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Status</h4>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="props.selectAllStatuses"
              @change="emit('toggle-all-statuses')"
              class="mr-2"
              id="select-all-statuses"
            />
            <label for="select-all-statuses" class="dark:text-gray-300">Select All</label>
          </div>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="props.selectedStatuses.includes('1')"
              @change="emit('toggle-status', '1')"
              class="mr-2"
              id="status-active"
            />
            <label
              for="status-active"
              class="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-sm font-medium dark:bg-green-600/20 dark:text-lime-400"
              >Active</label
            >
          </div>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              :checked="props.selectedStatuses.includes('0')"
              @change="emit('toggle-status', '0')"
              class="mr-2"
              id="status-inactive"
            />
            <label
              for="status-inactive"
              class="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-sm font-medium dark:bg-gray-600/20 dark:text-white/90"
              >Inactive</label
            >
          </div>
        </div>
        <!-- Apply and Reset Buttons -->
        <div class="flex justify-between">
          <button
            @click="emit('reset')"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Reset
          </button>
          <button
            @click="emitSearchValues"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:text-gray-200 dark:hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import MultipleSelectComponent from '@/components/forms/FormElements/MultipleSelectComponent.vue'

interface Props {
  isOpen: boolean
  uniqueRoles: readonly { label: string; value: string }[]
  selectedRoles: readonly { label: string; value: string }[]
  selectedStatuses: readonly string[]
  selectAllStatuses: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-selected-roles', roles: { label: string; value: string }[]): void
  (e: 'toggle-all-statuses'): void
  (e: 'toggle-status', status: string): void
  (e: 'reset'): void
  (
    e: 'apply-search',
    searchValues: {
      description: string
      createdBy: string
      minUsers: number | null
      maxUsers: number | null
    },
  ): void
}>()

// Convert readonly arrays to mutable arrays before passing to MultipleSelectComponent
const mutableUniqueRoles = computed(() =>
  props.uniqueRoles.map((role) => ({ ...role, id: role.value })),
)

// Transform selectedRoles to include id based on value
const mutableSelectedRoles = computed(() =>
  props.selectedRoles.map((role) => ({ ...role, id: role.value })),
)
// Search filters
const searchDescription = ref('')
const searchCreatedBy = ref('')
const minUsers = ref<number | null>(null)
const maxUsers = ref<number | null>(null)

const updateSelectedRoles = (roles: { label: string; value: string; id: string }[]) => {
  // Map back to original format without id for parent component
  const originalRoles = roles.map(({ label, value }) => ({ label, value }))
  emit('update-selected-roles', originalRoles)
}

// Reset search inputs when drawer opens
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      searchDescription.value = ''
      searchCreatedBy.value = ''
      minUsers.value = null
      maxUsers.value = null
    }
  },
)

// Emit search values when applied
const emitSearchValues = () => {
  emit('apply-search', {
    description: searchDescription.value,
    createdBy: searchCreatedBy.value,
    minUsers: minUsers.value,
    maxUsers: maxUsers.value,
  })
}
</script>
