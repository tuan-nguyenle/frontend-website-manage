// src/types/auth.types.ts
export interface Credentials {
  email: string
  password: string
}

export interface User {
  id: string
  name: User
  email: string
  username: string
  // roles?: string[]
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
