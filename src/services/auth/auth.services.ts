import type { AuthResponse, User } from '@/types'
import { apiService } from '@/services'
import { useAuthStore } from '@/store'

class AuthService {
  /**
   * Logs in a user and stores the access and refresh tokens.
   * @param username - User's username
   * @param password - User's password
   * @returns The authenticated user
   */

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await apiService.post<{
      accessToken: string
      user: User
    }>('/login', {
      username,
      password,
    })

    const authStore = useAuthStore()
    authStore.setAuth(response.data)

    return response.data
  }

  /**
   * Refreshes the access token using the refresh token.
   * Updates the auth store and refresh token if provided.
   */
  async refreshToken(): Promise<void> {
    const currentToken = this.getToken()
    if (!currentToken) {
      throw new Error('No access token available')
    }

    try {
      const {
        data: { token },
      } = await apiService.post<{ token: string }>('/refresh', { accessToken: currentToken })
      const authStore = useAuthStore()

      authStore.setAuth({
        accessToken: token,
        user: authStore.user as User,
      })
    } catch (error) {
      throw new Error(
        `Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Logs out the user, clearing tokens and user data.
   */
  async signOut(): Promise<void> {
    try {
      await apiService.post('/logout', {})
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      localStorage.clear()
      window.location.href = '/signin' // Fallback redirect
    }
  }

  /**
   * Gets the current access token.
   * @returns The access token or null if not authenticated
   */
  getToken(): string | null {
    return useAuthStore().auth?.accessToken ?? null
  }

  clearStorage(): void {
    useAuthStore().clearAuth()
  }
}

export const authService = new AuthService()
