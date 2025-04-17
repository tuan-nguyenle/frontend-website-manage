<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <!-- Logo Section -->
    <div :class="['py-8 flex', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start']">
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img v-else src="/images/logo/logo-icon.svg" alt="Logo" width="32" height="32" />
      </router-link>
    </div>

    <!-- Menu Section -->
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-if="menuStore.isLoading">
            <div v-for="n in 3" :key="n" class="animate-pulse">
              <div class="mb-4 h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="flex flex-col gap-4">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              </div>
            </div>
          </div>
          <div v-else v-for="(menuGroup, groupIndex) in mappedMenuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <!-- Menu Item with Submenu -->
                <button
                  v-if="item.subItems && item.subItems.length"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]"
                >
                  <span
                    v-if="item.icon"
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" v-if="item.icon" />
                    <span v-else class="w-5 h-5 bg-gray-200 rounded"></span>
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{
                    item.name
                  }}</span>
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, index),
                      },
                    ]"
                  />
                </button>

                <!-- Menu Item without Submenu -->
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    v-if="item.icon"
                    :class="[
                      isActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" v-if="item.icon" />
                    <span v-else class="w-5 h-5 bg-gray-200 rounded"></span>
                  </span>
                  <span v-if="iconMap || isHovered || isMobileOpen" class="menu-item-text">{{
                    item.name
                  }}</span>
                </router-link>

                <!-- Submenu Items -->
                <transition name="slide">
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) && (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(subItem.path),
                              'menu-dropdown-item-inactive': !isActive(subItem.path),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Sidebar Widget -->
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed, onMounted, type Component } from 'vue'
import { useRoute } from 'vue-router'
import {
  ChevronDownIcon,
  HorizontalDots,
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  SettingsIcon,
} from '@/icons'
import SidebarWidget from './SidebarWidget.vue'
import { useSidebar } from '@/composables/useSidebar'
import { useMenuStore } from '@/store'

const menuStore = useMenuStore()
const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()

const iconMap: Record<string, Component> = {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  SettingsIcon,
}

const mappedMenuGroups = computed(() => {
  return menuStore.menuGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      return {
        ...item,
        icon: iconMap[item.icon as string],
      }
    }),
  }))
})

// Fetch menu on mount
onMounted(async () => {
  await menuStore.fetchMenu()
})

// Check if a route is active
const isActive = (path: string) => route.path === path

// Toggle submenu
const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  openSubmenu.value = openSubmenu.value === key ? null : key
}

// Check if submenu is open
const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  const subItems = mappedMenuGroups.value[groupIndex]?.items[itemIndex]?.subItems
  return (
    openSubmenu.value === key || (subItems && subItems.some((subItem) => isActive(subItem.path)))
  )
}
</script>
