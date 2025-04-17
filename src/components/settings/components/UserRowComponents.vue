<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Toggle from './ToggleComponents.vue'

interface User {
  name: string
  avatar: string
  status: string
  permissions: Record<string, string>
}

defineProps<{
  user: User
  permissions: string[]
}>()

const emit = defineEmits<{
  (e: 'toggle-permission', payload: { user: User; permission: string }): void
}>()
</script>

<template>
  <tr class="border-b last:border-b-0">
    <td class="p-4">
      <div class="flex items-center space-x-2">
        <img :src="user.avatar" alt="avatar" class="w-8 h-8 rounded-full" />
        <div>
          <span class="font-medium">{{ user.name }}</span>
          <span class="block text-sm text-gray-500">{{ user.status }}</span>
        </div>
      </div>
    </td>
    <td v-for="permission in permissions" :key="permission" class="p-4">
      <Toggle
        :state="user.permissions[permission] === 'on' ? 'on' : 'off'"
        @toggle="emit('toggle-permission', { user, permission })"
      />
    </td>
  </tr>
</template>
