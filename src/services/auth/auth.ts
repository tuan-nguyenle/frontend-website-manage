import type { AuthResponse, Credentials, TokenPayload, User } from '@/type/auth.types'
import { apiService } from '@/services/api'
import { jwtDecode } from 'jwt-decode'

class AuthService {
  private readonly TOKEN_KEY = 'auth_token'
  private readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private readonly USER_KEY = 'user'
  private user: User | null = null

  constructor() {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.USER_KEY)
    if (userJson) {
      try {
        this.user = JSON.parse(userJson)
      } catch (error) {
        console.error('Failed to parse user from storage:', error)
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.user = null
  }

  public async login(credentials: Credentials): Promise<User> {
    const response = await apiService.post<AuthResponse>('/login', credentials)
    const { accessToken, refreshToken, user } = response.data

    localStorage.setItem(this.TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))

    this.user = user

    return user
  }

  public async register(userData: Credentials & { email: string }): Promise<User> {
    const response = await apiService.post<AuthResponse>('/register', userData)
    const { accessToken, refreshToken, user } = response.data

    localStorage.setItem(this.TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))

    this.user = user
    return user
  }

  public async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiService.post<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken },
    )
    const { token, refreshToken: newRefreshToken } = response.data

    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, newRefreshToken)

    return token
  }

  public logout(): void {
    this.clearStorage()
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  public getUser(): User | null {
    return this.user
  }

  public isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      const payload = jwtDecode<TokenPayload>(token)
      const currentTime = Date.now() / 1000

      return payload.exp > currentTime
    } catch (error) {
      console.log(error)
      return false
    }
  }
}

export const authService = new AuthService()
