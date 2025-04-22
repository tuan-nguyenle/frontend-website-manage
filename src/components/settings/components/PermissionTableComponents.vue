<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

interface PermissionNode {
  id: number
  name: string
  children: PermissionNode[]
}

const props = defineProps<{
  permissionTree: PermissionNode[]
  rolePermissions: Record<number, Record<string, boolean>>
  actions: string[]
}>()

const emit = defineEmits<{
  (e: 'toggle-permission', pageId: number, action: string): void
}>()

const togglePermission = (pageId: number, action: string) => {
  emit('toggle-permission', pageId, action)
}

const flattenedTree = computed(() => {
  const result: { node: PermissionNode; depth: number }[] = []
  function flatten(nodes: PermissionNode[], depth: number = 0) {
    nodes.forEach((node) => {
      result.push({ node, depth })
      if (node.children.length > 0) {
        flatten(node.children, depth + 1)
      }
    })
  }
  flatten(props.permissionTree)
  return result
})
</script>

<template>
  <div class="overflow-hidden rounded-xl border dark:border-gray-700 dark:bg-gray-900">
    <table class="w-full table-fixed">
      <thead class="border dark:border-gray-700 dark:bg-gray-800">
        <tr class="border-b border-gray-300 dark:border-gray-700">
          <th class="w-3/5 p-4 text-left dark:text-white/90">Permissions</th>
          <th
            v-for="action in actions"
            :key="action"
            class="w-12 p-4 text-center dark:text-white/90"
          >
            {{ action }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entry in flattenedTree"
          :key="entry.node.id"
          class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <td class="p-2 break-words">
            <div class="flex items-center" :style="{ 'padding-left': entry.depth * 20 + 'px' }">
              <span class="text-gray-900 dark:text-white/90">{{ entry.node.name }}</span>
            </div>
          </td>
          <td v-for="action in actions" :key="action" class="p-2 text-center">
            <input
              type="checkbox"
              :checked="rolePermissions[entry.node.id]?.[action] || false"
              @change="togglePermission(entry.node.id, action)"
              class="w-4 h-4 text-indigo-500 border-gray-500 rounded focus:ring-indigo-400 cursor-pointer"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
input[type='checkbox'] {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid #6b7280;
  border-radius: 0.25rem;
  cursor: pointer;
  position: relative;
}
input[type='checkbox']:checked {
  background-color: #4f46e5;
  border-color: #4f46e5;
}
input[type='checkbox']:checked::after {
  content: '\2713';
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
}
</style>
