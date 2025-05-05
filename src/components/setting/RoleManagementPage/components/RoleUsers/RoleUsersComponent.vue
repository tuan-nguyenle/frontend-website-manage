<template>
  <div>
    <h2 class="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Assign Users</h2>
    <div class="flex flex-col gap-4">
      <MultipleSelectComponent
        :model-value="selectedUsers"
        @update:model-value="updateSelectedUsers"
        :options="filteredUsers"
        :multiple="true"
        :searchable="true"
        @search="handleSearch"
        :close-on-select="false"
        :clear-on-select="false"
        placeholder="Search by name or email..."
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MultipleSelectComponent from '@/components/forms/FormElements/MultipleSelectComponent.vue'
import { defineProps, defineEmits, ref } from 'vue'
import { apiService } from '@/services/api.services'

interface SelectOption {
  value: number
  label: string
  id: number
  name: string
  email: string
}

interface Props {
  role: {
    assigned: { users: SelectOption[] }
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:role', updatedRole: { assigned: { users: SelectOption[] } }): void
}>()

const filteredUsers = ref<SelectOption[]>([])
const selectedUsers = ref<SelectOption[]>(props.role.assigned.users)

const handleSearch = async (search: string) => {
  try {
    const url = search
      ? `/user/get-all-user?search=${encodeURIComponent(search)}`
      : '/user/get-all-user'
    const response = await apiService.get<SelectOption[]>(url)
    // Map API response to SelectOption and limit to 5
    filteredUsers.value = response.data.slice(0, 5).map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
      id: user.id,
      name: user.name,
      email: user.email,
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    filteredUsers.value = []
  }
}

const updateSelectedUsers = (value: SelectOption[]) => {
  selectedUsers.value = value
  emit('update:role', { assigned: { users: value } })
}
</script>
