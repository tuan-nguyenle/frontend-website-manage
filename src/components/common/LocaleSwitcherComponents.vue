<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end">
    <div
      v-if="showDropdown"
      class="absolute bottom-full mb-3 right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-48 flex flex-col"
      style="min-width: 180px"
    >
      <div
        v-for="locale in locales"
        :key="locale.code"
        @click="selectLocale(locale.code)"
        class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
      >
        <img :src="locale.flag" :alt="locale.name" class="w-6 h-4 rounded border object-cover" />
        <span class="text-gray-700">{{ locale.name }}</span>
      </div>
    </div>
    <button
      class="bg-white shadow-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3 justify-between px-3 w-48 h-11 rounded-lg"
      style="min-width: 180px"
      @click="toggleDropdown"
    >
      <img
        :src="currentLocale.flag"
        :alt="currentLocale.name"
        class="w-6 h-4 rounded border object-cover"
      />
      <span class="text-gray-700 font-medium">{{ currentLocale.name }}</span>
      <svg
        :class="[
          'w-4 h-4 text-gray-400 transition-transform duration-200',
          showDropdown ? 'rotate-180' : '',
        ]"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@/composables/useLocale'

const showDropdown = ref(false)
const { locales, currentLocale, setLocale } = useLocale()

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}
function selectLocale(code: string) {
  setLocale(code)
  showDropdown.value = false
}
</script>

<style scoped>
.locale-switcher {
  display: none;
}

.locale-flag {
  width: 30.4px;
  height: 19px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
  object-fit: cover;
}
</style>
