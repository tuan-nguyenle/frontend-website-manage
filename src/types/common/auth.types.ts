// src/types/auth.types.ts
import type { User } from '@/types'

export interface Credentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface TokenPayload {
  id: string
  email: string
  exp: number
}
