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
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue'

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
  availableUsers: SelectOption[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:role', updatedRole: { assigned: { users: SelectOption[] } }): void
}>()

const filteredUsers = ref<SelectOption[]>([])
const selectedUsers = ref<SelectOption[]>(props.role.assigned.users)
const searchQuery = ref<string>('')

const availableOptions = computed(() => {
  const selectedIds = new Set(selectedUsers.value.map((user) => user.id))
  return props.availableUsers.filter((user) => !selectedIds.has(user.id))
})

const handleSearch = (search: string) => {
  searchQuery.value = search
  const lowerSearch = search.toLowerCase()
  const filtered = availableOptions.value
    .filter((user) =>
      lowerSearch
        ? user.name.toLowerCase().includes(lowerSearch) ||
          user.email.toLowerCase().includes(lowerSearch)
        : true,
    )
    .slice(0, 5)
  filteredUsers.value = filtered
}

const updateSelectedUsers = (value: SelectOption[]) => {
  selectedUsers.value = value
  emit('update:role', { assigned: { users: value } })
  handleSearch(searchQuery.value)
}

onMounted(() => {
  handleSearch('')
})

watch(
  () => props.availableUsers,
  () => {
    handleSearch(searchQuery.value)
  },
)
</script>
