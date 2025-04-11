import {
  CalenderIcon,
  GridIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
} from '@/icons'
import { menuService } from '@/services'
import type { MenuGroup, MenuItem } from '@/types'
import { defineStore } from 'pinia'
import { markRaw, type Component } from 'vue'

const iconMap: Record<string, Component> = {
  GridIcon: markRaw(GridIcon),
  CalenderIcon: markRaw(CalenderIcon),
  UserCircleIcon: markRaw(UserCircleIcon),
  ListIcon: markRaw(ListIcon),
  TableIcon: markRaw(TableIcon),
  PageIcon: markRaw(PageIcon),
  ChatIcon: markRaw(ChatIcon),
  MailIcon: markRaw(MailIcon),
  DocsIcon: markRaw(DocsIcon),
  PieChartIcon: markRaw(PieChartIcon),
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuGroups: [] as MenuGroup[],
  }),

  actions: {
    async fetchMenu(): Promise<void> {
      try {
        const response = await menuService.getMenu()
        this.menuGroups = response.map((group) => ({
          title: group.title,
          items: group.items.map((item: MenuItem) => ({
            name: item.name,
            icon: iconMap[item.icon as string] || null,
            path: item.path,
            subItems: item.subItems,
          })),
        }))
      } catch (error) {
        console.error('Error fetching menu:', error)
        throw error
      }
    },
  },
})
