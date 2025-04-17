<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import UserRow from './UserRowComponents.vue'

interface User {
  name: string
  avatar: string
  status: string
  permissions: Record<string, string>
}

defineProps<{
  users: User[]
  permissions: string[]
}>()

const emit = defineEmits<{
  (e: 'toggle-permission', user: User, permission: string): void
}>()
</script>

<template>
  <table class="w-full bg-white rounded-lg shadow-md">
    <thead>
      <tr class="border-b border-gray-200">
        <th class="p-4 text-left text-gray-700 font-semibold">User</th>
        <th
          v-for="permission in permissions"
          :key="permission"
          class="p-4 text-left text-gray-700 font-semibold"
        >
          {{ permission }}
        </th>
      </tr>
    </thead>
    <tbody>
      <UserRow
        v-for="user in users"
        :key="user.name"
        :user="user"
        :permissions="permissions"
        @toggle-permission="emit('toggle-permission', $event.user, $event.permission)"
      />
    </tbody>
  </table>
</template>
