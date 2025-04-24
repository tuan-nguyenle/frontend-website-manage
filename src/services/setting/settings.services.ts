import { apiService } from '@/services/api.services'
import type { Role, PermissionNode } from '@/types'

interface SettingsResponse {
  roles: Role[]
  pageTree: PermissionNode[]
}

export const settingsService = {
  async getSettings(): Promise<SettingsResponse> {
    const { data } = await apiService.get<SettingsResponse>('/settings')
    return data
  },

  async updatePermissions(roleId: number, permissions: { page_id: number; permission_names: string[] }[]): Promise<void> {
    await apiService.put(`/settings/${roleId}/update-permission-role`, { permissions })
  },
}
