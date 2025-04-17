<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  state: 'on' | 'off'
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>
<template>
  <div
    @click="emit('toggle')"
    class="w-12 h-6 rounded-full cursor-pointer flex items-center transition-colors duration-300"
    :class="{
      'bg-green-500': state === 'on',
      'bg-gray-300': state === 'off',
    }"
  >
    <div
      class="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300"
      :class="{
        'translate-x-6': state === 'on',
        'translate-x-0': state === 'off',
      }"
    ></div>
  </div>
</template>
