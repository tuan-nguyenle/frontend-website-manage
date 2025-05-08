<template>
  <div :class="['rounded-xl p-4 shadow-lg', variantClasses[toast.variant].container]">
    <div class="flex items-start gap-3">
      <div :class="['-mt-0.5', variantClasses[toast.variant].icon]">
        <component :is="icons[toast.variant]" />
      </div>
      <div>
        <h4 class="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90 flex items-center">
          <span>{{ toast.title.split(' ')[0] }}</span>
          <span>{{ toast.title.split(' ').slice(1).join(' ') }}</span>
        </h4>
        <p class="text-sm text-gray-500 dark:dark:text-white/90">{{ toast.message }}</p>
        <router-link
          v-if="toast.showLink"
          :to="toast.linkHref || '/'"
          class="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:dark:text-white/90"
        >
          {{ toast.linkText }}
        </router-link>
      </div>
      <button @click="$emit('close')" class="ml-auto text-gray-500 hover:text-gray-700">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SuccessIcon, ErrorIcon, WarningIcon, InfoCircleIcon } from '@/icons'

defineProps<{
  toast: {
    variant: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    showLink?: boolean
    linkHref?: string
    linkText?: string
  }
}>()

defineEmits(['close'])

const variantClasses = {
  success: {
    container: 'bg-success-50 dark:bg-success-900',
    icon: 'text-success-500 dark:text-success-400',
  },
  error: {
    container: 'bg-error-50 dark:bg-error-900',
    icon: 'text-error-500 dark:text-error-400',
  },
  warning: {
    container: 'bg-warning-50 dark:bg-warning-900',
    icon: 'text-warning-500 dark:text-warning-400',
  },
  info: {
    container: 'bg-blue-light-50 dark:bg-blue-light-900',
    icon: 'text-blue-light-500 dark:text-blue-light-400',
  },
}
const icons = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoCircleIcon,
}
</script>
