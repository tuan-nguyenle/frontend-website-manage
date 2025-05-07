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
        placeholder="Search by name or email..."
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MultipleSelectComponent from '@/components/forms/FormElements/MultipleSelectComponent.vue'
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue'

interface SelectOption {
  label: string
  id: number
  name: string
  email: string
}

interface Props {
  role: {
    assigned: { users: SelectOption[] }
  }
  availableUsers: SelectOption[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:role', updatedRole: { assigned: { users: SelectOption[] } }): void
}>()

const filteredUsers = ref<SelectOption[]>([])
const selectedUsers = ref<SelectOption[]>(props.role.assigned.users)
const searchQuery = ref<string>('')

// Removed availableOptions computed property since we want to show all users
const handleSearch = (search: string) => {
  searchQuery.value = search
  if (!search.trim()) {
    filteredUsers.value = props.availableUsers // Show all users when search is empty
  } else {
    const lowerSearch = search.toLowerCase()
    filteredUsers.value = props.availableUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch),
    )
  }
}

const updateSelectedUsers = (value: SelectOption[]) => {
  selectedUsers.value = value
  emit('update:role', { assigned: { users: value } })
  handleSearch(searchQuery.value) // Refresh filteredUsers to reflect current search
}

onMounted(() => {
  handleSearch('') // Initialize with all users
})

watch(
  () => props.availableUsers,
  () => {
    handleSearch(searchQuery.value) // Refresh when availableUsers changes
  },
)
</script>
