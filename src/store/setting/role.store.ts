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
          number_of_user: role.number_of_user,
        }))
      } catch (error) {
        console.error('Failed to fetch roles:', error)
        throw error
      }
    },
    async fetchRoleById(id: number) {
      try {
        const { role } = await settingsService.fetchRoleById(id)
        return role
      } catch (error) {
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
