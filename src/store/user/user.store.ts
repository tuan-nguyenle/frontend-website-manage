import { defineStore } from 'pinia'
import { userService } from '@/services'
import type { User } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
  }),
  getters: {
    allUsers: (state) => state.users,
  },
  actions: {
    async fetchAllUsers() {
      try {
        const users = await userService.fetchAllUsers()
        this.users = users
      } catch (error) {
        throw error
      }
    },
  },
})
