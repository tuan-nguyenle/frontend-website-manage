import { defineStore } from 'pinia'
import type { Role, PermissionNode } from '@/types'
import { settingsService } from '@/services'

interface SettingsState {
  roles: Role[]
  pageTree: PermissionNode[]
  selectedRoleId: number | null
  editedPermissions: Record<number, Record<string, boolean>>
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    roles: [],
    pageTree: [],
    selectedRoleId: null,
    editedPermissions: {},
  }),
  getters: {
    selectedRole: (state) => state.roles.find((r) => r.id === state.selectedRoleId) || null,
  },
  actions: {
    async fetchSettings() {
      try {
        const { roles, pageTree } = await settingsService.getSettings()
        this.roles = roles.map((role) => ({
          ...role,
          pages: role.pages.map((page) => ({
            ...page,
            page_name: page.page_name ?? '',
          })),
        }))
        this.pageTree = pageTree
        if (this.roles.length > 0) {
          this.selectRole(this.roles[0])
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    },
    selectRole(role: Role) {
      this.selectedRoleId = role.id
      this.editedPermissions = this.mapPermissions(role)
    },
    togglePermission(pageId: number, action: string) {
      if (!this.editedPermissions[pageId]) {
        this.editedPermissions[pageId] = { View: false }
      }
      this.editedPermissions[pageId][action] = !this.editedPermissions[pageId][action]
    },

    async savePermissions() {
      if (!this.selectedRoleId) return
      const permissionsToSave = Object.entries(this.editedPermissions).map(([pageId, perms]) => ({
        page_id: Number(pageId),
        permission_names: ['View'].filter((action) => perms[action]),
      }))
      try {
        await settingsService.updatePermissions(this.selectedRoleId, permissionsToSave)
      } catch (error) {
        alert(`Failed to save permissions ${error}`)
      }
    },

    resetEditedPermissions() {
      this.editedPermissions = {}
    },

    mapPermissions(role: Role): Record<number, Record<string, boolean>> {
      return role.pages.reduce(
        (acc, page) => {
          acc[page.page_id] = { View: page.permissions.includes('View') }
          return acc
        },
        {} as Record<number, Record<string, boolean>>,
      )
    },
  },
})
