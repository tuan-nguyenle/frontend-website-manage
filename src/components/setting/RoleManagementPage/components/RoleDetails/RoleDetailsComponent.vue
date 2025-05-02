<template>
  <div>
    <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
      {{ $t('Role Details') }}
    </h2>
    <div class="mb-4">
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{
        $t('Role Name')
      }}</label>
      <input
        v-model="name"
        type="text"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        placeholder="Enter role name"
      />
    </div>
    <div class="mb-4">
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{{
        $t('Description')
      }}</label>
      <textarea
        v-model="description"
        class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        rows="6"
        placeholder="Describe this role"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue'

interface Props {
  role: {
    name: string
    description: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:role', updatedRole: { name: string; description: string }): void
}>()

const name = ref(props.role.name)
const description = ref(props.role.description)

watch(name, (newValue) => {
  emit('update:role', { name: newValue, description: description.value })
})

watch(description, (newValue) => {
  emit('update:role', { name: name.value, description: newValue })
})
</script>
