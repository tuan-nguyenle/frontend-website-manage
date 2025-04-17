<template>
  <div>
    <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">
      Top Selling Products (2023)
    </h2>
    <div ref="chartContainer" style="height: 300px; width: 100%">
      <v-chart :option="option" autoresize />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { EChartsOption } from 'echarts'
import { ref, computed, onMounted } from 'vue'

const chartContainer = ref<HTMLElement | null>(null)
const isMounted = ref(false)
const isDarkMode = ref(document.documentElement.classList.contains('dark'))

// Dynamically set chart options based on dark mode
const option = computed<EChartsOption>(() => ({
  textStyle: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    color: isDarkMode.value ? '#E5E7EB' : '#1F2937', // Gray-200 for dark, Gray-800 for light
  },
  title: {
    text: 'Traffic Sources',
    left: 'center',
    textStyle: {
      color: isDarkMode.value ? '#F3F4F6' : '#111827', // Gray-100 for dark, Gray-900 for light
    },
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
    backgroundColor: isDarkMode.value ? '#1F2937' : '#FFFFFF', // Gray-800 for dark, White for light
    textStyle: {
      color: isDarkMode.value ? '#E5E7EB' : '#1F2937', // Gray-200 for dark, Gray-800 for light
    },
    borderColor: isDarkMode.value ? '#4B5563' : '#D1D5DB', // Gray-600 for dark, Gray-300 for light
  },
  legend: {
    orient: 'vertical',
    left: 'right',
    data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
    textStyle: {
      color: isDarkMode.value ? '#D1D5DB' : '#374151', // Gray-300 for dark, Gray-700 for light
    },
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 234, name: 'Ad Networks' },
        { value: 135, name: 'Video Ads' },
        { value: 458, name: 'Search Engines' },
      ],
      itemStyle: {
        borderColor: isDarkMode.value ? '#1F2937' : '#FFFFFF', // Gray-800 for dark, White for light
        borderWidth: 1,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: isDarkMode.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}))

// Watch for changes to dark mode
const observer = new MutationObserver(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark')
})
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

onMounted(() => {
  if (
    chartContainer.value &&
    chartContainer.value.clientWidth > 0 &&
    chartContainer.value.clientHeight > 0
  ) {
    isMounted.value = true
  }
})
</script>
