export interface Role {
  id: number
  role_name: string
  description: string
  created_by: string
  number_of_user: number
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
