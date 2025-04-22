<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

interface Role {
  id: number
  role_name: string
  pages: { page_id: number; page_name: string; permissions: string[] }[]
}

const props = defineProps<{
  roles: Role[]
  selectedRole: Role | null
}>()

const emit = defineEmits<{
  (e: 'select-role', role: Role): void
  (e: 'update-search', query: string): void
  (e: 'add-permission'): void
}>()

const selectedRoleName = ref('')
watch(
  () => props.selectedRole,
  (newRole) => {
    selectedRoleName.value = newRole ? newRole.role_name : ''
  },
  { immediate: true },
)

watch(selectedRoleName, (newVal) => {
  const selected = props.roles.find((role) => role.role_name === newVal)
  if (selected) emit('select-role', selected)
})

const searchQuery = ref('')
watch(searchQuery, (newVal) => emit('update-search', newVal))
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex space-x-2">
      <select
        v-model="selectedRoleName"
        class="appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 my-2 pr-10 w-48 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:focus:ring-brand-800 transition-all duration-200 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
        :disabled="!roles.length"
      >
        <option value="" disabled>No roles available</option>
        <option v-for="role in roles" :key="role.id" :value="role.role_name">
          {{ role.role_name }}
        </option>
      </select>
    </div>
    <div class="flex items-center space-x-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search or type command..."
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 xl:w-[430px]"
      />
      <button
        @click="emit('add-permission')"
        class="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors duration-200"
      >
        Add Permission
      </button>
    </div>
  </div>
</template>
