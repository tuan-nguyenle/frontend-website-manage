import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import type { ApiError, ApiResponse } from '@/types'
import { authService } from '@/services'
import router from '@/router'

class ApiService {
  private api: AxiosInstance
  private API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  constructor() {
    this.api = axios.create({
      baseURL: this.API_BASE_URL || 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []

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
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== '/api/refreshToken'
        ) {
          originalRequest._retry = true

          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(this.api(originalRequest))
              })
            })
          }

          this.isRefreshing = true
          try {
            await authService.refreshToken()
            const newToken = authService.getToken()
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              this.refreshSubscribers.forEach((callback) => callback(newToken))
              this.refreshSubscribers = []
              console.log('Retrying original request with new token')
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            await authService.signOut()
            router.push('/signin')
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        if (error.response?.status === 403) {
          router.push('/403')
          return Promise.reject(error)
        }

        if (error.response?.status === 401) {
          await authService.signOut()
          router.push('/signin')
        }

        const apiError: ApiError = {
          status: error.response?.status || 500,
          errors: error.response?.data?.errors,
          messages: error.response?.data?.messages,
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
