export interface Role {
  id: number
  role_name: string
  description: string
  created_by: string
  status: '0' | '1'
  pages: Page[]
}

export interface Page {
  page_id: number
  permissions: Permission[]
}

export interface Permission {
  name: string
}

export interface PermissionNode {
  id: number
  name: string
  children: PermissionNode[]
}

export interface ExtendedRole extends Role {
  permissions: Record<number, Record<string, boolean>>
  assigned: { users: Item[] }
  number_of_user: number
}

export interface Item {
  label: string
  id: number
  name: string
  email: string
}
