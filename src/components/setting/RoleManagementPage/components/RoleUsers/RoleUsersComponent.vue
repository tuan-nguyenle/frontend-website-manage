<template>
  <div>
    <h2 class="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Assign Users</h2>
    <div class="flex flex-col gap-4">
      <template v-if="users.length > 0">
        <MultipleSelectComponent
          :model-value="selectedUsers"
          @update:model-value="updateSelectedUsers"
          :options="users.map((user) => ({ value: user.value, label: `${user.label}` }))"
          :multiple="true"
          :searchable="true"
          :close-on-select="false"
          :clear-on-select="false"
          placeholder="Search by name or email..."
          class="w-full"
        />
      </template>
      <p v-else class="mt-4">Loading users...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import MultipleSelectComponent from '@/components/forms/FormElements/MultipleSelectComponent.vue'
import { defineProps, defineEmits, watch, ref } from 'vue'

interface Item {
  value: number
  label: string
  id: number
  name: string
  email: string
}

interface Props {
  role: {
    assigned: { users: Item[] }
  }
  users: Item[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:role', updatedRole: { assigned: { users: Item[] } }): void
}>()

const selectedUsers = ref(props.role.assigned.users)

const updateSelectedUsers = (value: Item[]) => {
  selectedUsers.value = value
  emit('update:role', { assigned: { users: value } })
}

watch(() => props.role.assigned.users, (newValue) => {
  selectedUsers.value = newValue
})
</script>
