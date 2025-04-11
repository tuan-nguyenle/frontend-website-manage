import { apiService } from '@/services'
import type { ApiResponse, MenuGroup } from '@/types'

class MenuService {
  async getMenu(): Promise<MenuGroup[]> {
    const response: ApiResponse<MenuGroup[]> = await apiService.get('/get-menu')
    return response.data
  }
}

export const menuService = new MenuService()
