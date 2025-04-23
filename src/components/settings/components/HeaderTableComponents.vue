<script lang="ts" setup>
import { ref, watch } from 'vue'

interface Role {
  id: number
  role_name: string
  pages: { page_id: number; page_name: string; permissions: string[] }[]
}

const props = defineProps<{
  roles: Role[]
  selectedRole: Role | null
}>()

const emit = defineEmits([
  'select-role',
  'update-search',
  // 'add-permission',
  'save-permissions',
])

const selectedRoleName = ref('')
// const searchQuery = ref('')

watch(
  () => props.selectedRole,
  (newRole) => {
    if (newRole) {
      selectedRoleName.value = newRole.role_name
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex space-x-2">
      <select
        v-model="selectedRoleName"
        class="appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 my-2 pr-10 w-48 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:focus:ring-brand-800 transition-all duration-200 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
        :disabled="!roles.length"
        @change="
          emit(
            'select-role',
            roles.find((r) => r.role_name === selectedRoleName),
          )
        "
      >
        <option v-if="roles.length === 0" disabled>No roles available</option>
        <option v-for="role in roles" :key="role.id" :value="role.role_name">
          {{ role.role_name }}
        </option>
      </select>
    </div>
    <div class="flex items-center space-x-2">
      <button
        @click="emit('save-permissions')"
        class="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-colors duration-200"
      >
        Save
      </button>
    </div>
  </div>
</template>
