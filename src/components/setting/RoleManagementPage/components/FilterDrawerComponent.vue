<template>
  <div class="fixed inset-0 bg-opacity-50 flex justify-end z-50" @click="$emit('close')">
    <div class="bg-white w-80 p-6 shadow-lg" @click.stop>
      <h3 class="font-bold mb-4">Filter</h3>
      <!-- Roles Filter -->
      <div class="mb-4">
        <h4 class="font-semibold mb-2">Roles</h4>
        <div class="flex items-center mb-2">
          <input
            type="checkbox"
            :checked="selectAllRoles"
            @change="$emit('toggle-all-roles')"
            class="mr-2"
          />
          <label>Select All</label>
        </div>
        <div v-for="role in uniqueRoles" :key="role as string" class="flex items-center mb-2">
          <input
            type="checkbox"
            :checked="selectedRoles.includes(role as string)"
            @change="$emit('toggle-role', role)"
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
            @change="$emit('toggle-all-statuses')"
            class="mr-2"
          />
          <label>Select All</label>
        </div>
        <div class="flex items-center mb-2">
          <input
            type="checkbox"
            :checked="selectedStatuses.includes('Active')"
            @change="$emit('toggle-status', 'Active')"
            class="mr-2"
          />
          <label>Active</label>
        </div>
        <div class="flex items-center mb-2">
          <input
            type="checkbox"
            :checked="selectedStatuses.includes('Inactive')"
            @change="$emit('toggle-status', 'Inactive')"
            class="mr-2"
          />
          <label>Inactive</label>
        </div>
      </div>
      <!-- Apply and Reset Buttons -->
      <div class="flex justify-between">
        <button @click="$emit('reset')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Reset
        </button>
        <button
          @click="$emit('apply')"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps({
  uniqueRoles: {
    type: Array as () => string[],
    default: () => [],
  },
  selectedRoles: {
    type: Array as () => string[],
    default: () => [],
  },
  selectAllRoles: {
    type: Boolean,
    default: false,
  },
  selectedStatuses: {
    type: Array as () => string[],
    default: () => [],
  },
  selectAllStatuses: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'close',
  'toggle-all-roles',
  'toggle-role',
  'toggle-all-statuses',
  'toggle-status',
  'reset',
  'apply',
])
</script>
