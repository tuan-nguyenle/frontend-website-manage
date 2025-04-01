import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Or use Vuex/Pinia store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration (e.g., redirect to signin)
      console.warn('Unauthorized, redirecting to signin...')
      localStorage.removeItem('token')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  },
)

export default api
