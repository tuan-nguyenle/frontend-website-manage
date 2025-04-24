export interface Role {
  id: number
  role_name: string
  pages: {
    page_id: number
    page_name: string
    permissions: string[]
  }[]
}

export interface PermissionNode {
  id: number
  name: string
  children: PermissionNode[]
}
