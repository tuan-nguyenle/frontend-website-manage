<template>
  <div class="relative" ref="multiSelectRef">
    <div
      @click="toggleDropdown"
      class="dark:bg-dark-900 flex items-center w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      :class="{ 'text-gray-800 dark:text-white/90': isOpen }"
    >
      <span v-if="selectedItems.length === 0" class="text-gray-400">{{ placeholder }}</span>
      <div class="flex items-center">
        <div class="flex flex-wrap items-center flex-auto gap-2 min-h-[44px]">
          <div
            v-for="item in visibleItems"
            :key="item.id"
            class="group flex items-center justify-center h-[30px] rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:bg-gray-700"
          >
            <span>{{ item.label }}</span>
            <button
              @click.stop="removeItem(item)"
              class="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
              aria-label="Remove item"
            >
              <svg
                role="button"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div
            v-if="overflowCount > 0"
            :title="overflowItemsLabels"
            class="flex items-center justify-center h-[30px] rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-white/90"
          >
            +{{ overflowCount }}
          </div>
        </div>
        <button
          v-if="selectedItems.length > 0"
          @click.stop="clearSelection"
          class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Clear all selections"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-sm dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-theme-lg"
      >
        <div v-if="searchable" class="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
          <input
            v-model="searchQuery"
            type="text"
            class="multi-select-search w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            placeholder="Search..."
            aria-label="Search options"
            @keydown.enter="handleEnterKey"
          />
        </div>
        <ul
          class="overflow-y-auto divide-y divide-gray-200 custom-scrollbar max-h-60 dark:divide-gray-800"
          role="listbox"
          aria-multiselectable="true"
        >
          <li v-if="props.options.length === 0" class="px-3 py-2 text-gray-500 dark:text-gray-400">
            No options available
          </li>
          <li
            v-else-if="filteredOptions.length === 0"
            class="px-3 py-2 text-gray-500 dark:text-gray-400"
          >
            No results match
          </li>
          <li
            v-for="item in filteredOptions"
            :key="item.id"
            @click="toggleItem(item)"
            class="group relative flex items-center w-full px-3 py-2 cursor-pointer border-transparent first:rounded-t-lg last:rounded-b-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            :class="{ 'bg-blue-100 dark:bg-blue-900': isSelected(item) }"
            :aria-selected="isSelected(item)"
            role="option"
          >
            <span class="grow" :class="{ 'font-semibold': isSelected(item) }">
              {{ item.label }}
            </span>
            <svg
              v-if="isSelected(item)"
              class="w-5 h-5 text-gray-400 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  taggable: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Select...',
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedItems = ref(props.modelValue)
const isOpen = ref(false)
const searchQuery = ref('')

const maxVisibleItems = 5

// Get visible items from selected items, always showing all regardless of search
const visibleItems = computed(() => selectedItems.value.slice(0, maxVisibleItems))

// Calculate overflow count
const overflowCount = computed(() => Math.max(selectedItems.value.length - maxVisibleItems, 0))

const overflowItemsLabels = computed(() => {
  const overflowItems = selectedItems.value.slice(maxVisibleItems)
  return overflowItems.map((item) => item.label).join(', ')
})

/** Compute filtered options to only include items matching the search query when searching */
const filteredOptions = computed(() => {
  if (searchQuery.value === '') {
    return props.options
  } else {
    const query = searchQuery.value.toLowerCase()
    return props.options.filter((option) => option.label.toLowerCase().includes(query))
  }
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && props.searchable) {
    setTimeout(() => {
      const searchInput = document.querySelector('.multi-select-search')
      searchInput?.focus()
    }, 100)
  }
}

const toggleItem = (item) => {
  if (props.multiple) {
    const index = selectedItems.value.findIndex((i) => i.id === item.id)
    if (index === -1) {
      selectedItems.value.push(item)
      searchQuery.value = '' // Clear search after selection
    } else {
      selectedItems.value.splice(index, 1)
    }
  } else {
    selectedItems.value = [item]
    isOpen.value = false
  }
  emit('update:modelValue', selectedItems.value)
}

const removeItem = (item) => {
  const index = selectedItems.value.findIndex((i) => i.id === item.id)
  if (index !== -1) {
    selectedItems.value.splice(index, 1)
    emit('update:modelValue', selectedItems.value)
  }
}

const isSelected = (item) => {
  return selectedItems.value.some((selected) => selected.id === item.id)
}

const handleEnterKey = (event) => {
  event.preventDefault()
  const query = searchQuery.value.trim()
  if (!query) return

  const matchingOption = props.options.find(
    (option) => option.label.toLowerCase() === query.toLowerCase(),
  )
  if (matchingOption) {
    toggleItem(matchingOption)
  } else if (props.taggable) {
    const newItem = { id: Date.now(), label: query }
    selectedItems.value.push(newItem)
    emit('update:modelValue', selectedItems.value)
    searchQuery.value = ''
  }
}

const clearSelection = () => {
  selectedItems.value = []
  emit('update:modelValue', selectedItems.value)
}

const handleClickOutside = (event) => {
  if (isOpen.value && !event.target.closest('.relative')) {
    isOpen.value = false
  }
}

const handleKeydown = (event) => {
  if (isOpen.value && event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
