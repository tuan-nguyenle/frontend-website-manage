// src/types/auth.types.ts
export interface Credentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  // roles?: string[]
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface TokenPayload {
  id: string
  email: string
  exp: number
}
