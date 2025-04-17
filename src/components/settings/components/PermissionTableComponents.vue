<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'

interface PermissionNode {
  name: string
  children?: PermissionNode[]
}

const props = defineProps<{
  permissionTree: PermissionNode[]
  rolePermissions: Record<string, Record<string, boolean>>
  actions: string[]
}>()

const emit = defineEmits<{
  (e: 'toggle-permission', path: string, action: string): void
}>()

const expandedPaths = ref(new Set<string>())

const visibleRows = computed(() => {
  const getVisibleRows = (nodes: PermissionNode[], path = '') => {
    const rows: {
      name: string
      path: string
      actions: Record<string, boolean>
      hasChildren: boolean
      isExpanded: boolean
    }[] = []
    for (const node of nodes) {
      const currentPath = path ? `${path}.${node.name}` : node.name
      const actions = props.rolePermissions[currentPath] || {}
      const hasChildren = !!node.children?.length
      const isExpanded = expandedPaths.value.has(currentPath)
      rows.push({
        name: node.name,
        path: currentPath,
        actions,
        hasChildren,
        isExpanded,
      })
      if (hasChildren && isExpanded) {
        rows.push(...getVisibleRows(node.children || [], currentPath))
      }
    }
    return rows
  }
  return getVisibleRows(props.permissionTree)
})

const toggleExpand = (path: string) => {
  if (expandedPaths.value.has(path)) {
    expandedPaths.value.delete(path)
  } else {
    expandedPaths.value.add(path)
  }
}

const togglePermission = (path: string, action: string) => {
  emit('toggle-permission', path, action)
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border dark:border-gray-700 dark:bg-gray-900">
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="w-full">
        <thead class="border dark:border-gray-700 dark:bg-gray-800">
          <tr class="border-b border-gray-300 dark:border-gray-700">
            <th class="p-4 text-left dark:text-white/90">Permissions</th>
            <th v-for="action in actions" :key="action" class="p-4 text-center dark:text-white/90">
              {{ action }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in visibleRows"
            :key="row.path"
            class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-150"
          >
            <td class="p-4">
              <div
                :style="{ paddingLeft: (row.path.split('.').length - 1) * 24 + 16 + 'px' }"
                class="flex items-center"
              >
                <span
                  v-if="row.hasChildren"
                  @click="toggleExpand(row.path)"
                  class="inline-flex items-center justify-center w-5 h-5 mr-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer transition-transform duration-200"
                >
                  <svg
                    :class="{ 'rotate-90': row.isExpanded }"
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
                <span class="text-gray-900 dark:text-white/90 font-medium">{{ row.name }}</span>
              </div>
            </td>
            <td v-for="action in actions" :key="action" class="p-4 text-center">
              <input
                v-if="!row.hasChildren"
                type="checkbox"
                :checked="row.actions[action] || false"
                @change="togglePermission(row.path, action)"
                class="w-4 h-4 text-indigo-500 border-gray-500 rounded focus:ring-indigo-400 cursor-pointer"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Custom checkbox styling */
input[type='checkbox'] {
  appearance: none;
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid #6b7280;
  border-radius: 0.25rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease-in-out;
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

/* Smooth rotation for expand icon */
.rotate-90 {
  transform: rotate(360deg);
}
</style>
