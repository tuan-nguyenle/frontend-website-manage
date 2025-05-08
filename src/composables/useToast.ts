// composables/useToast.ts
import { reactive } from 'vue'

interface Toast {
  id: number
  variant: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration: number
  showLink?: boolean
  linkHref?: string
  linkText?: string
}

const toasts = reactive<Toast[]>([])
let nextId = 1

export function useToast() {
  function showToast(variant: Toast['variant'], title: string, message: string, duration = 5000) {
    const id = nextId++
    toasts.push({ id, variant, title, message, duration })
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id: number) {
    const index = toasts.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.splice(index, 1)
    }
  }

  return { toasts, showToast, removeToast }
}
