<!-- RolePermissionsComponent.vue -->
<template>
  <div>
    <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Assign Permissions</h2>
    <div v-if="loading" class="text-center py-8" role="status" aria-label="Loading permissions">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
    </div>
    <div
      v-else-if="permissionTree.length === 0"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      No permissions available. Please try again or contact support.
    </div>
    <div v-else class="overflow-hidden rounded-xl border dark:border-gray-700 dark:bg-gray-900">
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
            v-for="entry in flattenedPermissions"
            :key="entry.node.id"
            class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
            @click="toggleExpand(entry.node.id)"
          >
            <td class="p-2 break-words">
              <div class="flex items-center" :style="{ 'padding-left': entry.depth * 20 + 'px' }">
                <button v-if="entry.node.children.length > 0" class="mr-2 focus:outline-none">
                  <svg
                    class="w-4 h-4 dark:text-white/90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    :class="{ 'rotate-90': expanded[entry.node.id] }"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <span class="text-gray-900 dark:text-white/90">{{ entry.node.name }}</span>
              </div>
            </td>
            <td v-for="action in actions" :key="action" class="p-2 text-center">
              <input
                v-if="entry.node.children.length === 0"
                type="checkbox"
                :checked="props.role.permissions[entry.node.id]?.[action] || false"
                @change="togglePermission(entry.node.id, action)"
                class="w-4 h-4 text-indigo-500 border-gray-500 rounded focus:ring-indigo-400 cursor-pointer"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from 'vue'

const props = defineProps<{
  actions: string[]
  role: {
    permissions: Record<number, Record<string, boolean>>
  }
  permissionTree: PermissionNode[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-permission', pageId: number, action: string): void
  (e: 'retry-fetch'): void
}>()

interface PermissionNode {
  id: number
  name: string
  children: PermissionNode[]
}

const expanded = ref<Record<number, boolean>>({})
const permissionTree = ref<PermissionNode[]>(props.permissionTree)

watch(
  () => props.permissionTree,
  (newTree) => {
    permissionTree.value = newTree
  },
  { deep: true, immediate: true },
)

const flattenedPermissions = computed(() => {
  const result: { node: PermissionNode; depth: number }[] = []
  const flatten = (nodes: PermissionNode[], depth: number = 0, parentExpanded: boolean = true) => {
    for (const node of nodes) {
      if (parentExpanded) {
        result.push({ node, depth })
      }
      if (node.children.length > 0 && expanded.value[node.id] && parentExpanded) {
        flatten(node.children, depth + 1, true)
      } else if (node.children.length > 0 && parentExpanded) {
        flatten(node.children, depth + 1, false)
      }
    }
  }
  flatten(permissionTree.value)
  return result
})

const toggleExpand = (pageId: number) => {
  expanded.value[pageId] = !expanded.value[pageId]
}

const togglePermission = (pageId: number, action: string) => {
  emit('toggle-permission', pageId, action)
}
</script>
