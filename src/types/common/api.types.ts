export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  messages: string
  status: number
  errors?: Record<string, string>
}
