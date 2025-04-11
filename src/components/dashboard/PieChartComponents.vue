<template>
  <div>
    <h2 class="text-lg font-bold mb-2">Top Selling Products (2023)</h2>
    <apexchart
      type="pie"
      :options="chartOptions"
      :series="activeSeries"
      @legend-click="toggleSegment"
    />
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { computed, ref } from 'vue'

// Constants
const LABELS = ['Earphones', 'Laptop', 'Smartphone', 'Camera', 'Tablet', 'Television']
const COLORS = ['#A6C8FF', '#9AE6B4', '#FBD38D', '#F6AD55', '#D6BCFA', '#FFB6B9', '#BEE3F8']
const DEFAULT_SERIES = [20, 25, 30, 15, 10, 5]

// Reactive state
const hiddenSegments = ref<number[]>([])

// Base chart options
const baseOptions = {
  chart: {
    type: 'pie',
  },
  labels: LABELS,
  colors: COLORS,
  legend: { position: 'right' },
  tooltip: {
    style: {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
    },
    custom: ({
      series,
      seriesIndex,
      w,
    }: {
      series: number[]
      seriesIndex: number
      w: { config: { labels: string[]; colors: string[] } }
    }) => `
      <div style="background: #fff; padding: 10px; color: #333; font-family: Arial, sans-serif;">
        <span style="display: inline-block; width: 12px; height: 12px; background: ${w.config.colors[seriesIndex]}; border-radius: 50%; margin-right: 8px;"></span>
        <strong>${w.config.labels[seriesIndex]}</strong>: ${series[seriesIndex]} Product
      </div>
    `,
  },
}

// Computed properties
const activeSeries = computed(() =>
  DEFAULT_SERIES.map((value, index) => (hiddenSegments.value.includes(index) ? 0 : value)),
)

const chartOptions = computed(() => ({
  ...baseOptions,
  states: {
    active: {
      filter: {
        type: 'none', // Prevents color fade
      },
    },
  },
  legend: {
    /**
     * Formats the legend label based on whether the series is hidden.
     *
     * - If the series index exists in `hiddenSegments`, the label is styled with a gray color (`#9CA3AF`) to indicate it's hidden.
     * - Otherwise, the label is displayed normally.
     *
     * @param {string} seriesName - The name of the series.
     * @param {{ seriesIndex: number }} context - Context object containing the index of the series.
     * @returns {string} - The formatted HTML string or plain series name.
     */

    formatter: (seriesName: string, { seriesIndex }: { seriesIndex: number }) =>
      hiddenSegments.value.includes(seriesIndex)
        ? `<span style="color: #9CA3AF">${seriesName}</span>`
        : seriesName,
  },
}))

/**
 * Toggles the visibility of a chart series by updating the `hiddenSegments` array.
 *
 * - If the given `seriesIndex` is already in `hiddenSegments`, it will be removed (making the series visible).
 * - If not, it will be added (hiding the series).
 *
 * This is typically used in conjunction with the legend to show or hide specific series on click.
 *
 * @param {ApexCharts} chart - The ApexCharts instance.
 * @param {number} seriesIndex - Index of the series to toggle.
 */

const toggleSegment = (chart: ApexCharts, seriesIndex: number) => {
  const isHidden = hiddenSegments.value.includes(seriesIndex)

  hiddenSegments.value = isHidden
    ? hiddenSegments.value.filter((i) => i !== seriesIndex)
    : [...hiddenSegments.value, seriesIndex]
}

defineOptions({
  components: { apexchart: VueApexCharts },
})
</script>
