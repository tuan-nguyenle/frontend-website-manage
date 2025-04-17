import type { Component } from 'vue'

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

export interface MenuItem {
  icon: string | Component
  name: string
  path: string
  subItems: SubItem[]
}

export interface SubItem {
  name: string
  path: string
}
