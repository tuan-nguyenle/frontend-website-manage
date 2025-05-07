import { apiService } from '@/services/api.services'
import type { PermissionNode, Role } from '@/types'

interface SettingsResponse {
  roles: Role[]
}

export const settingsService = {
  async fetchRoles(): Promise<SettingsResponse> {
    const { data } = await apiService.get<SettingsResponse>('/settings/roles')
    return data
  },

  // async updatePermissions(
  //   roleId: number,
  //   permissions: { page_id: number; permission_names: string[] }[],
  // ): Promise<void> {
  //   await apiService.put(`/settings/${roleId}/update-permission-role`, { permissions })
  // },

  // async deleteRole(roleId: number): Promise<void> {
  //   await apiService.delete(`/settings/roles/${roleId}`)
  // },

  async createRole(roleData: Role): Promise<unknown> {
    const { data } = await apiService.post('/settings/roles', roleData)
    return data
  },

  // async updateRole(roleData: Role): Promise<unknown> {
  //   const { data } = await apiService.put('/settings/roles', roleData)
  //   return data
  // },

  async fetchPermissionTree(): Promise<PermissionNode[]> {
    const { data } = await apiService.get<{ pageTree: PermissionNode[] }>(
      '/settings/get-page-tree-structure',
    )
    const convertIds = (PermissionNode: PermissionNode): PermissionNode => ({
      id: Number(PermissionNode.id),
      name: PermissionNode.name,
      children: PermissionNode.children ? PermissionNode.children.map(convertIds) : [],
    })
    return data.pageTree.map(convertIds)
  },

  async fetchRole(id: number): Promise<Role> {
    const { data } = await apiService.get<Role>(`/settings/roles/${id}`)
    return data
  },
}
