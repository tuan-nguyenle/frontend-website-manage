import { defineStore } from 'pinia'
import type { ExtendedRole, Role } from '@/types'
import { settingsService } from '@/services'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [] as ExtendedRole[],
  }),
  getters: {
    activeRoles: (state) => state.roles.filter((role) => role.status === '1'),
    inactiveRoles: (state) => state.roles.filter((role) => role.status === '0'),
    roleById: (state) => (id: number) => state.roles.find((role) => role.id === id),
  },
  actions: {
    async fetchRoles() {
      try {
        const { roles } = await settingsService.fetchRoles()
        this.roles = (roles as (Role & { number_of_user: number })[]).map((role) => ({
          ...role,
          permissions: {} as Record<number, Record<string, boolean>>,
          assigned: { users: [] },
          number_of_user: role.number_of_user, // Now TypeScript accepts this
        }))
      } catch (error) {
        console.error('Failed to fetch roles:', error)
        throw error
      }
    },
    async createRole(roleData: Role) {
      try {
        const newRole = await settingsService.createRole(roleData)
        this.roles.unshift({
          ...(newRole as Role),
          permissions: {} as Record<number, Record<string, boolean>>,
          assigned: { users: [] },
          number_of_user: 0,
        })
        return newRole
      } catch (error) {
        throw error
      }
    },
  },
})

// async updateRole(roleData: ExtendedRole) {
//   try {
//     const updatedRole = await settingsService.updateRole(roleData)
//     // Update in store
//     const index = this.roles.findIndex(role => role.id === roleData.id)
//     if (index !== -1) {
//       this.roles.splice(index, 1, {
//         ...roleData,
//         permissions: {} as Record<number, Record<string, boolean>>,
//         assigned: { users: [] }
//       })
//     }
//     return updatedRole
//   } catch (error) {
//     console.error('Failed to update role:', error)
//     throw error
//   }
// },

// async updateRolePermissions(roleId: number, pages: { page_id: number; permission_names: string[] }[]) {
//   try {
//     await settingsService.updatePermissions(roleId, pages)
//     // Update the store with the new permissions
//     const role = this.roles.find(r => r.id === roleId)
//     if (role) {
//       role.pages = pages.map(page => ({
//         page_id: page.page_id,
//         permissions: page.permission_names.map(p => ({ name: p }))
//       }))
//     }
//   } catch (error) {
//     console.error('Failed to update role permissions:', error)
//     throw error
//   }
// },

// async deleteRole(roleId: number) {
//   try {
//     // Make API call to delete role
//     await settingsService.deleteRole(roleId)
//     // Remove from store
//     this.roles = this.roles.filter(role => role.id !== roleId)
//   } catch (error) {
//     console.error('Failed to delete role:', error)
//     throw error
//   }
// }
