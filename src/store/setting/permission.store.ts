import { defineStore } from 'pinia'
import { settingsService } from '@/services'
import type { PermissionNode } from '@/types'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: [] as PermissionNode[],
  }),
  getters: {
    permissionsTree: (state) => state.permissions,
  },
  actions: {
    async fetchPermissionTree() {
      try {
        const permissionTree = await settingsService.fetchPermissionTree()
        this.permissions = permissionTree
      } catch (error) {
        console.error('Failed to fetch permission tree:', error)
        throw error
      }
    },
  },
})
