export interface MenuGroup {
  title: string
  items: MenuItem[]
}

export interface MenuItem {
  icon: unknown
  name: string
  path: string
  subItems: SubItem[]
}

export interface SubItem {
  name: string
  path: string
}
