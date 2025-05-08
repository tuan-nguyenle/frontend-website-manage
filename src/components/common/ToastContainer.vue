<!-- components/common/ToastContainer.vue -->
<template>
  <div class="fixed bottom-4 right-4 space-y-2 z-50">
    <ToastComponent
      v-for="toast in toasts"
      :key="toast.id"
      :toast="toast"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import ToastComponent from './ToastComponent.vue'

const { toasts, removeToast } = useToast()
</script>
