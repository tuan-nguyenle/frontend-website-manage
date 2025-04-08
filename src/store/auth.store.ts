import { defineStore } from 'pinia'
import type { AuthResponse, User } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: localStorage.getItem('auth')
      ? JSON.parse(localStorage.getItem('auth')!)
      : (null as AuthResponse | null),
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.auth
    },

    user(): User | null {
      return this.auth?.user ?? null
    },

    accessToken(): string | null {
      return this.auth?.accessToken ?? null
    },
  },

  actions: {
    setAuth(payload: AuthResponse): void {
      this.auth = payload
      localStorage.setItem('auth', JSON.stringify(payload))
    },

    clearAuth(): void {
      this.auth = null
      localStorage.removeItem('auth')
    },
  },
})
