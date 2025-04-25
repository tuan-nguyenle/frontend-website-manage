<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeaderTableComponents from './components/HeaderTableComponents.vue'
import PermissionTableComponents from './components/PermissionTableComponents.vue'
import { useSettingsStore } from '@/store'
import type { Role } from '@/types'

const settingsStore = useSettingsStore()
const isLoading = ref(false)
const isSaving = ref(false)

function onSelectRole(role: Role) {
  settingsStore.selectRole(role)
}

// Show overlay while awaiting savePermissions
async function handleSavePermissions() {
  isSaving.value = true
  try {
    await settingsStore.savePermissions()
    await settingsStore.fetchSettings()
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  await settingsStore.fetchSettings()
  isLoading.value = false
})
</script>

<template>
  <div
    class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 relative"
  >
    <!-- Overlay for saving (blocks the page with animated Saving... text only) -->
    <div
      v-if="isSaving"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black bg-opacity-30"
      style="backdrop-filter: blur(2px)"
    >
      <div class="flex flex-col items-center">
        <p class="text-gray-500 dark:text-gray-400 saving-animation">{{ $t('Saving') }}</p>
      </div>
    </div>

    <HeaderTableComponents
      :roles="settingsStore.roles"
      :selected-role="settingsStore.selectedRole"
      @select-role="onSelectRole"
      @save-permissions="handleSavePermissions"
    />

    <div v-if="isLoading" class="flex items-center justify-center">
      <div
        class="w-5 h-5 mr-3 border-2 border-gray-200 dark:border-gray-700 border-t-gray-500 dark:border-t-gray-400 rounded-full animate-spin mr-2"
      ></div>
      <span class="text-gray-500 dark:text-gray-400">{{ $t('Loading permissions') }}...</span>
    </div>
    <PermissionTableComponents
      v-else-if="settingsStore.selectedRole && settingsStore.pageTree.length"
      :permission-tree="settingsStore.pageTree"
      :role-permissions="settingsStore.editedPermissions"
      :actions="['View', 'Delete', 'Edit', 'Manage']"
      @toggle-permission="(pageId, action) => settingsStore.togglePermission(pageId, action)"
    />

    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      {{
        settingsStore.roles.length === 0
          ? $t('No roles available')
          : $t('Select a role to view permissions')
      }}
    </div>
  </div>
</template>

<style scoped>
.saving-animation::after {
  content: '';
  display: inline-block;
  width: 1.2em;
  vertical-align: bottom;
  /* Animated dots using keyframes */
  animation: dots 1.2s steps(3, end) infinite;
}

@keyframes dots {
  0%,
  20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%,
  100% {
    content: '...';
  }
}
</style>
