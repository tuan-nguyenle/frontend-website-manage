import { apiService } from '@/services/api.services'
import type { User } from '@/types'

export const userService = {
  async fetchAllUsers(): Promise<User[]> {
    const { data } = await apiService.get<User[]>('/user/get-all-user')
    return data
  }
}
