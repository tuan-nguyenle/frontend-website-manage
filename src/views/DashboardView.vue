<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <admin-layout>
    <div class="min-h-screen bg-gray-100 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Top Selling Products -->
      <div class="bg-white p-4 rounded-lg shadow">
        <PieChartComponents />
      </div>

      <!-- This Week’s Sales & Purchases -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-2">This Week’s Sales & Purchases</h2>
        <!-- <BarChart :options="barChartOptions" :series="barChartSeries" /> -->
      </div>

      <!-- Stock Alert -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-2">Stock Alert</h2>
        <!-- <StockAlertTable :items="stockItems" /> -->
      </div>

      <!-- Top 05 Customer -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-bold mb-2">Top 05 Customer (January)</h2>
        <!-- <DonutChart :options="donutChartOptions" :series="donutChartSeries" /> -->
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts" setup>
// Import components
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PieChartComponents from '@/components/dashboard/PieChartComponents.vue'
// import BarChart from '@/components/dashboard/BarChart.vue'
// import StockAlertTable from '@/components/dashboard/StockAlertTable.vue'
// import DonutChart from '@/components/dashboard/DonutChart.vue'
// import { useDashboardStore } from '@/store/stock.store'

// // Initialize the store
// const store = useDashboardStore()

// // Define chart data

// const barChartOptions = {
//   chart: { type: 'bar' },
//   xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
//   colors: ['#1E3A8A', '#A5B4FC'],
// }
// const barChartSeries = [
//   { name: 'Sales', data: [30, 40, 80, 90, 70, 50, 20] },
//   { name: 'Purchases', data: [20, 30, 60, 70, 50, 40, 10] },
// ]

// const donutChartOptions = {
//   chart: { type: 'donut' },
//   labels: ['Toggy Business', 'Solit IT', 'Walk-In Customer', 'Medizo Enterprise'],
//   colors: ['#C084FC', '#60A5FA', '#1E3A8A', '#FBBF24'],
// }
// const donutChartSeries = [25.6, 32.0, 23.3, 9.9]

// // Expose stockItems to the template
// const stockItems = store.stockItems
</script>
