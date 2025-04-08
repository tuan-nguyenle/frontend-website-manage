import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import type { ApiError, ApiResponse } from '@/types/api.types'
import { authService } from './auth/auth.services'

class ApiService {
  private api: AxiosInstance
  private API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  constructor() {
    this.api = axios.create({
      baseURL: this.API_BASE_URL || 'http:/localhost/8000/api',
      // withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = authService.getToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config

        // Handle token expiration (401 errors)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // Attempt to refresh token
            await authService.refreshToken()

            // Retry the original request with new token
            const token = authService.getToken()
            this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            return this.api(originalRequest)
          } catch (refreshError) {
            // If refresh fails, log out the user
            authService.logout()
            return Promise.reject(refreshError)
          }
        }

        // Transform error to consistent format
        const apiError: ApiError = {
          // message: error.response?.data?.message || 'An unknown error occurred',
          status: error.response?.status || 500,
          errors: error.response?.data?.error,
        }

        return Promise.reject(apiError)
      },
    )
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get<T>(url, config)
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    }
  }

  public async post<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.api.post<T>(url, data, config)

    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    }
  }

  public async put<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.api.put<T>(url, data, config)
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete<T>(url, config)
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    }
  }
}

export const apiService = new ApiService()
