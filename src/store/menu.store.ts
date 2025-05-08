import { menuService } from '@/services'
import type { MenuGroup } from '@/types'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuGroups: [] as MenuGroup[],
    isLoading: false,
  }),

  actions: {
    async fetchMenu(): Promise<void> {
      this.isLoading = true
      try {
        const menuStorage = localStorage.getItem('menuGroups')
        if (menuStorage) {
          this.menuGroups = JSON.parse(menuStorage)
          this.isLoading = false
          return
        }
        this.menuGroups = await menuService.getMenu()
        localStorage.setItem('menuGroups', JSON.stringify(this.menuGroups))
      } catch (error) {
        console.error('Error fetching menu:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    clearMenu(): void {
      this.menuGroups = []
      localStorage.removeItem('menuGroups')
      console.log('menuGroups cleared from state and localStorage')
    },
  },
})
